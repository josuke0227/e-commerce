import Joi from "joi";
Joi.objectId = require("joi-objectid")(Joi);

export const subCategorySchema = Joi.object({
  name: Joi.string().min(1).max(50).label("Subcategory name"),
  parent: Joi.objectId().label("Parent id"),
});
