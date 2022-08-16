import React from "react";
import HomeProductLayout from "./HomeProudctLayOut";
import img from "../images/mafia.png";
import { Button, Container, Grid, Link, Typography } from "@mui/material";

import blue from "@mui/material/colors/blue";

const HomeProduct = () => {
  return (
    <HomeProductLayout
      sxBackground={{
        backgroundColor: "rgb(200,232,228)",
        backgroundPosition: "center",
      }}
    >
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography
              color="black"
              align="center"
              variant="h3"
              sx={{ mb: 2, mt: { sx: 4, sm: 10 } }}
            >
              비대면 술자리 이용하기
            </Typography>
            <Typography
              color="black"
              align="center"
              component="span"
              sx={{ mb: 1, mt: { sx: 2, sm: 5 } }}
            >
              <h5>
                온라인 술자리도 오프라인 술자리처럼 느낄 수 있는 공간, 사람들과
                바로 옆에 있는 듯한 느낌을 주는 우리만의 공간. 더 쉽게 어울리고
                즐겁게 술 마실 수 있는 그런 공간 말이에요. 혹은 새로운 사람들을
                만나고 싶을 때는 랜덤 입장을 이용해보세요! 새로운 사람들과
                새로운 경험을 쌓을 수 있답니다.
              </h5>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              color="black"
              align="center"
              variant="h3"
              sx={{ mb: 1, mt: { sx: 2, sm: 5 } }}
            >
              {/* 여기다 이미지박아용 */}
              <img src={img} width="300vw"></img>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </HomeProductLayout>
  );
};

export default HomeProduct;
