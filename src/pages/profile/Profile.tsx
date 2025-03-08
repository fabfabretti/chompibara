import { useState, useEffect } from "react";
import "./Profile.css";
import Loadingspinner from "../../components/Loadingspinner/Loadingspinner";
import { SupabaseManager } from "../../context/supabaseManager";
import ProfileData from "../../types/ProfileData";
import InputField from "../../components/inputs/MealInput/MealInput";

export const defaultProfile: ProfileData = {
  height: 0,
  age: 0,
  id: -1,
  name: "name",
  surname: "surname",
  targetcarbo: 0,
  targetfat: 0,
  targetcalories: 0,
  targetprotein: 0,
  weight: 0,
};

function Profile() {
  // State
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [errorString, setErrorString] = useState("");

  //DB manager
  const supabaseManager: SupabaseManager = SupabaseManager.getInstance();

  // Effects (load profile)
  useEffect(() => {
    supabaseManager.getProfile().then((profile) => setProfile(profile));
    setIsLoading(false);
  }, []);

  const profileIsValid = () => {
    let errors = [];
    if (profile.age <= 0 || profile.age >= 150)
      errors.push("L'età deve essere maggiore di 0 e minore di 150.\n");
    if (profile.height < 50 || profile.height > 250)
      errors.push("L'altezza deve essere tra 50 e 250 cm.\n");
    if (profile.weight < 20 || profile.weight > 300)
      errors.push("Il peso deve essere tra 20 e 300 kg.\n");
    if (profile.targetcalories < 500 || profile.targetcalories > 6000)
      errors.push("Le calorie devono essere tra 500 e 6000.\n");
    if (profile.targetcarbo < 0)
      errors.push("I carboidrati non possono essere negativi.\n");
    if (profile.targetprotein < 0)
      errors.push("Le proteine non possono essere negative.\n");
    if (profile.targetfat < 0)
      errors.push("I grassi non possono essere negativi.\n");

    setErrorString(errors.join(""));
    return errors.length === 0;
  };

  //Update data
  const updateProfile = async () => {
    if (!profileIsValid()) return;
    supabaseManager.setProfile(profile).then(() => setIsLoading(false));
  };

  //Edit profile data
  const changeEditStatus = () => {
    setEditing((prev) => !prev);
    if (editing) {
      console.log("save");
      setIsLoading(true);

      if (!profileIsValid()) {
        console.log("not valid bro");
        setIsLoading(false);
        setEditing((prev) => !prev);

        return;
      }
      updateProfile();
    } else {
      console.log("edit");
    }
  };

  // Render
  return (
    <div className="profile-component flex-col flex-center page">
      <h1>Profile page</h1>
      {!isLoading ? (
        <div className="profileinfo-container card-custom flex-col flex-center">
          <img src="pfp" alt="Profile picture" />
          <div className="profileinput-container">
            {editing ? (
              <InputField
                item={profile}
                setItem={setProfile}
                label="Name"
                fieldName="name"
                type="text"
                align="left"
              />
            ) : (
              profile.name
            )}
          </div>
          <div className="profileinput-container">
            {editing ? (
              <InputField
                item={profile}
                setItem={setProfile}
                label="Surname"
                fieldName="surname"
                type="text"
                align="left"
              />
            ) : (
              profile.surname
            )}
          </div>
          <div className="profileinput-container">
            {editing ? (
              <InputField
                item={profile}
                setItem={setProfile}
                label="Age"
                fieldName="age"
                type="number"
                align="left"
              />
            ) : (
              "Age: " + profile.age
            )}
          </div>
          <div className="profileinput-container">
            {" "}
            {editing ? (
              <InputField
                item={profile}
                setItem={setProfile}
                label="Height"
                fieldName="height"
                type="number"
                align="left"
              />
            ) : (
              "Height: " + profile.height
            )}
          </div>
          <div className="profileinput-container">
            {editing ? (
              <InputField
                item={profile}
                setItem={setProfile}
                label="Weight"
                fieldName="weight"
                type="number"
                align="left"
              />
            ) : (
              "Weight: " + profile.weight
            )}
          </div>
          <div className="profileinput-container">
            {editing ? (
              <InputField
                item={profile}
                setItem={setProfile}
                label="Target calories"
                fieldName="targetcalories"
                type="number"
                align="left"
              />
            ) : (
              "Target calories: " + profile.targetcalories + " kcal"
            )}
          </div>

          <div className="profileinput-container">
            {editing ? (
              <InputField
                item={profile}
                setItem={setProfile}
                label="Target carbos: "
                fieldName="targetcarbos"
                type="number"
                align="left"
              />
            ) : (
              "Target carbos: " + profile.targetcarbo + "g"
            )}
          </div>
          <div className="profileinput-container">
            {editing ? (
              <InputField
                item={profile}
                setItem={setProfile}
                label="Target protein: "
                fieldName="targetprotein"
                type="number"
                align="left"
              />
            ) : (
              "Target protein: " + profile.targetprotein + "g"
            )}
          </div>
          <div className="profileinput-container">
            {editing ? (
              <InputField
                item={profile}
                setItem={setProfile}
                label="Target carbos: "
                fieldName="targetcarbos"
                type="number"
                align="left"
              />
            ) : (
              "Target carbos: " + profile.targetcarbo + "g"
            )}
          </div>
          {errorString}
          <button className="primary" onClick={() => changeEditStatus()}>
            {editing ? "Save" : "Edit"}
          </button>
        </div>
      ) : (
        <Loadingspinner />
      )}
    </div>
  );
}

export default Profile;
