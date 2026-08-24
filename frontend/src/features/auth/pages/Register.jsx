import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: Details, Step 2: OTP
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const { loading, handleSendOtp, handleRegisterWithOtp } = useAuth();

  const handleSendVerificationCode = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    if (!username.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    const res = await handleSendOtp({ username, email });
    if (res.success) {
      setStep(2);
      setInfoMsg(`Verification code sent to ${email}`);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    if (!otp.trim()) {
      setErrorMsg("Please enter the 6-digit verification code.");
      return;
    }

    const res = await handleRegisterWithOtp({ username, email, password, otp });
    if (res.success) {
      navigate("/");
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleResendCode = async () => {
    setErrorMsg("");
    setInfoMsg("");
    const res = await handleSendOtp({ username, email });
    if (res.success) {
      setInfoMsg(`New verification code sent to ${email}`);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <main>
      <div className="form-container">
        <h1>{step === 1 ? "Register" : "Email Verification"}</h1>

        {errorMsg && <div className="alert-message error">{errorMsg}</div>}
        {infoMsg && <div className="alert-message info">{infoMsg}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendVerificationCode}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                id="username"
                name="username"
                placeholder="Enter username"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                name="email"
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                required
              />
            </div>

            <button className="button primary-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Sending OTP...
                </>
              ) : (
                "Register"
              )}
            </button>
            <p>
              Already have an account ? <Link to={"/login"}>Login</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister}>
            <div className="input-group">
              <label htmlFor="otp">Enter 6-Digit Verification Code</label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                type="text"
                id="otp"
                name="otp"
                className="otp-input"
                placeholder="e.g. 123456"
                maxLength={6}
                required
              />
            </div>

            <button className="button primary-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Verifying...
                </>
              ) : (
                "Verify & Create Account"
              )}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={handleResendCode}
              disabled={loading}
            >
              Resend Code
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setStep(1);
                setErrorMsg("");
                setInfoMsg("");
              }}
              disabled={loading}
            >
              ← Edit Details
            </button>

            <p style={{ marginTop: "0.5rem" }}>
              Already have an account ? <Link to={"/login"}>Login</Link>
            </p>
          </form>
        )}
      </div>
    </main>
  );
};

export default Register;
