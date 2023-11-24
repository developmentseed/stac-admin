import React, { useCallback } from 'react';
import { MdDelete } from "react-icons/md";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
  IconButton
} from "@chakra-ui/react";

const FIELD_MARGIN = "4";

type InputProps = {
  label: string;
  error?: {
    message: string;
  };
  [key: string]: any;  // eslint-disable-line @typescript-eslint/no-explicit-any
}

type FieldProps = InputProps & {
  fieldComponent: React.ReactNode;
}

const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, FieldComponent, children, ...fieldProps }: FieldProps, ref) => (
    <FormControl isInvalid={!!error} my={FIELD_MARGIN}>
      <FormLabel>{label}</FormLabel>
      <FieldComponent {...fieldProps} ref={ref}>{ children }</FieldComponent>
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

type SelectProps = InputProps & {
  children: React.ReactNode[]
}

export const SelectInput = React.forwardRef<HTMLInputElement, SelectProps>(
  ({children, ...props}: InputProps, ref) => (
    <Field {...props} FieldComponent={Select} ref={ref}>{ children }</Field>
  )
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
