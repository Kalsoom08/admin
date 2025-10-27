import BaseDeleteModal from './BaseDeleteModal';
import { useDispatch, useSelector } from 'react-redux';
import { deleteExpense } from '@redux/actions/expense';
import {setSelectedExpense} from '@redux/slice/expensesSlice'
import { successToast, errorToast } from '@utils/toastUtil';
import { useState } from 'react';
const DeleteExpenses = ({ onClose, open }) => {
  const dispatch = useDispatch();
  const [modalLoader, setModalLoader] = useState(false);
  const selectedExpense = useSelector(state => state.expenses?.selectedExpense);
  async function onSubmit() {
    if (modalLoader) return;
    setModalLoader(true);
    try {
      const id = selectedExpense?.expenseId;
      if (!id) {
        console.warn('No expense selected to delete');
        setModalLoader(false);
        return;
      }
      await dispatch(deleteExpense(id)).unwrap();
      dispatch(setSelectedExpense(null));
      successToast('Expense deleted successfully!');
      onClose();
    } catch (error) {
      console.error('Error deleting expense:', error);
      errorToast('Failed to delete expense');
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
export default DeleteExpenses;