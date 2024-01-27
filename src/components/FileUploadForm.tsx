'use client';
import React, { useState } from 'react';

//form that takes an image as an endpoint, and hits the endpoint
const ImageUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) {
      return;
    }
    const reader = new FileReader();
    const file = e.target.files?.[0];

    reader.onloadend = () => {
      setFile(file);
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    alert('File uploaded!');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <input
        type="file"
        onChange={handleImageChange}
        className="border-2 border-gray-300 p-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
      >
        Submit
      </button>
      {imagePreviewUrl && (
        <img
          src={imagePreviewUrl}
          alt="preview"
          className="mt-2 max-w-xs max-h-xs"
        />
      )}
    </form>
  );
};

export default ImageUploadForm;
