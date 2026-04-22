// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import drYunus from "../assets/icons/DrYunus.png";
import bangladeshBank from "../assets/icons/Bangladesh-Bank.jpg";
import photo1 from "../assets/icons/photo1.jpg";

const images = [drYunus, bangladeshBank, photo1];

const Home = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  // ================= SLIDER =================
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // ================= NAVIGATION =================
  const handleNavigate = (url) => {
    navigate(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-end gap-3">

          <button
            onClick={() => handleNavigate("/login")}
            className="px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
          >
            লগইন
          </button>

          <button
            onClick={() => handleNavigate("/register")}
            className="px-5 py-2 rounded-lg border border-green-600 text-green-700 font-medium hover:bg-green-50 transition"
          >
            রেজিস্ট্রেশন
          </button>

        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative flex items-center justify-center min-h-[75vh] bg-slate-900 text-white overflow-hidden">

        {/* SLIDER IMAGES */}
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* CONTENT */}
        <div className="relative z-10 text-center p-8 max-w-2xl bg-slate-800/60 rounded-3xl shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            ক্ষুদ্র ঋণ উন্নয়ন প্রকল্প
          </h2>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-6">
            সহজ, দ্রুত ও নিরাপদ লোন
            <br />
            আপনার দোরগোড়ায়
          </h1>

          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 bg-green-600 rounded-xl text-white font-semibold hover:bg-green-700 transition"
          >
            এখনই আবেদন করুন
          </button>
        </div>

        {/* SLIDER DOTS */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {images.map((_, idx) => (
            <span
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                current === idx ? "bg-white w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>

      </section>

      {/* ================= INFO SECTION ================= */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

          <div className="border p-8 rounded-3xl shadow-md">
            <h3 className="font-bold text-xl mb-3">100% নিরাপদ</h3>
            <p className="text-slate-600">এনক্রিপ্টেড সিস্টেম</p>
          </div>

          <div className="border p-8 rounded-3xl shadow-md">
            <h3 className="font-bold text-xl mb-3">দ্রুত অনুমোদন</h3>
            <p className="text-slate-600">ডিজিটাল প্রসেস</p>
          </div>

          <div className="border p-8 rounded-3xl shadow-md">
            <h3 className="font-bold text-xl mb-3">সহজ আবেদন</h3>
            <p className="text-slate-600">কোনো ঝামেলা নেই</p>
          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>© 2026 Loan System</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;