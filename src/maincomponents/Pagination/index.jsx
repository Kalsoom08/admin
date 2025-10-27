import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

const TablePagination = ({ totalPages, limit, totalRecords, currentPage, onPageChange, onLimitChange,className }) => {
  return totalRecords > 0 ? (
    <div className={`w-full flex justify-between  items-center py-5 px-3 border-1 rounded-b-xl dark:border-gray-700 ${className}`}>
      <div className='hidden md:block text-gray-500 text-sm'>
        <p>
          Showing {currentPage > 1 ? (currentPage - 1) * limit : 1} to {currentPage * limit} of {totalRecords} entries
        </p>
      </div>
      <select
        value={limit}
        onChange={e => {
          onLimitChange(e.target.value);
        }}
        className='py-1 dark:bg-[#020819] rounded-md px-1'
      >
        <option value='5'>5</option>
        <option value='10'>10</option>
        <option value='25'>25</option>
        <option value='50'>50</option>
        <option value='100'>100</option>
      </select>
      <div className='flex items-center space-x-2'>
        {/* Left Arrow */}
        <button
          onClick={() => {
            onPageChange(currentPage - 1);
          }}
          disabled={currentPage === 1}
          className={`px-1 py-[3px] rounded text-xl transition-all ease-in-out duration-500 ${
            currentPage === 1 ? 'text-gray-400 bg-gray-100' : 'text-black bg-gray-100 hover:bg-gray-300'
          }`}
        >
          <ChevronLeft size={24} />
        </button>

        {/* First page */}
        <button
          onClick={() => {
            onPageChange(1);
          }}
          className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-primary text-white dark:text-black' : 'text-black dark:text-white'}`}
        >
          1
        </button>

        {/* Ellipsis before middle pages */}
        {currentPage > 3 && <span className='px-3 '>...</span>}

        {/* Middle pages */}
        {Array.from({ length: 3 }, (_, i) => {
          const page = currentPage === totalPages ? currentPage - 2 + i : currentPage - 1 + i;
          return page > 1 && page < totalPages ? (
            <button
              key={page}
              onClick={() => {
                onPageChange(page);
              }}
              className={`px-3 py-1 rounded ${currentPage === page ? 'bg-primary text-white dark:text-black' : 'text-black dark:text-white'}`}
            >
              {page}
            </button>
          ) : null;
        })}

        {/* Ellipsis after middle pages */}
        {currentPage < totalPages - 2 && <span className='px-3 text-primary]'>...</span>}

        {/* Last page */}
        {totalPages > 1 && (
          <button
            onClick={() => {
              onPageChange(totalPages);
            }}
            className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-primary text-white dark:text-black' : 'text-black dark:text-white'}`}
          >
            {totalPages}
          </button>
        )}

        {/* Right Arrow */}
        <button
          onClick={() => {
            onPageChange(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
          className={`px-1 py-[3px] rounded transition-all ease-in-out duration-500 ${
            currentPage === totalPages ? 'text-gray-400 bg-gray-100 ' : 'text-black bg-gray-100 hover:bg-gray-300'
          }`}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  ) : null;
};

export default TablePagination;
