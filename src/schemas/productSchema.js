import Joi from "joi";
Joi.ObjectId = require("joi-objectid")(Joi);

const titleSchema = Joi.string().min(1).max(100).label("Title");

const descriptionSchema = Joi.string().min(1).max(2000).label("Description");

const priceSchema = Joi.number().min(1).label("Price");

const categorySchema = Joi.ObjectId().label("Category");

const subCategorySchema = Joi.ObjectId().label("Sub category");

const quantitySchema = Joi.number().min(1).label("Quantity");

const colorSchema = Joi.string().label("Color").allow("").optional();

const brandSchema = Joi.string().label("Brand").allow("").optional();

const imageSchema = Joi.string().uri().label("Image file");

const variationsSchema = Joi.array();

export const productSchema = Joi.object({
  brand: brandSchema,
  category: categorySchema,
  color: colorSchema,
  description: descriptionSchema,
  price: priceSchema,
  quantity: quantitySchema,
  subCategory: subCategorySchema,
  title: titleSchema,
  variations: variationsSchema,
});

export {
  titleSchema,
  descriptionSchema,
  priceSchema,
  categorySchema,
  subCategorySchema,
  quantitySchema,
  imageSchema, //done
  colorSchema,
  brandSchema,
  variationsSchema,
};
