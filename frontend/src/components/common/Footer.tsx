import React, { useState } from 'react';
import { Link, Route, BrowserRouter } from "react-router-dom";


/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';



const Footer = () => {
  return (
    <Container>
      <Wrapper>
        <BrandWrapper>
          <Brand to="/">
            <Logo>
              <LogoImg
                src="/images/common/logo_A306.png"
                alt="A306 logo img"
              />
            <LogoName>A306</LogoName>
            </Logo>
          </Brand>
        </BrandWrapper>
        <Line></Line>
        <HeadMsg>문의 및 고객센터</HeadMsg>
        <ServiceMsg>
          1:1 라이브챗<br />
          Email: A306@gmail.com<br />
          운영 시간 : 오전 9시 ~ 오후 6시 (주말 및 공휴일 휴무)
        </ServiceMsg>
      </Wrapper>
    </Container>
  )
}

const Container = styled.footer`
  // position: sticky;
  // align-self: center;
  // top: 0;
  // left: 0;
  // height: 100px;
  // width: 100%;
  // padding:150px 0;
  // background-color: #39A2DB;
  // height: 100px;
  margin-top: auto;
  
`;

const Wrapper = styled.div`
  // position: static;
  padding: 10px;
  height: inherit;
  // top: 0;
  // left: 0;
  // text-align: center;
  // align-self: center;
  // width: 100%;
  // padding:px 3px;
  // background-color: #13192f;
  // z-index: 3;
  // display: flex;
  // justify-content: space-between;
  align-self: center;
  
`;

const BrandWrapper = styled.div`
  // position: relative;
  // margin: 100px 100px
  align-items: center;
  display: flex;
  // align-text: center;
  align-self: center;
  
`;

const Brand = styled(Link)`
  // position: absolute;
  // display: flex;
  text-decoration: none;
  
`;

const Logo = styled.div`
  // position: absolute; 
  display: flex;
  
`;

const LogoImg = styled.img`
  width: 30px;
  height: 30px;
  // margin: 0 auto;
  margin-left: 20px;
  margin-right: 10px;
  
`;

const LogoName = styled.span`
  margin-left: 6px;
  // padding-top: 1px;
  font-size: 20px;
  font-weight: 700;
  // align-items: center;
  // align-self: center;
  display: flex;
  color: #000;
  
  
  &:hover {
    color: #000;
  }

`;

const Line = styled.div`
  border-bottom: 1px solid;
  border-color: #D7D7D7;
  margin: 15px 25px;
  // opacity: 0.5;
`

const HeadMsg = styled.div`
  // border-bottom: 1px solid;
  margin: 0px 25px;
  text-align: left;
  font-size: 17px;
  font-weight: 700;
`
const ServiceMsg = styled.div`
  // border-bottom: 1px solid;
  margin: 5px 25px;
  text-align: left;
  font-size: 14px;
`

export default Footer
