import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiBell
} from "react-icons/fi";

const Register = ({ setShowRegister }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required");
      return false;
    }

    if (form.name.length < 3) {
      toast.error("Name must be at least 3 characters");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await API.post("/auth/register", form);

      toast.success("Registered successfully 🎉");
      setShowRegister(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-black text-white items-center justify-center">
        <div className="text-center px-10">
          <h1 className="text-3xl font-light">Welcome!</h1>
          <h2 className="text-4xl font-bold mt-2">
            Create your <br /> ACCOUNT
          </h2>
        </div>
      </div>

      {/* RIGHT SIDE (UPDATED UI) */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md text-center">

          {/* Top Icon */}
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-200 rounded-2xl">
            <FiBell className="text-xl text-gray-700" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-semibold">Create account</h1>
          <p className="text-gray-500 text-sm mt-1 mb-6">
            Start tracking your product prices
          </p>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-2xl shadow-sm border text-left"
          >
            {/* Name */}
            <label className="text-sm font-medium">Full Name</label>
            <div className="flex items-center border rounded-lg px-3 py-2 mt-1 mb-4">
              <FiUser className="text-gray-400 mr-2" />
              <input
                name="name"
                placeholder="John Doe"
                onChange={handleChange}
                className="w-full outline-none text-sm"
              />
            </div>

            {/* Email */}
            <label className="text-sm font-medium">Email</label>
            <div className="flex items-center border rounded-lg px-3 py-2 mt-1 mb-4">
              <FiMail className="text-gray-400 mr-2" />
              <input
                name="email"
                placeholder="you@example.com"
                onChange={handleChange}
                className="w-full outline-none text-sm"
              />
            </div>

            {/* Password */}
            <label className="text-sm font-medium">Password</label>
            <div className="flex items-center border rounded-lg px-3 py-2 mt-1 mb-5">
              <FiLock className="text-gray-400 mr-2" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full outline-none text-sm"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer text-gray-400"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            {/* Button */}
            <button
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
            >
              {loading ? "Creating..." : "Create Account →"}
            </button>
          </form>

          {/* Bottom */}
          <p className="text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => setShowRegister(false)}
              className="text-black font-medium cursor-pointer"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;