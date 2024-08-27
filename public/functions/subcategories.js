const { default: axios } = require("axios");
const { getToken } = require("./helpers");

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

exports.addSubCategory = async (name) => {
  try {
    const response = await axios.post(
      `${process.env.BASE_API_URL}/api/v1/subcategories`,
      {
        name,
        category: "66ba082cbc9bbcd6bc0f16c1",
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return { error: false, data: response.data };
  } catch (error) {
    throw error.response?.data;
  }
};

exports.deleteSubCategory = async (id) => {
  try {
    await axios.delete(
      `${process.env.BASE_API_URL}/api/v1/subcategories/${id}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return { error: false };
  } catch (error) {
    console.log(error);
    throw error.response?.data;
  }
};
