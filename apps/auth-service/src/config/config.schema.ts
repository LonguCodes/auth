import * as Joi from 'joi';

export const configSchema = Joi.object({
  CRYPTO__PUBLIC_KEY_PATH: Joi.string().optional().default('public.pem'),
  CRYPTO__PRIVATE_KEY_PATH: Joi.string().optional().default('private.pem'),
  CRYPTO__GENERATE: Joi.boolean().default(true),
  CRYPTO__TOKEN_LIFETIME: Joi.number()
    .optional()
    .default(1000 * 60 * 10),
  CRYPTO__RENEW_LIFETIME: Joi.number()
    .optional()
    .default(1000 * 60 * 60 * 24 * 180),

  USER__VALIDATION: Joi.boolean().optional().default(false),

  ADMIN__SECRET_FILE_PATH: Joi.string().optional().default('./secret'),
});
