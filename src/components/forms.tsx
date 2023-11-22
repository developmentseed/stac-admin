import React from 'react';
import { FormControl, FormLabel, FormErrorMessage, Input, Textarea } from "@chakra-ui/react";

type InputProps = {
  label: string;
  error?: {
    message: string;
  };
  fieldComponent: React.ReactNode;
  [key: string]: any;  // eslint-disable-line @typescript-eslint/no-explicit-any
}

type FieldProps = InputProps & {
  fieldComponent: React.ReactNode;
}

const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, FieldComponent, ...fieldProps }: FieldProps, ref) => (
    <FormControl isInvalid={!!error} my="4">
      <FormLabel>{label}</FormLabel>
      <FieldComponent {...fieldProps} ref={ref} />
      { !!error && (
        <FormErrorMessage>{ error.message }</FormErrorMessage>
      ) }
    </FormControl>
  )
);

export const TextInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props: FieldProps, ref) => (
    <Field {...props} FieldComponent={Input} ref={ref} />
  )
);

export const TextAreaInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props: FieldProps, ref) => (
    <Field {...props} FieldComponent={Textarea} ref={ref} />
  )
);
