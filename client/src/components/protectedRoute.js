import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { setAllUsers, setUser, setAllChats } from "../redux/userSlice";
import { getLoggedUser, getAllUsers } from "../apiCalls/user";
import { getAllChats } from "../apiCalls/chat";
import toast from "react-hot-toast";

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialize = async () => {
    try {
      dispatch(showLoader());

      const [userRes, usersRes, chatsRes] = await Promise.all([
        getLoggedUser(),
        getAllUsers(),
        getAllChats(),
      ]);

      dispatch(hideLoader());

      if (!userRes.success || !usersRes.success) {
        toast.error(userRes.message || usersRes.message);
        return navigate("/login");
      }

      dispatch(setUser(userRes.data));
      dispatch(setAllUsers(usersRes.data));
      if (chatsRes.success) {
        dispatch(setAllChats(chatsRes.data));
      }
    } catch (error) {
      dispatch(hideLoader());
      navigate("/login");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      initialize();
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  // Avoid rendering until user is set
  if (!user) return null;

  return <>{children}</>;
}

export default ProtectedRoute;
