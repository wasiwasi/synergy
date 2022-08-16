import Header from "../components/common/Header";
import { Link, Outlet } from "react-router-dom";
import axios from "axios";

import React, { useEffect, useState } from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";

import Button from "@mui/material/Button";

import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useNavigate } from "react-router";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { constants } from "buffer";

import Grid from "@mui/material/Grid"; // Grid version 1

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import Swal from "sweetalert2";
import { Label } from "@mui/icons-material";
import ScoreRate from "./modules/ScoreRate";
import { Table, TableCell } from "@mui/material";

const BE_URL = process.env.REACT_APP_BACKEND_URL;

const themeA306 = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: "#39A2DB",
      contrastText: "#ffffff",
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#769FCD",
    },
  },
});

const Mypage = () => {
  const colums: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
    },
    { field: "title", headerName: "Title", width: 150 },
    {
      field: "removeSubject",

      headerName: "remove ",
      renderCell: (cellValues) => {
        // return console.log(cellValues);

        const id = cellValues.row.id;
        return <Button onClick={() => removeSubject(id)}>remove</Button>;
      },
    },
  ];
  const [mypage, setMypage] = useState<any[]>([
    [{ id: "", title: "" }],
    "",
    "",
  ]);

  const [subjectSet, setSubjectSet] = useState<any>([
    {
      subjectName: "",
      gameTitle: "",
      bodytalkList: [],
    },
  ]);
  const [gameTitle, setGameTitle] = useState("");
  const [wordList, setWordList] = useState([{ id: 1, word: "" }]);


  const handletWordAdd = () => {
    let list = [...wordList];
    let len = list.length + 1;
    list.push({ id: len, word: "" });
    setWordList(list);
  };
  const handleWordRemove = (id: Number) => {
    let list = [...wordList];
    let newlist = list.filter((w) => w.id !== id);

    setWordList(newlist);
  };
  const handleWordChange =
    (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      // const idx = wordList.findIndex((w) => w.word === word);
      let list = [...wordList] as any;
      const idx = wordList.findIndex((w) => w.id === id);
      const { name, value } = event.target;
      list[idx][name] = value;
      setWordList(list);
    };

  const handleSubjectName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sj = {
      subjectName: event.target.value,
      gameTitle: "",
      bodytalkList: [],
    };
    setSubjectSet(sj);
  };

  const navigate = useNavigate();

  const onUserDelete = () => {
    let token = localStorage.getItem("access-token");

    Swal.fire({
      title: "정말 탈퇴하시겠습니까?",
      text: "탈퇴하면 되돌릴 수 없습니다",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "취소하기",
      confirmButtonText: "예, 탈퇴 하겠습니다",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${BE_URL}/users`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            localStorage.removeItem("access-token");
            Swal.fire("탈퇴성공!", "success");
            navigate("/");
          });
      }
    });
  };

  const createSubject = () => {
    const st = subjectSet.subjectName;
    // const gameTitle = "bodytalk";
    let wordSet = [...wordList];
    let bodyTalk = subjectSet.bodytalkList;
    wordSet.map((word, idx) => {
      bodyTalk.push(word.word);
    });

    const sj = {
      subjectName: st,
      gameTitle: gameTitle,
      bodytalkList: bodyTalk,
    };

    setSubjectSet(sj);

    let token = localStorage.getItem("access-token");
    axios
      .post(
        `${BE_URL}/subjects/create`,
        {
          subjectName: subjectSet.subjectName,
          gameTitle: gameTitle,
          bodytalkList: subjectSet.bodytalkList,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setSubjectSet({
          subjectName: "",
          gameTitle: "",
          bodytalkList: [],
        });
        setWordList([]);
        getMypage();
        setDialogOpen(false);
      });

    setDialogOpen(false);
  };

  const getMypage = () => {

    let token = localStorage.getItem("access-token");
    axios
      .get(`${BE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const copy = [...mypage];
        copy[0] = [];
        res.data.data.map((d: any, i: any) =>
          copy[0].push({ id: d.subject_set_id, title: d.subject_name })
        );

        copy[1] = res.data.userNickName;
        copy[2] = res.data.userEmail;

        setMypage(copy);
      });
  };

  const removeSubject = (id: number) => {
    let token = localStorage.getItem("access-token");

    Swal.fire({
      title: `${id} 번 문제집을 정말 삭제하시겠습니까?`,
      text: "문제집을 한번 삭제하면 취소 할 수 없습니다!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "예 삭제하겠습니다",
      cancelButtonText: "취소하기",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${BE_URL}/subjects/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            getMypage();
          });
        Swal.fire("Deleted!", "문제집이 삭제되었습니다.", "success");
      }
    });

    //삭제 로직 추가하기 -- 0813 ming
  };

  useEffect(() => {
    getMypage();
  }, []);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setWordList([{ id: 1, word: "" }]);
    setDialogOpen(false);
  };
  const handleGameTitle = (event: SelectChangeEvent) => {
    setGameTitle(event.target.value);
  };

  const handelDelteAllSubject = () => {
    let token = localStorage.getItem("access-token");
    Swal.fire({
      title: "모든 문제집을 삭제하시겠습니까?",
      text: "한번 삭제한 문제집들은 복구가 불가능합니다",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "예, 전부 삭제합니다",
      cancelButtonText: "취소하기",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${BE_URL}/subjects`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            getMypage();
          });
        Swal.fire("Deleted!", "전부다 삭제하였습니다!", "success");
      }
    });
  };

  const addWordByEnter =(e:any)=>{
    if(e.key==="Enter"){
    let list = [...wordList];
    let len = list.length + 1;
    list.push({ id: len, word: "" });
    setWordList(list);
    }
  }
  // const [marks, setMarks] = useState("100, 200, 10, 1");
    
  //   const [examiners, setExaminers] = useState(
  //     "con_SJsKJY0dxR,con_OZeqyIkRTK,con_RRGCKKWCdp,con_F7nsBnj8fq"
  //   );

  // constMypage HomePage: React.FC = () => {
  return (
    <Container>
      <Wrapper>
        <ThemeProvider theme={themeA306}>
          <ProfileForm>
            {/* <ProfileHead>{mypage}</ProfileHead> */}
            <ProfileHead>{mypage[1]} 님의 마이페이지입니다</ProfileHead>

            <ProfileInput>
              <InputLabel htmlFor="component-helper" shrink>
                Email
              </InputLabel>
              <Input
                id="component-helper-email"
                value={mypage[2]}
                inputProps={{
                  readOnly: true,
                }}
                sx={{
                  minWidth: 250,
                }}
                aria-describedby="component-helper-text"
              />
            </ProfileInput>
            <ProfileInput>
              <InputLabel htmlFor="component-helper" shrink>
                NickName
              </InputLabel>
              <Input
                id="component-helper-email"
                value={mypage[1]}
                inputProps={{
                  readOnly: true,
                }}
                sx={{
                  minWidth: 250,
                }}
                aria-describedby="component-helper-text"
              />
            </ProfileInput>
            <br />
            <Grid container spacing={2}>
              <Grid item sm={4}>
                <Button
                  variant="contained"
                  size="medium"
                  fullWidth
                  onClick={onUserDelete}
                >
                  회원 탈퇴
                </Button>
              </Grid>

              <Grid item sm={4}>
                <Button
                  variant="contained"
                  size="medium"
                  fullWidth
                  onClick={handleClickOpen}
                >
                  문제집 생성
                </Button>
              </Grid>
              <Grid item sm={4}>
                <Button
                  variant="contained"
                  size="medium"
                  fullWidth
                  onClick={handelDelteAllSubject}
                >
                  문제집 전부 삭제
                </Button>
              </Grid>
            </Grid>
            <br />
            <Box
              sx={{ width: "100%", height: 400, bgcolor: "background.paper" }}
            >
              <SubjectDialog open={dialogOpen} onClose={handleClose}>
                <SubjectDialogTitle>
                  <Title>
                  문제집 작성하기
                  </Title></SubjectDialogTitle>
                <SubjectDialogContent>
                  <SubjectDialogContentText>
                    원하는 문제를 작성하세요.
                  </SubjectDialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="subjectTitle"
                    label="subjectTitle"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={handleSubjectName}
                  />
                  <FormControl 
                  // sx={{ m: 1, minWidth: 150 }}
                  >
                    <InputLabel>GameTitle</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple"
                      label="GameTitle"
                      value={gameTitle}
                      onChange={handleGameTitle}
                    >
                      <MenuItem value={"bodytalk"}>몸으로 말해요</MenuItem>
                      <MenuItem disabled value={"goldenball"}>
                        골든벨
                      </MenuItem>
                      <MenuItem disabled value={"goldenball"}>
                        라이어게임
                      </MenuItem>
                      <MenuItem disabled value={"goldenball"}>
                        고요속의 외침
                      </MenuItem>
                    </Select>
                  </FormControl>

                  {wordList.map((singleWord, idx) => (
                    <div key={singleWord.id}>
                      <Grid container spacing={1}>
                        <Grid item xs={8} >
                          <Input
                            name="word"
                            id="word"
                            required
                            onChange={handleWordChange(singleWord.id)}
                            fullWidth
                            onKeyPress={addWordByEnter}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          {wordList.length > 1 && (
                            <SubjectButton
                              onClick={() => handleWordRemove(singleWord.id)}
                            >
                              delete
                            </SubjectButton>
                          )}
                        </Grid>
                      </Grid>
                      <br />

                      {wordList.length - 1 === idx && wordList.length < 30 && (
                        <SubjectButton onClick={handletWordAdd}>add word</SubjectButton>
                      )}
                    </div>
                  ))}
                <DialogActions>
                  <SubjectButton onClick={handleClose}>취소하기</SubjectButton>
                  <SubjectButton onClick={createSubject}>생성하기</SubjectButton>
                </DialogActions>

                </SubjectDialogContent>
              </SubjectDialog>
              {mypage[0].length === 0 ? (
                <Input
                  value="내가 만든 문제집이없습니다! 생성해주세요!"
                  readOnly
                  fullWidth
                />
              ) : (
                <DataGrid
                  rows={mypage[0]}
                  columns={colums}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                />
              )}
            </Box>
          </ProfileForm>
        </ThemeProvider>
        {/* <ScoreRate mark={marks} examiners={examiners} channelId="CC1488" /> */}
      </Wrapper>
    </Container>
  );
};
const Container = styled.div``;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ProfileHead = styled.h3`
  color: #000000;
  margin: 40px;
`;

const ProfileForm = styled.div`
  width: 500px;
  display: inline-block;
`;

const ProfileInput = styled.div`
  margin: 15px 0px;
`;

const SubjectDialogContent = styled(DialogContent)`
  display: flex;
  color: white;
  flex-direction: column;
  background-color: rgba(106, 96, 169, 0.5);
`;

const SubjectDialogContentText = styled(DialogContentText)`

  color:white

`;

// modal
const SubjectDialog = styled(Dialog)`
  & .MuiPaper-rounded {
    border-radius: 15px;
  }
`;

const SubjectDialogTitle = styled(DialogTitle)`
  display: flex;
  justify-content: center;
  background-color: rgba(106, 96, 169, 0.5);
  padding-bottom: 0;
  & > .MuiTypography-root {
    display: flex;
    align-items: center;
  }
`;

const Title = styled.p`
  font-weight: bold;
  font-size: 2rem;
  color: white;
  margin-bottom: 40px;
`;

const SubjectButton = styled(Button)`
&.MuiButton-text{
  color:white
}
`


const SubjectDialogActions = styled(DialogActions)`
  flex-direction: row;
`;


export default Mypage;
