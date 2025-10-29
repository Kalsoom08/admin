import React, { useEffect, useState } from 'react';
import AddEditBaseModal from './AddEditBaseModal';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '@maincomponents/components/ui/form';
import TextInput from '@maincomponents/Inputs/TextInput';
import SelectBox from '@maincomponents/Inputs/SelectBox';
import SelectWithSearchInput from '@maincomponents/Inputs/SelectWithSearch';
import { EMPLOYEES_STATUS, MONTH_ITEM } from '@data/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { successToast } from '@utils/toastUtil';
import { createPayRoll, fetchAllPayRoll, updatePayRoll } from '@redux/slice/payrollSlice';
import { fetchAllEmployee } from '@redux/slice/employeeSlice'; 
import { yupResolver } from '@hookform/resolvers/yup';
import { payrollSchema } from '@validations/index';

const payrollStatusOptions = Object.entries(EMPLOYEES_STATUS).map(([key, value]) => ({
  label: value,
  value: key
}));

const payrollMonthOptions = Object.entries(MONTH_ITEM).map(([key, value]) => ({
  label: value,
  value: key
}));

const AddEditPayRoll = ({ isEdit, open, onClose }) => {
  const dispatch = useDispatch();

  const { selectedPayRoll, page, perPage, filters } = useSelector(state => state.payroll);
  const employees = useSelector(state => state.employee.data);

  const [modalLoader, setModalLoader] = useState(false);

  const defaultValues = {
    employeeName: '',
    userId: [],
    month: '',
    year: new Date().getFullYear(),
    paidAmount: '',
    status: '',
    comment: ''
  };

  const { handleSubmit, reset, ...form } = useForm({
    // resolver: yupResolver(payrollSchema),
    mode: 'onBlur',
    defaultValues
  });

 
  useEffect(() => {
    if (employees.length === 0) {
      dispatch(fetchAllEmployee({ page: 1, perPage: 100 }));
    }
  }, [dispatch, employees.length]);


  useEffect(() => {
    if (isEdit && selectedPayRoll) {
      reset({
        userId: selectedPayRoll.user ? [selectedPayRoll.user.userId] : [],
        employeeName: selectedPayRoll.user?.fullName || '',
        month: selectedPayRoll.month,
        year: selectedPayRoll.year,
        paidAmount: selectedPayRoll.paidAmount,
        status: selectedPayRoll.status,
        comment: selectedPayRoll.comment
      });
    } else {
      reset(defaultValues);
    }
  }, [isEdit, selectedPayRoll, reset]);

  async function onSubmit(values) {
    if (modalLoader) return;
    setModalLoader(true);

    try {
      const basePayload = {
        month: values.month.replace(/^0/, ''),
        year: values.year,
        paidAmount: Number(values.paidAmount),
        status: values.status,
        comment: values.comment
      };

      if (isEdit) {
        if (!selectedPayRoll || !selectedPayRoll.salaryId) {
          setModalLoader(false);
          return;
        }
        const payload = { ...basePayload, userId: Number(values.userId[0]) };
        await dispatch(updatePayRoll({ id: selectedPayRoll.salaryId, body: payload })).unwrap();
        await dispatch(
          fetchAllPayRoll({
            page,
            limit: perPage,
            search: filters.search,
            status: filters.status,
            month: filters.month
          })
        );
        successToast('Payroll updated successfully');
      } else {
        const payload = { ...basePayload, userId: values.userId.map(Number) };
        await dispatch(createPayRoll(payload)).unwrap();

        await dispatch(
          fetchAllPayRoll({
            page,
            limit: perPage,
            search: filters.search,
            status: filters.status,
            month: filters.month
          })
        );

        successToast('Payroll created successfully');
      }

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setModalLoader(false);
    }
  }

  return (
    <AddEditBaseModal
      title={isEdit ? 'Edit Payroll' : 'Add Payroll'}
      open={open}
      onClose={onClose}
      isLoading={modalLoader}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='w-full'>
        <Form {...form}>
          <form className='space-y-4 mt-6'>
            <FormField
              control={form.control}
              name='userId'
              render={({ field }) => (
                <SelectWithSearchInput
                  label='Employee Name(s)'
                  options={employees.map(emp => ({
                    label: emp.fullName || emp.employeeName,
                    value: emp.userId
                  }))}
                  placeholder='Select employee(s)'
                  value={field.value || []}
                  onChange={field.onChange}
                  isMulti
                />
              )}
            />
            <FormField
              control={form.control}
              name='month'
              render={({ field }) => (
                <SelectBox label='Month' placeholder='Select month' options={payrollMonthOptions} field={field} />
              )}
            />
            <FormField
              control={form.control}
              name='paidAmount'
              render={({ field }) => <TextInput label='Paid Amount' type='number' field={field} />}
            />
            <FormField
              control={form.control}
              name='comment'
              render={({ field }) => <TextInput label='Comment' type='text' field={field} />}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <SelectBox label='Status' placeholder='Select Status' options={payrollStatusOptions} field={field} />
              )}
            />
          </form>
        </Form>
      </div>
    </AddEditBaseModal>
  );
};

export default AddEditPayRoll;
