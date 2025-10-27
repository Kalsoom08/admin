import React, { useState } from "react";
import BaseDeleteModal from "./BaseDeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedOrder } from "@redux/slice/orderSlice";
import { deleteOrder } from "@redux/actions/orders";
import { successToast } from "@utils/toastUtil";

const DeleteOrder = ({ onClose, open }) => {
  const dispatch = useDispatch();
  const [modalLoader, setModalLoader] = useState(false);
  const { selectedOrder } = useSelector((state) => state.order);

  async function onSubmit() {
    if (modalLoader) return;
    setModalLoader(true);

    if (!selectedOrder) {
      console.warn("No order selected to delete");
      setModalLoader(false);
      return;
    }

    const id = selectedOrder.orderId;

    if (!id) {
      console.warn("Invalid order selected");
      setModalLoader(false);
      return;
    }

    try {
      await dispatch(deleteOrder(id)).unwrap();
      dispatch(setSelectedOrder(null));
      successToast("Order deleted successfully");
      onClose();
    } catch (error) {
      console.error("Failed to delete order:", error);
    } finally {
      setModalLoader(false);
    }
  }

  return (
    <BaseDeleteModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={modalLoader}
      title="Delete Order!"
      message="Are you sure you want to delete this order?"
    />
  );
};

export default DeleteOrder;
