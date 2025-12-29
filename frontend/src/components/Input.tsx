import { useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";

type InputProps = {
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  variant?: "filled" | "outlined" | "standard"
};

function Input({ name, type, label, placeholder, multiline, rows, variant }: InputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  const allErrors: string[] = error?.types
    ? Object.values(error.types).flat()
    : error?.message
    ? [error.message]
    : [];

  return (
    <TextField
      {...register(name)}
      sx={{ whiteSpace: "pre-line" }}
      variant={variant}
      name={name}
      type={type}
      label={label}
      placeholder={placeholder}
      error={!!error}
      helperText={allErrors.join("\n")}
      multiline={multiline}
      rows={rows}
      fullWidth
    />
  );
}

export default Input;
