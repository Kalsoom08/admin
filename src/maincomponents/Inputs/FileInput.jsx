import React, { useRef, useState, useEffect } from 'react';
import { FormItem, FormLabel, FormControl, FormMessage } from '@maincomponents/components/ui/form';
import { Input } from '@maincomponents/components/ui/input';
import { X } from 'lucide-react';

const FileUploadInput = ({ label, field, existingFileUrl }) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (existingFileUrl && !field.value) {
      setPreviewUrl(`${import.meta.env.VITE_FILE_URL}/${existingFileUrl}`);
    }
  }, [existingFileUrl, field.value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      file.previewUrl = URL.createObjectURL(file);
      field.onChange(file); // IMPORTANT: set File object here
      setPreviewUrl(file.previewUrl);
    } else {
      alert('Only images or PDF files are allowed');
      e.target.value = '';
    }
  };

  const handleRemove = () => {
    if (field.value && typeof field.value !== 'string' && field.value.previewUrl) {
      URL.revokeObjectURL(field.value.previewUrl);
    }
    field.onChange(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="relative">
          <Input
            type="file"
            name="file" // must match backend
            accept="image/*,.pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          {previewUrl && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500"
              title="Remove file"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </FormControl>

      {previewUrl &&
        (previewUrl.endsWith('.pdf') ? (
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline mt-2 block text-sm"
          >
            View PDF
          </a>
        ) : (
          <img src={previewUrl} alt="Preview" className="mt-2 rounded border" width={120} height={80} />
        ))}
      <FormMessage />
    </FormItem>
  );
};

export default FileUploadInput;
