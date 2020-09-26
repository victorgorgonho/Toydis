import { Joi } from 'celebrate';

class Schemas {
  setSchema = {
    body: Joi.object().keys({
      key: Joi
        .string()
        .required()
        .messages({
          'string.base': `"Key" deveria ser do tipo string`,
          'string.empty': `"Key" não pode ser um campo vazio`,
          'any.required': `"Key" é obrigatório`,
        }),
      value: Joi
        .any()
        .required()
        .messages({
          'any.empty': `"Value" não pode ser um campo vazio`,
          'any.required': `"Value" é obrigatório`,
        }),
      ex: Joi
        .number()
        .min(0)
        .messages({
          'number.base': `"Ex" deveria ser do tipo number`,
          'number.empty': `"Ex" não pode ser um campo vazio`,
          'number.min': `"Ex" não pode ser um valor negativo`,
        }),
    }),
  };

  getSchema = {
    body: Joi.object().keys({
      key: Joi
        .string()
        .required()
        .messages({
          'string.base': `"Key" deveria ser do tipo string`,
          'string.empty': `"Key" não pode ser um campo vazio`,
          'any.required': `"Key" é obrigatório`,
        }),
    }),
  };

  delSchema = {
    body: Joi.object().keys({
      keys: Joi
        .array()
        .items(Joi
          .string()
          .required()
          .messages({
            'string.base': `"Keys" item deveria ser do tipo string`,
            'string.empty': `"Keys" item não pode ser um campo vazio`,
            'any.required': `"Keys" item é obrigatório`,
          }),
        )
        .unique()
        .required()
        .messages({
          'array.base': `"Keys" deveria ser do tipo array`,
          'array.empty': `"Keys" não pode ser um campo vazio`,
          'array.unique': `"Keys" é um campo único`,
          'any.required': `"Keys" é obrigatório`,
        }),
    }),
  };

  incrSchema = {
    body: Joi.object().keys({
      key: Joi
        .string()
        .required()
        .messages({
          'string.base': `"Key" deveria ser do tipo string`,
          'string.empty': `"Key" não pode ser um campo vazio`,
          'any.required': `"Key" é obrigatório`,
        }),
    }),
  };

  zaddSchema = {
    body: Joi.object().keys({
      key: Joi
        .string()
        .required()
        .messages({
          'string.base': `"Key" deveria ser do tipo string`,
          'string.empty': `"Key" não pode ser um campo vazio`,
          'any.required': `"Key" é obrigatório`,
        }),
      score: Joi
        .array()
        .items(Joi
          .number()
          .required()
          .messages({
            'number.base': `"Score" item deveria ser do tipo number`,
            'number.empty': `"Score" item não pode ser um campo vazio`,
            'any.required': `"Score" item é obrigatório`,
          }),
        )
        .required()
        .messages({
          'array.base': `"Score" deveria ser do tipo array`,
          'array.empty': `"Score" não pode ser um campo vazio`,
          'any.required': `"Score" é obrigatório`,
        }),
      member: Joi
        .array()
        .items(Joi
          .string()
          .required()
          .messages({
            'string.base': `"Member" item deveria ser do tipo string`,
            'string.empty': `"Member" item não pode ser um campo vazio`,
            'any.required': `"Member" item é obrigatório`,
          }),
        )
        .unique()
        .required()
        .messages({
          'array.base': `"Member" deveria ser do tipo array`,
          'array.empty': `"Member" não pode ser um campo vazio`,
          'array.unique': `"Member" é um campo único`,
          'any.required': `"Member" é obrigatório`,
        }),
    }),
  };

  zcardSchema = {
    body: Joi.object().keys({
      key: Joi
        .string()
        .required()
        .messages({
          'string.base': `"Key" deveria ser do tipo string`,
          'string.empty': `"Key" não pode ser um campo vazio`,
          'any.required': `"Key" é obrigatório`,
        }),
    }),
  };

  zrankSchema = {
    body: Joi.object().keys({
      key: Joi
        .string()
        .required()
        .messages({
          'string.base': `"Key" deveria ser do tipo string`,
          'string.empty': `"Key" não pode ser um campo vazio`,
          'any.required': `"Key" é obrigatório`,
        }),
      member: Joi
        .string()
        .required()
        .messages({
          'string.base': `"Member" deveria ser do tipo string`,
          'string.empty': `"Member" não pode ser um campo vazio`,
          'any.required': `"Member" é obrigatório`,
        }),
    }),
  };

  zrangeSchema = {
    body: Joi.object().keys({
      key: Joi
        .string()
        .required()
        .messages({
          'string.base': `"Key" deveria ser do tipo string`,
          'string.empty': `"Key" não pode ser um campo vazio`,
          'any.required': `"Key" é obrigatório`,
        }),
      start: Joi
        .number()
        .required()
        .messages({
          'number.base': `"Start" deveria ser do tipo number`,
          'number.empty': `"Start" não pode ser um campo vazio`,
          'any.required': `"Start" é obrigatório`,
        }),
      stop: Joi
        .number()
        .required()
        .messages({
          'number.base': `"Stop" deveria ser do tipo number`,
          'number.empty': `"Stop" não pode ser um campo vazio`,
          'any.required': `"Stop" é obrigatório`,
        }),
    }),
  };
}

export default new Schemas;
