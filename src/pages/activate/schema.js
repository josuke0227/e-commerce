import Joi from "joi";
import { emailShcema } from "../signup/schema";

export const passwordSchema = Joi.string()
  .pattern(new RegExp("^[a-zA-Z0-9]"))
  .min(6)
  .max(30)
  .label("password")
  .required();

export const userSchema = Joi.object({
  email: emailShcema,
  password: passwordSchema,
  confirmingPassword: Joi.ref("password"),
});
