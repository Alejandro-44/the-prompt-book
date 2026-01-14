import { useController, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Field, FieldError, FieldLabel } from "./ui/field";

type Option = {
  id: string;
  label: string;
};

type RHFSelectProps = {
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
};

export const RHFSelect = ({
  name,
  label,
  options,
  placeholder,
}: RHFSelectProps) => {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ control, name });
  return (
    <Field>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger>
          <SelectValue  placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{field.name}</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
        {fieldState.error && <FieldError errors={[fieldState.error]} />}
      </Select>
    </Field>
  );
};
