import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
} from "@mui/material";
import { Spinner } from "@nextui-org/react";
import {
  createRefund,
  getSpecificUserReturnOrder,
  updateReturnRequestFromAdmin,
} from "../../../public/functions/returnOrder";

export default function ReturnOrderDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approvedItems, setApprovedItems] = useState([]);
  const [rejectedItems, setRejectedItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refundItems, setRefundItems] = useState([]);

  // Fetch order details based on ID
  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const data = await getSpecificUserReturnOrder(id);
      setOrderDetails(data.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  // Check if all items are refunded
  const someItemsApproved = orderDetails?.returnItems.some(
    (item) => item.status === "Approved"
  );

  const handleApprove = (item) => {
    setApprovedItems((prev) => [
      ...prev,
      { id: item.product._id, color: item.color, size: item.size },
    ]);
    setRejectedItems((prev) =>
      prev.filter(
        (i) =>
          i.id !== item.product._id ||
          i.color !== item.color ||
          i.size !== item.size
      )
    );
  };

  const handleReject = (item) => {
    setRejectedItems((prev) => [
      ...prev,
      { id: item.product._id, color: item.color, size: item.size },
    ]);
    setApprovedItems((prev) =>
      prev.filter(
        (i) =>
          i.id !== item.product._id ||
          i.color !== item.color ||
          i.size !== item.size
      )
    );
  };

  const toggleRefundItem = (item) => {
    const itemExists = refundItems.some(
      (refundItem) =>
        refundItem.id === item.product._id &&
        refundItem.color === item.color &&
        refundItem.size === item.size
    );
    if (itemExists) {
      setRefundItems((prev) =>
        prev.filter(
          (refundItem) =>
            refundItem.id !== item.product._id ||
            refundItem.color !== item.color ||
            refundItem.size !== item.size
        )
      );
    } else {
      setRefundItems((prev) => [
        ...prev,
        { id: item.product._id, color: item.color, size: item.size },
      ]);
    }
  };

  const submitDecisions = async () => {
    setIsSubmitting(true);
    try {
      await updateReturnRequestFromAdmin(id, approvedItems, rejectedItems);
      await fetchOrderDetails();
      console.log("Return order updated successfully");
    } catch (error) {
      console.error("Error updating return order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefund = async () => {
    try {
      const response = await createRefund(orderDetails._id, refundItems);
      console.log("Refund successful:", response);
      await fetchOrderDetails();
    } catch (error) {
      console.error("Error processing refund:", error);
    }
  };

  const hasPendingItems = orderDetails?.returnItems.some(
    (item) => item.status === "Pending"
  );
  const allPendingItemsProcessed = orderDetails?.returnItems.every(
    (item) =>
      item.status !== "Pending" ||
      approvedItems.some(
        (approvedItem) =>
          approvedItem.id === item.product._id &&
          approvedItem.color === item.color &&
          approvedItem.size === item.size
      ) ||
      rejectedItems.some(
        (rejectedItem) =>
          rejectedItem.id === item.product._id &&
          rejectedItem.color === item.color &&
          rejectedItem.size === item.size
      )
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <Spinner color="primary" />
      </Box>
    );
  }

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Return Order Details
      </Typography>
      <Typography variant="body1" gutterBottom>
        Order ID: {orderDetails.order}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Return Order ID: {orderDetails._id}
      </Typography>
      <Typography variant="body1" gutterBottom>
        User: {orderDetails.user.name} ({orderDetails.user.email})
      </Typography>
      <Typography variant="body1" gutterBottom>
        Refund Amount: ${orderDetails.refundAmount}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Return Request Date: {new Date(orderDetails.createdAt).toLocaleString()}
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderDetails.returnItems.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.product.title}</TableCell>
                <TableCell>{item.color}</TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.reason}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  {item.approvalDate && (
                    <Typography variant="body2">
                      Approval Date:{" "}
                      {new Date(item.approvalDate).toLocaleString()}
                    </Typography>
                  )}
                  {item.rejectionDate && (
                    <Typography variant="body2">
                      Rejection Date:{" "}
                      {new Date(item.rejectionDate).toLocaleString()}
                    </Typography>
                  )}
                  {item.refundDate && (
                    <Typography variant="body2">
                      Refund Date: {new Date(item.refundDate).toLocaleString()}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {item.status === "Approved" && (
                    <Button
                      variant={
                        refundItems.some(
                          (refundItem) =>
                            refundItem.id === item.product._id &&
                            refundItem.color === item.color &&
                            refundItem.size === item.size
                        )
                          ? "contained"
                          : "outlined"
                      }
                      color="secondary"
                      onClick={() => toggleRefundItem(item)}
                    >
                      {refundItems.some(
                        (refundItem) =>
                          refundItem.id === item.product._id &&
                          refundItem.color === item.color &&
                          refundItem.size === item.size
                      )
                        ? "Cancel"
                        : "Refund"}
                    </Button>
                  )}
                  {item.status === "Pending" && (
                    <Box display="flex" gap={1}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() =>
                          handleApprove({
                            product: item.product,
                            color: item.color,
                            size: item.size,
                          })
                        }
                        disabled={
                          approvedItems.some(
                            (i) =>
                              i.id === item.product._id &&
                              i.color === item.color &&
                              i.size === item.size
                          ) || isSubmitting
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          handleReject({
                            product: item.product,
                            color: item.color,
                            size: item.size,
                          })
                        }
                        disabled={
                          rejectedItems.some(
                            (i) =>
                              i.id === item.product._id &&
                              i.color === item.color &&
                              i.size === item.size
                          ) || isSubmitting
                        }
                      >
                        Reject
                      </Button>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {hasPendingItems
        ? allPendingItemsProcessed && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={submitDecisions}
              disabled={isSubmitting}
            >
              Submit Decisions
            </Button>
          )
        : someItemsApproved && (
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 3 }}
              disabled={refundItems.length === 0}
              onClick={handleRefund}
            >
              Refund Amount
            </Button>
          )}
    </Box>
  );
}
