import { EMPLOYEES_ROLE, EMPLOYEES_STATUS, USER_STATUS, CATEGORY_ITEM, STOCK_STATUSS, FULFILMENT_STATUS, EMPLOYEESS_STATUS } from '@data/Constants';
import { de } from 'date-fns/locale/de';
import * as Yup from 'yup';

export const emailValidation = Yup.string().email('Invalid email').required('Email is required');
export const loginSchema = Yup.object({
  email: emailValidation,
  password: Yup.string().required('Password is required')
});
export const userssSchema = Yup.object({
  fullName: Yup.string().min(2, 'Full Name must be at least 2 characters').required('Full Name is required'),
  phone: Yup.string()
    .required('Phone number is required')
    .test('valid-phone', 'Phone must start with +92 or +966 and be 13 characters long', value => {
      if (!value) return false;
      const startsWithValidPrefix = value.startsWith('+92') || value.startsWith('+966');
      return startsWithValidPrefix && value.length === 13;
    }),
  email: emailValidation,
  status: Yup.string().required('Status is required')
});
// validations/index
export const expenseSchema = Yup.object({
  title: Yup.string().min(2).required(),
  item: Yup.string().required(),
  amount: Yup.number().typeError('Amount must be a number').positive().required()
  // expenseDate: Yup.string()
  //   .matches(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD')
  //   .required('Expense date is required'),
  // addedBy: Yup.string().min(2).required()
});
export const employeeSchema = Yup.object({
  fullName: Yup.string()
    .required('Employee name is required')
    .min(2, 'Employee name must be at least 2 characters')
    .max(15, 'Employee name cannot be longer than 15 characters'),
  role: Yup.string().required('Role is required').oneOf(Object.keys(EMPLOYEES_ROLE), 'Invalid role selected'), // assuming CATEGORY contains valid roles
  salary: Yup.number()
    .required('Base salary is required')
    .positive('Salary must be a positive number')
    .min(1000, 'Salary must be at least Rs. 1000')
    .max(100000, 'Salary must not exceed Rs. 100000'),
  // phone: Yup.string()
  //   .required('Phone number is required')
  //   .test('valid-phone', 'Phone must start with +92 and be 13 characters long', value => {
  //     if (!value) return false;
  //     const startsWithValidPrefix = value.startsWith('+92');
  //     return startsWithValidPrefix && value.length === 13;
  //   }),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^(\+923\d{10}|03\d{9})$/, 'Phone number must start with +923 or 03 and contain 10 digits after it.'),
  status: Yup.string()
    .required('Status is required')
    .oneOf(Object.keys(EMPLOYEESS_STATUS), 'Status must be either Active or blocked'), // assuming the statuses are 'Paid' or 'Pending'
  email: emailValidation,
  // password: Yup.string()
  //   .required('Password is required')
  //   .matches(
  //     /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,15}$/,
  //     'Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be 8-15 characters long'
  //   ),
  joinedDate: Yup.date()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .notRequired()
    .typeError('Joined date must be a valid date'),
  resignDate: Yup.date()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .notRequired()
    .typeError('Resign date must be a valid date')
});
export const payrollSchema = Yup.object().shape({
  employeeName: Yup.string().required('Employee name is required'),
  month: Yup.string().required('Month is required'),
  paidAmount: Yup.number()
    .typeError('Paid Amount must be a number')
    .positive('Paid Amount must be positive')
    .required('Paid Amount is required'),
  status: Yup.string().required('Status is required').oneOf(Object.keys(EMPLOYEES_STATUS), 'Invalid status selected'),
  comment: Yup.string().nullable(),
  userId: Yup.array().min(1, 'At least one employee is required') // Ensure this is properly validated
});

export const categorySchema = Yup.object().shape({
  name: Yup.string()
    .required('Category name is required')
    .min(2, 'Category name must be at least 2 characters')
    .max(20, 'Category name cannot exceed 50 characters'),
  status: Yup.string().required('Status is required').oneOf(Object.keys(USER_STATUS), 'Invalid status selected'),
  // image: Yup.mixed().required('Image is required'),
  description: Yup.string().optional()
});
export const itemSchema = Yup.object().shape({
  name: Yup.string().required('Item name is required'),
  category: Yup.number().required('Category is required'),
  price: Yup.number().required('Price is required').min(0, 'Price must be a positive number'),
  stock: Yup.number().required('Stock is required').min(0, 'Stock must be a positive number'),
  status: Yup.string().required('Status is required'),
  image: Yup.mixed().required('Image is required')
});
// Stock Alert schema
export const stockSchema = Yup.object().shape({
  itemName: Yup.string()
    .required('Item name is required')
    .min(3, 'Item name must be at least 3 characters long')
    .max(100, "Item name can't exceed 100 characters"),
  stockStatus: Yup.string()
    .required('Stock status is required')
    .oneOf(Object.keys(STOCK_STATUSS), 'Invalid stock status'),
  fulfilmentStatus: Yup.string()
    .required('Fulfilment status is required')
    .oneOf(Object.keys(FULFILMENT_STATUS), 'Invalid fulfilment status'),
  note: Yup.string().max(200, "Note can't exceed 200 characters").nullable(), // Make it optional if the note is not mandatory

});
