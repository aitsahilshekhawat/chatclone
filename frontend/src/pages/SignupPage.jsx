import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
export default function SignupPage() {
    const [fullName, setFullName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleSignup = async () => {
      try {
        const res = await axiosInstance.post("/auth/signup", {
          fullName,
          email,
          password,
        });

        console.log(res.data);

        alert("Signup Successful");
      } catch (error) {
        console.log(error);

        console.log(error.response);

        alert(error.response?.data?.message || "Signup Failed");
      }
    };
  return (
    <div className="h-screen flex items-center justify-center bg-[#0f172a] text-white">
      <div className="bg-[#111827] p-10 rounded-3xl w-[400px]">
        <h1 className="text-3xl font-bold mb-6">Signup</h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-4 rounded-xl bg-[#1f2937] outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-xl bg-[#1f2937] outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-xl bg-[#1f2937] outline-none"
          />

          <button
            onClick={handleSignup}
            className="w-full bg-blue-500 hover:bg-blue-600 transition p-4 rounded-xl font-semibold"
          >
            Signup
          </button>
          <p className="text-center text-gray-400">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
