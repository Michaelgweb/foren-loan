import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import api from "../services/api";

const TopBar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  // ================= API CALL =================
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
      console.log("User fetch error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ================= HELPERS =================
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "শুভ সকাল";
    if (h < 17) return "শুভ দুপুর";
    if (h < 20) return "শুভ বিকেল";
    return "শুভ রাত";
  };

  const getInitial = (name) =>
    name?.trim()?.charAt(0)?.toUpperCase() || "U";

  // 🔥 FIX: works for both /uploads/kyc/... and full URL
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `https://loan.adcpa.live${path}`;
  };

  return (
    <div className="px-4 pt-4">
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-xl p-4 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex flex-col">
          <h1 className="text-lg font-bold">ক্ষুদ্র-ঋণ উন্নয়ন প্রকল্প</h1>

          <p className="text-sm text-indigo-100 mt-1">
            {getGreeting()}, {user?.full_name || "নতুন ইউজার"}
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          <button
            onClick={() => navigate("/profile")}
            className="relative bg-white/10 p-2 rounded-full"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* AVATAR */}
          {loading ? (
            <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse" />
          ) : user?.selfie ? (
            <img
              src={getImageUrl(user.selfie)}
              alt="avatar"
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
              {getInitial(user?.full_name)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;