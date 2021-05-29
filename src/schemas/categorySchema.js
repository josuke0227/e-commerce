import Joi from "joi";

export const categorySchema = Joi.string()
  .min(1)
  .max(50)
  .label("Category name");
