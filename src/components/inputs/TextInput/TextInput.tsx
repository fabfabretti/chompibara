import MealData from "../../../type/MealData";

type TextInputProps = {
  meal: MealData;
  setMeal: React.Dispatch<React.SetStateAction<MealData>>;
  label: string;
  fieldName: string;
  type: string;
};

function TextInput({ meal, setMeal, type, label, fieldName }: TextInputProps) {
  return (
    <label>
      {label}
      <input
        type={type}
        inputMode={type === "number" ? "numeric" : undefined}
        pattern={type === "number" ? "[0-9]*" : undefined}
        value={meal[fieldName as keyof MealData] ?? ""}
        onChange={(e) => {
          setMeal((prev) => ({
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

export default TextInput;
