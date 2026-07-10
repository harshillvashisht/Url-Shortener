import { config } from './infrastructure/config/index.js';
import app from './app.js';
import logger from './infrastructure/logger/pino.js';

const port = Number(config.app.port ?? 3000);

logger.info(`Server is running on port ${port}`);

app.listen(port);
