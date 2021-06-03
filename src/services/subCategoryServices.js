import axios from "axios";

export const getSubCategories = async (user) =>
  await axios({
    method: "GET",
    url: `${process.env.REACT_APP_API}/subcategories`,
  });

export const updateSubCategory = async (category, user) =>
  axios({
    method: "PUT",
    url: `${process.env.REACT_APP_API}/subcategories/${category.slug}`,
    data: { name: category.name },
    headers: {
      "x-auth-token": user.token,
    },
  });

export const createSubCategory = async (subCategory, user) => {
  const { name, parent } = subCategory;
  return axios({
    method: "POST",
    url: `${process.env.REACT_APP_API}/subcategories/`,
    data: { name, parent },
    headers: {
      "x-auth-token": user.token,
    },
  });
};

export const deleteSubCategory = async (category, user) =>
  axios({
    method: "DELETE",
    url: `${process.env.REACT_APP_API}/subcategories/${category.slug}`,
    headers: {
      "x-auth-token": user.token,
    },
  });
