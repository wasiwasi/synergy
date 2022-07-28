import Header from '../components/common/Header';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

const EmailAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const sch = location.search;
    const params = new URLSearchParams(sch);
    const id = params.get('id');
    const code = params.get('code');
    //axios
    axios
      .post(
        "http://i7a306.p.ssafy.io:8080/users/email-auth",
        {
          "id": id,
          "code" : code
        }
      )
      .then(res => {
        alert(res);
        navigate('/');
      })
      .catch(err => {
        alert(err);
        navigate('/');
    })

  }, [])
  
  return (
    <div>
      {/* <Header></Header> */}
      <h4>emailauth</h4>
      <h4>emailauth</h4>
      <h4>emailauth</h4>
    </div>

  );
};

export default EmailAuth;