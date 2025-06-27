import type { CorsOptions } from 'cors';
import { env } from './env';

const allowedOrigins = process.env.NODE_ENV === 'production' ? env.frontend.url : '*';

export const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
};
