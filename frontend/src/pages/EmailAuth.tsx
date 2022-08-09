import Header from "../components/common/Header";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const EmailAuth = () => {
  const BE_URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sch = location.search;
    const params = new URLSearchParams(sch);
    const id = params.get("id");
    const code = params.get("code");
    //axios
    axios
      .post(`${BE_URL}/users/email-auth`, {
        id: id,
        code: code,
      })
      .then((res) => {
        alert(res.data.message);
        navigate("/");
      })
      .catch((error) => {
        alert(error);
        navigate("/");
      });
  }, []);

  return (
    <div>
      <h4>A306의 회원이 되신 것을 환영합니다 :) !!</h4>
    </div>
  );
};

export default EmailAuth;
