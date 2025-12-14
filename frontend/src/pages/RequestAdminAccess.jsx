// import React, { useEffect, useState } from "react";
// import { UserCog, Send } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";
// import { userAPI } from "../api";

// export default function RequestAdminAccess({ currentUser, theme }) {
//   const [message, setMessage] = useState("");
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [status, setStatus] = useState("Not Submitted");
//   const [enableSubmit, setEnableSubmit] = useState(true);
//   const [rejectionReason, setRejectionReason ] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (message.trim().length < 50) {
//       toast.error("Please enter at least 50 characters explaining your reason.");
//       return;
//     }

//     try {
//           const requestData =   {
//                                     name: currentUser.name,
//                                     email: currentUser.email,
//                                     reason: message,
//                                     date: new Date().toLocaleString(),
//                                     status: "pending",
//                                 };

//       const response = await userAPI.requestAdminAccess(requestData);

//       if (response.status === 201) {
//         toast.success(
//           "Your admin access request has been submitted successfully!"
//         );
//         setMessage(message);
//         setRejectionReason("");
//         setEnableSubmit(false);
//         setStatus("pending");
//       } else {
//         toast.error(
//           response.data?.message || "Something went wrong. Please try again."
//         );
//       }
//     } catch (error) {
//       console.error("Error submitting admin request:", error);
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to submit request. Please try again later."
//       );
//     }
//   };

//     // Function to fetch user requests
//   const fetchUserRequest = async () => {
//     try {
//       const response = await userAPI.getUserRequest(currentUser.id);

//       if (response.status === 200) {
//         setRequests(response.data); // store requests in state
        
//         const request = response.data; // take the first request
//         setStatus(request.status || "pending");
//         setMessage(request.reason || "");

//         if(request.status == "rejected")
//         {
//             setEnableSubmit(true);
//             setMessage("");
//             setRejectionReason(request.rejectionReason)
//             console.log(request.rejectionReason);
//         }
//         else if(currentUser.role == 'user' && request.status == 'approved') {
//             setEnableSubmit(true);
//             setMessage("");
//             setStatus("Access Revoked")
//         }
//         else
//         {
//           setStatus("pending");
//           setEnableSubmit(false)
//         }

//       } else {
//         setEnableSubmit(true);
//         setStatus("pending");
//         // toast.error(response.data?.message || "Failed to fetch requests");
//       }
//     } catch (error) {
//       console.error("Error fetching admin requests:", error);
//       // toast.error(
//       //   error.response?.data?.message || "Failed to fetch requests"
//       // );
//     } finally {
//       setLoading(false);
//     }
//   };

//    // Call fetchUserRequest on page/component load
//   useEffect(() => {
//     if (currentUser.id) {
//       fetchUserRequest();
//     }
//   }, [currentUser]);

//   if (loading) {
//     return (
//       <div className="p-8 flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#bc4e9c] mx-auto"></div>
//           <p className="mt-4 text-gray-600 font-medium">Loading Request...</p>
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div className={`p-8 min-h-screen transition-all ${theme === "dark" ? "bg-blue-950 text-gray-100" : "bg-blue-50 text-gray-900"}`}>
//       <Toaster position="top-center" />
//       <div className="max-w-2xl mx-auto">
//         <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
//           <UserCog className="text-[#bc4e9c]" /> Request Admin Access
//         </h1>

//         <form
//           onSubmit={handleSubmit}
//           className={`p-6 rounded-2xl shadow-xl ${
//             theme === "dark"
//               ? "bg-gradient-to-br from-blue-100/20 via-blue-200/20 to-blue-300/20"
//               : "bg-gradient-to-br from-blue-100/20 via-blue-200/20 to-blue-300/20"
//           }`}
//         >
//           <div className="mb-5">
//             <label className="block text-sm font-semibold mb-1">Name</label>
//             <input
//               type="text"
//               value={currentUser.name}
//               disabled
//               className="w-full p-3 rounded-xl border border-[#bc4e9c]"
//             />
//           </div>

//           <div className="mb-5">
//             <label className="block text-sm font-semibold mb-1">Email</label>
//             <input
//               type="email"
//               value={currentUser.email}
//               disabled
//               className="w-full p-3 rounded-xl border border-[#bc4e9c] "
//             />
//           </div>

//           <div className="mb-6">
//             <label className="block text-sm font-semibold mb-1">Reason (Min 50 characters)</label>
//             <textarea
//               rows={5}
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Explain why you need admin access..."
//               className="w-full p-3 rounded-xl border border-[#bc4e9c]"
//             />
//           </div>

//           <button
//             type="submit" disabled={!enableSubmit}
//             className="flex items-center gap-2 bg-gradient-to-t from-[#bc4e9c] to-[#f80759] text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all"
//           >
//             <Send size={18} /> Submit Request
//           </button>

//           <p className="mt-4 font-medium">Current Status: <span  className={`capitalize ${
//                 status === 'rejected' ||  status === 'Access Revoked' ? 'text-red-600' : ''
//             }`}>{status}</span>
//             </p>

//             {rejectionReason != ''  && (
//             <p className="mt-4 font-medium ">
//                 <strong>Rejection Reason:</strong> {rejectionReason}
//             </p>
//             )}
//         </form>
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { UserCog, Send, AlertCircle, CheckCircle, XCircle, Clock, Loader } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { userAPI } from "../api";

export default function RequestAdminAccess() {
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Not Submitted");
  const [enableSubmit, setEnableSubmit] = useState(true);
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Get user from localStorage on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      setCurrentUser(user);
      fetchUserRequest(user.id);
    } else {
      setLoading(false);
      toast.error("User not found. Please login again.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("User information not found. Please login again.");
      return;
    }

    if (message.trim().length < 50) {
      toast.error("Please enter at least 50 characters explaining your reason.");
      return;
    }

    setSubmitting(true);

    try {
      const requestData = {
        name: currentUser.name,
        email: currentUser.email,
        reason: message,
        date: new Date().toLocaleString(),
        status: "pending",
      };

      const response = await userAPI.requestAdminAccess(requestData);

      if (response.status === 201) {
        toast.success("Your admin access request has been submitted successfully!");
        setMessage(message);
        setRejectionReason("");
        setEnableSubmit(false);
        setStatus("pending");
      } else {
        toast.error(response.data?.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting admin request:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit request. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fetchUserRequest = async (userId) => {
    try {
      const response = await userAPI.getUserRequest(userId);

      if (response.status === 200) {
        setRequests(response.data);
        
        const request = response.data;
        setStatus(request.status || "pending");
        setMessage(request.reason || "");

        if (request.status === "rejected") {
          setEnableSubmit(true);
          setMessage("");
          setRejectionReason(request.rejectionReason);
          console.log(request.rejectionReason);
        } else if (currentUser?.role === 'user' && request.status === 'approved') {
          setEnableSubmit(true);
          setMessage("");
          setStatus("Access Revoked");
        } else {
          setStatus("pending");
          setEnableSubmit(false);
        }
      } else {
        setEnableSubmit(true);
        setStatus("pending");
      }
    } catch (error) {
      console.error("Error fetching admin requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'rejected':
      case 'access revoked':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'approved':
        return 'bg-green-100 text-green-600';
      case 'rejected':
      case 'access revoked':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const bgColor = "bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef]";
  const cardBg = "bg-white";
  const textColor = "text-gray-900";

  if (loading) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#bc4e9c] border-t-transparent mx-auto mb-4"></div>
          <p className={`${textColor} font-semibold text-lg`}>Loading request...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center p-8`}>
        <div className={`${cardBg} rounded-2xl shadow-xl p-8 text-center max-w-md`}>
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-6">Please login again to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgColor} p-8`}>
      <Toaster position="top-center" />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`text-4xl lg:text-5xl font-bold ${textColor} mb-2 flex items-center gap-3`}>
                <UserCog className="text-[#bc4e9c]" size={40} />
                Request Admin Access
              </h1>
              <p className="text-gray-600 text-lg">
                Submit your request to gain administrative privileges
              </p>
            </div>
          </div>
          <hr className="border-t-2 border-[#bc4e9c]" />
        </div>

        {/* Status Card */}
        <div className={`${cardBg} rounded-2xl shadow-lg border-2 border-[#bc4e9c] p-6 mb-8`}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
            Request Status
          </h2>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <p className="text-sm text-gray-600 font-medium">Current Status</p>
                <p className={`text-lg font-bold capitalize ${textColor}`}>{status}</p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor()}`}>
              {status}
            </span>
          </div>

          {rejectionReason && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-800 mb-1">Rejection Reason:</p>
                  <p className="text-red-700">{rejectionReason}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Request Form */}
        <div className={`${cardBg} rounded-2xl shadow-lg border-2 border-[#bc4e9c] p-8`}>
          <h2 className="text-2xl font-bold mb-6">Submit Request</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={currentUser.name}
                disabled
                className="w-full px-6 py-4 rounded-xl border-2 border-[#bc4e9c] bg-gray-50 text-gray-900 font-medium"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={currentUser.email}
                disabled
                className="w-full px-6 py-4 rounded-xl border-2 border-[#bc4e9c] bg-gray-50 text-gray-900 font-medium"
              />
            </div>

            {/* Reason Textarea */}
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">
                Reason for Request (Minimum 50 characters)
              </label>
              <textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please explain in detail why you need admin access. Include your role, responsibilities, and how admin privileges will help you contribute to the organization..."
                disabled={!enableSubmit}
                className="w-full px-6 py-4 rounded-xl border-2 border-[#bc4e9c] bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
              />
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {message.length} / 50 characters
                </span>
                {message.length >= 50 && (
                  <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Meets minimum length
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!enableSubmit || submitting}
              className="w-full bg-gradient-to-r from-[#bc4e9c] to-[#f80759] text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-[#a0428a] hover:to-[#e0064f] transition-all font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Request
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className={`${cardBg} rounded-2xl shadow-lg border border-gray-200 p-6 mt-8`}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Important Information</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Your request will be reviewed by system administrators</li>
                <li>• Processing time typically takes 1-3 business days</li>
                <li>• You'll be notified via email once your request is processed</li>
                <li>• Provide detailed and valid reasons to increase approval chances</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}