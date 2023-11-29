import React, { useEffect, useState, useCallback } from 'react';
import { MdDelete } from "react-icons/md";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  Select,
  NumberInput as Number,
  NumberInputField,
  IconButton,
} from "@chakra-ui/react";

const FIELD_MARGIN = "4";

type InputProps = {
  label: string;
  value?: any;
  error?: {
    message: string;
  };
  helper?: string;
  [key: string]: any;  // eslint-disable-line @typescript-eslint/no-explicit-any
}

type FieldProps = InputProps & {
  fieldComponent: React.ReactNode;
}

const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, helper, FieldComponent, children, ...fieldProps }: FieldProps, ref) => (
    <FormControl isInvalid={!!error} my={FIELD_MARGIN}>
      <FormLabel>{label}</FormLabel>
      <FieldComponent {...fieldProps} ref={ref}>{ children }</FieldComponent>
      { !!helper && !error && (
        <FormHelperText>{ helper }</FormHelperText>
      ) }
      { !!error && (
        <FormErrorMessage>{ error.message }</FormErrorMessage>
      ) }
    </FormControl>
  )
);

export const TextInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props: InputProps, ref) => (
    <Field {...props} FieldComponent={Input} ref={ref} />
  )
);

export const TextAreaInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props: InputProps, ref) => (
    <Field {...props} FieldComponent={Textarea} ref={ref} />
  )
);

const NumberField  = React.forwardRef<HTMLInputElement, InputProps>(
  ({ min, max, ...props }: InputProps, ref) => (
    <Number min={min} max={max}>
      <NumberInputField {...props} ref={ref} />
    </Number>
  )
);

export const NumberInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props: InputProps, ref) => (
    <Field {...props} FieldComponent={NumberField} ref={ref} />
  )
);

type SelectProps = InputProps & {
  children: React.ReactNode[]
}

export const SelectInput = React.forwardRef<HTMLInputElement, SelectProps>(
  ({children, ...props}: InputProps, ref) => (
    <Field {...props} FieldComponent={Select} ref={ref}>{ children }</Field>
  )
);

export const ArrayField = React.forwardRef<HTMLInputElement, InputProps>(
  ({onChange, value, ...props}: InputProps, ref) => {
    const [ val, setVal ] = useState(value?.join(',') || '');

    useEffect(() => setVal(value?.join(',') || ''), [value])

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      setVal(event.target.value);
      onChange(event.target.value.split(',').map(val => val.trim()))
    }

    return <Input {...props} value={val} onChange={handleChange} ref={ref} />;
  }
);

export const ArrayInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props: InputProps, ref) => {
    return <Field {...props} FieldComponent={ArrayField} ref={ref} />;
  }
);

type DateRangeInputProps = InputProps & {
  dateRangeFrom?: string,
  setDateRangeFrom: (date: string) => void,
  dateRangeTo?: string,
  setDateRangeTo: (date: string) => void,
}

export function DateRangeInput({
  label,
  error,
  dateRangeFrom,
  setDateRangeFrom,
  dateRangeTo,
  setDateRangeTo,
}: DateRangeInputProps) {
  const handleRangeFromChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => setDateRangeFrom(e.target.value), [setDateRangeFrom]);
  const handleRangeToChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => setDateRangeTo(e.target.value), [setDateRangeTo]);

  return (
    <FormControl isInvalid={!!error} my={FIELD_MARGIN} as="fieldset" display="flex" gap={FIELD_MARGIN}>
      <Box as="legend" mb="1">{label}</Box>
      <Box>
        <FormControl>
          <FormLabel fontWeight="400">Date from</FormLabel>
          <Flex>
            <Input type="date" onChange={handleRangeFromChange} value={dateRangeFrom} />
            <IconButton variant="link" aria-label="Clear date-from field" icon={<MdDelete />} onClick={() => setDateRangeFrom('')} />
          </Flex>
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel fontWeight="400">Date to</FormLabel>
          <Flex>
            <Input type="date" onChange={handleRangeToChange} value={dateRangeTo} />
            <IconButton variant="link" aria-label="Clear date-to field" icon={<MdDelete />} onClick={() => setDateRangeTo('')} />
          </Flex>
        </FormControl>
      </Box>
      { !!error && (
        <FormErrorMessage>{ error.message }</FormErrorMessage>
      ) }
    </FormControl>
  )
}
