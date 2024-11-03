import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserState } from "../store/features/auth/UserState";
import { useEffect } from "react";
import { AppDispatch } from "../store/store";
import { activeUser, logout } from "../store/features/auth/UserSlice";

const Dashboard = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
  };
  useEffect(() => {
    dispatch(activeUser());
  }, [dispatch]);

  const isAuthenticated = useSelector((state: { user: UserState }) => state.user.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col justify-center items-center text-2xl max-w-[1000px} min-h-screen gap-3 text-white bg-slate-700">
      <h1>Dashboard</h1>
      <h2>Welcome To Our Website's Dashboard</h2>
      <button onClick={handleLogout} className="bg-red-500 text-white p-4 rounded-xl hover:opacity-80">Log Out</button>
    </div>
  );
}

export default Dashboard;