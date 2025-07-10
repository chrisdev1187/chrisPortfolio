"use client";
import React, { useState } from "react";
import ClientLayout from '@/components/ClientLayout';

function MainComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // MOCK LOGIN: check hardcoded credentials on frontend
    if (email === "admin@example.com" && password === "admin123") {
      const user = { id: 1, email: "admin@example.com", isAdmin: true };
      localStorage.setItem("user", JSON.stringify(user));
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1000);
      setLoading(false);
      return;
    } else {
      setError("Invalid credentials");
      setLoading(false);
      return;
    }
  };

  return (
    <ClientLayout>
      <div className="min-h-screen bg-[#121212] text-white font-poppins">
        {/* Login Section */}
        <section className="pt-32 pb-16 px-4 flex items-center justify-center min-h-screen relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[#121212] opacity-90"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-[#00FFFF]/20 to-[#FF00FF]/20 rounded-full blur-[120px]"></div>
          </div>

          <div className="w-full max-w-md z-10">
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-8 shadow-lg">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-transparent bg-clip-text">
                    Admin Login
                  </span>
                </h1>
                <p className="text-gray-400">Sign in to access the admin panel</p>
              </div>

              {success ? (
                <div className="bg-[#00FFFF]/10 border border-[#00FFFF] text-[#00FFFF] p-4 rounded-md mb-6 text-center">
                  <i className="fa-solid fa-check-circle mr-2"></i>
                  Login successful! Redirecting...
                </div>
              ) : (
                <form onSubmit={handleLogin}>
                  {error && (
                    <div className="bg-[#FF00FF]/10 border border-[#FF00FF] text-[#FF00FF] p-4 rounded-md mb-6">
                      <i className="fa-solid fa-exclamation-circle mr-2"></i>
                      {error}
                    </div>
                  )}

                  <div className="mb-6">
                    <label htmlFor="email" className="block mb-2 text-gray-300">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <i className="fa-solid fa-envelope"></i>
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="bg-[#121212] border border-[#333333] text-white rounded-md block w-full pl-10 p-3 focus:outline-none focus:border-[#00FFFF]"
                        placeholder="admin@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-gray-300"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <i className="fa-solid fa-lock"></i>
                      </div>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="bg-[#121212] border border-[#333333] text-white rounded-md block w-full pl-10 p-3 focus:outline-none focus:border-[#00FFFF]"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-black font-bold rounded-md hover:opacity-90 transition-opacity flex justify-center items-center"
                  >
                    {loading ? (
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    ) : (
                      <i className="fa-solid fa-sign-in-alt mr-2"></i>
                    )}
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>
              )}

              <div className="mt-6 text-center">
                <a
                  href="/"
                  className="text-gray-400 hover:text-[#00FFFF] transition-colors"
                >
                  <i className="fa-solid fa-arrow-left mr-2"></i>
                  Back to website
                </a>
              </div>
            </div>

            <div className="mt-8 text-center text-gray-500 text-sm">
              © 2025 Christiaan Bothma. All rights reserved.
            </div>
          </div>
        </section>
      </div>
    </ClientLayout>
  );
}

export default MainComponent;