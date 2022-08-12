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
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2

import Swal from "sweetalert2";

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
  const handleWordChange = (
    id: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
            Swal.fire("탈퇴성공!", "Your file has been deleted.", "success");
            navigate("/");
          });
      }
    });
  };

  const createSubject = () => {
    const st = subjectSet.subjectName;
    const gameTitle = "bodytalk";
    let wordSet = [...wordList];
    let bodyTalk = subjectSet.bodytalkList;
    wordSet.map((word, idx) => {
      bodyTalk.push(word.word);
    });

    const sj = {
      subjectName: st,
      gameTitle: "bodytalk",
      bodytalkList: bodyTalk,
    };

    setSubjectSet(sj);

    let token = localStorage.getItem("access-token");
    axios
      .post(
        `${BE_URL}/subjects/create`,
        {
          subjectName: subjectSet.subjectName,
          gameTitle: "bodytalk",
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
                aria-describedby="component-helper-text"
              />
            </ProfileInput>
            <br />
            <Grid container spacing={3}>
              <Grid xs={4}>
                <Button
                  variant="contained"
                  size="medium"
                  fullWidth
                  onClick={onUserDelete}
                >
                  회원 탈퇴
                </Button>
              </Grid>

              <Grid xs={4}>
                <Button
                  variant="contained"
                  size="medium"
                  fullWidth
                  onClick={handleClickOpen}
                >
                  문제집 생성하기
                </Button>
              </Grid>
              <Grid xs={4}>
                <Button
                  variant="contained"
                  size="medium"
                  fullWidth
                  onClick={handelDelteAllSubject}
                >
                  문제집 전부 삭제하기
                </Button>
              </Grid>
            </Grid>
            <br />
            <Box
              sx={{ width: "100%", height: 400, bgcolor: "background.paper" }}
            >
              <Dialog open={dialogOpen} onClose={handleClose}>
                <DialogTitle>문제집 작성하기</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    원하는 문제를 작성하세요.
                  </DialogContentText>
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
                  {wordList.map((singleWord, idx) => (
                    <div key={singleWord.id}>
                      <input
                        name="word"
                        id="word"
                        required
                        onChange={(e) => handleWordChange(singleWord.id, e)}
                      />

                      {wordList.length > 1 && (
                        <Button onClick={() => handleWordRemove(singleWord.id)}>
                          delete
                        </Button>
                      )}
                      <br />
                      {wordList.length - 1 === idx && wordList.length < 30 && (
                        <Button onClick={handletWordAdd}>add word</Button>
                      )}
                    </div>
                  ))}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>취소하기</Button>
                  <Button onClick={createSubject}>생성하기</Button>
                </DialogActions>
              </Dialog>
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

const LoginMsg = styled.h5`
  color: #000000;
  margin: 40px;
  font-size: 16px;
`;

const ProfileForm = styled.div`
  width: 500px;
  display: inline-block;
`;

const ProfileInput = styled.div`
  margin: 15px 0px;
`;

export default Mypage;
