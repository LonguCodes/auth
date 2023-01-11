import * as Joi from 'joi';

export const configSchema = Joi.object({
  AUTH__CORE_HOST: Joi.string().required(),
  AUTH__API_KEY: Joi.string().required(),
});
