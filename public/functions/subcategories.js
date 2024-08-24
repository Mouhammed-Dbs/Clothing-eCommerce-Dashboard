const { default: axios } = require("axios");
// const { getToken } = require("./helpers");

exports.getSubCategories = async () => {
  try {
    const response = await axios.get(
      `${process.env.BASE_API_URL}/api/v1/subcategories`,
      {}
    );
    return { error: false, data: response.data };
  } catch (error) {
    throw error.response?.data;
  }
};

exports.getSubCategoriesWithProductCount = async () => {
  try {
    const response = await axios.get(
      `${process.env.BASE_API_URL}/api/v1/subcategories/subcategories-with-product-count`,
      {}
    );
    return { error: false, data: response.data };
  } catch (error) {
    throw error.response?.data;
  }
};
