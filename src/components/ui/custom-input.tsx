
import React, { forwardRef } from 'react';
import { Input } from './input';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  allowNegative?: boolean;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ allowNegative, onChange, ...props }, ref) => {
    // Handle input changes, allowing for negative values if enabled
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (allowNegative) {
        // We allow the input to maintain a negative sign even if the rest is empty
        const value = e.target.value;
        if (value === '-') {
          e.target.value = '-';
        }
      }
      
      if (onChange) {
        onChange(e);
      }
    };
    
    return <Input ref={ref} onChange={handleChange} {...props} />;
  }
);

CustomInput.displayName = 'CustomInput';
