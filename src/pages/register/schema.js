import Joi from "joi";

export const emailShcema = Joi.string()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  })
  .required()
  .label("Email");
