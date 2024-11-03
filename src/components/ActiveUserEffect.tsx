import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";

const ActiveUserEffect = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch({ type: 'auth/activeUser' });
  }, [dispatch]);

  return null;
};

export default ActiveUserEffect;
