import React, { useEffect, useState } from 'react';
import AddEditBaseModal from './AddEditBaseModal';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '@maincomponents/components/ui/form';
import TextInput from '@maincomponents/Inputs/TextInput';
import SelectWithSearchInput from '@maincomponents/Inputs/SelectWithSearch';
import { useDispatch, useSelector } from 'react-redux';
import { createExpense, updateExpense } from '@redux/actions/expense';
import { fetchAllItem } from '@redux/slice/itemSlice';
import { successToast } from '@utils/toastUtil';
import { Button } from '@maincomponents/components/ui/button';
import { Plus, X } from 'lucide-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { expenseSchema } from '@validations/index';

const AddEditExpenses = ({ isEdit, open, onClose }) => {
  const dispatch = useDispatch();
  const { selectedExpense } = useSelector(state => state.expenses);
  const { data: items } = useSelector(state => state.item);

  const [modalLoader, setModalLoader] = useState(false);
  const [showCustomItem, setShowCustomItem] = useState(false);

  const form = useForm({
    // resolver: yupResolver(expenseSchema),
    mode: 'onBlur',
    defaultValues: {
      expenseId: '',
      title: '',
      item: '',
      customItem: '',
      amount: ''
    }
  });

  const { handleSubmit, reset, control, watch, setValue, formState: { errors } } = form;

  useEffect(() => {
    dispatch(fetchAllItem());
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && selectedExpense) {
      const { expenseId, title, item, amount, itemName } = selectedExpense;
      const itemData = itemName || (typeof item === 'string' ? item : item?.name);

      const existingItem = items.find(itm => itm.name === itemData || itm.itemId === itemData);
      if (existingItem) {
        reset({
          expenseId,
          title,
          item: existingItem.itemId,
          customItem: '',
          amount
        });
        setShowCustomItem(false);
      } else {
        reset({
          expenseId,
          title,
          item: '',
          customItem: itemData || '',
          amount
        });
        setShowCustomItem(true);
      }
    } else {
      reset({
        expenseId: '',
        title: '',
        item: '',
        customItem: '',
        amount: ''
      });
      setShowCustomItem(false);
    }
  }, [isEdit, selectedExpense, reset, items]);

  const onSubmit = async (values) => {

    
    if (modalLoader) return;
    setModalLoader(true);

    try {
      const body = {
        expenseId: values.expenseId || undefined,
        title: values.title.trim(),
        amount: Number(values.amount.trim())
      };

      if (showCustomItem) {
        if (!values.customItem.trim()) throw new Error('Please enter a custom item name');
        body.item = 0; 
        body.fakeItemName = values.customItem.trim();
      } else {
        if (!values.item) throw new Error('Please select an item');
        body.item = Number(values.item);
      }

      let result;
      if (isEdit) {
        result = await dispatch(updateExpense(body)).unwrap();
        successToast('Expense updated successfully');
      } else {
        result = await dispatch(createExpense(body)).unwrap();
        successToast('Expense created successfully');
      }

      onClose();
    } catch (err) {
      console.error('Error submitting expense:', err);
    } finally {
      setModalLoader(false);
    }
  };

  const itemOptions = items.map(itm => ({
    label: itm.name,
    value: itm.itemId
  }));

  return (
    <AddEditBaseModal
      title={isEdit ? 'Edit Expense' : 'Add Expense'}
      open={open}
      onClose={onClose}
      isLoading={modalLoader}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <div className="space-y-4 mt-6">
          <FormField
            control={control}
            name="title"
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <TextInput label="Expense Title" placeholder="e.g., Gas Bill" field={field}    />
            )}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Item <span className="text-red-500">*</span></label>
              {!showCustomItem ? (
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCustomItem(true)} className="h-8 text-xs">
                  <Plus className="h-3 w-3 mr-1" /> Add New Item
                </Button>
              ) : (
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCustomItem(false)} className="h-8 text-xs">
                  <X className="h-3 w-3 mr-1" /> Use Existing Item
                </Button>
              )}
            </div>

            {showCustomItem ? (
              <FormField
                control={control}
                name="customItem"
                rules={{ required: "Custom item name is required" }}
                render={({ field }) => (
                  <TextInput label="Custom Item Name" placeholder="Enter new item name" field={field} />
                )}
              />
            ) : (
              <FormField
                control={control}
                name="item"
                rules={{ required: "Item is required" }}
                render={({ field }) => (
                  <SelectWithSearchInput
                    label="Select Item"
                    options={itemOptions}
                    placeholder="Select an existing item"
                    value={field.value}
                    onChange={field.onChange}
       
                  />
                )}
              />
            )}
          </div>

          <FormField
            control={control}
            name="amount"
            rules={{ required: "Amount is required" }}
            render={({ field }) => (
              <TextInput label="Amount" placeholder="Rs. 1000" field={field} />
            )}
          />
        </div>
      </Form>
    </AddEditBaseModal>
  );
};

export default AddEditExpenses;
