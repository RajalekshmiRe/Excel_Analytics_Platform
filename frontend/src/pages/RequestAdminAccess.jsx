import React, { useState } from "react";
import { UserCog, Send } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function RequestAdminAccess({ currentUser, theme }) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(localStorage.getItem("adminRequestStatus") || "Not Submitted");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.length < 50) {
      toast.error("Please enter at least 50 characters explaining your reason.");
      return;
    }

    const requestData = {
      name: currentUser.name,
      email: currentUser.email,
      message,
      date: new Date().toLocaleString(),
      status: "Pending Review",
    };

    localStorage.setItem("adminRequest", JSON.stringify(requestData));
    localStorage.setItem("adminRequestStatus", "Pending Review");
    setStatus("Pending Review");
    setMessage("");
    toast.success("Request submitted successfully!");
  };

  return (
    <div className={`p-8 min-h-screen transition-all ${theme === "dark" ? "bg-blue-950 text-gray-100" : "bg-blue-50 text-gray-900"}`}>
      <Toaster position="top-center" />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
          <UserCog className="text-blue-500 dark:text-blue-400" /> Request Admin Access
        </h1>

        <form
          onSubmit={handleSubmit}
          className={`p-6 rounded-2xl shadow-xl ${
            theme === "dark"
              ? "bg-gradient-to-br from-blue-900 to-blue-800"
              : "bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300"
          }`}
        >
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input
              type="text"
              value={currentUser.name}
              disabled
              className="w-full p-3 rounded-xl border border-blue-300 bg-blue-50 dark:bg-blue-900"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              value={currentUser.email}
              disabled
              className="w-full p-3 rounded-xl border border-blue-300 bg-blue-50 dark:bg-blue-900"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1">Reason (Min 50 characters)</label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain why you need admin access..."
              className="w-full p-3 rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all"
          >
            <Send size={18} /> Submit Request
          </button>

          <p className="mt-4 font-medium">Current Status: <span className="text-blue-600">{status}</span></p>
        </form>
      </div>
    </div>
  );
}
