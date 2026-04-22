// src/pages/Terms.jsx
import React from "react";
import TopBar from "../components/TopBar";
import DownBar from "../components/DownBar";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <TopBar />

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow mt-4 space-y-6">

        <h2 className="text-2xl font-semibold text-center">
          নিয়মাবলী ও শর্তাবলী
        </h2>

        {/* Intro */}
        <div className="space-y-3 text-gray-700 leading-relaxed">
          <p>
            আমাদের সাথে থাকার জন্য ধন্যবাদ! খুব সহজেই আপনি ঘরে বসে ঋণ নিতে পারেন। ২০ হাজার থেকে ৫০ লক্ষ টাকা পর্যন্ত ঋণ গ্রহণ সম্ভব। অনুগ্রহ করে নিচের শর্তাবলী মনোযোগ সহকারে পড়ুন।
          </p>
        </div>

        {/* Loan Rules */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-inner space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">ঋণ সম্পর্কিত শর্তাবলী</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>প্রতি মাসের ১–১০ তারিখের মধ্যে বিকাশ/নগদ কিস্তি পরিশোধ করতে হবে।</li>
            <li>যদি কোনো মাসে কিস্তি পরিশোধ করতে না পারেন, পরবর্তী দুই মাসের কিস্তি একত্রে পরিশোধ করা যাবে।</li>
            <li>দুই মাসের বেশি কিস্তি বাকি থাকলে অতিরিক্ত জরিমানা প্রযোজ্য হতে পারে।</li>
            <li>ফোন বা মেসেজে প্রয়োজন ছাড়া যোগাযোগ এড়িয়ে চলুন।</li>
            <li>ভুল তথ্য দেওয়া থেকে বিরত থাকুন; ভুয়া বা ভুল তথ্য দিলে ব্যাংক বা কর্তৃপক্ষ আইনি ব্যবস্থা নিতে পারে।</li>
          </ul>
        </div>

        {/* Fees */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-inner space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">জামানত / অগ্রিম ফি</h3>
          <p className="text-gray-700">
            ঋণ গ্রহণের ক্ষমতা যাচাই বা বীমার উদ্দেশ্যে সাময়িক ফি নেওয়া হতে পারে। ফি যাচাই বা বীমা কিস্তি পরিশোধের পরে পুরো ফি ফেরত দেওয়া হবে।
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mt-3">তথ্য সংশোধন ফি</h3>
          <p className="text-gray-700">
            একাউন্ট নম্বর বা ব্যক্তিগত তথ্য ভুল হলে সংশোধনের জন্য ফি প্রযোজ্য হতে পারে।
          </p>
        </div>

        {/* Password */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-inner space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">পাসওয়ার্ড সম্পর্কিত</h3>
          <p className="text-gray-700">
            পাসওয়ার্ড ভুলে গেলে অবিলম্বে আমাদের গ্রাহক প্রতিনিধির সাথে যোগাযোগ করুন।
          </p>
        </div>

        {/* Loan Duration */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-inner space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">ঋণ গ্রহণের সময়সীমা</h3>
          <p className="text-gray-700">
            ঋণ কত দ্রুত সম্পূর্ণ হবে তা ঋণের পরিমাণ ও যাচাইকরণের প্রক্রিয়ার উপর নির্ভর করে। সাধারণত কয়েক ঘণ্টা থেকে ১–৫ দিন সময় লাগতে পারে।
          </p>
        </div>

        {/* Support */}
        <div className="border-t pt-4 space-y-3">
          <h3 className="text-lg font-semibold">সাহায্য ও যোগাযোগ</h3>
          <p className="text-gray-700">
            সাহায্য পেতে আমাদের সাথে চ্যাট করুন অথবা নিচে দেওয়া যোগাযোগ মাধ্যমগুলো ব্যবহার করুন।
          </p>

          <div className="space-y-1 text-gray-800">
            <p>
              <span className="font-medium">ঠিকানা:</span> বোরাক টাওয়ার ৭ম তলা, ৭১-৭২ পুরাতন এ্যলিফ্যান্ট রোড, ঢাকা।
            </p>
            <p>
              <span className="font-medium">কার্যক্রম:</span> সকাল ৯টা থেকে রাত ৯টা (শনিবার – বৃহস্পতিবার)
            </p>
          </div>

          <div className="space-y-1">
            <p>
              <span className="font-medium">WhatsApp:</span>{" "}
              <a
                href="https://wa.me/8801884503477"
                className="text-green-600 underline"
              >
                +880 1884-503477
              </a>
            </p>
            <p>
              <span className="font-medium">IMO:</span> +8801884503477
            </p>
          </div>
        </div>

      </div>

      <DownBar />
    </div>
  );
};

export default Terms;
