import "./Profile.css";

import { useState, useEffect } from "react";
import { SupabaseManager } from "../../context/supabaseManager";
import ProfileData from "../../types/ProfileData";
import { defaultProfile } from "../../types/defaultProfile";

import Loadingspinner from "../../components/Loadingspinner/Loadingspinner";
import InputField from "../../components/inputs/MealInput/MealInput";

function Profile() {
  // State
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [oldProfile, setOldProfile] = useState<ProfileData>(defaultProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [errorString, setErrorString] = useState("");

  //DB manager
  const supabaseManager: SupabaseManager = SupabaseManager.getInstance();

  // Effects (load profile)
  useEffect(() => {
    supabaseManager.getProfile().then((profile) => {
      setProfile(profile);
      setIsLoading(false);
    });
  }, []);

  // Client side input validation
  const profileIsValid = () => {
    let errors = [];

    if (!profile.age || profile.age <= 0 || profile.age > 120)
      errors.push("L'età deve essere compresa tra 1 e 120 anni.");

    if (!profile.height || profile.height < 50 || profile.height > 250)
      errors.push("L'altezza deve essere tra 50 e 250 cm.");

    if (!profile.weight || profile.weight < 20 || profile.weight > 300)
      errors.push("Il peso deve essere tra 20 e 300 kg.");

    if (
      !profile.targetcalories ||
      profile.targetcalories < 500 ||
      profile.targetcalories > 5000
    )
      errors.push("Le calorie devono essere tra 500 e 5000.");

    if (
      profile.targetcarbo === null ||
      profile.targetcarbo < 0 ||
      profile.targetcarbo > 1000
    )
      errors.push("I carboidrati devono essere tra 0 e 1000 g.");

    if (
      profile.targetprotein === null ||
      profile.targetprotein < 0 ||
      profile.targetprotein > 500
    )
      errors.push("Le proteine devono essere tra 0 e 500 g.");

    if (
      profile.targetfat === null ||
      profile.targetfat < 0 ||
      profile.targetfat > 500
    )
      errors.push("I grassi devono essere tra 0 e 500 g.");

    setErrorString(errors.join("\n"));
    return errors.length === 0;
  };

  //Update data on the database
  const updateProfile = async () => {
    if (!profileIsValid()) return;
    supabaseManager.setProfile(profile).then(() => setIsLoading(false));
  };

  // Discard changes
  const discardEdits = () => {
    setProfile(oldProfile);
    setEditing((prev) => !prev);
  };

  //Edit profile data (enter/exit edit mode)
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
      setOldProfile(profile);
      console.log("edit");
    }
  };

  // Render
  return (
    <div className="profile-component flex-col flex-center page text-center ">
      <h1>Profile page</h1>
      {!isLoading ? (
        <div
          className="profileinfo-container card-custom flex-col flex-center"
          style={{ maxWidth: "600px" }}
        >
          {/** Name, surname, pfp placeholder */}
          <div
            className="namesurnamepfp-container flex-col flex-center"
            style={{ color: "var(--primary-color)" }}
          >
            <img alt="Profile picture" src="chompibara.png" />
            <div className="namesurname-container flex-row gap10">
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
                  <h2> {profile.name}</h2>
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
                  <h2> {profile.surname}</h2>
                )}
              </div>
            </div>
          </div>

          <div
            className="flex-row flex-around flex-center"
            style={{ width: "70%" }}
          >
            {/** Demographics */}
            <div className="flex-col gap10">
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
            </div>

            {/**Targets */}
            <div className="flex-col gap10">
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
                    label="Target carbohydrates: "
                    fieldName="targetcarbo"
                    type="number"
                    align="left"
                  />
                ) : (
                  "Target carbohydrates: " + profile.targetcarbo + "g"
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
                    label="Target fats: "
                    fieldName="targetfat"
                    type="number"
                    align="left"
                  />
                ) : (
                  "Target fats: " + profile.targetfat + "g"
                )}
              </div>
            </div>
          </div>

          <div className="errorstring-container color-primary">
            {errorString}
          </div>

          {/**Action button */}
          {editing ? (
            <div className="flex-row gap20">
              <button className="primary" onClick={() => changeEditStatus()}>
                Save
              </button>
              <button onClick={() => discardEdits()}>Discard</button>
            </div>
          ) : (
            <button className="primary" onClick={() => changeEditStatus()}>
              Edit
            </button>
          )}
        </div>
      ) : (
        <Loadingspinner />
      )}
    </div>
  );
}

export default Profile;
