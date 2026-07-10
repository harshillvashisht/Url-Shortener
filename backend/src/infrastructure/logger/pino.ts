import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",

  timestamp: pino.stdTimeFunctions.isoTime,

  base: {
    service: "url-shortener",
  },

  formatters: {
    level(label) {
      return { level: label };
    },
  },

  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        }
      : undefined,

    redact: [
        "req.headers.authorization",
        "req.headers.cookie",
    ]
});

export default logger;