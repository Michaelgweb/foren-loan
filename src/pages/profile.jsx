import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import TopBar from "../components/TopBar";
import DownBar from "../components/DownBar";

// ICONS
import shieldIcon from "../assets/shield.png";
import padlockIcon from "../assets/padlock.png";
import logoutIcon from "../assets/log-out.png";
import idCardIcon from "../assets/id-card.png";
import creditIcon from "../assets/credit.jpg";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  // ================= FETCH USER =================
  const fetchUser = async () => {
    try {
      const token =
        localStorage.getItem("access") ||
        localStorage.getItem("token");

      const res = await api.get("/user/kyc/me", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      setUser(res.data);
    } catch (err) {
      console.log(err);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ================= IMAGE FIX =================
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `https://loan.adcpa.live${path}`;
  };

  const getInitial = (name) =>
    name?.trim()?.charAt(0)?.toUpperCase() || "U";

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="border-4 border-indigo-400 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 pb-24">

      <TopBar />

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-4">

        {/* ===== PROFILE HEADER ===== */}
        <div className="bg-gray-300 rounded-xl p-4 flex items-center gap-4">

          {user?.selfie ? (
            <img
              src={getImageUrl(user.selfie)}
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 p-[2px]"
            />
          ) : (
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-blue-500 flex items-center justify-center bg-white text-lg font-bold">
              {getInitial(user?.full_name)}
            </div>
          )}

          <div>
            <h2 className="text-lg font-bold uppercase">
              {user?.full_name}
            </h2>
            <p className="text-sm">{user?.phone_number}</p>
          </div>

        </div>

        {/* ===== MENU ===== */}
        <div className="space-y-3">

          <MenuItem
            label="ব্যক্তিগত তথ্য"
            icon={idCardIcon}
            onClick={() => navigate("/personal-info")}
          />

          <MenuItem
            label="ব্যাংক অ্যাকাউন্ট"
            icon={creditIcon}
            onClick={() => navigate("/payment-info")}
          />

          <MenuItem
            label="নিয়মাবলী ও শর্তাবলী"
            icon={shieldIcon}
            onClick={() => navigate("/terms")}
          />

          <MenuItem
            label="পাসওয়ার্ড পরিবর্তন"
            icon={padlockIcon}
            onClick={() => navigate("/change-password")}
          />

          <MenuItem
            label="লগ আউট"
            icon={logoutIcon}
            onClick={handleLogout}
            red
          />

        </div>

      </div>

      <DownBar />
    </div>
  );
};

// ================= MENU ITEM =================
const MenuItem = ({ label, icon, onClick, red }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-gray-300 rounded-xl px-4 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-400
      ${red ? "text-red-600" : "text-black"}`}
    >
      <div className="flex items-center gap-4">

        <div className="w-9 h-9 bg-black flex items-center justify-center rounded-md">
          <img src={icon} alt="icon" className="w-5 h-5 invert" />
        </div>

        <span className="font-medium">{label}</span>
      </div>

      <span className="text-xl">›</span>
    </div>
  );
};

export default Profile;