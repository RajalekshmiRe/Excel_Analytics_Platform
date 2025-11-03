import React, { useEffect, useState } from "react";
import { UserCog, Send } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { userAPI } from "../api";

export default function RequestAdminAccess({ currentUser, theme }) {
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Not Submitted");
  const [enableSubmit, setEnableSubmit] = useState(true);
  const [rejectionReason, setRejectionReason ] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (message.trim().length < 50) {
      toast.error("Please enter at least 50 characters explaining your reason.");
      return;
    }

    try {
          const requestData =   {
                                    name: currentUser.name,
                                    email: currentUser.email,
                                    reason: message,
                                    date: new Date().toLocaleString(),
                                    status: "pending",
                                };

      const response = await userAPI.requestAdminAccess(requestData);

      if (response.status === 201) {
        toast.success(
          "Your admin access request has been submitted successfully!"
        );
        setMessage(message);
        setRejectionReason("");
        setEnableSubmit(false);
        setStatus("pending");
      } else {
        toast.error(
          response.data?.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting admin request:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit request. Please try again later."
      );
    }
  };

    // Function to fetch user requests
  const fetchUserRequest = async () => {
    try {
      const response = await userAPI.getUserRequest(currentUser.id);

      if (response.status === 200) {
        setRequests(response.data); // store requests in state
        
        const request = response.data; // take the first request
        setStatus(request.status || "pending");
        setMessage(request.reason || "");

        if(request.status == "rejected")
        {
            setEnableSubmit(true);
            setMessage("");
            setRejectionReason(request.rejectionReason)
            console.log(request.rejectionReason);
        }
        else if(currentUser.role == 'user' && request.status == 'approved') {
            setEnableSubmit(true);
            setMessage("");
            setStatus("Access Revoked")
        }
        else
        {
          setStatus("pending");
          setEnableSubmit(false)
        }

      } else {
        setEnableSubmit(true);
        setStatus("pending");
        // toast.error(response.data?.message || "Failed to fetch requests");
      }
    } catch (error) {
      console.error("Error fetching admin requests:", error);
      // toast.error(
      //   error.response?.data?.message || "Failed to fetch requests"
      // );
    } finally {
      setLoading(false);
    }
  };

   // Call fetchUserRequest on page/component load
  useEffect(() => {
    if (currentUser.id) {
      fetchUserRequest();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#bc4e9c] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Request...</p>
        </div>
      </div>
    );
  }
  return (
    <div className={`p-8 min-h-screen transition-all ${theme === "dark" ? "bg-blue-950 text-gray-100" : "bg-blue-50 text-gray-900"}`}>
      <Toaster position="top-center" />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
          <UserCog className="text-[#bc4e9c]" /> Request Admin Access
        </h1>

        <form
          onSubmit={handleSubmit}
          className={`p-6 rounded-2xl shadow-xl ${
            theme === "dark"
              ? "bg-gradient-to-br from-blue-100/20 via-blue-200/20 to-blue-300/20"
              : "bg-gradient-to-br from-blue-100/20 via-blue-200/20 to-blue-300/20"
          }`}
        >
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input
              type="text"
              value={currentUser.name}
              disabled
              className="w-full p-3 rounded-xl border border-[#bc4e9c]"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              value={currentUser.email}
              disabled
              className="w-full p-3 rounded-xl border border-[#bc4e9c] "
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1">Reason (Min 50 characters)</label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain why you need admin access..."
              className="w-full p-3 rounded-xl border border-[#bc4e9c]"
            />
          </div>

          <button
            type="submit" disabled={!enableSubmit}
            className="flex items-center gap-2 bg-gradient-to-t from-[#bc4e9c] to-[#f80759] text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all"
          >
            <Send size={18} /> Submit Request
          </button>

          <p className="mt-4 font-medium">Current Status: <span  className={`capitalize ${
                status === 'rejected' ||  status === 'Access Revoked' ? 'text-red-600' : ''
            }`}>{status}</span>
            </p>

            {rejectionReason != ''  && (
            <p className="mt-4 font-medium ">
                <strong>Rejection Reason:</strong> {rejectionReason}
            </p>
            )}
        </form>
      </div>
    </div>
  );
}
