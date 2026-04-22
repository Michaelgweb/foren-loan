// src/pages/Support.jsx
import React from "react";
import TopBar from "../components/TopBar";
import DownBar from "../components/DownBar";
import { Phone } from "lucide-react";

const Support = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <TopBar />

      <div className="max-w-2xl mx-auto mt-6 space-y-6 p-4">


        {/* Address */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold mb-2">ঠিকানা</h2>
          <p className="text-gray-700">
            ই-৩২, আগারগাঁও, শেরে-বাংলা নগর, ঢাকা - ১২০৭
          </p>
        </div>

        {/* Working Hours */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold mb-2">কার্যক্রম</h2>
          <p className="text-gray-700">
            সকাল ৯টা থেকে রাত ৯টা, শনি থেকে বৃহস্পতিবার
          </p>
        </div>



      </div>

      <DownBar />
    </div>
  );
};

export default Support;
