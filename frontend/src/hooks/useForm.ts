import { useState } from 'react';

export function useForm<T>(initialState: T) {
  const [values, setValues] = useState<T>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let finalValue: any = value;
    if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      finalValue = value === '' ? '' : Number(value);
    }

    setValues(prev => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const setFieldValue = (name: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const reset = () => {
    setValues(initialState);
  };

  return { values, handleChange, setFieldValue, reset, setValues };
}
