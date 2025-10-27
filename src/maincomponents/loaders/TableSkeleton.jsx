import { Skeleton } from '@maincomponents/components/ui/skeleton';
import { TableCell, TableRow } from '@maincomponents/components/ui/table';

const TableSkeleton = ({ columnsCount, rowsCount = 5 }) => {
  return (
    <>
      {Array.from({ length: rowsCount }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columnsCount }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton className='h-4 w-full rounded' />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TableSkeleton;
