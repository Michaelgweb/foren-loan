import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DownBar from "../components/DownBar";
import api from "../services/api";

import bkashIcon from "../assets/icons/BKash.png";
import nagadIcon from "../assets/icons/Nagad.png";

/* ---------- BOX COMPONENT ---------- */
const Box = ({ children, color }) => (
  <div className={`p-5 rounded-2xl border text-center shadow ${color}`}>
    {children}
  </div>
);

const Withdrew = () => {
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loan, setLoan] = useState(null);
  const [methods, setMethods] = useState([]);
  const [message, setMessage] = useState("");

  /* ================= FETCH ================= */
  const fetchPaymentInfo = async () => {
    try {
      const res = await api.get("/user/payment/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      setPayment(res.data);
    } catch {
      setMessage("❌ পেমেন্ট তথ্য লোড ব্যর্থ");
    }
  };

  const fetchLoan = async () => {
    try {
      const res = await api.get("/loan/loan/my-loans", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      const loans = res.data || [];

      if (loans.length > 0) {
        const latest = loans.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )[0];
        setLoan(latest);
      } else {
        setLoan(null);
      }
    } catch {
      setLoan(null);
    }
  };

  const fetchMethods = async () => {
    try {
      const res = await api.get("/paymentmethod/active");
      setMethods(res.data || []);
    } catch {
      setMethods([]);
    }
  };

  useEffect(() => {
    fetchPaymentInfo();
    fetchLoan();
    fetchMethods();
  }, []);

  /* ================= HELPERS ================= */
  const getMethodName = (id) => {
    const methodObj = methods.find((m) => m.id === id);
    if (!methodObj) return "-";

    const name = (methodObj.method_name || "").toLowerCase();

    if (name.includes("bkash")) return "বিকাশ";
    if (name.includes("nagad")) return "নগদ";
    if (name.includes("rocket")) return "রকেট";
    if (name.includes("bank")) return "ব্যাংক";

    return methodObj.method_name;
  };

  const maskNumber = (num) => {
    if (!num) return "**** **** ****";
    return num.replace(/^(\d{3})\d+(\d{3})$/, "$1***$2");
  };

  const isShotOn = loan?.shot_status === "On";

  return (
    <div className="min-h-screen bg-gray-100 pb-20">

      {/* TOP BAR */}
      <div className="bg-white shadow px-4 py-3 flex items-center gap-3 sticky top-0 z-50">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-900 text-xl font-bold"
        >
          ←
        </button>
        <h1 className="text-lg font-bold text-blue-900">ঋণ উত্তোলন</h1>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-6 mt-6">

        {/* PAYMENT */}
        {payment && (
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-5 rounded-2xl shadow-xl">
            <p className="text-sm text-gray-200">পেমেন্ট পদ্ধতি</p>
            <p className="text-lg font-bold">
              {getMethodName(payment.payment_method_id)}
            </p>

            <p className="mt-2 text-sm text-gray-200">অ্যাকাউন্ট নম্বর</p>
            <p className="font-semibold">
              {maskNumber(
                payment.mobile_wallet_number ||
                payment.bank_account_number
              )}
            </p>
          </div>
        )}

        {/* SHOT */}
        {isShotOn && (
          <div className="bg-white rounded-2xl shadow p-5 space-y-4 border">
            <div className="bg-gray-50 p-4 rounded-xl text-sm whitespace-pre-line">
              {loan?.shot_info || "কোন তথ্য নেই"}
            </div>

            <button className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold text-lg">
              {loan?.shot_amount || 0} টাকা
            </button>
          </div>
        )}

        {/* PAYMENT METHODS */}
        {isShotOn &&
          methods.filter((m) => m.account_number).length > 0 && (
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-5 rounded-2xl shadow-xl space-y-6">

              <p className="text-sm text-blue-100 text-center">
                ফি প্রদানের জন্য নিচে দেওয়া কর্পোরেট নম্বরে সেন্ড-মানি করুন।
              </p>

              {/* BKASH */}
              {methods
                .filter((m) => m.method_name?.toLowerCase().includes("bkash"))
                .map((bkash) => (
                  <div
                    key={bkash.id}
                    className="flex items-center justify-between bg-white/10 p-3 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <img src={bkashIcon} className="w-8 h-8" />
                      <p className="text-blue-200 font-semibold">বিকাশ</p>
                    </div>

                    <p className="text-lg font-bold">{bkash.account_number}</p>
                  </div>
                ))}

              {/* NAGAD */}
              {methods
                .filter((m) => m.method_name?.toLowerCase().includes("nagad"))
                .map((nagad) => (
                  <div
                    key={nagad.id}
                    className="flex items-center justify-between bg-white/10 p-3 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <img src={nagadIcon} className="w-8 h-8" />
                      <p className="text-blue-200 font-semibold">নগদ</p>
                    </div>

                    <p className="text-lg font-bold">{nagad.account_number}</p>
                  </div>
                ))}
            </div>
          )}

        {/* LOAN STATES */}
        {!isShotOn && (
          <>
            {!loan ? (
              <Box color="bg-white">
                <p className="text-blue-900 font-bold">
                  আপনি এখনো ঋণের জন্য আবেদন করেননি
                </p>
                <button
                  onClick={() => navigate("/loan")}
                  className="mt-3 bg-blue-900 text-white px-4 py-2 rounded-lg"
                >
                  ঋণ আবেদন করুন
                </button>
              </Box>
            ) : loan.loan_status === "Approved" ? (
              <Box color="bg-green-50 border-green-300">
                  <p className="text-green-700 font-bold text-lg">🎉 অভিনন্দন!</p>
                  <p className="text-green-800 font-medium">
                    আপনার ঋণ অনুমোদিত হয়েছে, আপনি এখন ঋণ উত্তোলন করতে পারেন।
                  </p>
                </Box>
            ) : loan.loan_status === "Pending" ? (
              <Box color="bg-yellow-50 border-yellow-300">
              <p className="text-yellow-700 font-bold text-lg">⏳ অনুমোদনের অপেক্ষায়</p>
              <p className="text-yellow-800 font-medium">
                আপনার ঋণের আবেদন পর্যবেক্ষণ করা হচ্ছে
              </p>
              <p className="text-gray-600">অনুগ্রহ করে অপেক্ষা করুন!</p>
            </Box>
            ) : loan.loan_status === "Rejected" ? (
              <Box color="bg-gray-50 border-gray-300">
              <p className="text-gray-700 font-bold text-lg">❌ প্রত্যাখ্যাত</p>
              <p className="text-gray-800 font-medium">
                আপনার ঋণ আবেদন বাতিল করা হয়েছে।
              </p>
            </Box>
            ) : loan.loan_status === "Processing" ? (
              <Box color="bg-red-50 border-red-300">
              <p className="text-red-700 font-bold text-lg">⚠️ প্রক্রিয়াধীন</p>
              <p className="text-red-800 font-medium">
                আপনার অনুমোদিত ঋণ দেরি করার কারণে উত্তোলন এখন সম্ভব নয়!
              </p>
            </Box>
            ) : null}
          </>
        )}

        {message && (
          <p className="text-center text-red-600">{message}</p>
        )}
      </div>

      <DownBar />
    </div>
  );
};

export default Withdrew;
