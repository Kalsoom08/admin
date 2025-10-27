import React, { useState } from 'react';
import BaseDeleteModal from './BaseDeleteModal';
import { useDispatch, useSelector } from 'react-redux';
import { removeItem, removeItemById, setSelectedItem } from '@redux/slice/itemSlice';
import { successToast } from '@utils/toastUtil';

const DeleteItem = ({ onClose, open }) => {
  const dispatch = useDispatch();
  const [modalLoader, setModalLoader] = useState(false);
  const selectedItem = useSelector(state => state.item.selectedItem);

  async function onSubmit() {
    if (modalLoader) return;
    if (!selectedItem) return;
    setModalLoader(true);

    try {
      const id = selectedItem.itemId;
      await dispatch(removeItem(id)).unwrap(); 
        dispatch(removeItemById(id));
      dispatch(setSelectedItem(null));
      successToast('Item deleted successfully');
      onClose();
    } catch (err) {
      console.error(err);
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
      title="Delete Item!"
      message="Are you sure you want to delete this Item?"
    />
  );
};

export default DeleteItem;
