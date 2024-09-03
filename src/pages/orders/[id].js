import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  getSpecificUserOrders,
  updateIsDelivered,
  updateIsPay,
} from "../../../public/functions/order";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Spinner } from "@nextui-org/react";

export default function OrderDetailPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;

      try {
        const res = await getSpecificUserOrders(id);
        setOrder(res.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleUpdateDelivered = async () => {
    setUpdating(true);
    try {
      await updateIsDelivered(id);
      setOrder((prevOrder) => ({ ...prevOrder, isDelivered: true }));
    } catch (error) {
      console.error("Error updating delivery status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePaid = async () => {
    setUpdating(true);
    try {
      await updateIsPay(id);
      setOrder((prevOrder) => ({ ...prevOrder, isPaid: true }));
    } catch (error) {
      console.error("Error updating payment status:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box padding={2} sx={{ maxWidth: "1200px", margin: "auto" }}>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="60vh"
        >
          <Spinner color="primary" />
        </Box>
      ) : order ? (
        <div>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ mb: 2, color: "#c2410c" }}
          >
            Order Details
          </Typography>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              mb: 3,
              backgroundColor: "#f1f5f9",
              border: "1px solid #fb923c",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6" sx={{ color: "#c2410c" }}>
              Order ID: {order._id}
            </Typography>
            <Typography variant="h6" sx={{ color: "#6b7280" }}>
              Shipping Address: {order.shippingAddress.details},
              {order.shippingAddress.city},{order.shippingAddress.postalCode}
            </Typography>
            <Typography variant="h6" sx={{ color: "#6b7280" }}>
              Total Price: {order.totalOrderPrice}
            </Typography>
            <Typography variant="h6" sx={{ color: "#6b7280" }}>
              Payment Method: {order.paymentMethodType}
            </Typography>
            <Typography variant="h6" sx={{ color: "#6b7280" }}>
              Paid: {order.isPaid ? "Yes" : "No"}
            </Typography>
            <Typography variant="h6" sx={{ color: "#6b7280" }}>
              Delivered: {order.isDelivered ? "Yes" : "No"}
            </Typography>

            <Box marginTop={2}>
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdatePaid}
                    disabled={updating || order.isPaid}
                    sx={{
                      border: "1px solid #fb923c",
                      backgroundColor: "orange",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#ea580c" },
                    }}
                  >
                    {updating ? "Updating..." : "Mark as Paid"}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleUpdateDelivered}
                    disabled={updating || order.isDelivered}
                    sx={{
                      border: "1px solid #fb923c",
                      backgroundColor: "#f87171",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#ef4444" },
                    }}
                  >
                    {updating ? "Updating..." : "Mark as Delivered"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          <Box marginTop={4}>
            <Typography variant="h6" sx={{ mb: 2, color: "#c2410c" }}>
              Order Items:
            </Typography>
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
                      Product
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#c2410c" }}>
                      Quantity
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#c2410c" }}>
                      Color
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#c2410c" }}>
                      Size
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#c2410c" }}>
                      Price
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.cartItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.product.title}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.color}</TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>{item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </div>
      ) : (
        <Typography variant="h6" sx={{ color: "#6b7280" }}>
          Order not found.
        </Typography>
      )}
    </Box>
  );
}
