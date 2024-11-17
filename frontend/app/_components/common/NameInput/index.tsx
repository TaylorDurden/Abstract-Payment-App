import {
  type FieldError,
  type Validate,
  useFormContext,
} from "react-hook-form";
import get from "lodash/get";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type NameInputProps = {
  name: string;
  validate?: Validate<string, any>;
  required?: boolean;
  label?: string;
} & Omit<React.ComponentProps<typeof Input>, "name">;

const NameInput = ({
  name,
  validate,
  required = false,
  label,
  ...props
}: NameInputProps) => {
  const { register, formState } = useFormContext() || {};
  const fieldError = get(formState?.errors, name) as FieldError | undefined;

  return (
    <>
      {label && (
        <Label htmlFor={name}>
          {fieldError?.type === "maxLength" ? "Maximum 50 symbols" : label}
        </Label>
      )}
      <Input
        id={name}
        {...props}
        {...register(name, { maxLength: 50, required, validate })}
        aria-invalid={Boolean(fieldError)}
        aria-describedby={fieldError ? `${name}-error` : undefined}
      />
    </>
  );
};

export default NameInput;
