/* eslint-disable */
// import BasicSelect from '../components/common/Select';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios'

import { useCallback, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export const steps = [
  {
    label: '게임을 선택해주세요',
    choice: ['몸으로 말해요', '골든벨', '고요 속의 외침', '준비 중']
  },
  {
    label: '개인전/팀전을 선택해주세요',
    choice: ['개인전', '팀전']
  },
  {
    label: '카테고리와 라운드를 선택해주세요',
    choice: ['카테고리', '라운드'],
  },
];

const data = [
   ['스포츠', '음식', '영화', '드라마', '동물'],
   ['5', '10', '15', '20'],
]

function SwipeableTextMobileStepper() {
  const [info, setInfo] = useState<string[]>([]);
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const choice = (e: string) => {
    let copy: string[] = [...info]
    copy.push(e)
    setInfo(copy)
    console.log(info)
    handleNext()
  }

  const back = () => {
    let copy: string[] = [...info]
    copy.pop()
    setInfo(copy)
    handleBack()
  }

  // const postData = useCallback(()=>{

  // })

  return (
    <Box sx={{ flexGrow: 1, 
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'center',
               alignItems: 'center',
               width: '100%',
               zIndex: 0}}>
      <Paper
        square
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 50,
          pl: 2,
          bgcolor: 'background.default',
        }}
      >
        <Typography
        sx={{
          typography: 'subtitle2',
          fontSize: 'h4.fontSize',
          fontWeight: 'bold'
        }}>{steps[activeStep].label}</Typography>
      </Paper>
      <div style={{ 
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        width: 1100,
        height: 700
     }}>
        {steps[activeStep].choice.map((step, index) => (
          <div key={index}>
            {activeStep < maxSteps - 1 ?
              <Button
                // disabled={}
                onClick={()=>{
                  activeStep < maxSteps - 1 ?  choice(steps[activeStep].choice[index]) : undefined
                  }}
                sx={{
                  bgcolor: 'info.main',
                  color: 'white',
                  height: 300,
                  margin: 2,
                  marginBottom: 0,
                  fontSize: 25,
                  width: 400,
                  zIndex: 1,
                }}>
                {steps[activeStep].choice[index]}
              </Button> : 
              <BasicSelect index = { index } steps = { steps } activeStep = {activeStep}
              setInfo = {setInfo}/>
              // 
            }
          </div>
        
        ))}
      </div>
      <MobileStepper
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          maxWidth: 1000,
          width: '100%'
        }}
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          activeStep === maxSteps - 1 ? 
          <Link to="/channel/gamechannel" style={{ textDecoration: 'inherit'}}>
            <Button
              size="small"
              // onClick={()=> {데이터 서버로 전송}}
            >
              게임 생성
              {theme.direction === 'rtl' ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          </Link>
          : <Button
          size="small"
          disabled= {true}
          >
          게임 생성
          {theme.direction === 'rtl' ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </Button>
        }
        backButton={
          <Button size="small" onClick={back} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            이전
          </Button>
        }
      />
      {/* api 받아오기 */}
      {/* <button onClick={()=>{
        axios.get('api')
        .then((결과)=>{
          setAAA()
        })
        .catch(()=>{
          console.log('fail to get')
        })
      }}></button>*/} 
    </Box>
  );
}

export default SwipeableTextMobileStepper;

function BasicSelect(props: any) {
  const [category, setCategory] = useState(`${data[props.index][0]}`);

  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
    console.log(category)
  };

  return (
    <Box sx={{ minWidth: 120,
    width: 560 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{steps[2].choice[props.index]}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={category}
          label="Category"
          onChange={handleChange}
        >
          {data[props.index].map((d, i)=> (
            <MenuItem key={i} value={d}>{d}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}