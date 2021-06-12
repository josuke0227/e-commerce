import Joi from "joi";

const imagesSchema = Joi.object();

const imageSchema = Joi.string().uri().label("Image file");

export { imagesSchema, imageSchema };
