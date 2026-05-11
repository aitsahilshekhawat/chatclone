import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { axiosInstance } from "../lib/axios";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      console.log(res.data);

      localStorage.setItem("token", res.data.token);

      navigate("/home");
    } catch (error) {
      console.log(error);

      alert("Login Failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0f172a] text-white">
      <form
        onSubmit={handleLogin}
        className="bg-[#111827] p-10 rounded-3xl w-[400px] space-y-5"
      >
        <h1 className="text-4xl font-bold mb-8 text-center">Login</h1>

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
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 transition p-4 rounded-xl font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
}
