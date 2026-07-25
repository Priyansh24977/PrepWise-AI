import React, { useState } from "react";
import "../auth.form.scss";
import { useNavigate, Link, useLocation } from "react-router";

import { useAuth } from "../hooks/useAuth";

const VerifyOtp = () => {
  const { loading, handleVerifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();


  const [email, setEmail] = useState(location.state?.email || "");
  
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await handleVerifyOtp({ email, otp });

    if (success) {
      navigate("/login");
    }
  };

  return (
    <main>
      <div className="form-container">
        <h1>Verify Email</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="otp">OTP</label>
            <input
              type="text"
              id="otp"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <button className="button primary-button" disabled={loading}>
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        <p>
          Already verified? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
};

export default VerifyOtp;