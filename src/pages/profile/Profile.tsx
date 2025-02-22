import { useState, useEffect } from "react";
import "./Profile.css";
import Loadingspinner from "../../components/Loadingspinner/Loadingspinner";
// Database access
const DBurl = import.meta.env.VITE_SUPABASE_URL;
const DBkey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(DBurl, DBkey);

import { createClient } from "@supabase/supabase-js";

type ProfileDBType = {
  height: number;
  age: number;
  id: number;
  name: string;
  surname: string;
  targetcarbo: number;
  targetfat: number;
  targetprotein: number;
  weight: number;
  targetcalories: number;
};

const defaultProfile: ProfileDBType = {
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
  const [profile, setProfile] = useState<ProfileDBType>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [errorString, setErrorString] = useState("");

  //Controlled inputs

  // Effects
  useEffect(() => {
    getProfileDB();
  }, []);

  // Functions

  //Load profile data
  async function getProfileDB() {
    try {
      // Call Supabase
      const { data, error } = await supabase.from("ProfileDB").select();
      if (error) {
        setIsLoading(false);
        throw new Error(error.message);
      }
      // Save return
      setProfile(data[0] ?? []);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching user profile: ", err);
      alert("Couldn't fetch user data at this time. Please refresh the page.");
      setIsLoading(false);
    }
  }

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
    if (profile.targetcarbo + profile.targetprotein + profile.targetfat > 100) {
      errors.push(
        "La somma di carboidrati, proteine e grassi non può superare il 100%.\n"
      );
    }

    setErrorString(errors.join(""));
    return errors.length === 0;
  };

  //Update data
  const updateProfile = async () => {
    if (!profile?.id) {
      console.error("Missing ID!");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from("ProfileDB") // Nome della tabella
      .update({
        height: profile.height,
        age: profile.age,
        name: profile.name,
        surname: profile.surname,
        targetcarbo: profile.targetcarbo,
        targetfat: profile.targetfat,
        targetprotein: profile.targetprotein,
        weight: profile.weight,
        targetcalories: profile.targetcalories,
      })
      .eq("id", profile.id); // Condizione per aggiornare il record corretto

    if (error) {
      console.error("Error when updating:", error.message);
    } else {
      console.log("Update success!");
    }
    setIsLoading(false);
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

  console.log(profile);

  // Render
  return (
    <div className=" flex-col flex-center page">
      <div className="page-title">Profile page</div>
      {!isLoading ? (
        <div className="profile-container card-custom flex-col flex-center">
          <div className="profile-info flex-col flex-center">
            <img src="pfp" alt="Profile picture" />
            <div>
              {editing ? (
                <input
                  type="string"
                  value={profile.name}
                  onChange={(e) => {
                    setProfile((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  }}
                ></input>
              ) : (
                profile.name
              )}
            </div>
            <div>
              {editing ? (
                <input
                  type="string"
                  value={profile.surname}
                  onChange={(e) => {
                    setProfile((prev) => ({
                      ...prev,
                      surname: e.target.value,
                    }));
                  }}
                ></input>
              ) : (
                profile.surname
              )}
            </div>
          </div>
          <div className="profile-data flex-col">
            <div className="profile-row flex-row">
              <div>Age</div>
              <div>
                {editing ? (
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => {
                      setProfile((prev) => ({
                        ...prev,
                        age: parseInt(e.target.value),
                      }));
                    }}
                  ></input>
                ) : (
                  profile.age
                )}
              </div>
            </div>
            <div className="profile-row flex-row">
              <div>Height</div>
              <div>
                {editing ? (
                  <input
                    type="number"
                    value={profile.height}
                    onChange={(e) => {
                      setProfile((prev) => ({
                        ...prev,
                        height: parseInt(e.target.value),
                      }));
                    }}
                  ></input>
                ) : (
                  profile?.height
                )}
              </div>
            </div>
            <div className="profile-row flex-row">
              <div>Weight</div>
              <div>
                {editing ? (
                  <input
                    type="number"
                    value={profile.weight}
                    onChange={(e) => {
                      setProfile((prev) => ({
                        ...prev,
                        weight: parseFloat(e.target.value),
                      }));
                    }}
                  ></input>
                ) : (
                  profile.weight
                )}
              </div>
            </div>
            <div className="profile-row flex-row">
              <div>Target calories</div>
              <div>
                {editing ? (
                  <input
                    type="number"
                    value={profile.targetcalories}
                    onChange={(e) => {
                      setProfile((prev) => ({
                        ...prev,
                        targetcalories: parseInt(e.target.value),
                      }));
                    }}
                  ></input>
                ) : (
                  profile.targetcalories
                )}
              </div>
            </div>{" "}
            <div className="profile-row flex-row">
              <div>Target carbo</div>
              <div>
                {editing ? (
                  <input
                    type="number"
                    value={profile.targetcarbo}
                    onChange={(e) => {
                      setProfile((prev) => ({
                        ...prev,
                        targetcarbo: parseInt(e.target.value),
                      }));
                    }}
                  ></input>
                ) : (
                  profile?.targetcarbo
                )}
              </div>
            </div>{" "}
            <div className="profile-row flex-row">
              <div>Target protein</div>
              <div>
                {editing ? (
                  <input
                    type="number"
                    value={profile.targetprotein}
                    onChange={(e) => {
                      setProfile((prev) => ({
                        ...prev,
                        targetprotein: parseInt(e.target.value),
                      }));
                    }}
                  ></input>
                ) : (
                  profile?.targetprotein
                )}
              </div>
            </div>
            <div className="profile-row flex-row">
              <div>Target fats</div>
              <div>
                {editing ? (
                  <input
                    type="number"
                    value={profile.targetfat}
                    onChange={(e) => {
                      setProfile((prev) => ({
                        ...prev,
                        targetfat: parseInt(e.target.value),
                      }));
                    }}
                  ></input>
                ) : (
                  profile.targetfat
                )}
              </div>
            </div>
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
