/* eslint-disable */
// import BasicSelect from '../components/common/Select';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios'

import { useCallback, useEffect, useState } from 'react';
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

const steps = [
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

export const accessToken = localStorage.getItem("access-token");

function SwipeableTextMobileStepper() {
  const [selectData, setSelectData] = useState([
    [],
    ['5', '10', '15', '20'],
  ])
  const [category, setCategory] = useState('')
  const [round, setRound] = useState('')
  useEffect(()=> {
    axios.get("https://i7a306.p.ssafy.io:8080/subjects", {
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
    }).then((res)=>{
      const copy = [...selectData]
      res.data.data.map((d:any, i:any)=> (
        copy[0].push(d.subject_name)
      ))
      console.log(res.data.data)
      setSelectData(copy)
    })
  }, [])

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
    handleNext()
  }

  const back = () => {
    let copy: string[] = [...info]
    copy.pop()
    setInfo(copy)
    handleBack()
  }

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
              setInfo = {setInfo}
              selectData = {selectData}
              setSelectData = {setSelectData}
              category = {category}
              round = {round}
              setCategory = {setCategory}
              setRound = {setRound}
              />
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
    </Box>
  );
}

export default SwipeableTextMobileStepper;

function BasicSelect(props: any) {
  const [category, setCategory] = useState(`${props.selectData[props.index][0]}`);

  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
    if (props.index == 0) {
      props.setCategory(category)
    }
    else {
      props.setRound(category)
    }
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
          {props.selectData[props.index].map((d: any, i: any)=> (
            <MenuItem key={i} value={d}>{d}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}