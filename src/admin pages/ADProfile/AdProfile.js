import React, { useState, useEffect } from "react";
import AdNavBar from "../../components/AdNavBar";
import "./AdProfile.css";
import LogoutDialog from "../../components/LogoutDialog";
import EditSuccessfulDialog from "./EditSuccessfulDialog";
import ErrorDialog from "./ErrorDialog";
import ProfilePicture from "../../components/ProfilePicture";

const AdProfile = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [admin, setAdmin] = useState({});
  const [profilePicture, setProfilePicture] = useState("/default.png");

  useEffect(() => {
    const loggedInAdmin = JSON.parse(localStorage.getItem('loggedInAdmin'));
    console.log("Logged in admin:", loggedInAdmin);
    if (loggedInAdmin) {
      setAdmin(loggedInAdmin);
      fetch(`http://localhost:8080/api/profile/admin/getProfilePicture/${loggedInAdmin.adminId}`)
        .then(response => response.blob())
        .then(blob => {
          if (blob.size > 0) {
            setProfilePicture(URL.createObjectURL(blob));
          }
        })
        .catch(error => console.error("Error fetching profile picture:", error));
    }
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Check file size (e.g., 5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      setShowErrorMessage(true);
      console.error("File size exceeds 5MB limit");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", admin.adminId);
    
    // Rest of your upload code...
  }

  const handleEditClick = () => {
    setIsEditable(true);
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleUpdateClick = async () => {
    if (!currentPassword || !newPassword) {
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/admin/updatePassword?adminId=${admin.adminId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Password updated successfully:", result);

      setIsEditable(false);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating password:", error);
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
    }
  };

  return (
    <div className="main-container">
      <header>
        <AdNavBar />
      </header>
      <main className="adprofile-container">
        <div className="profile-container">
          <div className="profile-details">
            <ProfilePicture
              currentPicture={profilePicture}
              adminId={admin.adminId}
              onUpdateSuccess={setProfilePicture}
            />
            <div className="name-details">
              <span className="id-number">{admin.idNumber}</span>
              <h1>{admin.fullName}</h1>
              <span>{admin.adminname}</span>
            </div>
            <span className="email-design">{admin.email}</span>
            <LogoutDialog />
          </div>
        </div>
        <div className="password-container">
          <h1>Password</h1>
          <form>
            <div>
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                readOnly={!isEditable}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                readOnly={!isEditable}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="btn-container">
              {isEditable ? (
                <>
                  <button type="button" className="update-btn" onClick={handleUpdateClick}>
                    Update
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => setIsEditable(false)}>
                    Cancel
                  </button>
                </>
              ) : (
                <button type="button" className="edit-btn" onClick={handleEditClick}>
                  Edit
                </button>
              )}
            </div>
          </form>
          {showSuccessMessage && <EditSuccessfulDialog />}
          {showErrorMessage && <ErrorDialog />}
        </div>
      </main>
    </div>
  );
};

export default AdProfile;