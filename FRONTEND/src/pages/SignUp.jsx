import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera, User } from "lucide-react";
import { dataContext } from "../context/UserContext";
import axios from "axios";

const inputClass =
  "w-full rounded-lg border border-[#2A3247] bg-[#1E2536] px-3.5 py-2.5 text-sm text-[#E7ECF5] placeholder-[#5B6478] outline-none transition focus:border-[#2DD4BF] focus:ring-1 focus:ring-[#2DD4BF]/50";

const SignUp = () => {
  const { serverURL } = useContext(dataContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // purani preview URL ko memory se hatane ke liye
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    setError("");
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let payload = form;

      // photo chuni hai to FormData bhejna padta hai
      if (avatarFile) {
        payload = new FormData();
        Object.entries(form).forEach(([key, value]) =>
          payload.append(key, value),
        );
        payload.append("avatar", avatarFile);
      }

      const { data } = await axios.post(serverURL + "/api/signup", payload, {
        withCredentials: true,
      });
      console.log(data);
      navigate("/login");
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
          Create your account
        </h1>
        <p className="mt-1 text-center text-sm text-[#8994AC]">
          Join in a few quick steps
        </p>

        {/* Avatar upload */}
        <div className="mt-6 flex justify-center">
          <div className="relative">
            <div
              onClick={openFilePicker}
              className="flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#1E2536] ring-2 ring-[#2DD4BF]/40 transition hover:opacity-70"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-9 w-9 text-[#59647E]" strokeWidth={1.5} />
              )}
            </div>
            <button
              type="button"
              onClick={openFilePicker}
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-[#2DD4BF] to-[#3B82F6] text-white shadow-md transition-transform hover:scale-105"
              aria-label="Upload photo"
            >
              <Camera className="h-3.5 w-3.5" strokeWidth={2} />
            </button>

            {/* hidden input, jo click hone par file picker kholta hai */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </div>

        <form onSubmit={handleSignUp} className="mt-7 space-y-3.5">
          <div className="flex gap-3">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={form.firstName}
              onChange={handleChange}
              required
              className={`${inputClass} w-1/2`}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={form.lastName}
              onChange={handleChange}
              required
              className={`${inputClass} w-1/2`}
            />
          </div>

          <input
            type="text"
            name="userName"
            placeholder="Username"
            value={form.userName}
            onChange={handleChange}
            required
            className={inputClass}
          />

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
            minLength={6}
            className={inputClass}
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-linear-to-r from-[#2DD4BF] to-[#3B82F6] py-2.5 text-sm font-medium text-white shadow-lg shadow-[#2DD4BF]/10 transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#8994AC]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[#2DD4BF] hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
