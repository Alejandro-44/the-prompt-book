import { useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { InputGroup, InputGroupTextarea } from "./ui/input-group";

type TextareaProps = {
  name: string;
  label?: string;
  placeholder?: string;
  row?: number;
};

export const RHFTextArea = ({
  name,
  label,
  placeholder,
  row = 5,
}: TextareaProps) => {
  const { register, formState, getFieldState } = useFormContext();
  const { error } = getFieldState(name, formState);
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupTextarea
          {...register(name)}
          id={name}
          placeholder={placeholder}
          rows={row}
          aria-invalid={!!error}
          className="resize-none"
        />
      </InputGroup>
      {error && <FieldError errors={[error]} />}
    </Field>
  );
};
