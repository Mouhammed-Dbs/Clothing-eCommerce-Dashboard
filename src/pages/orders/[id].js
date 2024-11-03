import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  getSpecificUserOrders,
  updateIsDelivered,
} from "../../../public/functions/order";
import {
  Box,
  Typography,
  Button,
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
import { IoPrintSharp } from "react-icons/io5";
import Link from "next/link";

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

  const handlePrintAddress = () => {
    if (typeof window !== "undefined") {
      const printWindow = window.open("", "_blank", "width=800,height=400");
      if (printWindow) {
        printWindow.document.write(`
        <html>
          <head>
            <title>Shipping Label</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
              }
              h1 {
                font-size: 24px;
                margin-bottom: 10px;
              }
              p {
                font-size: 18px;
                margin-bottom: 8px;
              }
              .label-box {
                border: 2px dashed #4d4e49;
                padding: 20px;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="label-box">
              <h1>Shipping Address</h1>
              <p>${order?.shippingAddress.details}, ${order?.shippingAddress.city}, ${order?.shippingAddress.postalCode}</p>
            </div>
          </body>
        </html>
      `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
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
            sx={{ mb: 2, color: "#3d3f36" }}
          >
            Order Details
          </Typography>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              mb: 3,
              backgroundColor: "#f1f5f9",
              border: "1px solid #4d4e49",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6" sx={{ color: "#3d3f36" }}>
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
            <Typography variant="h6" sx={{ color: "#6b7280" }}>
              Created At: {order.createdAt}
            </Typography>
            <Typography variant="h6" sx={{ color: "#6b7280" }}>
              Updated At: {order.updatedAt}
            </Typography>
            <Box marginTop={2}>
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleUpdateDelivered}
                    disabled={updating || order.isDelivered}
                    sx={{
                      border: "1px solid #4d4e49",
                      backgroundColor: "#f87171",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#ef4444" },
                    }}
                  >
                    {updating ? "Updating..." : "Mark as Delivered"}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={handlePrintAddress}
                    sx={{
                      border: "1px solid #4d4e49",
                      backgroundColor: "#4d4e49",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#3d3f36" },
                    }}
                  >
                    <IoPrintSharp className="mr-2" />
                    Print Shipping Address
                  </Button>
                </Grid>
                {order.returnOrder && (
                  <Grid item>
                    <Link
                      href={`/return-orders/${order.returnOrder._id}`}
                      passHref
                    >
                      <Button
                        variant="contained"
                        sx={{
                          border: "1px solid #4d4e49",
                          backgroundColor: "#2b93db",
                          color: "#fff",
                          "&:hover": { backgroundColor: "#1d9ed8" },
                        }}
                      >
                        View Return Request
                      </Button>
                    </Link>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Paper>

          <Box marginTop={4}>
            <Typography variant="h6" sx={{ mb: 2, color: "#3d3f36" }}>
              Order Items:
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                border: "1px solid #4d4e49",
                backgroundColor: "#f1f5f9",
                boxShadow: "none",
                borderRadius: "8px",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", color: "#3d3f36" }}>
                      Product
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#3d3f36" }}>
                      Quantity
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#3d3f36" }}>
                      Color
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#3d3f36" }}>
                      Size
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#3d3f36" }}>
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
                      <TableCell>
                        {item.priceAfterDiscount
                          ? item.priceAfterDiscount
                          : item.price}
                      </TableCell>
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
