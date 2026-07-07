import { config } from './infrastructure/config/index.js';
import app from './app.js';

const port = Number(config.app.port ?? 3000);

console.log(`Server is running on port ${port}`);

app.listen(port);
