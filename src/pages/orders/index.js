import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getUserOrders } from "../../../public/functions/order";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { Spinner } from "@nextui-org/react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getUserOrders();
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleRowClick = (orderId) => {
    router.push(`/orders/${orderId}`);
  };

  return (
    <Box padding={2}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2, color: "#c2410c" }}>
        Orders
      </Typography>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="60vh"
        >
          <Spinner color="primary" />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            border: "1px solid #fb923c",
            backgroundColor: "#f1f5f9",
            boxShadow: "none",
            borderRadius: "8px",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#c2410c" }}>
                  Order ID
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#c2410c" }}>
                  Shipping Address
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#c2410c" }}>
                  Total Price
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#c2410c" }}>
                  Payment Method
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#c2410c" }}>
                  Is Paid
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#c2410c" }}>
                  Is Delivered
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order._id}
                  hover
                  onClick={() => handleRowClick(order._id)}
                >
                  <TableCell>{order._id}</TableCell>
                  <TableCell>
                    {order.shippingAddress.details},{order.shippingAddress.city}
                    ,{order.shippingAddress.postalCode}
                  </TableCell>
                  <TableCell>{order.totalOrderPrice}</TableCell>
                  <TableCell>{order.paymentMethodType}</TableCell>
                  <TableCell>{order.isPaid ? "Yes" : "No"}</TableCell>
                  <TableCell>{order.isDelivered ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
