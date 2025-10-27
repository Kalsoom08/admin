import React, { useEffect, useState } from 'react';
import AddEditBaseModal from './AddEditBaseModal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, FormField } from '@maincomponents/components/ui/form';
import TextInput from '@maincomponents/Inputs/TextInput';
import SelectBox from '@maincomponents/Inputs/SelectBox';
import { useDispatch, useSelector } from 'react-redux';
import { successToast } from '@utils/toastUtil';
import { createItem, editItem } from '@redux/slice/itemSlice';
import { USER_STATUS } from '@data/Constants';
import { fetchAllCategory } from '@redux/slice/categorySlice';
import { itemSchema } from '@validations/index';

const statusOptions = Object.entries(USER_STATUS).map(([key, value]) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
  value: key
}));

const AddEditItem = ({ isEdit, open, onClose }) => {
  const dispatch = useDispatch();
  const { selectedItem } = useSelector(state => state.item); // ✅ fixed naming
  const { data: categories } = useSelector(state => state.category);
  console.log("categories option in items",categories);
  
  const [modalLoader, setModalLoader] = useState(false);

  const defaultValues = {
    name: '',
    category: '',
    price: '',
    stock: '',
    status: '',
    image: ''
  };

  const { handleSubmit, reset, control, ...form } = useForm({
    resolver: yupResolver(itemSchema),
    mode: 'onBlur',
    defaultValues
  });

  // ✅ Fetch categories when modal opens
  useEffect(() => {
    if (open) dispatch(fetchAllCategory());
  }, [dispatch, open]);

  const categoryOptions = categories?.map(cat => ({
    label:  cat.name,
    value: cat.categoryId
  })) || [];

  // ✅ Reset form values when switching between add/edit
  useEffect(() => {
    if (isEdit && selectedItem) {
       console.log('Selected Item:', selectedItem);
      reset({
        name: selectedItem.name || '',
        category: Number(selectedItem.category.id) || '',
        price: selectedItem.price || '',
        stock: selectedItem.stock || '',
        status: selectedItem.status || '',
        image: selectedItem.image || ''
      });
    } else {
      reset(defaultValues);
    }
  }, [isEdit, selectedItem, reset, open]);

  const onSubmit = async values => {
    if (modalLoader) return;
    setModalLoader(true);

    try {
      const formData = new FormData();
      formData.append('name', values.name?.trim() || '');
      formData.append('categoryId', values.category);
      formData.append('price', values.price);
      formData.append('stock', values.stock);
      formData.append('status', values.status);
      if (values.image instanceof File) {
        formData.append('file', values.image);
      }

      if (isEdit && selectedItem?.itemId) {
        await dispatch(editItem({ id: selectedItem.itemId, body: formData })).unwrap();
        successToast('Item updated successfully');
      } else {
        await dispatch(createItem(formData)).unwrap();
        successToast('Item created successfully');
      }

      onClose();
    } catch (error) {
      console.error('Submit Error:', error);
    } finally {
      setModalLoader(false);
    }
  };

  return (
    <AddEditBaseModal
      title={isEdit ? 'Edit Item' : 'Add Item'}
      open={open}
      onClose={onClose}
      isLoading={modalLoader}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full">
        <Form control={control} {...form}>
          <form className="space-y-4 mt-6" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <TextInput
                  label="Item Name"
                  type="text"
                  placeholder="e.g., Tea"
                  field={field}
                />
              )}
            />

            <FormField
              control={control}
              name="category"
              render={({ field }) => (
                <SelectBox
                  label="Category"
                  placeholder="Choose category"
                  options={categoryOptions}
                  field={{
                    ...field,
                    value: field.value !== '' ? Number(field.value) : '',
                    onChange: val => field.onChange(Number(val))
                  }}
                />
              )}
            />

            <FormField
              control={control}
              name="price"
              render={({ field }) => (
                <TextInput
                  label="Price"
                  type="number"
                  placeholder="Rs. 1000"
                  field={field}
                />
              )}
            />

            <FormField
              control={control}
              name="stock"
              render={({ field }) => (
                <TextInput
                  label="Stock"
                  type="number"
                  placeholder="Enter Stock"
                  field={field}
                />
              )}
            />

            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <SelectBox
                  label="Status"
                  placeholder="Select Status"
                  options={statusOptions}
                  field={field}
                />
              )}
            />

            <FormField
              control={control}
              name="image"
              render={({ field }) => (
                <div>
                  <label className="block font-medium">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    placeholder="Upload Image"
                    onChange={e => field.onChange(e.target.files[0])}
                  />
                  {field.value && (
                    <img
                      src={
                        field.value instanceof File
                          ? URL.createObjectURL(field.value)
                          : field.value
                      }
                      alt="Preview"
                      className="mt-2 w-24 h-24 object-cover rounded"
                    />
                  )}
                </div>
              )}
            />
          </form>
        </Form>
      </div>
    </AddEditBaseModal>
  );
};

export default AddEditItem;
