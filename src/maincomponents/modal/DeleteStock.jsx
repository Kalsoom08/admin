import React, { useState } from 'react';
import BaseDeleteModal from './BaseDeleteModal';
import { useDispatch, useSelector } from 'react-redux';
import { successToast, errorToast } from '@utils/toastUtil';
import { deleteStockAlertAsync, removeStockById, setSelectedStock } from '@redux/slice/stockSlice';

const DeleteStockAlert = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { selectedStock } = useSelector(state => state.stock);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (loading) return;
    setLoading(true);
    try {
      await dispatch(deleteStockAlertAsync(selectedStock.alertId)).unwrap();
      dispatch(removeStockById(selectedStock.alertId));
      dispatch(setSelectedStock(null));
      successToast('Stock alert deleted successfully');
      onClose();
    } catch (err) {
      console.error(err);
      errorToast('Failed to delete stock alert');
    } finally {
      setLoading(false);
    }
  }

  return (
    <BaseDeleteModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={loading}
      title="Delete Stock Alert"
      message="Are you sure you want to delete this stock alert?"
    />
  );
};

export default DeleteStockAlert;
