import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import DownBar from "../components/DownBar";
import api from "../services/api";

const BankInfo = () => {
  const [form, setForm] = useState({
    account_number: "",
    account_holder_name: "",
    cvv: "123",
    status: "inactive",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/user/kyc/me");

        setForm({
          account_number: res.data.unique_id || "",
          account_holder_name: res.data.full_name || "N/A",
          cvv: "123",
          status: res.data.status || "inactive",
        });

      } catch (err) {
        console.error("User load failed", err);
        alert("ব্যবহারকারীর তথ্য লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading ব্যবহারকারীর তথ্য...
      </div>
    );

  const maskedNumber = form.account_number
    ? form.account_number.replace(/^(\d{4})\d+(\d{4})$/, "$1********$2")
    : "**** ******** ****";

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <TopBar />

      <div className="max-w-2xl mx-auto mt-6 space-y-6">

        {/* ALERT */}
        {form.status !== "active" && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
            <p className="font-semibold text-lg">
              ⚠️ কার্ডটি সক্রিয় নয়!
            </p>
          </div>
        )}

        {/* CARD FRONT */}
        <div className="relative w-full h-52 rounded-3xl shadow-2xl bg-gradient-to-r from-blue-500 to-pink-500 text-white p-6">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">VISA</span>
            <span className="text-sm">Valid Till 12/29</span>
          </div>

          <div className="mt-8 text-2xl tracking-widest font-mono">
            {maskedNumber}
          </div>

          <div className="mt-8 flex justify-between items-center text-sm">
            <div>
              <p>Card Holder</p>
              <p className="font-semibold text-lg">
                {form.account_holder_name}
              </p>
            </div>
          </div>
        </div>

        {/* CARD BACK */}
        <div className="relative w-full h-52 rounded-3xl shadow-2xl bg-gradient-to-r from-blue-500 to-pink-500 text-white p-6">
          <div className="h-10 bg-black mb-4 rounded"></div>

          <div className="flex justify-between items-center text-sm">
            <div>
              <p>CVV</p>
              <p className="font-semibold text-lg">***</p>
            </div>

            <div>
              <p>STATUS</p>
              <p
                className={`font-semibold text-lg ${
                  form.status === "active"
                    ? "text-green-300"
                    : "text-white"
                }`}
              >
                {form.status === "active" ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>

      </div>

      <DownBar />
    </div>
  );
};

export default BankInfo;