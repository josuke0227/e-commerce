import axios from "axios";

export const getCategories = async () =>
  await axios({
    method: "GET",
    url: `${process.env.REACT_APP_API}/categories`,
  });

export const updateCategory = async (category) =>
  axios({
    method: "PUT",
    url: `${process.env.REACT_APP_API}/categories/update/${category.slug}`,
    data: { name: category.name },
  });

export const createCategory = async (categoryName) =>
  axios({
    method: "POST",
    url: `${process.env.REACT_APP_API}/categories/create`,
    data: { name: categoryName },
  });

export const deleteCategory = async (category) =>
  axios({
    method: "DELETE",
    url: `${process.env.REACT_APP_API}/categories/remove/${category.slug}`,
  });
