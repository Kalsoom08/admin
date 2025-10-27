import React, { useState } from 'react';
import BaseDeleteModal from './BaseDeleteModal';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedPayRoll, removePayRollById } from '@redux/slice/payrollSlice';
import { removePayRoll } from '@redux/slice/payrollSlice';
import { successToast, errorToast } from '@utils/toastUtil';

const DeletePayroll = ({ onClose, open }) => {
  const dispatch = useDispatch();
  const [modalLoader, setModalLoader] = useState(false);
  const { selectedPayRoll } = useSelector(state => state.payroll);

  async function onSubmit() {
    if (modalLoader) return;
    setModalLoader(true);
    try {
      const id = selectedPayRoll?.salaryId;
      if (!id) throw new Error('No payroll selected');

      await dispatch(removePayRoll(id)).unwrap();
      dispatch(removePayRollById(id));
      dispatch(setSelectedPayRoll(null));

      successToast('Payroll deleted successfully');
      onClose();
    } catch (error) {
      console.error('Delete failed:', error);
      errorToast('Failed to delete payroll');
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
      title="Delete Payroll!"
      message="Are you sure you want to delete this payroll?"
    />
  );
};

export default DeletePayroll;
