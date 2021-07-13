import Joi from "joi";
Joi.ObjectId = require("joi-objectid")(Joi);

const titleSchema = Joi.string().min(1).max(100).label("Title");

const descriptionSchema = Joi.string().min(1).label("Description");

const priceSchema = Joi.number().min(1).label("Price");

const categorySchema = Joi.ObjectId().label("Category");

const subCategorySchema = Joi.ObjectId().label("Sub category");

const quantitySchema = Joi.number().min(1).label("Quantity");

const brandSchema = Joi.string().label("Brand");

const imageSchema = Joi.string().uri().label("Image file");

const variationsSchema = Joi.array().optional();

const variationSchema = Joi.array().has(
  Joi.object().keys({
    color: Joi.object({
      name: Joi.string().label("Variation name"),
      index: Joi.number().label("Variation index"),
    }),
    size: Joi.object({
      name: Joi.string().label("Variation name"),
      index: Joi.number().label("Variation index"),
    }),
    qty: Joi.number().label("Variation qty"),
  })
);

export const productSchemas = {
  title: titleSchema,
  price: priceSchema,
  quantity: quantitySchema,
  variations: variationsSchema,
  category: categorySchema,
  subCategory: subCategorySchema,
  brand: brandSchema,
  description: descriptionSchema,
  // product signature changes in creating and editing
  sold: Joi.number(),
  _id: Joi.ObjectId(),
  slug: Joi.string(),
  ratings: Joi.array(),
  __v: Joi.number(),
};

export const productSchema = Joi.object().keys({ ...productSchemas });

export {
  titleSchema,
  descriptionSchema,
  priceSchema,
  categorySchema,
  subCategorySchema,
  quantitySchema,
  imageSchema, //done
  brandSchema,
  variationsSchema,
  variationSchema,
};
