import React, { useEffect, useState } from "react";
import api from "../services/api";

import KycForm from "../components/kyc/KycForm";
import KycDetails from "../components/fromdetlise";

import backIcon from "../assets/icons/back.png";

const PersonalInfo = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/user/kyc/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setData(res.data);
    } catch (err) {
      console.error("KYC FETCH ERROR:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">লোড হচ্ছে...</div>;
  }

  // ✅ STRONG CHECK (IMPORTANT FIX)
  const hasKyc =
    data &&
    (data.personal_info_submitted === true ||
      data.nid_number ||
      data.full_name);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* TOP BAR */}
      <div className="bg-blue-600 text-white flex items-center gap-3 px-4 py-3 shadow">

        <img
          src={backIcon}
          alt="back"
          className="w-6 h-6 cursor-pointer"
          onClick={() => window.history.back()}
        />

        <h1 className="text-lg font-semibold">
          ব্যক্তিগত তথ্য
        </h1>
      </div>

      {/* BODY */}
      <div className="p-3">

        {/* ✅ FIXED ROUTE LOGIC */}
        {hasKyc ? (
          <KycDetails data={data} />
        ) : (
          <KycForm onSuccess={fetchData} />
        )}

      </div>
    </div>
  );
};

export default PersonalInfo;
