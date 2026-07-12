import  { RedisClientType } from "redis";

export const TOKEN_BUCKET_SCRIPT = `
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local refill_interval = tonumber(ARGV[3])
local now = tonumber(ARGV[4])

-- Get current state or initialize
local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
local tokens = tonumber(bucket[1])
local last_refill = tonumber(bucket[2])

-- Initialize if this is the first request
if tokens == nil then
    tokens = capacity
    last_refill = now
end

-- Calculate token refill
local time_passed = now - last_refill
local refills = math.floor(time_passed / refill_interval)

if refills > 0 then
    tokens = math.min(capacity, tokens + (refills * refill_rate))
    last_refill = last_refill + (refills * refill_interval)
end

-- Try to consume a token
local allowed = 0
if tokens >= 1 then
    tokens = tokens - 1
    allowed = 1
end

-- Update state
redis.call(
    "HSET",
    key,
    "tokens",
    tokens,
    "last_refill",
    last_refill
)
local ttl = math.ceil((capacity / refill_rate) * refill_interval)
redis.call("EXPIRE", key, ttl)

-- Return result: allowed (1 or 0) and remaining tokens
return {allowed, tokens}
`;

interface TokenBucketOptions {
    capacity?: number;
    refillRate?: number;
    refillInterval?: number;
    redisClient: RedisClientType;
}

interface TokenBucketResult {
    allowed: boolean;
    remaining: number;
}

export class TokenBucket {
    private capacity: number;
    private refillRate: number;
    private refillInterval: number
    private redisClient: RedisClientType;
    private scriptSha: string;
    private scriptLoaded: boolean;


    constructor({
    capacity = 10,
    refillRate = 1,
    refillInterval = 1,
    redisClient,
}: TokenBucketOptions) {
    this.capacity = capacity ?? 10;
    this.refillRate = refillRate ?? 1;
    this.refillInterval = refillInterval ?? 1;
    this.redisClient = redisClient;

    this.scriptLoaded = false;
    this.scriptSha = "";
}

    private async ensureScriptLoaded() {
    if (!this.scriptLoaded) {
      try {
        this.scriptSha = await this.redisClient.scriptLoad(TOKEN_BUCKET_SCRIPT);
        this.scriptLoaded = true;
      } catch {
        // If loading fails, we'll fall back to EVAL
      }
    }
  }

    async allow(key: string): Promise<TokenBucketResult> {
        await this.ensureScriptLoaded();

        const now = Math.floor(Date.now() / 1000);

        let result: [number, number];
        const redisKey = `rate-limit:${key}`;

        try {
            result = await this.redisClient.evalSha(
                this.scriptSha,
                {
                    keys: [redisKey],
                    arguments: [
                        this.capacity.toString(),
                        this.refillRate.toString(),
                        this.refillInterval.toString(),
                        now.toString()
                    ]
                }
            ) as [number, number];
        }  catch (err) {
      if (err instanceof Error && err.message.includes("NOSCRIPT")) {
        // Script not in cache, use EVAL and reload
        result = await this.redisClient.eval(TOKEN_BUCKET_SCRIPT, {
          keys: [redisKey],
          arguments: [
            this.capacity.toString(),
            this.refillRate.toString(),
            this.refillInterval.toString(),
            now.toString()
          ],
        }) as [number, number];
        this.scriptSha = await this.redisClient.scriptLoad(TOKEN_BUCKET_SCRIPT);
        this.scriptLoaded = true;
      } else {
        throw err;
      }
    }

        return { allowed: result[0] == 1, remaining: result[1] };
    }

}