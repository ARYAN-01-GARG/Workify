import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserState } from "../store/features/auth/UserState";
import { useEffect } from "react";
import { AppDispatch } from "../store/store";
import { activeUser } from "../store/features/auth/UserSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(activeUser());
  }, [dispatch]);

  const isAuthenticated = useSelector((state: { user: UserState }) => state.user.isAuthenticated);
  const token = useSelector((state: { user: UserState }) => state.user.token);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex justify-center items-center text-2xl max-w-[1000px}">
      <h1>Dashboard</h1>
      <h2>Welcome {token}</h2>
    </div>
  );
}

export default Dashboard;