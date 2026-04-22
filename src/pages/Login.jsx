import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import BankLogo from "../assets/icons/bank.png";

/* ================= INPUT FIELD ================= */
const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  maxLength,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-700">{label}</label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className="p-3 rounded-md border border-gray-300 bg-white
                   focus:outline-none focus:border-blue-500"
        required
      />
    </div>
  );
};

/* ================= LOGIN ================= */
const Login = () => {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Only digits + max 13 digit
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value.slice(0, 13));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login/user", {
        phone_number: phoneNumber,
        password: password,
      });

      localStorage.setItem("access", res.data.access_token);
      localStorage.setItem("role", res.data.role);

      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("❌ ফোন নাম্বার বা পাসওয়ার্ড ভুল");
      } else {
        setError("⚠️ লগইন ব্যর্থ হয়েছে, আবার চেষ্টা করুন");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* BIG LOGO */}
        <div className="flex justify-center mb-8">
          <img
            src={BankLogo}
            alt="Bank Logo"
            className="w-56 md:w-72 lg:w-80 object-contain drop-shadow-lg"
          />
        </div>

        {/* TITLE */}
        <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">
          লগইন করুন
        </h2>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow"
        >

          {/* PHONE */}
          <InputField
            label="ফোন নম্বর"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="01523456789"
            maxLength={13}
          />

          {/* PASSWORD */}
          <InputField
            label="পাসওয়ার্ড"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`py-3 rounded-md text-white font-medium transition
              ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Loading..." : "লগইন করুন →"}
          </button>

          {/* REGISTER LINK */}
          <p className="text-sm text-center text-gray-600 mt-2">
            অ্যাকাউন্ট নেই?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              এখানে রেজিস্টার করুন →
            </Link>
          </p>

        </form>

      </div>
    </div>
  );
};

export default Login;