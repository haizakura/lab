import { z } from 'zod';

export default defineEventHandler(async (event) => {
  const textString = z.string().min(1);
  const scaleInteger = z.int32().min(2).max(64);
  const schema = z.object({
    text: textString,
    scale: scaleInteger.optional().default(8),
  });

  const result = await readValidatedBody(event, schema.safeParse);

  if (!result.success) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        data: {
          message: 'Input Invalid',
          errors: z.flattenError(result.error).fieldErrors,
        },
      }),
    );
  }

  try {
    const qrcode = await QrcodeUtils.encode(result.data.text, { scale: result.data.scale });

    setHeader(event, 'Content-Type', 'image/gif');
    setHeader(event, 'Content-Length', qrcode.data.length);
    setHeader(event, 'Cache-Control', 'public, max-age=3600');

    return qrcode.data;
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
