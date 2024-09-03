import axios from "axios";
import { getToken } from "./helpers";

export const getUserOrders = async (page) => {
  let token = getToken();
  if (token) {
    try {
      const response = await axios.get(
        `${process.env.BASE_API_URL}/api/v1/orders?limit=15&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  } else {
    throw new Error("No token found. Please log in.");
  }
};

export const getSpecificUserOrders = async (orderId) => {
  let token = getToken();
  if (token) {
    try {
      const response = await axios.get(
        `${process.env.BASE_API_URL}/api/v1//orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  } else {
    throw new Error("No token found. Please log in.");
  }
};

export const updateIsDelivered = async (orderId) => {
  let token = getToken();
  if (token) {
    try {
      const response = await axios.put(
        `${process.env.BASE_API_URL}/api/v1/orders/${orderId}/deliver`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  } else {
    throw new Error("No token found. Please log in.");
  }
};

export const updateIsPay = async (orderId) => {
  let token = getToken();
  if (token) {
    try {
      const response = await axios.put(
        `${process.env.BASE_API_URL}/api/v1/orders/${orderId}/pay`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  } else {
    throw new Error("No token found. Please log in.");
  }
};
