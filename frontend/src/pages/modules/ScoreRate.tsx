// import { log } from "console";

import styled from "@emotion/styled";
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
  width: "40%",
  height: "75%",
  bgcolor: "white",
  border: "2px solid #000",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

function ScoreRate(props: {
  score: number[];
  examiners: string[];
  channelId: string;
}) {
  const [participantList, setParticipantList] = useState({});
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [orderList, setOrderList] = useState([
    {
      idx: 1,
      nickname: "",
    },
  ]);

  const getParticipantList = (channelId: string) => {
    axios.get(`${BE_URL}/api/channels/info/${channelId}`).then((res) => {
      let temp = res.data.participantList;
      let map = new Map();
      temp.map((object: { nickName: ""; channelId: ""; connectionId: "" }) => {
        map.set(object.connectionId, object.nickName);
      });
      setParticipantList(map);
      // console.log(participantList.get("con_FJoEpZK8GU"));
    });
  };

  useEffect(() => {
    getParticipantList(props.channelId);
    getorder();
  }, []);

  let examinerList = props.examiners;

  const getorder = () => {
    examinerList.map((val: string, index) => {
      let c = [...orderList];
      console.log(val);
      // console.log(participantList[val]);

      c.push({ idx: index, nickname: "" });
      setOrderList(c);
    });
    console.log(orderList);
  };
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

  let scoreList = props.score;
  let index = 0;

  let dic: { [index: number]: number } = {};
  scoreList.map(function (num) {
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
                  {/* <TableCell align="right">{examinerList[{val.index}]}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <List>
          {result.map((val, idx) => (
            <li key={idx}>
              <ul>
                
                < readOnly value={idx + 1} />
                <Input readOnly value={val.score} />
              </ul>
            </li>
          ))}
        </List> */}
      </Modal>
    </Container>
  );
}

const Container = styled.div``;
export default ScoreRate;
