import BaseDeleteModal from './BaseDeleteModal';
import { useDispatch, useSelector } from 'react-redux';
import { removeEmployee, removeEmployeeById, setSelectedEmployee } from '@redux/slice/employeeSlice';
import { successToast, errorToast } from '@utils/toastUtil';
import { useState } from 'react';
const DeleteEmployee = ({ onClose, open }) => {
  const dispatch = useDispatch();
  const [modalLoader, setModalLoader] = useState(false);
  const { selectedEmployee } = useSelector(state => state.employee);
  async function onSubmit() {
    if (modalLoader) return;
    setModalLoader(true);
    try {
      const id = selectedEmployee?.userId;
      if (!id) {
        console.warn('No Employee selected to delete');
        setModalLoader(false);
        return;
      }
      // :white_check_mark: Call backend API via thunk
      await dispatch(removeEmployee(id)).unwrap();
      // :white_check_mark: Remove from local state only after success
      dispatch(removeEmployeeById(id));
      dispatch(setSelectedEmployee(null));
      successToast('Employee deleted successfully');
      onClose();
    } catch (error) {
      console.error('Delete failed:', error);
      errorToast('Failed to delete employee');
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
      title="Delete Employee!"
      message="Are you sure you want to delete this employee?"
    />
  );
};
export default DeleteEmployee;