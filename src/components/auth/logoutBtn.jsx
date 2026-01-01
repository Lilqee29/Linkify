import React from "react";
import { logOutUser } from "../../firebase/logout";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../contexts/AlertContext";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const handleLogout = async () => {
    try {
      await logOutUser();
      navigate("/login"); // Redirect to login page after logout
    } catch (err) {
      showAlert("Logout failed: " + err.message, "error");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
