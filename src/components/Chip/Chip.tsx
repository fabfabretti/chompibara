import "./Chip.css";
import { JSX } from "react";
type ChipProps = {
  icon: JSX.Element;
  label: string;
  color?: string;
};
function Chip({ icon, label, color }: ChipProps) {
  return (
    <div
      className={label + " chip"}
      style={{ backgroundColor: color + "30", color: color }}
    >
      {icon} {label}
    </div>
  );
}

export default Chip;
