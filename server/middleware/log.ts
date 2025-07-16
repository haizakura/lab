import { logger } from '../utils/logger';

export default defineEventHandler((event) => {
  const { method, url, headers } = event.node.req;
  const userAgent = headers['user-agent'] || 'Unknown';

  logger.info(`[${method}] ${url} - User-Agent: ${userAgent}`);

  if (method !== 'GET' && method !== 'HEAD') {
    logger.info(`Request body will be processed for ${method} ${url}`);
  }
});
