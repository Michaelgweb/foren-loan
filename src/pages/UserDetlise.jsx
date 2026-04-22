import React, { useEffect, useState } from "react";
import api from "../services/api";

const UserDetlise = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ================= FETCH =================
  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await api.get("/kyc/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Login again!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading user details...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        No user data found
      </div>
    );
  }

  // ================= SAFE USER =================
  const user = data || {};

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">

      <h1 className="text-3xl font-bold mb-6 text-center">
        👤 ইউজার তথ্য
      </h1>

      {/* STATUS */}
      <div className="text-center mb-4">
        <span className="px-4 py-2 rounded-xl bg-indigo-100 text-indigo-700 font-semibold">
          স্ট্যাটাস: {user.status || "PENDING"}
        </span>
      </div>

      {/* PERSONAL INFO */}
      <Section title="ব্যক্তিগত তথ্য">
        <InfoRow label="নাম" value={user.name} />
        <InfoRow label="ফোন" value={user.phone_number} />
        <InfoRow label="পূর্ণ নাম" value={user.full_name} />
        <InfoRow label="এনআইডি নম্বর" value={user.nid_number} />
        <InfoRow label="বর্তমান ঠিকানা" value={user.current_address} />
        <InfoRow label="স্থায়ী ঠিকানা" value={user.permanent_address} />
        <InfoRow label="পেশা" value={user.profession} />
        <InfoRow label="লোনের কারণ" value={user.loan_reason} />
        <InfoRow label="সাবমিট সময়" value={user.last_submitted_at} />
      </Section>

      {/* ACCOUNT */}
      <Section title="অ্যাকাউন্ট তথ্য">
        <InfoRow label="অ্যাকাউন্ট আইডি" value={user.unique_id} />
        <InfoRow label="ব্যালেন্স" value={`৳ ${user.balance || 0}`} />
        <InfoRow
          label="KYC সাবমিট"
          value={data.kyc_submitted ? "হ্যাঁ" : "না"}
        />
      </Section>

      {/* NOMINEE */}
      <Section title="নমিনির তথ্য">
        <InfoRow label="পূর্ণ নাম" value={user.nominee_name} />
        <InfoRow label="সম্পর্ক" value={user.nominee_relation} />
        <InfoRow label="মোবাইল" value={user.nominee_phone} />
      </Section>

      {/* STAFF */}
      <Section title="স্টাফ তথ্য">
        <InfoRow label="অ্যাসাইন স্টাফ" value={user.assigned_staff_name} />
      </Section>

      {/* FILES */}
      <Section title="ডকুমেন্টস">

        <FileRow label="সেলফি" value={user.selfie} />
        <FileRow label="NID ফ্রন্ট" value={user.nid_front} />
        <FileRow label="NID ব্যাক" value={user.nid_back} />
        <FileRow label="সিগনেচার" value={user.signature} />

      </Section>

      {/* PERMISSION */}
      <Section title="অনুমতি">
        <InfoRow label="এডিট করা যাবে" value={data.can_edit ? "হ্যাঁ" : "না"} />
        <InfoRow label="লক করা" value={data.is_locked ? "হ্যাঁ" : "না"} />
      </Section>

    </div>
  );
};

/* ================= UI COMPONENTS ================= */

const Section = ({ title, children }) => (
  <div className="bg-white rounded-3xl shadow p-6 mb-6">
    <h2 className="text-2xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between border-b py-2">
    <span className="font-medium text-gray-600">{label}:</span>
    <span className="text-gray-800">{value || "N/A"}</span>
  </div>
);

// ================= FILE PREVIEW =================
const FileRow = ({ label, value }) => (
  <div className="flex justify-between items-center border-b py-2">
    <span className="font-medium text-gray-600">{label}:</span>

    {value ? (
      <a
        href={
          value.startsWith("http")
            ? value
            : `http://127.0.0.1:8000/${value}`
        }
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline"
      >
        দেখুন
      </a>
    ) : (
      <span className="text-gray-400">N/A</span>
    )}
  </div>
);

export default UserDetlise;