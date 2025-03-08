type InputFieldProps<T> = {
  item: T;
  setItem: React.Dispatch<React.SetStateAction<T>>;
  label: string;
  fieldName: string;
  type: string;
  align?: string;
};

function InputField<T>({
  item,
  setItem,
  type,
  label,
  fieldName,
  align,
}: InputFieldProps<T>) {
  return (
    <label style={{ display: "flex", alignItems: align ?? "center" }}>
      {label}
      <input
        style={{ width: "80%" }}
        type={type}
        inputMode={type === "number" ? "numeric" : undefined}
        pattern={type === "number" ? "*" : undefined}
        value={(item as any)[fieldName] ?? ""} // Access value dynamically
        onChange={(e) => {
          setItem((prev) => ({
            ...prev,
            [fieldName]:
              type === "number" ? parseInt(e.target.value) : e.target.value,
          }));
        }}
        id={fieldName}
      />
    </label>
  );
}

export default InputField;
