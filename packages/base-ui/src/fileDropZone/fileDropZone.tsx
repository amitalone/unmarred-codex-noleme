"use client";
import React from "react";
import { FileInput } from "@repo/design-system/file-input";

export interface FileDropZoneProps {
  id?: string;
  name?: string;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
  helperText?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onDrop?: (event: React.DragEvent<HTMLLabelElement>) => void;
  onDragOver?: (event: React.DragEvent<HTMLLabelElement>) => void;
  onDragLeave?: (event: React.DragEvent<HTMLLabelElement>) => void;
}

export function FileDropZone({
  id = "dropzone-file",
  name,
  multiple = false,
  accept,
  disabled = false,
  required = false,
  className = "",
  title = "Click to upload",
  subtitle = "or drag and drop",
  helperText = "SVG, PNG, JPG or GIF (MAX. 800x400px)",
  onChange,
  onBlur,
  onFocus,
  onDrop,
  onDragOver,
  onDragLeave,
}: FileDropZoneProps) {
  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onDragOver?.(event);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onDrop?.(event);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onDragLeave?.(event);
  };

  return (
    <div className={`flex w-full items-center justify-center ${className}`}>
      <label
        htmlFor={id}
        className={`flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600 ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
          <svg
            className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">{title}</span> {subtitle}
          </p>
          {helperText && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {helperText}
            </p>
          )}
        </div>
        <FileInput
          id={id}
          name={name}
          multiple={multiple}
          accept={accept}
          disabled={disabled}
          required={required}
          className="hidden"
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </label>
    </div>
  );
}
