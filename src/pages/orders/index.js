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
  Button,
} from "@mui/material";
import { Spinner } from "@nextui-org/react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchOrders = async (page = 1) => {
    setLoading(page === 1);
    setLoadingMore(page !== 1);
    try {
      const res = await getUserOrders(page);
      setOrders((prevOrders) =>
        page === 1 ? res.data : [...prevOrders, ...res.data]
      );
      setCurrentPage(page);
      setTotalPages(res.paginationResult.numberOfPages);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRowClick = (orderId) => {
    router.push(`/orders/${orderId}`);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchOrders(currentPage + 1);
    }
  };

  return (
    <Box padding={2}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2, color: "#3d3f36" }}>
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
        <>
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
                    Order ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#3d3f36" }}>
                    Shipping Address
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#3d3f36" }}>
                    Total Price
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#3d3f36" }}>
                    Payment Method
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#3d3f36" }}>
                    Paid
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#3d3f36" }}>
                    Delivered
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
                      {order.shippingAddress.details},
                      {order.shippingAddress.city},
                      {order.shippingAddress.postalCode}
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

          {currentPage < totalPages && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#4d4e49",
                  "&:hover": { backgroundColor: "#3d3f36" },
                }}
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? "Loading..." : "Load More"}
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
