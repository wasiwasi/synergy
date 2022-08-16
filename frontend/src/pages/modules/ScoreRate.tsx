// import { log } from "console";

import styled from "@emotion/styled";
import { Preview } from "@mui/icons-material";
import {
  Button,
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
      <Modal open={open} onClose={handleClose}>
        <TableContainer component={Paper}>
          <Table sx={style} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>등수</TableCell>
                <TableCell>점수</TableCell>
                <TableCell>이름</TableCell>
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
      </Modal>
    </Container>
  );
}

const Container = styled.div``;
export default ScoreRate;
