import { Button } from '@maincomponents/components/ui/button';
import { CirclePlus } from 'lucide-react';

const AddButton = ({ text, onClick }) => {
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={onClick}>
        <span>{text}</span>
        <CirclePlus size={18} />
      </Button>
    </div>
  );
};

export default AddButton;
