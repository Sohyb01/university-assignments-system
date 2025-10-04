import { Textarea, TextareaProps } from "./textarea";

interface NullableTextareaProps
  extends Omit<TextareaProps, "value" | "onChange"> {
  value?: string | null;
  onChange: (value: string | null) => void;
}

const NullableTextarea: React.FC<NullableTextareaProps> = ({
  value,
  onChange,
  ...props
}) => {
  return (
    <Textarea
      {...props}
      value={value ?? ""} // Render null as an empty string
      onChange={(e) => {
        const newValue = e.target.value;
        onChange(newValue === "" ? null : newValue); // Convert empty string back to null
      }}
    />
  );
};

export default NullableTextarea;
