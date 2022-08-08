import { Link, Outlet } from 'react-router-dom';
import { bgcolor, Box, display, height, width } from '@mui/system';
import { Paper } from '@mui/material';

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
            bgcolor: 'green'
          }}>
          <h1>로고</h1>
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
            bgcolor: 'green'
        }}>
          <h1>버튼 두개</h1>
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