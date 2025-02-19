import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Chip.css";
import {
  faClock,
  faCow,
  faDna,
  faLeaf,
  faPoo,
  faWheatAlt,
  faWheatAwn,
} from "@fortawesome/free-solid-svg-icons";
import { JSX } from "react";

type ChipProps = {
  name: string;
};

type Dictionary = {
  [key: string]: {
    label: string;
    icon: JSX.Element;
  };
};

const values: Dictionary = {
  vegan: {
    label: "No animal products",
    icon: <FontAwesomeIcon icon={faLeaf} />,
  },
  glutenFree: {
    label: "Gluten Free",
    icon: <FontAwesomeIcon icon={faWheatAwn} />,
  },
  diaryFree: {
    label: "No diary",
    icon: <FontAwesomeIcon icon={faCow} />,
  },
  highFiber: {
    label: "High fiber",
    icon: <FontAwesomeIcon icon={faPoo} />,
  },
  highProtein: {
    label: "High protein",
    icon: <FontAwesomeIcon icon={faDna} />,
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
        "Error with tag parsing: tag doesn't exist or is empty"
      )}
    </div>
  );
}

export default Chip;
