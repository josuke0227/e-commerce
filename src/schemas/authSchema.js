import Joi from "joi";

export const emailSchema = Joi.string()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  })
  .required()
  .label("Email");

export const passwordSchema = Joi.string()
  .pattern(new RegExp("^[a-zA-Z0-9]"))
  .min(6)
  .max(30)
  .label("Password")
  .required();

export const tokenSchema = Joi.string().label("JWT").required();

export const shcemaObject = {
  email: emailSchema,
  password: passwordSchema,
  confirmingPassword: Joi.ref("password"),
  token: tokenSchema,
};

export const userSchema = Joi.object(shcemaObject);

export const schemaSelector = (path) => {
  let schemas = {};
  path.forEach((p) => (schemas = { ...schemas, [p]: shcemaObject[p] }));
  return Joi.object(schemas);
};
