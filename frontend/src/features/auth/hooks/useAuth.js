import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe, verifyOtp } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
      return true;
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
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

  const handleVerifyOtp = async ({ email, otp }) => {
  setLoading(true);

  try {
    await verifyOtp({ email, otp });
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  } finally {
    setLoading(false);
  }
};

  return { user, loading, handleLogin, handleRegister, handleVerifyOtp,handleLogout };
};
