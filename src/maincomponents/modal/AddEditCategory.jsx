import React, { useEffect, useState } from 'react';
import AddEditBaseModal from './AddEditBaseModal';
import { useForm, FormProvider } from 'react-hook-form';
import { FormField } from '@maincomponents/components/ui/form';
import TextInput from '@maincomponents/Inputs/TextInput';
import SelectBox from '@maincomponents/Inputs/SelectBox';
import FileUploadInput from '@maincomponents/Inputs/FileInput';
import { USER_STATUS } from '@data/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { successToast } from '@utils/toastUtil';
import { createCategory, updateCategory } from '@redux/slice/categorySlice';
import { categorySchema } from '@validations/index';
import { yupResolver } from '@hookform/resolvers/yup';
const categoryStatusOptions = Object.entries(USER_STATUS).map(([key, value]) => ({
  label: value.charAt(0) + value.slice(1).toLowerCase(),
  value: key,
}));
const AddEditCategory = ({ isEdit, open, onClose }) => {
  const dispatch = useDispatch();
  const { selectedCategory } = useSelector(state => state.category);
  const [modalLoader, setModalLoader] = useState(false);
  const title = isEdit ? 'Edit Category' : 'Add Category';
  const methods = useForm({
    resolver: yupResolver(categorySchema),
        mode: 'onBlur',
    defaultValues: {
      name: '',
      status: '',
      image: null,
      description: '',
    },

  });
  const { reset, handleSubmit } = methods;
  useEffect(() => {
    if (isEdit && selectedCategory) {
      reset({
        name: selectedCategory.name || '',
        status: selectedCategory.status || '',
        image: null,
        description: selectedCategory.description || '',
      });
    }
  }, [isEdit, selectedCategory, reset]);
  const onSubmit = async values => {
    if (modalLoader) return;
    setModalLoader(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('status', values.status);
      formData.append('description', values.description || '');
      if (values.image instanceof File) {
        formData.append('file', values.image);
      }
      if (isEdit && selectedCategory?.categoryId) {
        await dispatch(updateCategory({ id: selectedCategory.categoryId, body: formData })).unwrap();
        successToast('Category updated successfully');
      } else {
        await dispatch(createCategory(formData)).unwrap();
        successToast('Category created successfully');
      }
      onClose();
    } catch (error) {
      console.error('Error creating/updating category:', error);
    } finally {
      setModalLoader(false);
    }
  };
  return (
    <AddEditBaseModal title={title} open={open} onClose={onClose} isLoading={modalLoader} onSubmit={handleSubmit(onSubmit)}>
      <FormProvider {...methods}>
        <form className="space-y-4 mt-6" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={methods.control}
            name="name"
            render={({ field }) => (
              <TextInput label="Category Title" type="text" placeholder="Enter category name" field={field} />
            )}
          />
          <FormField
            control={methods.control}
            name="status"
            render={({ field }) => (
              <SelectBox label="Status" placeholder="Select Status" options={categoryStatusOptions} field={field} />
            )}
          />
          <FormField
            control={methods.control}
            name="image"
            render={({ field }) => (
              <FileUploadInput label="Upload Image" field={field} existingFileUrl={selectedCategory?.image} />
            )}
          />
          <FormField
            control={methods.control}
            name="description"
            render={({ field }) => (
              <TextInput label="Description" type="text" placeholder="Enter description" field={field} />
            )}
          />
          <button type="submit" className="hidden"></button>
        </form>
      </FormProvider>
    </AddEditBaseModal>
  );
};
export default AddEditCategory;