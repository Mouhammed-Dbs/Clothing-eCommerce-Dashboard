import axios from "axios";
import { getToken } from "./helpers";

export const getUserReturnOrders = async (page) => {
  let token = getToken();
  if (token) {
    try {
      const response = await axios.get(
        `${process.env.BASE_API_URL}/api/v1/return-order?limit=15&page=${page}`,
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

export const getSpecificUserReturnOrder = async (id) => {
  let token = getToken();
  if (token) {
    try {
      const response = await axios.get(
        `${process.env.BASE_API_URL}/api/v1/return-order/${id}`,
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

export const updateReturnRequestFromAdmin = async (
  id,
  approvedItems,
  rejectedItems
) => {
  const token = getToken();
  if (!token) throw new Error("No token found. Please log in.");

  try {
    const response = await axios.patch(
      `${process.env.BASE_API_URL}/api/v1/return-order/${id}/approve-or-reject`,
      { approvedItems, rejectedItems },
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
};

export const createRefund = async (orderId, refundItems) => {
  let token = getToken();
  if (token) {
    try {
      const response = await axios.post(
        `${process.env.BASE_API_URL}/api/v1/return-order/${orderId}/refund`,
        { refundItems },
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
