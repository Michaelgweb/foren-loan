import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DownBar from "../components/DownBar";
import api from "../services/api";

const Loan = () => {
  const navigate = useNavigate();

  const [months, setMonths] = useState(null);
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loanDetails, setLoanDetails] = useState(null);

  const interestRate = 2.4;

  const monthOptions = [12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120];

  const amountOptions = [
    { value: 50000, label: "৫০ হাজার" },
    { value: 100000, label: "১ লক্ষ" },
    { value: 150000, label: "১.৫ লক্ষ" },
    { value: 200000, label: "২ লক্ষ" },
    { value: 300000, label: "৩ লক্ষ" },
    { value: 400000, label: "৪ লক্ষ" },
    { value: 500000, label: "৫ লক্ষ" },
    { value: 600000, label: "৬ লক্ষ" },
    { value: 700000, label: "৭ লক্ষ" },
    { value: 800000, label: "৮ লক্ষ" },
    { value: 900000, label: "৯ লক্ষ" },
    { value: 1000000, label: "১০ লক্ষ" },
    { value: 1500000, label: "১৫ লক্ষ" },
    { value: 2000000, label: "২০ লক্ষ" },
    { value: 3000000, label: "৩০ লক্ষ" },
  ];

  const calculateEmi = (P, n) => {
    const r = interestRate / (12 * 100);
    if (!P || !n) return 0;

    return Math.round(
      (P * r * Math.pow(1 + r, n)) /
        (Math.pow(1 + r, n) - 1)
    );
  };

  // 👉 FIX: clean formatting function (NO DECIMAL)
  const formatTk = (value) => {
    return Number(value || 0).toLocaleString("bn-BD", {
      maximumFractionDigits: 0,
    });
  };

  useEffect(() => {
    const load = async () => {
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

          setLoanDetails(latest);
        }
      } catch (err) {
        console.error(err.message);
      }
    };

    load();
  }, []);

  const emi = amount && months ? calculateEmi(amount, months) : 0;
  const showCard = amount && months;

  const handleSubmit = async () => {
    setError("");

    if (!amount || !months) {
      setError("দয়া করে মাস এবং টাকা নির্বাচন করুন");
      return;
    }

    setLoading(true);

    try {
      const body = new URLSearchParams();
      body.append("amount", amount);
      body.append("months", months);
      body.append("monthly_installment", emi);

      await api.post("/loan/loan/create", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      navigate("/payment-info");
    } catch (err) {
      setError(err.response?.data?.detail || "সার্ভার সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const hasLoan = !!loanDetails;

  return (
    <div className="min-h-screen bg-gray-100 pb-20">

      <div className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white p-4 shadow-md text-center">
        <h1 className="text-lg font-bold">ক্ষুদ্র ঋণ উন্নয়ন প্রজেক্ট</h1>
        <p className="text-xs mt-1 text-blue-100">
          ঋণ অনুমোদিত হলে, প্রতি মাসের ১–১০ তারিখের মধ্যে কিস্তি পরিশোধ করতে হবে
        </p>
      </div>

      <div className="max-w-3xl mx-auto mt-6 p-4 space-y-6">

        <h1 className="text-2xl font-bold text-center text-blue-900">
          লোন আবেদন
        </h1>

        {hasLoan ? (
          <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white p-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">📋 আপনার লোনের বিস্তারিত</h2>

              <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                loanDetails.loan_status === "Pending"
                  ? "bg-yellow-400 text-black"
                  : loanDetails.loan_status === "Approved"
                  ? "bg-green-500 text-black"
                  : "bg-red-500 text-white"
              }`}>
                {loanDetails.loan_status === "Pending"
                  ? "অনুমোদন হয়নি"
                  : loanDetails.loan_status === "Approved"
                  ? "অনুমোদিত"
                  : "বাতিল"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">

              <div className="bg-white/5 p-3 rounded-lg">
                <p>আবেদন তারিখ</p>
                <p className="font-bold">
                  {new Date(loanDetails.created_at).toLocaleDateString("bn-BD")}
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-lg">
                <p>ঋণের পরিমাণ</p>
                <p className="font-bold">
                  {formatTk(loanDetails.amount)} টাকা
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-lg">
                <p>ঋণের সময়</p>
                <p className="font-bold">{loanDetails.months} মাস</p>
              </div>

              <div className="bg-white/5 p-3 rounded-lg">
                <p>মাসিক কিস্তি</p>
                <p className="font-bold text-yellow-300">
                  {formatTk(loanDetails.monthly_installment)} টাকা
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-lg">
                <p>পরিশোধ হয়েছে</p>
                <p className="font-bold">
                  {loanDetails.paid_installment || 0} টি
                </p>
              </div>

              <div className="bg-red-500/10 p-3 rounded-lg">
                <p>বাকি কিস্তি</p>
                <p className="font-bold text-red-300">
                  {loanDetails.remaining_installment || loanDetails.months} টি
                </p>
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-300">
              {loanDetails.loan_status === "Pending"
                ? "⏳ আপনার লোন অনুমোদনের অপেক্ষায় আছে"
                : "✔️ লোন স্ট্যাটাস আপডেট হয়েছে"}
            </div>
          </div>
        ) : (
          <>
            <div>
              <h2 className="font-semibold mb-3">১️⃣ কত মাসের জন্য ঋণ নিতে চান?</h2>
              <div className="flex flex-wrap gap-2">
                {monthOptions.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMonths(m)}
                    className={`px-4 py-2 rounded-md border ${
                      months === m
                        ? "bg-blue-900 text-white"
                        : "text-blue-900 border-blue-900"
                    }`}
                  >
                    {m} মাস
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-3">২️⃣ কত টাকা নিতে চান?</h2>
              <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-2">
                {amountOptions.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => setAmount(a.value)}
                    className={`px-4 py-2 rounded-md border ${
                      amount === a.value
                        ? "bg-blue-900 text-white"
                        : "text-blue-900 border-blue-900"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {showCard && (
              <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 rounded-2xl shadow-2xl">
                <h2 className="font-bold mb-3">আপনার ঋণের বিস্তারিত তথ্য</h2>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p>সুদ</p>
                    <p className="font-bold">{interestRate}%</p>
                  </div>

                  <div>
                    <p>সময়</p>
                    <p className="font-bold">{months} মাস</p>
                  </div>

                  <div>
                    <p>পরিমাণ</p>
                    <p className="font-bold">{formatTk(amount)} টাকা</p>
                  </div>

                  <div>
                    <p>মাসিক কিস্তি</p>
                    <p className="font-bold text-yellow-300">
                      {formatTk(emi)} টাকা
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800"
            >
              {loading ? "প্রসেসিং..." : "আবেদন সম্পূর্ণ করুন"}
            </button>
          </>
        )}
      </div>

      <DownBar />
    </div>
  );
};

export default Loan;