import React, { useState } from "react";
import {
  BarChart3,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Lock,
  Database,
  Menu,
  X,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { guestAPI } from "../api";


const HomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await guestAPI.contact(formData);

      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });

    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Try again later.");
    }
  };

  const features = [
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: "Advanced Analytics",
      description:
        "Transform your raw data into meaningful visualizations. Use charts, graphs, and dashboards to understand trends, anomalies, and opportunities quickly with our intuitive interface.",
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security measures including role-based access control, encrypted data storage, and strict user authentication to keep your data safe and compliant.",
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Lightning Fast Processing",
      description:
        "Upload large datasets and generate insights instantly. Our optimized processing engine ensures minimal waiting time even for complex analytics tasks.",
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: "Real-time Updates",
      description:
        "Receive automatic notifications when your data changes. Keep your dashboards current without manual refreshes for always-current insights.",
    },
    {
      icon: <Database className="w-7 h-7" />,
      title: "Multi-format Support",
      description:
        "Upload CSV, Excel, JSON, or other data formats. Our platform automatically detects and parses your data for seamless analysis.",
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Team Collaboration",
      description:
        "Manage teams and collaborators with ease. Assign roles, track activity, and maintain full control over who accesses which data.",
    },
  ];

  const roles = [
    {
      name: "User",
      icon: <Users className="w-12 h-12" />,
      color: "from-[#f80759] to-[#bc4e9c]",
      description: "Analyze data and create visualizations",
      features: [
        "Upload Files",
        "Create Charts",
        "Export Reports",
        "View History",
      ],
    },
    {
      name: "Admin",
      icon: <Shield className="w-12 h-12" />,
      color: "from-indigo-500 to-blue-500",
      description: "Manage team analytics and activities",
      features: [
        "User Management",
        "Analytics Dashboard",
        "System Reports",
        "Access Control",
      ],
    },
    {
      name: "Super Admin",
      icon: <Lock className="w-12 h-12" />,
      color: "from-slate-600 to-slate-800",
      description: "Complete system control",
      features: [
        "Full System Access",
        "Admin Management",
        "Security Settings",
        "Audit Logs",
      ],
    },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">

        <Toaster position="top-right" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => scrollToSection("home")}
          >
            <div className="w-10 h-10 bg-gradient-to-t from-[#bc4e9c] to-[#f80759] rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#bc4e9c] to-[#f80759] bg-clip-text text-transparent">
              Excel Analytics Platform
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-base font-medium">
            {["home", "features", "roles", "contact"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="text-gray-700 hover:text-blue-600 transition-colors capitalize"
              >
                {section}
              </button>
            ))}

            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 border border-[#f80759] text-[#bc4e9c] rounded-lg hover:bg-blue-50 transition-all font-semibold"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2 bg-gradient-to-br from-[#f80759] to-[#bc4e9c] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              Register
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-50 border-t border-gray-100 px-6 py-4 space-y-3">
            {["home", "features", "roles", "contact"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 capitalize"
              >
                {section}
              </button>
            ))}
            <button
              onClick={() => {
                navigate("/login");
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 border border-[#f80759] text-[#bc4e9c] rounded-lg"
            >
              Login
            </button>
            <button
              onClick={() => {
                navigate("/register");
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 bg-gradient-to-br from-[#f80759] to-[#bc4e9c] text-white rounded-lg"
            >
              Register
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-40 md:pt-48 pb-20 px-6 scroll-mt-32">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#4a00e0]/10 px-4 py-2 rounded-full mb-6 border border-blue-100">
            <Sparkles className="w-4 h-4 text-[#f80759]" />
            <span className="text-sm font-semibold text-[#f80759]">
              Modern Data Analytics Solution
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Transform Your Data Into{" "}
            <span className="bg-gradient-to-br from-[#561292] to-[#4a00e0] bg-clip-text text-transparent">
              Actionable Insights
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Excel Analytics Platform empowers you to upload, analyze, and
            visualize data with ease. Real-time updates, multi-format support,
            and team collaboration tools built for modern analytics.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3 bg-gradient-to-br from-[#bc4e9c] to-[#f80759] text-white rounded-lg hover:shadow-xl transition-all font-semibold text-lg flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all font-semibold text-lg"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage, analyze, and visualize your data
              efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
              >
                <div className="p-8">
                  <div className="w-14 h-14 bg-[#F472B6]/25 rounded-xl flex items-center justify-center text-[#561292] mb-5 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              User Roles & Permissions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Role-based access control designed for different user types
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div
                  className={`h-32 bg-gradient-to-br ${role.color} flex items-end p-8 relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 opacity-10 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl relative z-10 shadow-lg">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl relative z-10 shadow-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {role.icon}
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">
                    {role.name}
                  </h3>
                  <p className="text-gray-600 text-base mb-6">
                    {role.description}
                  </p>
                  <div className="space-y-3 mb-8">
                    {role.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600">
              We'd love to hear from you. Send us a message!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#F472B6]/25 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Mail className="w-6 h-6 text-[#561292]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Email
                  </h3>
                  <p className="text-gray-600 text-base">
                    contact@excelanalyticsplatform.com
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#F472B6]/25 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Phone className="w-6 h-6 text-[#561292]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Phone
                  </h3>
                  <p className="text-gray-600 text-base">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#F472B6]/25 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="w-6 h-6 text-[#561292]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Location
                  </h3>
                  <p className="text-gray-600 text-base">
                    123 Analytics Street, Tech City, TC 12345
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 max-w-lg mx-auto"
            >
              <input
                type="text"
                name="name"
                placeholder="Your Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base resize-none"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-br from-[#f80759] to-[#bc4e9c] text-white rounded-lg font-semibold hover:shadow-lg transition-all text-base"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
