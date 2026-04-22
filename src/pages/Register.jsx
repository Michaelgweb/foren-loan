import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import BankLogo from "../assets/icons/bank.png";

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

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      navigate("/personal-info");
    }
  }, [navigate]);

  // Only digits + max 13 digit
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value.slice(0, 13)); // ✅ max 13 digit
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        phone_number: phoneNumber,
        password,
      });

      const loginRes = await api.post("/auth/login/user", {
        phone_number: phoneNumber,
        password,
      });

      const token = loginRes.data?.access_token;

      localStorage.setItem("access", token);

      navigate("/personal-info");
    } catch (err) {
      if (err.response?.status === 400) {
        setError("❌ এই ফোন নাম্বার দিয়ে আগে থেকেই অ্যাকাউন্ট আছে");
      } else {
        setError("❌ রেজিস্ট্রেশন ব্যর্থ হয়েছে");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* ✅ BIGGER LOGO */}
        <div className="flex justify-center mb-8">
          <img
            src={BankLogo}
            alt="Bank Logo"
            className="w-56 md:w-72 lg:w-80 object-contain drop-shadow-lg"
          />
        </div>

        <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">
          একটি অ্যাকাউন্ট তৈরি করুন!
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">

          <InputField
            label="নাম (ইংরেজি)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Robiul Alom"
          />

          <InputField
            label="ফোন নম্বর (ইংরেজি)"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="01523456789"
            maxLength={13}   // ✅ max 13 digit
          />

          <InputField
            label="পাসওয়ার্ড"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 py-3 rounded-md text-white font-medium flex items-center justify-center gap-2
            ${
              loading
                ? "bg-orange-300"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {loading ? "Processing..." : "নিবন্ধন করুন →"}
          </button>

          <p className="text-sm text-center text-gray-600 mt-2">
            একটি অ্যাকাউন্ট আছে?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              এখানে লগইন করুন →
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Register;