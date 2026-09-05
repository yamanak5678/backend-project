"use client";

import { useState } from "react";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="login-page">
      <div className="login-box">

        {/* Logo */}
        <div className="logo">
          EMS
        </div>

        {/* Heading */}
        <div className="brand">
          <h1>Employee Management System</h1>
          <p>Welcome back! Please login to continue.</p>
        </div>

        {/* Login Form */}
        <form>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="password-box">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
              />

              <button
                type="button"
                className="show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="login-options">

            <label className="remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <a href="#">
              Forgot password?
            </a>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>

        {/* Footer */}
        <p className="login-footer">
          Employee Management System
        </p>

      </div>
    </main>
  );
}