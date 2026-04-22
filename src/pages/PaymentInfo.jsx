import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const PaymentInfo = () => {
  const navigate = useNavigate();

  const [payment, setPayment] = useState({
    payment_method_id: "",
    mobile_wallet_number: "",
    bank_account_number: "",
    bank_account_name: "",
    bank_name: "",
    bank_branch_name: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hasPayment, setHasPayment] = useState(false);

  // ================= LOAD =================
  const fetchPaymentInfo = async () => {
    try {
      const res = await api.get("/user/payment/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      const data = res.data;

      const exists =
        data.payment_method_id ||
        data.mobile_wallet_number ||
        data.bank_account_number;

      setHasPayment(!!exists);

      setPayment({
        payment_method_id: data.payment_method_id
          ? String(data.payment_method_id)
          : "",
        mobile_wallet_number: data.mobile_wallet_number || "",
        bank_account_number: data.bank_account_number || "",
        bank_account_name: data.bank_account_name || "",
        bank_name: data.bank_name || "",
        bank_branch_name: data.bank_branch_name || "",
      });
    } catch (err) {
      setHasPayment(false);
      setMessage("❌ পেমেন্ট তথ্য লোড ব্যর্থ");
    }
  };

  useEffect(() => {
    fetchPaymentInfo();
  }, []);

  // ================= CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "payment_method_id") {
      setPayment({
        payment_method_id: value,
        mobile_wallet_number: "",
        bank_account_number: "",
        bank_account_name: "",
        bank_name: "",
        bank_branch_name: "",
      });
      return;
    }

    setPayment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SUBMIT (FIXED) =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const formData = new URLSearchParams();

      formData.append("payment_method_id", payment.payment_method_id);
      formData.append("mobile_wallet_number", payment.mobile_wallet_number || "");
      formData.append("payment_description", "");
      formData.append("bank_account_number", payment.bank_account_number || "");
      formData.append("bank_account_name", payment.bank_account_name || "");
      formData.append("bank_name", payment.bank_name || "");
      formData.append("bank_branch_name", payment.bank_branch_name || "");

      await api.post("/user/payment/update", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      setMessage("✅ সফলভাবে আপডেট হয়েছে");
      await fetchPaymentInfo();
    } catch (err) {
      console.log(err.response?.data);
      setMessage(err?.response?.data?.detail || "❌ আপডেট ব্যর্থ");
    } finally {
      setLoading(false);
    }
  };

  // ================= METHOD =================
  const getMethod = (id) => {
    if (id === "1") return "বিকাশ";
    if (id === "2") return "নগদ";
    if (id === "3") return "রকেট";
    if (id === "4") return "ব্যাংক";
    return "-";
  };

  const isMobile = ["1", "2", "3"].includes(payment.payment_method_id);
  const isBank = payment.payment_method_id === "4";

  const accountNumber =
    payment.mobile_wallet_number || payment.bank_account_number || "-";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* TOP BAR */}
      <div className="bg-blue-800 text-white px-4 py-3 flex items-center shadow">
        <button onClick={() => navigate(-1)} className="text-xl mr-3">
          ←
        </button>
        <h1 className="text-lg font-semibold">ব্যাংক অ্যাকাউন্ট</h1>
      </div>

      <div className="flex justify-center px-4 mt-6">
        <div className="w-full max-w-md space-y-4">

          {message && (
            <div className="text-center text-sm text-blue-600">
              {message}
            </div>
          )}

          {/* CARD */}
          {hasPayment && (
            <div className="bg-white rounded-xl shadow-md p-5 space-y-4">

              <div>
                <p className="text-gray-500 text-sm">পেমেন্ট পদ্ধতি</p>
                <p className="text-lg font-bold text-blue-700">
                  {getMethod(payment.payment_method_id)}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">অ্যাকাউন্ট নম্বর</p>
                <p className="text-lg font-semibold">{accountNumber}</p>
              </div>

            </div>
          )}

          {/* FORM */}
          {!hasPayment && (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-md p-5 space-y-3"
            >

              <select
                name="payment_method_id"
                value={payment.payment_method_id}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">-- নির্বাচন করুন --</option>
                <option value="1">বিকাশ</option>
                <option value="2">নগদ</option>
                <option value="3">রকেট</option>
                <option value="4">ব্যাংক</option>
              </select>

              {/* MOBILE */}
              {isMobile && (
                <input
                  name="mobile_wallet_number"
                  value={payment.mobile_wallet_number}
                  onChange={handleChange}
                  placeholder="মোবাইল নাম্বার"
                  className="w-full p-2 border rounded"
                />
              )}

              {/* BANK */}
              {isBank && (
                <>
                  <input
                    name="bank_account_name"
                    value={payment.bank_account_name}
                    onChange={handleChange}
                    placeholder="একাউন্ট নাম"
                    className="w-full p-2 border rounded"
                  />

                  <input
                    name="bank_account_number"
                    value={payment.bank_account_number}
                    onChange={handleChange}
                    placeholder="একাউন্ট নাম্বার"
                    className="w-full p-2 border rounded"
                  />

                  <input
                    name="bank_name"
                    value={payment.bank_name}
                    onChange={handleChange}
                    placeholder="ব্যাংকের নাম"
                    className="w-full p-2 border rounded"
                  />

                  <input
                    name="bank_branch_name"
                    value={payment.bank_branch_name}
                    onChange={handleChange}
                    placeholder="শাখা"
                    className="w-full p-2 border rounded"
                  />
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                {loading ? "⏳ সংরক্ষণ হচ্ছে..." : "✔ সংরক্ষণ করুন"}
              </button>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;