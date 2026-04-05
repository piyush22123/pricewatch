import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff, FiBell } from "react-icons/fi";

const Login = ({ setIsAuth, setShowRegister }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    if (!form.email || !form.password) {
      toast.error("All fields are required");
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

      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful 🎉");
      setIsAuth(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      
      {/* LEFT SIDE (same as before) */}
      <div className="hidden md:flex w-1/2 bg-black text-white items-center justify-center">
        <div className="text-center px-10">
          <h1 className="text-3xl font-light">Hello!</h1>
          <h2 className="text-4xl font-bold mt-2">
            Have a <br /> GOOD DAY
          </h2>
        </div>
      </div>

      {/* RIGHT SIDE (NEW UI) */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md text-center">

          {/* Top Icon */}
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-200 rounded-2xl">
            <FiBell className="text-xl text-gray-700" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1 mb-6">
            Sign in to manage your price alerts
          </p>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-2xl shadow-sm border text-left"
          >
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
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Password</label>
              <span className="text-xs text-gray-500 cursor-pointer">
                Forgot password?
              </span>
            </div>

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
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          {/* Bottom */}
          <p className="text-sm text-gray-500 mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => setShowRegister(true)}
              className="text-black font-medium cursor-pointer"
            >
              Create account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;