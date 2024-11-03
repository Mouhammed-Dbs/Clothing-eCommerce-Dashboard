import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
import { Spinner, Input } from "@nextui-org/react";
import { getUserReturnOrders } from "../../../public/functions/returnOrder";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedId, setSelectedId] = useState("");
  const router = useRouter();

  const fetchOrders = async (page = 1) => {
    setLoading(page === 1);
    setLoadingMore(page !== 1);
    try {
      const res = await getUserReturnOrders(page);
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
    router.push(`/return-orders/${orderId}`);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchOrders(currentPage + 1);
    }
  };

  const handleOpenOrderById = () => {
    if (selectedId) {
      router.push(`/return-orders/${selectedId}`);
    }
  };

  // Function to determine the status of the return order
  // Function to determine the status of the return order and count each status type
  // Function to determine the status of the return order and count each status type
  const getOrderStatus = (returnItems) => {
    const statusCounts = returnItems.reduce(
      (acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      },
      { Pending: 0, Approved: 0, Rejected: 0, Refunded: 0 }
    );

    // Filter out statuses with count of 0 and format the output
    return Object.entries(statusCounts)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => `${status}: ${count}`)
      .join(", ");
  };

  return (
    <Box padding={2}>
      <div className="md:flex justify-between">
        <Typography variant="h4" gutterBottom sx={{ mb: 2, color: "#3d3f36" }}>
          Returned Orders
        </Typography>
        <div className="flex gap-1 mb-2 md:mb-0">
          <Input
            type="text"
            placeholder="Type returned order id"
            classNames={{
              input: "text-red-500 font-semibold text-black",
              base: "bg-transparent rounded-xl border-1 border-primary h-11",
              inputWrapper: "bg-white",
              innerWrapper: "bg-transparent",
            }}
            onChange={(e) => setSelectedId(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{
              borderRadius: "15px",
              height: "40px",
              backgroundColor: "#4d4e49",
              "&:hover": { backgroundColor: "#3d3f36" },
            }}
            onClick={handleOpenOrderById}
          >
            Go
          </Button>
        </div>
      </div>

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
                    Created At
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#3d3f36" }}>
                    Order ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#3d3f36" }}>
                    Refund Amount
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#3d3f36" }}>
                    User Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#3d3f36" }}>
                    Returned Items Count
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#3d3f36" }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    className="cursor-pointer"
                    key={order._id}
                    hover
                    onClick={() => handleRowClick(order._id)}
                  >
                    <TableCell>
                      {new Date(order.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>{order.order}</TableCell>
                    <TableCell>{order.refundAmount}</TableCell>
                    <TableCell>{order.user.name}</TableCell>
                    <TableCell>{order.returnItems.length}</TableCell>
                    <TableCell>{getOrderStatus(order.returnItems)}</TableCell>
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
