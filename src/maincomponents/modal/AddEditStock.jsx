import React, { useEffect, useState } from 'react';
import AddEditBaseModal from './AddEditBaseModal';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '@maincomponents/components/ui/form';
import TextInput from '@maincomponents/Inputs/TextInput';
import SelectBox from '@maincomponents/Inputs/SelectBox';
import { FULFILMENT_STATUS, STOCK_STATUSS } from '@data/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { successToast } from '@utils/toastUtil';
import { createStock, updateStockStatusAsync, fetchAllStock } from '@redux/slice/stockSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { stockSchema } from '@validations/index';

const stockStatusOptions = Object.entries(STOCK_STATUSS).map(([key, value]) => ({ label: value, value: key }));
const fulfilmentOptions = Object.entries(FULFILMENT_STATUS).map(([key, value]) => ({ label: value, value: key }));

const AddEditStockAlert = ({ isEdit, open, onClose }) => {
  const dispatch = useDispatch();
  const { selectedStock,data } = useSelector(state => state.stock);
  console.log("selected atock",selectedStock);
  console.log("selected atock data",data);
  const [modalLoader, setModalLoader] = useState(false);


const form = useForm({
  defaultValues: {
    itemName: '',
    stockStatus: '',
    fulfilmentStatus: '',
    note: '',
    alertId: isEdit ? selectedStock?.alertId : '',  // Set alertId only when editing
  },
    //  resolver: yupResolver(stockSchema),
  mode: 'onBlur',
});

  const { handleSubmit, reset, control } = form;

  useEffect(() => {
    if (isEdit && selectedStock) {
       const { alertId, _id, itemName, fulfilmentStatus,note,stockStatus } = selectedStock;
      reset({
        alertId: alertId || _id,
        itemName: itemName || '',
        fulfilmentStatus: fulfilmentStatus || "",
        note: note || '',
        stockStatus:stockStatus||""

      });
    } else {
      reset({
        itemName: '',
        alertId: '',
        fulfilmentStatus: '',
        note: '',
        stockStatus:'',
    
      });
    }
  }, [isEdit, selectedStock, reset]);

async function onSubmit(values) {
  if (modalLoader) return;
  setModalLoader(true);
  try {
    // Remove alertId for new stock alerts
    const { alertId, ...restValues } = values;

    if (isEdit && selectedStock?.alertId) {
      // Update stock alert
      await dispatch(updateStockStatusAsync({ alertId: selectedStock.alertId, ...restValues }));
      successToast('Stock alert updated successfully');
    } else {
      // Create new stock alert (do not include alertId)
      await dispatch(createStock(restValues));
      successToast('Stock alert added successfully');
    }
    await dispatch(fetchAllStock());
    onClose();
  } catch (error) {
    console.error(error);
  } finally {
    setModalLoader(false);
  }
}

  return (
    <AddEditBaseModal
      title={isEdit ? 'Edit Stock Alert' : 'Add Stock Alert'}
      open={open}
      onClose={onClose}
      isLoading={modalLoader}
      onSubmit={handleSubmit(onSubmit)}
    >
      
      <Form {...form}>
        <form className="space-y-4 mt-6" onSubmit={handleSubmit(onSubmit)}>
          <FormField control={control} name="itemName" render={({ field }) => <TextInput label="Item Name" field={field} />} />
          <FormField control={control} name="stockStatus" render={({ field }) => <SelectBox label="Stock Status" options={stockStatusOptions} field={field} />} />
          <FormField control={control} name="fulfilmentStatus" render={({ field }) => <SelectBox label="Fulfilment Status" options={fulfilmentOptions} field={field} />} />
          <FormField control={control} name="note" render={({ field }) => <TextInput label="Note" field={field} />} />
        </form>
      </Form>
    </AddEditBaseModal>
  );
};

export default AddEditStockAlert;
