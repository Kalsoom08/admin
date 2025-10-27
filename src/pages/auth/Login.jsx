import AuthLayout from '@layouts/AuthLayout';
import { Form, FormField } from '@maincomponents/components/ui/form';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@validations/index';
import TextInput from '@maincomponents/Inputs/TextInput';
import PasswordInput from '@maincomponents/Inputs/PasswordInput';
import LoaderButton from '@maincomponents/loaders/LoaderButton';
import { useDispatch } from 'react-redux';
import { signIn } from '@redux/slice/authSlice';
import { Link } from 'react-router-dom';
import { storeTokens } from '@utils/localstorageutil';
const Login = () => {
  const dispatch = useDispatch();
  const form = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'all',
    defaultValues: {
      email: 'admin@gmail.com',
      password: 'Khan@1234'
    }
  });
  async function onSubmit(values) {
    try {
      const response = await dispatch(signIn(values)).unwrap();
      storeTokens(response);
    } catch (error) {
      console.log('Error', error);
    }
  }
  return (
    <AuthLayout headerText='Ahmad Cafe' description='Professional Point of Sale System'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full max-w-md mx-auto'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => <TextInput label='Email' type='email' placeHolder='Email address' field={field} />}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => <PasswordInput label='Password' placeHolder='*********' field={field} />}
          />
          {/* <div className='flex justify-between text-sm text-primary -mt-4'>
            <FormField
              control={form.control}
              name='remember'
              render={({ field }) => (
                <div className='flex items-center gap-2'>
                  <input
                    id='remember'
                    type='checkbox'
                    className='h-4 w-4 rounded border'
                    checked={!!field.value}
                    onChange={e => field.onChange(e.target.checked)}
                  />
                  <label htmlFor='remember' className='text-sm text-primary'>
                    Remember me
                  </label>
                </div>
              )}
            />
            <Link to='/email' className='text-sm font-medium text-primary hover:underline'>
              Forgot password?
            </Link>
          </div> */}
          <LoaderButton
            btnText='Login'
            loaderText='Logging in...'
            loading={form.formState.isSubmitting}
            type='submit'
            className='w-full'
            btn
          />
        </form>
      </Form>
    </AuthLayout>
  );
};
export default Login;