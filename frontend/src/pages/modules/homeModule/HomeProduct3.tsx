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
              기능2
            </Typography>
            <Typography
              color="black"
              align="center"
              // variant="h5"
              sx={{ mb: 1, mt: { sx: 2, sm: 5 } }}
            >
              <h5>기능2설명</h5>
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
