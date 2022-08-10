import Header from "../components/common/Header";
import { Link, Outlet } from "react-router-dom";
import axios from "axios";

import { useEffect, useState } from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

// import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Button from "@mui/material/Button";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const BE_URL = process.env.REACT_APP_BACKEND_URL;

const themeA306 = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: "#39A2DB",
      contrastText: "#ffffff",
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#769FCD",
    },
  },
});

const Mypage = () => {
  const [mypage, setMypage] = useState<any[]>([[], "", ""]);

  const getMypage = () => {
    let token = localStorage.getItem("access-token");
    axios
      .get(`${BE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);

        const copy = [...mypage];
        res.data.data.map((d: any, i: any) => copy[0].push(d.subject_name));
        copy[1] = res.data.userNickName;
        copy[2] = res.data.userEmail;

        console.log(copy);

        setMypage(copy);
      });
  };

  useEffect(() => {
    getMypage();
  }, []);

  // constMypage HomePage: React.FC = () => {
  return (
    <Container>
      <Wrapper>
        <ThemeProvider theme={themeA306}>
          <ProfileForm>
            {/* <ProfileHead>{mypage}</ProfileHead> */}
            <ProfileHead>{mypage[1]} 님의 마이페이지입니다</ProfileHead>

            <ProfileInput>
              <InputLabel htmlFor="component-helper" shrink>
                Email
              </InputLabel>
              <Input
                id="component-helper-email"
                value={mypage[2]}
                inputProps={{
                  readOnly: true,
                }}
                aria-describedby="component-helper-text"
              />
            </ProfileInput>
            <ProfileInput>
              <InputLabel htmlFor="component-helper" shrink>
                NickName
              </InputLabel>
              <Input
                id="component-helper-email"
                value={mypage[1]}
                inputProps={{
                  readOnly: true,
                }}
                aria-describedby="component-helper-text"
              />
            </ProfileInput>
          </ProfileForm>
        </ThemeProvider>
      </Wrapper>
    </Container>
  );
};
const Container = styled.div``;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ProfileHead = styled.h3`
  color: #000000;
  margin: 40px;
`;

const LoginMsg = styled.h5`
  color: #000000;
  margin: 40px;
  font-size: 16px;
`;

const ProfileForm = styled.div`
  width: 500px;
  display: inline-block;
`;

const ProfileInput = styled.div`
  margin: 15px 0px;
`;

export default Mypage;
