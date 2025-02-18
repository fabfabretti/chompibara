import "./Chip.css";

type ChipProps = {
  name: string;
};

type Dictionary = {
  [key: string]: FoodTag;
};

type FoodTag = {
  label: string;
  icon: string;
  color: string;
  bgcolor: string;
};

const values: Dictionary = {
  vegan: {
    label: "No animal products",
    icon: "?",
    color: "string",
    bgcolor: "aaa",
  },
  glutenFree: {
    label: "Gluten Free",
    icon: "?",
    color: "string",
    bgcolor: "aaa",
  },
  diaryFree: {
    label: "No diary",
    icon: "?",
    color: "string",
    bgcolor: "aaa",
  },
  highFiber: {
    label: "High fiber",
    icon: "?",
    color: "string",
    bgcolor: "aaa",
  },
  highProtein: {
    label: "High protein",
    icon: "?",
    color: "string",
    bgcolor: "aaa",
  },
};

function Chip(props: ChipProps) {
  const currentChip = values[props.name];

  return (
    <div className={props.name + " chip"}>
      {currentChip ? (
        <div className={props.name + " chip"}>
          {currentChip.icon} {currentChip.label}
        </div>
      ) : (
        "Error with tag parsing"
      )}
    </div>
  );
}

export default Chip;
