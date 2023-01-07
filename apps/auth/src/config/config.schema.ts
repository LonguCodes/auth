import * as Joi from 'joi';

export const configSchema = Joi.object({
  DATABASE__HOST: Joi.string().required(),
  DATABASE__PORT: Joi.number().optional().default(5432),
  DATABASE__USERNAME: Joi.string().required(),
  DATABASE__PASSWORD: Joi.string().required(),
  DATABASE__DATABASE: Joi.string().required(),
  DATABASE__MIGRATIONS_RUN: Joi.boolean().optional().default(false),

  CRYPTO__PUBLIC_KEY_PATH: Joi.string().optional().default('public.pem'),
  CRYPTO__PRIVATE_KEY_PATH: Joi.string().optional().default('private.pem'),
  CRYPTO__GENERATE: Joi.boolean().default(true),
  CRYPTO__TOKEN_LIFETIME: Joi.number()
    .optional()
    .default(1000 * 60 * 10),
  CRYPTO__RENEW_LIFETIME: Joi.number()
    .optional()
    .default(1000 * 60 * 60 * 24 * 180),

  EVENTS__AMQP__ENABLE: Joi.boolean().default(false),
  EVENTS__AMQP__URL: Joi.string().when('EVENTS__AMQP__ENABLE', {
    is: Joi.valid(true),
    then: Joi.string().required(),
  }),
  EVENTS__AMQP__EXCHANGE: Joi.string().when('EVENTS__AMQP__ENABLE', {
    is: Joi.valid(true),
    then: Joi.string().required(),
  }),
  EVENTS__AMQP__ASSERT: Joi.boolean().optional(),
  EVENTS__AMQP__PREFIX: Joi.string().optional(),

  USER__VALIDATION: Joi.boolean().optional().default(false),
});
