import { Link, Outlet } from 'react-router-dom';
import { bgcolor, Box, display, width } from '@mui/system';
import { Paper } from '@mui/material';

const GameChannel = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Paper
        sx={{
          position: 'sticky',
          width: 1000,
          height: 150,
          bgcolor: 'orange',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <h1 style={{
            color: 'white'
          }}>게임 종류</h1>
      </Paper>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{ 
          backgroundColor: 'skyblue',
          width: 1200,
          height: 800,
          margin: 2
          }}>
          <h1 style={{
            color: 'white'
          }}>화면</h1>
        </div>
        <div style={{
          backgroundColor: 'grey',
          width: 400,
          height: 800,
          margin: 20
        }}>
          채팅
        </div>
      </Box>
    </Box>
  );
  
};

export default GameChannel;