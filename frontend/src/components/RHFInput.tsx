import { useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

type InputProps = {
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
};

export function RHFInput({ name, type, label, placeholder }: InputProps) {
  const { register, formState, getFieldState } = useFormContext();
  const { error } = getFieldState(name, formState);
  return (
    <Field data-invalid={!!error}>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
      <Input
        {...register(name)}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
      />
      {error && <FieldError errors={[error]} />}
    </Field>
  );
}
