import { ProfileData } from "../../../context/types/ProfileTypes";

type ProfileInputProps = {
  profile: ProfileData;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
  label: string;
  fieldName: string;
  type: string;
  align?: string;
};

function ProfileInput({
  profile,
  setProfile,
  type,
  label,
  fieldName,
  align,
}: ProfileInputProps) {
  return (
    <label style={{ display: "flex", alignItems: align ?? "center" }}>
      {label}
      <input
        style={{ width: "80%" }}
        type="type"
        inputMode={type === "number" ? "numeric" : undefined}
        pattern={type === "number" ? "[0-9]*" : undefined}
        value={profile[fieldName as keyof ProfileData] ?? ""}
        onChange={(e) => {
          setProfile((prev) => ({
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

export default ProfileInput;
