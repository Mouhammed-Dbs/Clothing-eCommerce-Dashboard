const { default: axios } = require("axios");

exports.getProducts = async (query) => {
  try {
    const res = await axios.get(
      `${process.env.BASE_API_URL}/api/v1/products?${query}`
    );
    return { error: false, data: res.data };
  } catch (err) {
    return { error: true, data: err.response?.data };
  }
};
exports.getSubCategories = async () => {
  try {
    const response = await axios.get(
      `${process.env.BASE_API_URL}/api/v1/subcategories`,
      {}
    );
    return { error: false, data: response.data };
  } catch (error) {
    throw error.response.data;
  }
};
