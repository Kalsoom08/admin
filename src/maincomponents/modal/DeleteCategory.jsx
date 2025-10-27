// import React, { useState } from 'react';
import BaseDeleteModal from './BaseDeleteModal';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCategory, setSelectedCategory } from '@redux/slice/categorySlice';
import { successToast } from '@utils/toastUtil';
import { useState } from 'react';
const DeleteCategory = ({ onClose, open }) => {
  const dispatch = useDispatch();
  const [modalLoader, setModalLoader] = useState(false);
  const selectedCategory = useSelector(state => state.category?.selectedCategory);
  async function onSubmit() {
    if (modalLoader) return;
    setModalLoader(true);
    try {
      const id = selectedCategory?.categoryId;
      if (!id) {
        console.warn('No category selected to delete');
        setModalLoader(false);
        return;
      }
      dispatch(deleteCategory(id));
      dispatch(setSelectedCategory(null));
      successToast('Category deleted successfully');
      onClose();
    } catch (error) {
      console.error(error);
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
      title="Delete Expense!"
      message="Are you sure you want to delete this expense?"
    />
  );
};
export default DeleteCategory;