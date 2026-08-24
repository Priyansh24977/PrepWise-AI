import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe, sendOtp, registerWithOtp } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleSendOtp = async ({ username, email }) => {
    setLoading(true);
    try {
      const data = await sendOtp({ username, email });
      return { success: true, message: data.message };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.response?.data?.message || "Failed to send OTP" };
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterWithOtp = async ({ username, email, password, otp }) => {
    setLoading(true);
    try {
      const data = await registerWithOtp({ username, email, password, otp });
      setUser(data.user);
      return { success: true, message: data.message };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.response?.data?.message || "Invalid OTP or registration failed" };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);

    try {
      const data = await register({ username, email, password });

      setUser(data.user);

      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async ({ email, password }) => {
    setLoading(true);

    try {
      const data = await login({ email, password });

      setUser(data.user);

      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const data = await logout();
      setUser(null);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return { 
    user, 
    loading, 
    handleLogin, 
    handleRegister, 
    handleSendOtp, 
    handleRegisterWithOtp, 
    handleLogout 
  };
};
