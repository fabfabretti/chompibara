import { useState } from "react";
import "./Profile.css";
function Profile() {
  //State
  const [editing, setEditing] = useState(false);

  // Render
  return (
    <div className=" flex-col flex-center page">
      <div className="page-title">Profile page</div>
      <div className="profile-container card-custom flex-col flex-center">
        <div className="profile-info flex-col flex-center">
          <img src="pfp" alt="Profile picture" />
          Name Surname
        </div>
        <div className="profile-data flex-col">
          <div className="profile-row flex-row">
            <div>Age</div>
            <div>{editing ? <input type="number"></input> : "Unset"}</div>
          </div>
          <div className="profile-row flex-row">
            <div>Height</div>
            <div>{editing ? <input type="number"></input> : "Unset"}</div>
          </div>
          <div className="profile-row flex-row">
            <div>Weight</div>
            <div>{editing ? <input type="number"></input> : "Unset"}</div>
          </div>
          <div className="profile-row flex-row">
            <div>Target calories</div>
            <div>{editing ? <input type="number"></input> : "Unset"}</div>
          </div>
        </div>

        <button className="primary" onClick={() => setEditing(!editing)}>
          {editing ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
}

export default Profile;
