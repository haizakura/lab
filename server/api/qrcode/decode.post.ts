import { z } from 'zod';

export default defineEventHandler(async (event) => {
  const heightInteger = z.int().positive();
  const widthInteger = z.int().positive();
  const dataArray = z.instanceof(Uint8Array).or(z.instanceof(Uint8ClampedArray)).or(z.array(z.number()));
  const schema = z.object({
    height: heightInteger,
    width: widthInteger,
    data: dataArray,
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
    const qrcode = await QrcodeUtils.decode(result.data);

    return qrcode;
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
