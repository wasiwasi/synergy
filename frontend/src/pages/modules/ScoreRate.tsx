// import { log } from "console";

import styled from "@emotion/styled";
import { Preview } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input,
  List,
  ListItem,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import React, { useEffect, useState } from "react";

const BE_URL = process.env.REACT_APP_BACKEND_URL;

interface GameResult {
  index: number;
  score: number;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  height: "75%",
  bgcolor: "white",
  border: "2px solid #000",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};
// 아래와 같은 형태로 호출해야함.
    //점수 테스트를 위한거 0815
    // const [marks, setMarks] = useState("100, 200, 10, 1");
    // 
    // const [examiners, setExaminers] = useState(
    //   "con_SJsKJY0dxR,con_OZeqyIkRTK,con_RRGCKKWCdp,con_F7nsBnj8fq"
    // );
  
    // <ScoreRate mark={marks} examiners={examiners} channelId="CC1488" />
function ScoreRate(props: {
  mark: string;
  examiners: string;
  channelId: string;
}) {
  const [participantList, setParticipantList] = useState(new Map());
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [orderList, setOrderList] = useState<string[]>([]);
  const [examinerList, setExaminerList] = useState<string[]>([]);
  const [score,setScore] =useState<number[]>([]);

  const getParticipantList = (channelId: string) => {
    axios.get(`${BE_URL}/api/channels/info/${channelId}`)
    .then((res) => {
      let temp = res.data.participantList;
        
      temp.map((object: { nickName: ""; channelId: ""; connectionId: "" }) => {
        setParticipantList((prev)=> new Map(prev).set(object.connectionId, object.nickName));
      });
    });
  };
  const getOrderList =(examinerList:string[])=>{
    let order = [...orderList];
      
    examinerList.map((val,index)=>{
        let name = participantList.get(val);
        
        order[index]=name;

  
    })
      setOrderList(order);
  }
  const setDataArray=(examiners:string, mark:string)=>{
    examiners.split(',').map((val,index)=>{
      examinerList[index] =val;
    });
    setExaminerList(examinerList);
    
    mark.split(',').map((val,index)=>{
      score[index] =Number(val);
    });
    setScore(score);
  }

  useEffect(() => {
    setDataArray(props.examiners,props.mark);
    getParticipantList(props.channelId);
  }, []);

  useEffect(()=>{
    getOrderList(examinerList);
  },[participantList])


  
  const sort = (obj: any) => {
    let items = Object.keys(obj).map(function (key) {
      return [key, obj[key]];
    });

    items.sort(function (first, second) {
      return second[1] - first[1];
    });
    let sorted_obj: GameResult[] = [];
    let idx = 0;
    items.forEach(function (val, index) {
      sorted_obj[idx] = { index: val[0], score: val[1] };
      idx++;
    });
    return sorted_obj;
  };

  // let scoreList = props.score;
  let index = 0;

  let dic: { [index: number]: number } = {};
  score.map(function (num) {
    dic[index++] = num;
  });

  let result;
  result = sort(dic);
  

  return (
    <Container>
      <Button onClick={handleOpen}>랭크 오픈</Button>
      <RankDialog
          fullWidth
          open={open}
          onClose={handleClose}
          // TransitionComponent={Transition}
          aria-labelledby="form-dialog-title"
        >
          <RankDialogTitle id="form-dialog-title">
            <Title>
            랭킹
            </Title>
          </RankDialogTitle>
          <RankDialogContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <CustomTableCell align="center"> 순위 </CustomTableCell>
                    <CustomTableCell align="center"> 닉네임 </CustomTableCell>
                    <CustomTableCell align="center"> 개수 </CustomTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.map((val, idx) => {
                    return (
                      <TableRow key={idx}>
                        <BodyTableCell
                          component="th"
                          scope="row"
                          align="center"
                        >
                          {idx + 1 === 1 && '🥇'}
                          {idx + 1 === 2 && '🥈'}
                          {idx + 1 === 3 && '🥉'}
                          {idx + 1 >= 4 && idx + 1}
                        </BodyTableCell>
                        <BodyTableCell align="center">
                          {orderList[val.index]}
                        </BodyTableCell>
                        <BodyTableCell align="center">
                          {val.score}
                        </BodyTableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <RankDialogActions>
              <CancelButton
                onClick={() => {
                  handleClose();
                }}
              />
            </RankDialogActions>
          </RankDialogContent>
        </RankDialog>
      {/* <Modal open={open} onClose={handleClose}>
        <TableContainer component={Paper}>
          <Table sx={style} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>등수</TableCell>
                <TableCell>점수</TableCell>
                <TableCell>nickname</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.map((val, idx) => (
                <TableRow
                  key={val.index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {idx + 1}
                  </TableCell>
                  <TableCell>{val.score}</TableCell>
                  <TableCell >{orderList[val.index]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Modal> */}
    </Container>
  );
}

const Container = styled.div``;

const RankDialogContent = styled(DialogContent)`
  display: flex;
  color: white;
  flex-direction: column;
  background-color: rgba(106, 96, 169, 0.5);
`;

const RankDialogContentText = styled(DialogContentText)``;

const RankDialogActions = styled(DialogActions)`
  flex-direction: row;
`;

const RankRecordContainer = styled(Table)`
  color: white;
  display: flex;
`;
// modal
const RankDialog = styled(Dialog)`
  opacity: 0.97;
  padding: 0 50px 0 100px;
  & .MuiPaper-rounded {
    border-radius: 15px;
  }
`;

const RankDialogTitle = styled(DialogTitle)`
  display: flex;
  justify-content: center;
  background-color: rgba(106, 96, 169, 0.5);
  padding-bottom: 0;
  & > .MuiTypography-root {
    display: flex;
    align-items: center;
  }
`;
const CustomTableCell = styled(TableCell)`
  font-size: 1.2rem;
`;
const CancelButton = styled(CloseIcon)`
  cursor: pointer;
  color: white;
  justify-self: flex-end;
`;
const BodyTableCell = styled(TableCell)`
  font-size: 1.5rem;
`;

const Title = styled.p`
  font-weight: bold;
  font-size: 2rem;
  color: white;
  margin-bottom: 40px;
`;

export default ScoreRate;
