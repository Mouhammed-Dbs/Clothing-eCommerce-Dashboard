const { default: axios } = require("axios");
const { getToken } = require("./helpers");

exports.getProducts = async (query) => {
  try {
    const res = await axios.get(
      `${process.env.BASE_API_URL}/api/v1/products?${query}`
    );
    return { error: false, data: res.data };
  } catch (error) {
    return { error: true, data: error.response?.data };
  }
};

exports.addProducts = async (data) => {
  try {
    const formData = new FormData();

    formData.append("imageCover", data.imageCover);
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => formData.append("images", image));
    }
    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("quantity", data.quantity);

    if (data.priceAfterDiscount !== undefined) {
      formData.append("priceAfterDiscount", data.priceAfterDiscount);
    }
    formData.append("colors[]", data.colors);
    formData.append("sizes[]", data.sizes);
    formData.append("subcategories[]", data.subcategories);

    const res = await axios.post(
      `${process.env.BASE_API_URL}/api/v1/products`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { error: false, data: res.data };
  } catch (error) {
    throw error.response?.data;
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
    throw error.response?.data;
  }
};
