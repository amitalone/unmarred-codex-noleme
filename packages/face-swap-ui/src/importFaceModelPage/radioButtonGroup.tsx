import React from "react";

export interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
  className?: string;
}

export function RadioButton({
  id,
  name,
  value,
  label,
  checked,
  onChange,
  className = "",
}: RadioButtonProps) {
  return (
    <div className={`radio-button ${className}`}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="radio-button__input"
        data-testid={`radio-${value}`}
      />
      <label
        htmlFor={id}
        className="radio-button__label"
        data-testid={`radio-label-${value}`}
      >
        {label}
      </label>
    </div>
  );
}

export interface RadioButtonGroupProps {
  name: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  selectedValue: string | null;
  onChange: (value: string) => void;
  className?: string;
}

export function RadioButtonGroup({
  name,
  options,
  selectedValue,
  onChange,
  className = "",
}: RadioButtonGroupProps) {
  return (
    <div
      className={`radio-button-group ${className}`}
      data-testid="radio-button-group"
    >
      {options.map((option) => (
        <RadioButton
          key={option.value}
          id={`${name}-${option.value}`}
          name={name}
          value={option.value}
          label={option.label}
          checked={selectedValue === option.value}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
