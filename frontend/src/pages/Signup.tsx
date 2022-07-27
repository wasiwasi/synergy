import Header from "../components/common/Header";
import { Link, Outlet } from "react-router-dom";
import { useState, useCallback } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import './Signup.css';

const Signup = () => {
  //닉네임, 이메일, 비밀번호, 비밀번호 확인
  const [nickName, setNickName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

  //에러메시지 저장
  const [nickNameError, setNickNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordConfirmError, setPasswordConfirmError] = useState<string>("");

  // 유효성 검사
  const [isNickName, setIsNickName] = useState<boolean>(false);
  const [isEmail, setIsEmail] = useState<boolean>(false);
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState<boolean>(false);
  // const router = useRouter();

  // 닉네임, 이메일 중복 체크
  const [usableNickName, setUsableNickName] = useState<boolean>(false);
  const [usableEmail, setUsableEmail] = useState<boolean>(false);

  // 회원가입 버튼 클릭
  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        await axios
          .post(
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDxRwa2AMB8A0ngXcvVZhLCmMhfNBw6Uu8",
            {
              email: email,
              password: password,
            }
          )
          .then((res: any) => {
            console.log("response:", res);
            if (res.status === 200) {
              console.log(res.status);
              alert('이메일 인증 완료 후 로그인 해주세요 :)')
              // 로그인 페이지로 리다이렉트 코드 넣어야함!
              // router.push("/sign_up/profile_start");
            }
          });
      } catch (err) {
        console.error(err);
      }
    },
    [email, password]
  );

  // 닉네임
  const onChangeNickName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const nickNameRegex = /^[ㄱ-ㅎ|가-힣|a-z]+$/; // 한글, 영어소문자만
      const nickNameCurrent = e.target.value;
      setNickName(nickNameCurrent);

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

  // 이메일
  const onChangeEmail = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const emailRegex =
        /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      const emailCurrent = e.target.value;
      setEmail(emailCurrent);

      if (!emailRegex.test(emailCurrent)) {
        setEmailError("이메일 형식에 맞게 입력해 주세요.");
        setIsEmail(false);
      } else {
        setEmailError("올바른 이메일 형식입니다!");
        setIsEmail(true);
      }
    },
    []
  );

  // 비밀번호
  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // const passwordRegex =
      //   /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
      const passwordCurrent = e.target.value;
      setPassword(passwordCurrent);

      if (passwordCurrent.length < 8) {
        setPasswordError("비밀번호는 8자리 이상이어야 합니다.");
        setIsPassword(false);
      } else {
        setPasswordError("올바른 비밀번호 형식입니다!");
        setIsPassword(true);
      }
    },
    []
  );

  // 비밀번호 확인
  const onChangePasswordConfirm = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const passwordConfirmCurrent = e.target.value;
      setPasswordConfirm(passwordConfirmCurrent);

      if (password === passwordConfirmCurrent) {
        setPasswordConfirmError("비밀번호가 같습니다.");
        setIsPasswordConfirm(true);
      } else {
        setPasswordConfirmError("비밀번호를 다시 확인해 주세요.");
        setIsPasswordConfirm(false);
      }
    },
    [password]
  );

  // 닉네임 중복확인
  const nickNameCheck = (e: any) => {
    e.preventDefault();
    fetch("보낼주소넣기", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickName: nickName }),
    }).then((response) => {
      if (response.status === 200) {
        alert("사용가능한 닉네임입니다.");
        setUsableNickName(true);
      } else if (response.status === 409) {
        alert("중복된 닉네임입니다.");
      } else {
        alert("사용 불가능한 닉네임입니다.");
      }
    });
  };

  // 이메일 중복확인
  const emailCheck = (e: any) => {
    e.preventDefault();
    fetch("보낼주소넣기", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    }).then((response) => {
      if (response.status === 200) {
        alert("사용가능한 이메일입니다.");
        setUsableNickName(true);
      } else if (response.status === 409) {
        alert("이미 가입된 이메일입니다.");
      } else {
        alert("사용 불가능한 이메일입니다.");
      }
    });
  };

  return (
    <>
      <h1>회원 가입</h1>

      <p>이미 Brand 회원이신가요? 로그인</p>

      <form onSubmit={onSubmit}>
        <div>
          <TextField
            required
            id="nickName"
            label="Nick Name"
            placeholder="닉네임을 입력해주세요."
            variant="standard"
            onChange={onChangeNickName}
          />
          <button onClick={nickNameCheck}>닉네임 중복체크</button>
          {nickName.length > 0 && (
            <div className={`${isNickName ? "success" : "error"}`}>
              {nickNameError}
            </div>
          )}
        </div>

        <div>
          <TextField
            required
            id="email"
            label="Email"
            placeholder="이메일을 입력해주세요."
            variant="standard"
            onChange={onChangeEmail}
          />
          <button onClick={emailCheck}>이메일 중복체크</button>
          {email.length > 0 && (
            <div className={`${isEmail ? "success" : "error"}`}>
              {emailError}
            </div>
          )}
        </div>
        <div>
          <TextField
            required
            id="password"
            label="Password"
            type="password"
            placeholder="비밀번호를 입력해주세요."
            variant="standard"
            onChange={onChangePassword}
          />
          {password.length > 0 && (
            <div className={`${isPassword ? "success" : "error"}`}>
              {passwordError}
            </div>
          )}
        </div>

        <div>
          <TextField
            required
            id="passwordConfirm"
            label="Password Confirmation"
            type="password"
            placeholder="비밀번호를 다시 입력해주세요."
            variant="standard"
            onChange={onChangePasswordConfirm}
          />
          {passwordConfirm.length > 0 && (
            <div
              className={`${isPasswordConfirm ? "success" : "error"}`}
            >
              {passwordConfirmError}
            </div>
          )}
        </div>

        <button type="submit"
        disabled={!(isNickName && isEmail && isPassword && isPasswordConfirm)}>회원 가입</button>
        <p>* 등록하신 이메일을 확인하세요. 인증을 위한 메일이 전송됩니다.</p>
      </form>
    </>
  );
};

export default Signup;
