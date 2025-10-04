import { Input, InputProps } from "./input";

interface NullableInputProps extends Omit<InputProps, "value" | "onChange"> {
  value?: string | null;
  onChange: (value: string | null) => void;
}

const NullableInput: React.FC<NullableInputProps> = ({
  value,
  onChange,
  ...props
}) => {
  return (
    <Input
      {...props}
      value={value ?? ""} // Render null as an empty string
      onChange={(e) => {
        const newValue = e.target.value;
        onChange(newValue === "" ? null : newValue); // Convert empty string back to null
      }}
    />
  );
};

export default NullableInput;
