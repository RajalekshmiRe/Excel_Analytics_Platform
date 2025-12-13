// import React, { useState } from "react";
// import API from "../api";
// import { useNavigate } from "react-router-dom";

// function Register() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await API.post("/auth/register", { name, email, password });
//       navigate("/");
//     } catch (err) {
//       alert(err.response.data.message || "Registration failed");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
//         <h1 className="text-xl font-bold mb-4">Register</h1>
//         <input
//           type="text"
//           placeholder="Name"
//           className="border p-2 w-full mb-3"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           className="border p-2 w-full mb-3"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="border p-2 w-full mb-3"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button type="submit" className="bg-green-500 text-white w-full py-2 rounded">Register</button>
//       </form>
//     </div>
//   );
// }

// export default Register;

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      // await axios.post("http://localhost:5000/api/auth/register", {
      await axios.post("api/auth/register",{
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success(`User registered successfully`);

        // Wait for toast to display before redirecting
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Registration successful! Please login." },
        });
      }, 2000); 
      
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-gray-100 p-4">
      
      <Toaster position="top-center" />
      
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6/12 overflow-hidden border border-gray-100">
        <div className="p-5 px-12">
          <div className="text-center mb-12">
            <a href="/">
              <div className="w-20 h-20 bg-gradient-to-br from-[#f80759] to-[#bc4e9c] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-3xl font-bold">EA</span>
              </div>
            </a>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Create Account
            </h1>
            <p className="text-gray-600 text-lg">
              Start analyzing your data today
            </p>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-base flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">✕</span>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            <div className=" grid grid-cols-2 gap-3">
              <div className="">
                <label className="block text-base font-semibold text-gray-900 mb-3">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-base placeholder-gray-500 bg-gray-50 hover:bg-white"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-900 mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-base placeholder-gray-500 bg-gray-50 hover:bg-white"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-900 mb-3">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 pr-14 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-base placeholder-gray-500 bg-gray-50 hover:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-200 rounded-lg flex-shrink-0"
                  >
                    {showPassword ? (
                      <EyeOff className="w-6 h-6" />
                    ) : (
                      <Eye className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-900 mb-3">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 pr-14 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-base placeholder-gray-500 bg-gray-50 hover:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-200 rounded-lg flex-shrink-0"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-6 h-6" />
                    ) : (
                      <Eye className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-br from-[#f80759] to-[#bc4e9c] text-white py-4 rounded-xl font-bold text-lg hover:from-[#a3053a] hover:to-[#6c2d5a] transition-all shadow-lg hover:shadow-xl ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <div className="mt-5 text-center border-t border-gray-200 pt-8">
            <p className="text-gray-700 text-base">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#f80759] hover:text-[#bc4e9c] font-bold underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
