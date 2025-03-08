import "./InputCustom.css";
import { ProfileDBType } from "../../pages/profile/Profile";

type InputCustomProps = {
  value: ProfileDBType;
  setValue: React.Dispatch<React.SetStateAction<ProfileDBType>>;
  property: string;
  type: string;
  hideLabel?: boolean;
  editing: boolean;
};

function InputCustom(props: InputCustomProps) {
  return (
    <div>
      {props.editing ? (
        <input
          type={props.type}
          value={props.value.property}
          onChange={(e) => {
            props.setValue((prev) => ({
              ...prev,
              name: e.target.value,
            }));
          }}
        ></input>
      ) : (
        <div>props.value.</div>
      )}
    </div>
  );
}

export default InputCustom;
