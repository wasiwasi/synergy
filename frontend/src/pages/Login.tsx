import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import Header from '../components/common/Header';
import { Link, Outlet } from 'react-router-dom';


/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';


import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';

import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Button from '@mui/material/Button';

import { createTheme, ThemeProvider } from '@mui/material/styles';

axios.defaults.baseURL = "https://www.abc.com";
axios.defaults.withCredentials = true;

const themeA306 = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
			main: '#39A2DB',
			contrastText: '#ffffff',
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#769FCD',
    },
  },
});




interface State {
  amount: string;
  password: string;
  weight: string;
  weightRange: string;
  showPassword: boolean;
}

// const onLogin = (string: amount, password) => {
// 	const data = {
// 		amount,
// 		password,
// 	};
// 	axios.post('/login', data).then(response => {
// 		const { accessToken } = response.data;

// 		// API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
// 		axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

// 		// accessToken을 localStorage, cookie 등에 저장하지 않는다!

// 	}).catch(error => {
// 		// ... 에러 처리
// 	});
// }

const Login = () => {

	const [values, setValues] = React.useState<State>({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
	});
	


// const HomePage: React.FC = () => {
	const [name, setName] = React.useState('Composed TextField');

	// 텍스트 필드가 바뀔때 마다 동작
  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
		console.log(event.target.value);
	};

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

	// 패스워드 보기 버튼이 눌릴때마다 동작
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
		});
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
	
  return (
			<Container>
				<Wrapper>
				<ThemeProvider theme={themeA306}>
					<LoginForm>
						<LoginHead>A306</LoginHead>
						<LoginMsg>A306에 오신것을 환영합니다.</LoginMsg>

						<LoginInput>
							<FormControl variant="standard" fullWidth>
								<InputLabel htmlFor="component-helper" shrink>Email</InputLabel>
								<Input
									id="component-helper"
									placeholder="이메일을 입력해 주세요."
									onChange={handleChangeEmail}
									aria-describedby="component-helper-text"
								/>
							</FormControl>
						</LoginInput>

						<LoginInput>
							<FormControl variant="standard" fullWidth>
								<InputLabel htmlFor="standard-adornment-password" shrink>
									Password
								</InputLabel>
								<Input
									id="standard-adornment-password"
									type={values.showPassword ? 'text' : 'password'}
									value={values.password}
									placeholder="비밀번호를 입력해 주세요."
									onChange={handleChange('password')}
									required
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPassword}
												onMouseDown={handleMouseDownPassword}
											>
												{values.showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									}
								/>
							</FormControl>
						</LoginInput>
						
							<LoginInput>
							<Button variant="contained" size="medium" fullWidth>
								Login
							</Button>
							</LoginInput>

						<LinkFindPassword to="/signup">비밀번호를 잊으셨나요?</LinkFindPassword>
						<SignupMsg>
							계정이 없으신가요?
							<LinkSignup to="/signup"> 가입하기</LinkSignup>
						</SignupMsg>

						



						</LoginForm>
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

const LoginHead = styled.h1`
	color: #000000;
  margin: 40px;
`;

const LoginMsg = styled.h5`
	color: #000000;
  margin: 40px;
  font-size: 16px
`;

const LoginForm = styled.div`
  // display: flex;
  // flex-direction: column;
	// align-items: right;
	width: 500px;
	display: inline-block;
	// position: absolute;
	
`;

const LoginInput = styled.div`
  // display: flex;
  // flex-direction: column;
	// width: 500px;
	// text-align: center;
	// align-items: center;
  margin: 15px 0px;
`;

const LoginButton = styled.button`
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

const LinkFindPassword = styled(Link)`
  // position: absolute;
  display: block;
	text-decoration: none;
  margin: 10px;
  // padding: 4px 8px;
  font-size: 13px;
  // font-weight: 500;
  // line-height: 1.6;
  color: #769FCD;
  // transition: color 0.08s ease-in-out;

  // &:hover {
  //   color: #fff;
  // }

  
  // display: block;
  // margin: auto;
  // margin-bottom: 8px;
  // padding: 12px;
  // color: #000000;
  // text-decoration: none;
  // font-size: 16px;
  // // align-self: center;
  // font-weight: 600;

  // &:hover {
  //   color: #000000;
  // }
`;

const SignupMsg = styled.div`
	text-decoration: none;
  font-size: 14px;
  font-weight: bold;
  
`;

const LinkSignup = styled(Link)`
	text-decoration: none;
  color: #39A2DB;
`;

// const LoginInput = styled.div`
//   // display: flex;
//   // flex-direction: column;
// 	width: 500px;
// 	// text-align: center;
// 	// align-items: center;
// `;

export default Login;
