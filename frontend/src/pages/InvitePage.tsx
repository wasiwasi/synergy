import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import Header from "../components/common/Header";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { useState, useCallback } from "react";

import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Button from "@mui/material/Button";

import TextField from "@mui/material/TextField";
import "./Signup.css";

import { createTheme, ThemeProvider } from "@mui/material/styles";

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
    const [nickName, setNickName] = useState<string>("");
    const [nickNameError, setNickNameError] = useState<string>("");
    const [isNickName, setIsNickName] = useState<boolean>(false);
    const [usableNickName, setUsableNickName] = useState<boolean>(false);

    // 채널 입장 버튼 클릭
  const onEnter = () => {
    axios
      .post(
        "https://i7a306.p.ssafy.io:8080/주소넣기",
        {
          nickname: nickName,
        }
      )
      .then((res) => {
        console.log("response:", res);
        {
          console.log(res.status);
        
          // 채널로 입장하게 함
          // 코드 넣기
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
        .post("https://i7a306.p.ssafy.io:8080/주소넣기", {
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
              <InviteForm>
                <InviteHead>Brand</InviteHead>

                <InvitePageMsg>
                000님의 방에 입장하시겠습니까?
               </InvitePageMsg>
                
    
                <InviteInput>
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
                </InviteInput>
                
    
                
                <InviteInput onClick={onEnter}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="medium"
                    fullWidth
                    // && usableNickName && usableEmail 추가하기
                    disabled={
                      !(
                        isNickName &&
                        usableNickName
                      )
                    }
                  >
                    회원 가입
                  </Button>
                  <div>{!usableNickName ? "닉네임 중복체크를 해주세요" : ""}</div>
                </InviteInput>
              </InviteForm>
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
    
    const InviteHead = styled.h1`
      color: #000000;
      margin: 40px;
    `;
    
    
    const InviteForm = styled.div`
      // display: flex;
      // flex-direction: column;
      // align-items: right;
      width: 500px;
      display: inline-block;
      // position: absolute;
    `;
    
    const InviteInput = styled.div`
      // display: flex;
      // flex-direction: column;
      // width: 500px;
      // text-align: center;
      // align-items: center;
      margin: 15px 0px;
    `;
    
    const EnterButton = styled.button`
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
    

export default InvitePage;