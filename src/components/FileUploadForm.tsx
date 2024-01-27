"use client";
import React, { useState } from "react";

// Form that takes an image as an endpoint and hits the endpoint
const ImageUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) {
      return;
    }
    const reader = new FileReader();
    const selectedFile = e.target.files[0];

    reader.onloadend = () => {
      setFile(selectedFile);
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/bill", {
        method: "POST",
        body: formData,
      });
      // Handle response if needed
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="inputStyle"
      style={{ marginLeft: 380 }}
    >
      <div
        className="flex items-center justify-center w-full"
        style={{ width: 750 }}
      >
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {/* Display the file name if a file is selected */}
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              {file
                ? file.name
                : <span className="font-semibold">Click to upload</span>}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>
      <button type="submit" className="btn">
        Submit
      </button>
    </form>
  );
};

export default ImageUploadForm;
