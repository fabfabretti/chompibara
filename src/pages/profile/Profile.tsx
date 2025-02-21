import { useState, useEffect } from "react";
import "./Profile.css";

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
  const [isLoaded, setIsLoaded] = useState(false);

  //Controlled inputs

  // Effects
  useEffect(() => {
    getProfileDB();
  }, []);

  // Functions

  //Load profile data
  async function getProfileDB() {
    try {
      const { data, error } = await supabase.from("ProfileDB").select();
      console.log(data);
      if (error) {
        throw new Error(error.message);
      }
      setProfile(data[0] ?? []);
      setIsLoaded(true);
    } catch (err) {
      console.error("Error fetching user profile: ", err);
      alert("Couldn't fetch user data at this time. Please refresh the page.");
    }
  }

  //Edit profile data
  const changeEditStatus = () => {
    setEditing(!editing);

    if (editing) {
      console.log("save");
    } else {
      console.log("edit");
    }
  };

  console.log(profile);

  // Render
  return (
    <div className=" flex-col flex-center page">
      <div className="page-title">Profile page</div>
      {isLoaded ? (
        <div className="profile-container card-custom flex-col flex-center">
          <div className="profile-info flex-col flex-center">
            <img src="pfp" alt="Profile picture" />
            Name Surname
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
                  profile?.age
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
          <button className="primary" onClick={() => changeEditStatus()}>
            {editing ? "Save" : "Edit"}
          </button>
        </div>
      ) : (
        "LOADING"
      )}
      {/**TODO: metti una rotella che gira */}
    </div>
  );
}

export default Profile;
