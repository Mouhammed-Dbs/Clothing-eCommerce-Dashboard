const { default: axios } = require("axios");
const { getToken } = require("./helpers");

exports.getProducts = async (query) => {
  try {
    const res = await axios.get(
      `${process.env.BASE_API_URL}/api/v1/products?${query}`
    );
    return { error: false, data: res.data };
  } catch (error) {
    throw error.response?.data;
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
    if (data.selectedColors && data.selectedColors.length > 0) {
      data.selectedColors.forEach((color) =>
        formData.append("colors[]", color)
      );
    }

    if (data.selectedSizes && data.selectedSizes.length > 0) {
      data.selectedSizes.forEach((size) => formData.append("sizes[]", size));
    }

    if (data.subcategories && data.subcategories.length > 0) {
      data.subcategories.forEach((subcategory) =>
        formData.append("subcategories[]", subcategory)
      );
    }
    console.log(data.selectedSizes);
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

exports.deleteProduct = async (id) => {
  try {
    await axios.delete(`${process.env.BASE_API_URL}/api/v1/products/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return { error: false };
  } catch (error) {
    throw error.response?.data;
  }
};

exports.getProduct = async (id) => {
  try {
    const res = await axios.get(
      `${process.env.BASE_API_URL}/api/v1/products/${id}`
    );
    console.log(res.data);
    return { error: false, data: res.data };
  } catch (error) {
    throw error.response?.data;
  }
};
exports.updateProduct = async (id, data) => {
  try {
    const formData = new FormData();

    if (data.imageCover) {
      formData.append("imageCover", data.imageCover);
    }
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
    if (data.selectedColors && data.selectedColors.length > 0) {
      data.selectedColors.forEach((color) =>
        formData.append("colors[]", color)
      );
    }

    if (data.selectedSizes && data.selectedSizes.length > 0) {
      data.selectedSizes.forEach((size) => formData.append("sizes[]", size));
    }

    if (data.subcategories && data.subcategories.length > 0) {
      data.subcategories.forEach((subcategory) =>
        formData.append("subcategories[]", subcategory)
      );
    }

    const res = await axios.put(
      `${process.env.BASE_API_URL}/api/v1/products/${id}`,
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
