import React, { useEffect, useState } from 'react';
import AddEditBaseModal from './AddEditBaseModal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, FormField } from '@maincomponents/components/ui/form';
import { employeeSchema } from '@validations/index';
import TextInput from '@maincomponents/Inputs/TextInput';
import { EMPLOYEES_STATUS, EMPLOYEES_ROLE, USER_STATUS, EMPLOYEESS_STATUS } from '@data/Constants';
import SelectBox from '@maincomponents/Inputs/SelectBox';
import { useDispatch, useSelector } from 'react-redux';
import { errorToast, successToast } from '@utils/toastUtil';
import { createEmployee, editEmployee } from '@redux/slice/employeeSlice';
import PasswordInput from '@maincomponents/Inputs/PasswordInput';
const employeeStatusOptions = Object.entries(EMPLOYEESS_STATUS).map(([key, value]) => ({
  label: value.charAt(0) + value.slice(1).toUpperCase(),
  value: key
}));
const employeeRoleOptions = Object.entries(EMPLOYEES_ROLE).map(([key, value]) => ({
  label: value.charAt(0) + value.slice(1).toUpperCase(), // Makes it "Active", "Blocked", etc.
  value: key
}));
const AddEditEmployee = ({ isEdit, open, onClose }) => {
  const dispatch = useDispatch();
  const { selectedEmployee } = useSelector(state => state.employee);
  const [modalLoader, setModalLoader] = useState(false);
  const title = isEdit ? 'Edit Employee' : 'Add Employee';
  const defaultValues = {
    fullName: '',
    phone: '',
    role: '',
    salary: '',
    status: '',
    email: '',
    password: '',
    joinedDate: '',
    resignDate: null || ''
  };
  const { handleSubmit, reset, ...form } = useForm({
    resolver: yupResolver(employeeSchema),
    mode: 'onBlur',
    defaultValues
  });
  async function onSubmit(values) {
    console.log('Form Values:', values);
    if (modalLoader) return;
    setModalLoader(true);
    try {
      const normalized = {
        ...values,
        phone: values.phone.replace('+92', '0'), // turns +923045760623 → 03045760623
        resignDate: values.resignDate || null,
      };
    try {
if (isEdit) {
  await dispatch(editEmployee({ id: selectedEmployee.userId, body: normalized })).unwrap();
  successToast('Employee updated successfully');
} else {
  await dispatch(createEmployee(normalized)).unwrap();
  successToast('Employee created successfully');
}
} catch (error) {
  console.error(error);
} finally {
  setModalLoader(false);
}
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setModalLoader(false);
    }
  }
  useEffect(() => {
    if (isEdit && selectedEmployee) {
      const { fullName, phone, role, salary, status, email, password, joinedDate, resignDate } = selectedEmployee;
      reset({
        fullName,
        phone,
        role,
        salary,
        status,
        email,
        password,
        joinedDate,
        resignDate
      });
    }
  }, [isEdit, selectedEmployee, reset]);
  return (
    <AddEditBaseModal
      title={title}
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
              name='fullName'
              render={({ field }) => (
                <TextInput label='Employee Name' type='text' placeHolder='Enter employee name' field={field} />
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <TextInput label='Email' type='email' placeHolder='Enter your email' field={field} />
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <TextInput label='Phone Number' type='number' placeHolder='03000000000' field={field} />
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <PasswordInput label='Password' type='email' placeHolder='**********' field={field} />
              )}
            />
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <SelectBox label='Role' placeholder='Choose role' options={employeeRoleOptions} field={field} />
              )}
            />
            <FormField
              control={form.control}
              name='salary'
              render={({ field }) => <TextInput label='Base Salary (Pkr)' placeHolder='Rs. 1000' field={field} />}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <SelectBox label='Status' placeholder='Select Status' options={employeeStatusOptions} field={field} />
              )}
            />
            <FormField
              control={form.control}
              name='joinedDate'
              render={({ field }) => (
                <TextInput label='Joined Date' type='date' placeHolder='YYYY-MM-DD' field={field} />
              )}
            />
            <FormField
              control={form.control}
              name='resignDate'
              render={({ field }) => (
                <TextInput label='Resign Date' type='date' placeHolder='YYYY-MM-DD' field={field} />
              )}
            />
          </form>
        </Form>
      </div>
    </AddEditBaseModal>
  );
};
export default AddEditEmployee;