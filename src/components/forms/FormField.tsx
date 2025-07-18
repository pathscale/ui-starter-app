import { Component, JSX, Show } from "solid-js";
import { Form, Input, useFormValidation, Flex } from "@pathscale/ui";

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  autocomplete?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  class?: string;
  value?: string;
}

export const FormField: Component<FormFieldProps> = (props) => {
  const { errors, touched } = useFormValidation();

  return (
    <Flex direction="col" gap="sm">
      <Form.Label title={props.label} />
      <Input
        name={props.name}
        type={props.type || "text"}
        autocomplete={props.autocomplete}
        leftIcon={props.leftIcon}
        rightIcon={props.rightIcon}
        placeholder={props.placeholder}
        class={props.class || "w-full"}
        disabled={props.disabled}
        readonly={props.readonly}
        value={props.value}
      />
      <Show when={touched(props.name) && errors(props.name)}>
        <p class="text-error text-sm">{errors(props.name)}</p>
      </Show>
    </Flex>
  );
};

export default FormField;
