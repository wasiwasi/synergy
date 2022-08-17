import { Link, Outlet } from 'react-router-dom';
import { bgcolor, Box, display, flexbox, height, width } from '@mui/system';
import { Paper, Button, Modal, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { useState } from 'react';
import{ Brand, Logo, LogoImg, LogoName, BrandWrapper } from '../components/common/Header';

import styled from '@emotion/styled';

const GameChannel = () => {
  
  return (
    <Box id='full'
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 0,
      height: '100vh',
      width: '100vw'
    }}>
      <Box id='header'
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '15%'
        }}>
        <Box id='logo'
          sx={{
            width: '20%',
            height: '100%',
          }}>
          <BrandWrapper
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}>
            <Brand to="/">
              <Logo>
                <LogoImg
                  style={{
                    margin: 0
                  }}
                  src="/images/common/logo_A306.png"
                  alt="SYNERGY logo img"
                />
              <LogoName>SYNERGY</LogoName>
              </Logo>
            </Brand>
          </BrandWrapper>
        </Box>
        <Paper id='info'
          sx={{
            // position: 'sticky',
            top: 0,
            left: 0,
            right: 0,

            width: '60%',
            height: '100%',
            bgcolor: 'orange',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <h1 style={{
              color: 'white'
            }}>게임 종류</h1>
        </Paper>
        <Box id='buttons'
          sx={{
            width: '20%',
            height: '100%',
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
        }}>
          {/* {accessToken === localStorage.getItem("access-token")
          ? <Button>게임 시작</Button>
          : 'Nickname'} */}
          <BasicModal/>
        </Box>
      </Box>
      <Box id='main'
        sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '85%'
      }}>
        <Box id='conference'
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection:'column',
            width: '75%',
            height: '100%'
            }}>
          <div id='cam' 
            style={{ 
            backgroundColor: 'skyblue',
            width: '100%',
            height: '90%',
            // margin: 10
            }}>
            <h1 style={{
              color: 'white'
            }}>화면</h1>
          </div>
          <Box id='settings'
            sx={{
              backgroundColor: 'olive',
              width: '100%',
              height: '10%'
            }}>
            게임 설정
          </Box>
        </Box>
        <div id='chat' 
          style={{
          backgroundColor: 'grey',
          width: '25%',
          height: '100%'
          // margin: 10
        }}>
          채팅
        </div>
      </Box>
    </Box>
  );
};

export default GameChannel;



function BasicModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Container>
      <Button onClick={handleOpen}>게임 방법</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* <Box sx={style}> */}
          <DialogTitle>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <div>
            몸으로 말해요
            </div>
          </Typography>
          </DialogTitle>
          <DialogContent>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div>            
              1. 출제자는 몸짓으로만 제시어를 묘사합니다. <br />
            2. 참여자는 출제자의 묘사를 통해 정답을 유추합니다. <br />
            3. 참여자는 채팅으로 정답을 맞춥니다.</div>

          </Typography>
          <DialogActions>
          <Button onClick={handleClose}><span>닫기</span></Button>
          </DialogActions>

          </DialogContent>
        {/* </Box> */}
      </Dialog>
    </Container>
  );
}
const Container = styled.div``;