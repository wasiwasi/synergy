import React from "react";
import HomeProductLayout from "./HomeProudctLayOut";
import img from "../images/homeImage.png";
import { Button, Container, Link, Typography } from "@mui/material";
import {   useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import blue from "@mui/material/colors/blue";

const theme = createTheme({
  palette: {
    primary: {
      main: "#90caf9",
    },
  },
});

const HomeProduct = () => {


  const navigate = useNavigate();
  const handleClick =()=>{
    navigate('/channel/createchannel');
  }

  return (
    <ThemeProvider theme={theme}>
      <HomeProductLayout
        sxBackground={{
          backgroundImage: `url(${img})`,
          backgroundColor: "rgb(200,232,228)",
          backgroundPosition: "center",
        }}
      >
        <img style={{ display: "none" }} src={img} alt="increase priority" />
        <Typography color="inherit" align="center" variant="h1">
          <div>Synergy</div>
        </Typography>
        <Typography
          color="inherit"
          align="center"
          variant="h3"
          sx={{ mb: 4, mt: { sx: 4, sm: 10 } }}
        >
          <br></br>
          <div>우리함께 즐겨봐요!</div>
        </Typography>
        {/* <Link to="/meeting-main" style={{ textDecoration: "none" }}> */}
        <Button
          color="primary"
          variant="contained"
          size="large"
          sx={{ minWidth: 200 }}
          onClick={handleClick}
        >
          <div>아이스 브레이킹~</div>
        </Button>
        {/* </Link> */}

        <Typography variant="body2" color="inherit" sx={{ mt: 2 }}></Typography>
        <Container></Container>
      </HomeProductLayout>
    </ThemeProvider>
  );
};

export default HomeProduct;
