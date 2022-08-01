/* eslint-disable */
import Header from '../components/common/Header';
import MultipleSelect from '../components/common/Select';
import { Link, Outlet } from 'react-router-dom';

import * as React from 'react';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

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
    choice: ['카테고리', '라운드']
  },
];

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

  const handleStepChange = (step: number) => {
    setActiveStep(step);
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

  const create = () => {

  }

  return (
    <Box sx={{ flexGrow: 1, 
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'center',
               alignItems: 'center',
               width: '100%'}}>
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
        }}>{steps[activeStep].label}</Typography>
      </Paper>
      <div style={{ 
        display: 'inline',
        width: 1100
     }}>
        {steps.map((step, index) => (
          <div key={index} style={{ display: 'inline-block', width:400}}>

            <Button
              color='primary'
              onClick={()=>{
                activeStep < maxSteps - 1 ?  choice(steps[activeStep].choice[index]) : undefined
                }}
              sx={{
                height: 300,
                margin: 4,
                display: 'inline-block',
                width: 400,
              }}
            >
              {steps[activeStep].choice[index]}
            </Button>
          </div>
        ))}
      </div>
      <MobileStepper
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: 400

        }}
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Link to="/channel/gamechannel" style={{ textDecoration: 'inherit'}}>
            <Button
              size="small"
              // onClick={()=> {데이터 서버로 전송}}
              disabled={activeStep != maxSteps - 1}
            >
              게임 생성
              {theme.direction === 'rtl' ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          </Link>
        }
        backButton={
          <Button size="small" onClick={back} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
    </Box>
  );
}

export default SwipeableTextMobileStepper;
