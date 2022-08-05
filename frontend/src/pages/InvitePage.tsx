import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import Header from "../components/common/Header";
import { Link, Outlet, useNavigate } from "react-router-dom";

import styled from "@emotion/styled";

import { useState, useCallback } from "react";

import FormControl from "@mui/material/FormControl";
// import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";

import Button from "@mui/material/Button";

import "./Signup.css";

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

const InvitePage = () => {
  //닉네임 확인
  const [nickName, setNickName] = useState<string>("");
  const navigate = useNavigate();

  //에러메시지 저장
  const [nickNameError, setNickNameError] = useState<string>("");

  // 유효성 검사
  const [isNickName, setIsNickName] = useState<boolean>(false);

  // 닉네임 중복 체크
  const [usableNickName, setUsableNickName] = useState<boolean>(false);

  // 입장 버튼 클릭
  const onEnter = () => {
    axios
      .post(
        `${BE_URL}/주소넣기`,

        {
          nickname: nickName,
        }
      )
      .then((res) => {
        console.log("response:", res);
        {
          console.log(res.status);
          alert("A306에 오신 것을 환영합니다!");
          // 입장 후 들어가야할 채널 코드 (수정해야 함)
          navigate("/Login");
        }
      })
      .catch((error) => {
        alert("다시 시도해 주세요.");
        console.log(error.message);
      });
  };

  // 닉네임
  const onChangeNickName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const nickNameRegex = /^[ㄱ-ㅎ|가-힣|a-z]+$/; // 한글, 영어소문자만
      const nickNameCurrent = e.target.value;
      setNickName(nickNameCurrent);
      // 닉네임 변경시 중복체크 다시하도록 false로 상태 변경
      setUsableNickName(false);

      if (
        nickNameCurrent.length < 6 ||
        nickNameCurrent.length > 12 ||
        !nickNameRegex.test(nickNameCurrent)
      ) {
        setNickNameError("공백 없이 6~12자 영소문자와 한글만 가능합니다.");
        setIsNickName(false);
      } else {
        setNickNameError("올바른 이름 형식입니다!");
        setIsNickName(true);
      }
    },
    []
  );

  // 닉네임 중복확인
  const nickNameCheck = (e: any) => {
    e.preventDefault();
    if (isNickName) {
      axios
        .post(`${BE_URL}/주소넣기`, {
          nickname: nickName,
        })
        .then((response) => {
          {
            alert("사용가능한 닉네임입니다.");
            setUsableNickName(true);
          }
        })
        .catch((error) => {
          alert("중복된 닉네임입니다.");
        });
    } else {
      alert("6~12자 영소문자와 한글로 된 닉네임만 사용 가능합니다.");
    }
  };

  return (
    <Container>
      <Wrapper>
        <ThemeProvider theme={themeA306}>
          <InvitePageForm>
            <InvitePageHead>Brand</InvitePageHead>
            
            <InvitePageMsg>ooo 님의 방에 입장하시겠습니까? : )</InvitePageMsg>

            <InvitePageInput>
              <FormControl variant="standard" fullWidth>
                <InputLabel htmlFor="component-helper" shrink>
                  Nick Name
                </InputLabel>
                <Input
                  id="component-helper-nickname"
                  placeholder="닉네임을 입력해 주세요."
                  // value={nickName}
                  onChange={onChangeNickName}
                  required
                  aria-describedby="component-helper-text"
                />
              </FormControl>
              <NickNameButton onClick={nickNameCheck}>
                닉네임 중복체크
              </NickNameButton>

              {nickName.length > 0 && (
                <div className={`${isNickName ? "success" : "error"}`}>
                  {nickNameError}
                </div>
              )}
            </InvitePageInput>

            <InvitePageInput onClick={onEnter}>
              <Button
                type="submit"
                variant="contained"
                size="medium"
                fullWidth
                disabled={!(isNickName && usableNickName)}
              >
                채널 입장하기
              </Button>
              <div>{!usableNickName ? "닉네임 중복체크를 해주세요" : ""}</div>
            </InvitePageInput>
          </InvitePageForm>
        </ThemeProvider>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  // position: sticky;
  // align-self: center;
  // top: 0;
  // left: 0;
  // height: 60px;
  // width: 100%;
  // // padding:150px 0;
  // background-color: #D7D7D7;
`;

const Wrapper = styled.div`
  display: flex;
  // align-items: center;
  // text-align: center;
  // background-color: #D7D7D7;
  justify-content: center;
  // z-index: 5;
`;

const InvitePageHead = styled.h1`
  color: #000000;
  margin: 40px;
`;

const InvitePageMsg = styled.h5`
  color: #000000;
  margin: 40px;
  font-size: 16px;
`;

const InvitePageForm = styled.div`
  // display: flex;
  // flex-direction: column;
  // align-items: right;
  width: 500px;
  display: inline-block;
  // position: absolute;
`;

const InvitePageInput = styled.div`
  // display: flex;
  // flex-direction: column;
  // width: 500px;
  // text-align: center;
  // align-items: center;
  margin: 15px 0px;
`;

const InvitePageButton = styled.button`
  height: 40px;
  margin-bottom: 24px;
  border: none;
  border-radius: 0.25rem;
  box-sizing: border-box;
  background-color: #3396f4;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  transition: background-color 0.08s ease-in-out;
  cursor: pointer;
  &:hover {
    background-color: #2878c3;
  }
  @media (max-width: 575px) {
    font-size: 15px;
  }
`;

const NickNameButton = styled.button`
  height: 40px;
  margin-bottom: 24px;
  border: none;
  border-radius: 0.25rem;
  box-sizing: border-box;
  background-color: #39a2db;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  transition: background-color 0.08s ease-in-out;
  cursor: pointer;
  &:hover {
    background-color: #2878c3;
  }
  @media (max-width: 100px) {
    font-size: 15px;
  }
`;

// const InvitePageMsg = styled.div`
//   text-decoration: none;
//   font-size: 14px;
//   font-weight: bold;
// `;

export default InvitePage;
