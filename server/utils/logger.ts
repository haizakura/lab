import log4js from 'log4js';

log4js.configure({
  appenders: {
    console: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} [%p] %c - %m',
      },
    },
  },
  categories: {
    default: {
      appenders: ['console'],
      level: 'info',
    },
  },
});

export const logger = log4js.getLogger('default');

export { log4js };
