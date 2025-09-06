import { z } from 'zod';

export default defineEventHandler(async (event) => {
  const today = new Date();
  const nowYear = today.getFullYear().toString();
  const nowMonth = (today.getMonth() + 1).toString().padStart(2, '0');
  const nowDay = today.getDate().toString().padStart(2, '0');

  const stringYear = z.string().regex(/^\d{4}$/, 'Must be a number string (4 digits)');
  const stringMonth = z.string().regex(/^\d{2}$/, 'Must be a number string (2 digits)');
  const stringDay = z.string().regex(/^\d{2}$/, 'Must be a number string (2 digits)');
  const stringCurrency = z
    .string()
    .toUpperCase()
    .regex(/[A-Z]{3}/, 'Must be a currency code (3 letters)');

  const querySchema = z.object({
    year: stringYear.optional().default(nowYear),
    month: stringMonth.optional().default(nowMonth),
    day: stringDay.optional().default(nowDay),
    transCur: stringCurrency.optional().default('JPY'),
    baseCur: stringCurrency.optional().default('CNY'),
  });

  const query = await getValidatedQuery(event, querySchema.safeParse);

  if (!query.success) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        data: {
          message: 'Input Invalid',
          errors: z.flattenError(query.error).fieldErrors,
        },
      }),
    );
  }

  try {
    const response = await $fetch(
      `https://www.unionpayintl.com/upload/jfimg/${query.data.year}${query.data.month}${query.data.day}.json`,
    );

    const data = response as {
      exchangeRateJson: {
        transCur: string;
        baseCur: string;
        rateData: number;
      }[];
    };

    const exchangeRateJson: {
      transCur: string;
      baseCur: string;
      rateData: number;
    }[] = data.exchangeRateJson;

    const rate = exchangeRateJson.find(
      (element) => element.transCur === query.data.transCur && element.baseCur === query.data.baseCur,
    );

    return {
      data: {
        rate: rate,
      },
    };
  } catch (error) {
    const errorDetails = ErrorUtils.getErrorDetails(error);

    return sendError(
      event,
      createError({
        statusCode: errorDetails.status,
        data: {
          message: errorDetails.statusText,
        },
      }),
    );
  }
});
