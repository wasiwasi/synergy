import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import Header from "../components/common/Header";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Mypage from "../pages/Mypage";
import CreateChannel from "../pages/CreateChannel";
import GameChannel from "../pages/GameChannel";
import HomePage from "../pages/HomePage";

const Router = () => {
  // const HomePage: React.FC = () => {
  return (

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/users/mypage" element={<Mypage />} />
        <Route path="/channel/createchannel" element={<CreateChannel />} />
        <Route path="/channel/gamechannel" element={<GameChannel />} />
      </Routes>

  );
};

export default Router;




const Main = styled.main`
  min - height: calc(100vh - 180px);
`;