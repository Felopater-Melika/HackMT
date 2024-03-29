'use client';

// Import React and useState hook
import React, { Dispatch, SetStateAction, useState } from 'react';
import FormDataTypeArray from '../types/formData';

interface ImageUploadFormProps {
  setFormData: Dispatch<SetStateAction<FormDataTypeArray | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

// Define the ImageUploadForm component
const ImageUploadForm: React.FC<ImageUploadFormProps> = ({
  setFormData,
  setLoading
}) => {
  // Define state variables for file and image preview URL
  const [file, setFile] = useState<File | null>(null);

  // Define function to handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) {
      return;
    }
    const reader = new FileReader();
    const selectedFile = e.target.files[0];

    // Read the file and set state variables
    reader.onloadend = () => {
      setFile(selectedFile);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Define function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    const image = new FormData();
    image.append('image', file);

    try {
      setLoading(true);
      const response = await fetch('/api/bill', {
        method: 'POST',
        body: image
      });

      const formData: FormDataTypeArray = await response.json();

      setFormData(formData);
      setLoading(false);
      // Handle response if needed
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  // Return the JSX for the component
  return (
    <div className="flex flex-col items-center mt-8">
      <form onSubmit={handleSubmit} className="inputStyle mt-8">
        <div
          // className="flex items-center justify-center w-full mt-8 mb-8"
          style={{ width: 750 }}
        >
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {/* Display the file name if a file is selected */}
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                {file ? (
                  file.name
                ) : (
                  <span className="font-semibold">Click to upload</span>
                )}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG, PDF, or GIF
              </p>
            </div>
          </label>
          {/* Separate file input field */}
          <input
            id="dropzone-file"
            type="file"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>
        <div className="flex flex-col items-center">
          <button
            type="submit"
            className="btn btn-active btn-primary mt-8 mb-4"
          >
            submit
          </button>
        </div>
      </form>
    </div>
  );
};

// Export the ImageUploadForm component
export default ImageUploadForm;
