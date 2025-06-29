"use client";
import {
  FileInput as FlowFileInput,
  FileInputProps as FlowFileInputProps,
} from "flowbite-react";
import React from "react";

export interface FileInputProps {
  id?: string;
  name?: string;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  required?: boolean;
  sizing?: "sm" | "md" | "lg";
  color?: "gray" | "info" | "failure" | "warning" | "success";
  helperText?: string;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export function FileInput({
  id,
  name,
  multiple = false,
  accept,
  disabled = false,
  required = false,
  sizing = "md",
  color = "gray",
  helperText,
  className,
  onChange,
  onBlur,
  onFocus,
}: FileInputProps) {
  return (
    <FlowFileInput
      id={id}
      name={name}
      multiple={multiple}
      accept={accept}
      disabled={disabled}
      required={required}
      sizing={sizing}
      color={color}
      helperText={helperText}
      className={className}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
}
