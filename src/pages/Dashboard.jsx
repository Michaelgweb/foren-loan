import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import TopBar from "../components/TopBar";
import DownBar from "../components/DownBar";
import depositIcon from "../assets/icons/deposit.png";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [loan, setLoan] = useState(null);

  const [showInfoNotice, setShowInfoNotice] = useState(false);
  const [showLoanNotice, setShowLoanNotice] = useState(false);
  const [showPaymentButton, setShowPaymentButton] = useState(false);

  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("access") ||
        localStorage.getItem("token");

      // USER
      const userRes = await api.get("/user/kyc/me", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const userData = userRes.data;
      setUser(userData);

      // LOANS
      const loanRes = await api.get("/loan/loan/my-loans", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const loanData = loanRes.data || [];
      setLoans(loanData);

      // latest loan
      const latestLoan = loanData.length ? loanData[0] : null;
      setLoan(latestLoan);

      // UI states
      setShowInfoNotice(!userData?.kyc_submitted);
      setShowLoanNotice(loanData.length === 0);
      setShowPaymentButton(loanData.some(l => l.loan_status === "Pending"));

    } catch (err) {
      console.log(err);
      setUser(null);
      setLoans([]);
      setLoan(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        ⏳ লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      <TopBar />

      <div className="max-w-5xl mx-auto px-4 mt-8 space-y-6">

        {/* ================= BALANCE ================= */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-3xl p-6 shadow-lg">

          <p className="text-sm opacity-80">অ্যাকাউন্ট ব্যালেন্স</p>

          <p className="text-4xl font-bold mt-2">
            ৳{Number(user?.balance || 0).toLocaleString("en-BD")}
          </p>

          <button
            onClick={() => navigate("/withdrew")}
            className="w-full mt-5 bg-white text-blue-800 py-3 rounded-xl font-bold"
          >
             ঋণ উত্তোলন
          </button>

        </div>

        {/* ================= NOTICE ================= */}
        {showInfoNotice && (
          <NoticeBox
            text="⚠ প্রথমে ব্যক্তিগত তথ্য পূরণ করুন!"
            buttonText="যাও"
            onClick={() => navigate("/personal-info")}
          />
        )}

        {showLoanNotice && !showInfoNotice && (
          <NoticeBox
            text="📢 আপনি এখনো ঋণের জন্য আবেদন করেননি!"
            buttonText="আবেদন করুন"
            onClick={() => navigate("/loan")}
          />
        )}

        {/* ================= LOAN STATES ================= */}
        {loan && (
          <div className="space-y-4">

            {loan.loan_status === "Approved" && (
              <Box color="bg-green-50 border-green-300">
                <p className="text-green-700 font-bold text-lg">
                  🎉 অভিনন্দন!
                </p>
                <p className="text-green-800 font-medium">
                  আপনার ঋণ অনুমোদিত হয়েছে, আপনি এখন ঋণ উত্তোলন করতে পারেন।
                </p>
              </Box>
            )}

            {loan.loan_status === "Pending" && (
              <Box color="bg-yellow-50 border-yellow-300">
                <p className="text-yellow-700 font-bold text-lg">
                  ⏳ অনুমোদনের অপেক্ষায়
                </p>
                <p className="text-yellow-800 font-medium">
                  আপনার ঋণের আবেদন পর্যবেক্ষণ করা হচ্ছে
                </p>
                <p className="text-gray-600">অনুগ্রহ করে অপেক্ষা করুন!</p>
              </Box>
            )}

            {loan.loan_status === "Rejected" && (
              <Box color="bg-gray-50 border-gray-300">
                <p className="text-gray-700 font-bold text-lg">
                  ❌ প্রত্যাখ্যাত
                </p>
                <p className="text-gray-800 font-medium">
                  আপনার ঋণ আবেদন বাতিল করা হয়েছে।
                </p>
              </Box>
            )}

            {loan.loan_status === "Processing" && (
              <Box color="bg-red-50 border-red-300">
                <p className="text-red-700 font-bold text-lg">
                  ⚠️ প্রক্রিয়াধীন
                </p>
                <p className="text-red-800 font-medium">
                  আপনার অনুমোদিত ঋণ দেরির কারণে উত্তোলন সম্ভব নয়!
                </p>
              </Box>
            )}

          </div>
        )}

      </div>

      {/* ================= MODAL ================= */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80">
            <h2 className="text-xl font-bold text-center">
              Loan Details
            </h2>

            <p className="text-center text-gray-600 mt-3">
              Status: {loan?.loan_status}
            </p>

            <button
              onClick={() => setShowApprovalModal(false)}
              className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      <DownBar />
    </div>
  );
};

/* ================= BOX ================= */
const Box = ({ color, children }) => (
  <div className={`${color} border rounded-xl p-5 text-center`}>
    {children}
  </div>
);

/* ================= ACTION CARD ================= */
const ActionCard = ({ title, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-xl p-4 text-center cursor-pointer"
  >
    <img src={icon} className="w-10 mx-auto" />
    <p className="mt-2 font-semibold">{title}</p>
  </div>
);

/* ================= NOTICE ================= */
const NoticeBox = ({ text, buttonText, onClick }) => (
  <div className="bg-yellow-100 border p-4 rounded-xl text-center">
    <p>{text}</p>
    <button
      onClick={onClick}
      className="mt-3 bg-yellow-400 px-4 py-2 rounded-lg"
    >
      {buttonText}
    </button>
  </div>
);

export default Dashboard;