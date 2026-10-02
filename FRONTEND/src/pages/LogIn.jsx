import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { dataContext } from "../context/UserContext";

const inputClass =
  "w-full rounded-lg border border-[#2A3247] bg-[#1E2536] px-3.5 py-2.5 text-sm text-[#E7ECF5] placeholder-[#5B6478] outline-none transition focus:border-[#2DD4BF] focus:ring-1 focus:ring-[#2DD4BF]/50";

const Login = () => {
  const { serverURL } = useContext(dataContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(serverURL + "/api/login", form, {
        withCredentials: true,
      });
      console.log(data);
      navigate("/"); // login ke baad jis page par bhejna ho, wo route yahan likho
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0F1420] px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-[#242C40] bg-[#161C2C] p-8 shadow-2xl shadow-black/40">
        <h1 className="text-center text-xl font-semibold text-[#E7ECF5]">
          Welcome back
        </h1>
        <p className="mt-1 text-center text-sm text-[#8994AC]">
          Log in to continue
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-3.5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className={inputClass}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className={inputClass}
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-linear-to-r from-[#2DD4BF] to-[#3B82F6] py-2.5 text-sm font-medium text-white shadow-lg shadow-[#2DD4BF]/10 transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#8994AC]">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-[#2DD4BF] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
