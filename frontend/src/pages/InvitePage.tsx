import React, {
  Component,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import Header from "../components/common/Header";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import VideocamIcon from "@mui/icons-material/Videocam";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import styled from "@emotion/styled";

import FormControl from "@mui/material/FormControl";
// import FormHelperText from "@mui/material/FormHelperText";
import {
  Brand,
  Logo,
  LogoImg,
  LogoName,
  BrandWrapper,
} from "../components/common/Header";
import {
  Button,
  Box,
  Input,
  InputLabel,
  Modal,
  Typography,
  Grid,
  Paper,
} from "@mui/material/";

import "./Signup.css";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  OpenVidu,
  Publisher,
  Session,
  StreamManager,
  Subscriber,
} from "openvidu-browser";
import "../components/openvidu/App.css";
import Messages from "../components/openvidu/Messages";
import UserVideoComponent from "../components/openvidu/UserVideoComponent";
import { display } from "@mui/system";
import { AddBox } from "@mui/icons-material";

const OPENVIDU_SERVER_URL = process.env.REACT_APP_OPENVIDU_SERVER_URL;
const OPENVIDU_SERVER_SECRET = process.env.REACT_APP_OPENVIDU_SERVER_SECRET;
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

interface IState {
  OV: OpenVidu | null;
  mySessionId: string;
  myUserName: string;
  session: Session | undefined;
  mainStreamManager: Publisher | undefined;
  publisher: Publisher | undefined;
  subscribers: Subscriber[];
  myConnectionId: string;
  audiostate: boolean;
  audioallowed: boolean;
  videostate: boolean;
  videoallowed: boolean;
  messages: object[];
  message: string;
}

const InvitePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // const [openviduState, setOpenviduState] = React.useState<IState>({
  //     OV: null,
  //     mySessionId: "",
  //     myUserName: "",
  //     session: undefined,
  //     mainStreamManager: undefined,
  //     publisher: undefined,
  //     subscribers: [],
  //     // user need to hold their own connection.id
  //     myConnectionId: "",

  //     // audio, video
  //     audiostate: true,
  //     audioallowed: true,
  //     videostate: true,
  //     videoallowed: true,

  //     // chatting
  //     messages: [],
  //     message: "",
  // });

  const [OV, setOV] = useState<OpenVidu | null>(null);
  const [mySessionId, setMySessionId] = useState<string | null>("");
  const [myUserName, setMyUserName] = useState<string>("");
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [mainStreamManager, setMainStreamManager] = useState<
    Publisher | undefined
  >(undefined);
  const [publisher, setPublisher] = useState<Publisher | undefined>(undefined);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  const [myConnectionId, setMyConnectionId] = useState<string>("");

  const [audiostate, setAudiostate] = useState<boolean>(true);
  const [audioallowed, setAudioallowed] = useState<boolean>(true);
  const [videostate, setVideostate] = useState<boolean>(true);
  const [videoallowed, setVideoallowed] = useState<boolean>(true);

  const [messages, setMessages] = useState<object[]>([]);
  const [message, setMessage] = useState<string>("");
  const emptyAllOV = () => {
    setOV(null);
    setSession(undefined);
    setSubscribers([]);
    setMySessionId("");
    setMyUserName("");
    setMainStreamManager(undefined);
    setPublisher(undefined);
  };
  //닉네임 확인
  const [nickName, setNickName] = useState<string>("");

  //에러메시지 저장
  const [nickNameError, setNickNameError] = useState<string>("");

  // 유효성 검사
  const [isNickName, setIsNickName] = useState<boolean>(false);

  // 닉네임 중복 체크
  const [usableNickName, setUsableNickName] = useState<boolean>(false);

  const [hostName, sethostName] = useState<string>("");
  const [hostConnectionId, setHostConnectionId] = useState<string>("");

  const didMount = useRef(false);

  // URL에서 방 코드를 가져옴
  useEffect(() => {
    const sch = location.search;
    const params = new URLSearchParams(sch);
    const channelId = params.get("channelid");
    setMySessionId(channelId);
    //호스트 닉네임을 가져옴
    axios
      .get(`${BE_URL}/api/channels/findHost/${channelId}`)
      .then((res: any) => {
        console.log(res);
        sethostName(res.data.nickName);
        setHostConnectionId(res.data.connectionId);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    // --- 2) Init a session ---
    setSession(OV?.initSession());
  }, [OV]);

  // 세션 받아오고 들어가는 로직
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    // leaveSession에는 동작하면 안됨
    if (session == null) {
      return;
    }
    var mySession = session;

    // --- 3) Specify the actions when events take place in the session ---

    // On every new Stream received...
    mySession?.on("streamCreated", (event: any) => {
      // Subscribe to the Stream to receive it. Second parameter is undefined
      // so OpenVidu doesn't create an HTML video by its own
      var subscriber = mySession?.subscribe(event.stream, "undefined");
      // Update the state with the new subscribers
      subscribers.push(subscriber);
      setSubscribers([...subscribers]);
    });

    // On every Stream destroyed...
    mySession?.on("streamDestroyed", (event: any) => {
      //호스트가 비정상 종료했다면
      if (hostConnectionId === event.stream.connection.connectionId) {
        deleteSession();
      } else {
        // Remove the stream from 'subscribers' array
        deleteSubscriber(event.stream.streamManager);
      }
    });
    // On every asynchronous exception...
    mySession?.on("exception", (exception) => {
      console.warn(exception);
    });
    mySession?.on("sessionDisconnected", (event: any) => {
      alert("서버와의 접속이 끊어졌습니다.");
      navigate("/");
    });

    // chatting
    mySession?.on("signal:chat", (event: any) => {
      let chatdata = event.data.split(",");
      // let chatdata = event.;
      console.log(chatdata);
      if (chatdata[0] !== myUserName) {
        setMessages([
          ...messages,
          {
            userName: chatdata[0],
            text: chatdata[1],
            boxClass: "messages__box--visitor",
          },
        ]);
      }
    });
    mySession?.on("sessionDisconnected", (event: any) => {
      alert("서버와의 접속이 끊어졌습니다.");
      navigate("/");
    });

    // --- 4) Connect to the session with a valid user token ---

    // 'getToken' method is simulating what your server-side should do.
    // 'token' parameter should be retrieved and returned by your own backend
    getToken().then((token) => {
      // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
      // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
      mySession
        ?.connect(String(token), { clientData: myUserName })
        .then(async () => {
          var devices = await OV?.getDevices();
          var videoDevices = devices?.filter(
            (device) => device.kind === "videoinput"
          );

          // --- 5) Get your own camera stream ---

          // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
          // element: we will manage it on our own) and with the desired properties
          let publisher = OV?.initPublisher("", {
            audioSource: undefined, // The source of audio. If undefined default microphone
            videoSource: undefined, // The source of video. If undefined default webcam
            publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
            publishVideo: true, // Whether you want to start publishing with your video enabled or not
            resolution: "640x480", // The resolution of your video
            frameRate: 30, // The frame rate of your video
            insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
            mirror: false, // Whether to mirror your local video or not
          });

          // --- 6) Publish your stream ---

          mySession?.publish(publisher as Publisher);

          // Set the main video in the page to display our webcam and store our Publisher
          setMainStreamManager(publisher);
          setPublisher(publisher);
        })
        .catch((error: any) => {
          console.log(
            "There was an error connecting to the session:",
            error.code,
            error.message
          );
        });
    });
  }, [session]);
  useEffect(() => {
    const mySession = session;
    mySession?.on("signal:chat", (event: any) => {
      let chatdata = event.data.split(",");
      // let chatdata = event.;
      if (chatdata[0] !== myUserName) {
        console.log("messages: " + messages);

        // messages.push({
        //   userName: chatdata[0],
        //   text: chatdata[1],
        //   boxClass: "messages__box--visitor",
        // });

        // setMessages([...messages]);

        setMessages([
          ...messages,
          {
            userName: chatdata[0],
            text: chatdata[1],
            boxClass: "messages__box--visitor",
          },
        ]);
      }
    });
  }, [session, messages]);

  const onEnter = async () => {
    await joinSession();
  };

  // 닉네임
  const onChangeNickName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const nickNameRegex = /^[ㄱ-ㅎ|가-힣|a-z]+$/; // 한글, 영어소문자만
      const nickNameCurrent = e.target.value;
      setNickName(nickNameCurrent);
      // 닉네임 변경시 중복체크 다시하도록 false로 상태 변경
      setUsableNickName(false);

      if (
        nickNameCurrent.length < 6 ||
        nickNameCurrent.length > 12 ||
        !nickNameRegex.test(nickNameCurrent)
      ) {
        setNickNameError("공백 없이 6~12자 영소문자와 한글만 가능합니다.");
        setIsNickName(false);
      } else {
        setNickNameError("올바른 이름 형식입니다!");
        setIsNickName(true);
      }
    },
    []
  );

  // 닉네임 중복확인
  const nickNameCheck = (e: any) => {
    e.preventDefault();
    if (isNickName) {
      axios
        .post(`${BE_URL}/api/channels/duplicate/nickname/${mySessionId}`, {
          connectionId: myConnectionId,
          nickName: nickName,
        })
        .then((response: any) => {
          if (response.status == 226) {
            alert("중복된 닉네임입니다.");
          } else {
            alert("사용가능한 닉네임입니다.");
            setUsableNickName(true);
            setMyUserName(nickName);
          }
        })
        .catch((error: any) => {
          alert("서버 오류");
        });
    } else {
      alert("6~12자 영소문자와 한글로 된 닉네임만 사용 가능합니다.");
    }
  };

  const sendMessageByClick = () => {
    if (message !== "") {
      setMessages([
        ...messages,
        {
          userName: myUserName,
          text: message,
          boxClass: "messages__box--operator",
        },
      ]);
      setMessage("");
      const mySession = session;

      mySession?.signal({
        data: `${myUserName},${message}`,
        to: [],
        type: "chat",
      });
    }
  };

  const sendMessageByEnter = (e: any) => {
    if (e.key === "Enter") {
      if (message !== "") {
        setMessages([
          ...messages,
          {
            userName: myUserName,
            text: message,
            boxClass: "messages__box--operator",
          },
        ]);
        setMessage("");
        const mySession = session;

        mySession?.signal({
          data: `${myUserName},${message}`,
          to: [],
          type: "chat",
        });
      }
    }
  };

  const handleChatMessageChange = (e: any) => {
    setMessage(e.target.value);
  };
  // chatting

  const componentDidMount = () => {
    window.addEventListener("beforeunload", onbeforeunload);
  };

  const componentWillUnmount = () => {
    window.removeEventListener("beforeunload", onbeforeunload);
  };

  const onbeforeunload = (event: any) => {
    leaveSession();
  };

  const handleChangeSessionId = (e: any) => {
    setMySessionId(e.target.value);
  };

  const handleChangeUserName = (e: any) => {
    setMyUserName(e.target.value);
  };

  const handleMainVideoStream = (stream: any) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
  };

  const deleteSubscriber = (streamManager: any) => {
    let varSubscribers = subscribers;
    let index = varSubscribers.indexOf(streamManager, 0);
    if (index > -1) {
      varSubscribers.splice(index, 1);
      setSubscribers(varSubscribers);
    }
  };
  // 참가자 백엔드에 등록
  const recordParticipant = (conId: string) => {
    const requestBody = JSON.stringify({
      connectionId: conId,
      nickName: myUserName,
    });
    console.log("put session id " + mySessionId);
    axios
      .post(BE_URL + "/api/channels/join/" + mySessionId, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response: any) => {
        console.log(response);
      });
  };

  const joinSession = () => {
    // --- 1) Get an OpenVidu object ---
    setOV(new OpenVidu());
  };

  const leaveSession = () => {
    axios
      .post(`${BE_URL}/api/channels/leave/${mySessionId}`, {
        nickName: myUserName,
        connectionId: myConnectionId,
      })
      .then((res: any) => {
        console.log("방 나가기 성공");
      })
      .catch((e: any) => {
        console.log("방 나가기 실패");
      });
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    const mySession = session;

    if (mySession) {
      mySession?.disconnect();
    }

    // Empty all properties...
    emptyAllOV();
  };

  const deleteSession = () => {
    axios
      .delete(`${BE_URL}/api/channels/delete/${mySessionId}`, {
        data: {
          nickName: hostName,
          connectionId: hostConnectionId,
        },
      })
      .then((res: any) => {
        console.log("방 삭제 성공");
      })
      .catch((e: any) => {
        console.log("방 삭제 실패");
      });
  };

  const switchCamera = async () => {
    try {
      const devices = await OV?.getDevices();
      var videoDevices = devices?.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices && videoDevices.length > 1) {
        var newVideoDevice = videoDevices.filter(
          // (device) => device.deviceId !== currentVideoDevice.deviceId
          (device) => device.deviceId
        );

        if (newVideoDevice.length > 0) {
          // Creating a new publisher with specific videoSource
          // In mobile devices the default and first camera is the front one
          var newPublisher = OV?.initPublisher("", {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          //newPublisher.once("accessAllowed", () => {
          await session?.unpublish(mainStreamManager as Publisher);

          await session?.publish(newPublisher as Publisher);
          // currentVideoDevice: newVideoDevice,
          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);
        }
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  /**
   * --------------------------
   * SERVER-SIDE RESPONSIBILITY
   * --------------------------
   * These methods retrieve the mandatory user token from OpenVidu Server.
   * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
   * the API REST, openvidu-java-client or openvidu-node-client):
   *   1) Initialize a Session in OpenVidu Server	(POST /openvidu/api/sessions)
   *   2) Create a Connection in OpenVidu Server (POST /openvidu/api/sessions/<SESSION_ID>/connection)
   *   3) The Connection.token must be consumed in Session.connect() method
   */

  const getToken = () => {
    return createSession(mySessionId as string).then((sessionId) =>
      createToken(sessionId as string)
    );
  };

  const createSession = (sessionId: string) => {
    console.log("created session " + sessionId);
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(OPENVIDU_SERVER_URL + "/sessions", data, {
          headers: {
            Authorization:
              "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json",
          },
        })
        .then((response: any) => {
          console.log("CREATE SESSION", response);
          axios.delete(OPENVIDU_SERVER_URL + "/sessions/" + response.data.id, {
            headers: {
              Authorization:
                "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
              "Content-Type": "application/json",
            },
          });
          alert(`참가하려는 ${sessionId}방이 존재하지 않습니다.`);
          reject(response);
        })
        .catch((response: any) => {
          var error = Object.assign({}, response);
          if (error?.response?.status === 409) {
            resolve(sessionId);
          } else {
            console.log(error);
            console.warn(
              "No connection to OpenVidu Server. This may be a certificate error at " +
                OPENVIDU_SERVER_URL
            );
            if (
              window.confirm(
                'No connection to OpenVidu Server. This may be a certificate error at "' +
                  OPENVIDU_SERVER_URL +
                  '"\n\nClick OK to navigate and accept it. ' +
                  'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                  OPENVIDU_SERVER_URL +
                  '"'
              )
            ) {
              window.location.assign(
                OPENVIDU_SERVER_URL + "/accept-certificate"
              );
            }
          }
        });
    });
  };

  const createToken = (sessionId: string) => {
    return new Promise((resolve, reject) => {
      var data = {};
      axios
        .post(
          OPENVIDU_SERVER_URL + "/sessions/" + sessionId + "/connection",
          data,
          {
            headers: {
              Authorization:
                "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
              "Content-Type": "application/json",
            },
          }
        )
        .then((response: any) => {
          console.log("TOKEN", response);
          resolve(response.data.token);
          console.log("connection id : " + response.data.id);
          setMyConnectionId(response.data.id);
          //TODO: setMyConnectionId가 늦게 작동하는 문제 해결 필요
          //임시로 connectionId를 인자로 넘겨주어 해결
          recordParticipant(response.data.id);
        })
        .catch((error: any) => reject(error));
    });
  };

  //카메라, 마이크 온오프
  const reverseAudioState = () => {
    publisher?.publishAudio(!audiostate);
    setAudiostate(!audiostate);
  };

  const reverseVideoState = () => {
    publisher?.publishVideo(!videostate);
    setVideostate(!videostate);
  };

  return (
    <Container>
      <Wrapper>
        <ThemeProvider theme={themeA306}>
          {session === undefined ? (
            <InvitePageForm>
              <InvitePageHead>Brand</InvitePageHead>

              <InvitePageMsg>
                {hostName} 님의 방에 입장하시겠습니까?
              </InvitePageMsg>

              <InvitePageInput>
                <FormControl variant="standard" fullWidth>
                  <InputLabel htmlFor="component-helper" shrink>
                    Nick Name
                  </InputLabel>
                  <Input
                    id="component-helper-nickname"
                    placeholder="닉네임을 입력해 주세요."
                    // value={nickName}
                    onChange={onChangeNickName}
                    required
                    aria-describedby="component-helper-text"
                  />
                </FormControl>
                <NickNameButton onClick={nickNameCheck}>
                  닉네임 중복체크
                </NickNameButton>

                {nickName.length > 0 && (
                  <div className={`${isNickName ? "success" : "error"}`}>
                    {nickNameError}
                  </div>
                )}
              </InvitePageInput>

              <InvitePageInput onClick={onEnter}>
                <Button
                  type="submit"
                  variant="contained"
                  size="medium"
                  fullWidth
                  disabled={!(isNickName && usableNickName)}
                >
                  채널 입장하기
                </Button>
                <div>{!usableNickName ? "닉네임 중복체크를 해주세요" : ""}</div>
              </InvitePageInput>
            </InvitePageForm>
          ) : null}
          {/* session이 있을 때 */}
          {session !== undefined ? (
            <Box
              id="full"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 0,
                height: "100vh",
                width: "100vw",
              }}
            >
              <Box
                id="header"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "15%",
                }}
              >
                <Box
                  id="logo"
                  sx={{
                    width: "20%",
                    height: "100%",
                  }}
                >
                  <BrandWrapper
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Brand to="/">
                      <Logo>
                        <LogoImg
                          style={{
                            margin: 0,
                          }}
                          src="/images/common/logo_A306.png"
                          alt="A306 logo img"
                        />
                        <LogoName>A306</LogoName>
                      </Logo>
                    </Brand>
                  </BrandWrapper>
                </Box>
                <Paper
                  id="info"
                  sx={{
                    // position: 'sticky',
                    top: 0,
                    left: 0,
                    right: 0,

                    width: "60%",
                    height: "100%",
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    boxShadow: 4,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h1
                    style={{
                      color: "skyblue",
                      fontWeight: "bold",
                    }}
                  >
                    게임 종류
                  </h1>
                </Paper>
                <Box
                  id="buttons"
                  sx={{
                    width: "20%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                >
                  {/* <input
                  className="btn btn-large btn-danger"
                  type="button"
                  id="buttonLeaveSession"
                  onClick={leaveSession}
                  value="Leave session"
                /> */}
                  {/* </div> */}
                  {nickName}
                  <BasicModal />
                </Box>
              </Box>
              <Box
                id="main"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "85%",
                }}
              >
                <Box
                  id="conference"
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    width: "75%",
                    height: "100%",
                    display: "flex",
                  }}
                >
                  <Box
                    id="cam"
                    sx={{
                      // display: 'flex',
                      // backgroundColor: 'powderblue',
                      flexGrow: 1,
                      width: "100%",
                      height: "90%",
                      // margin: 10
                    }}
                  >
                    {/* 큰 화면 카메라 */}
                    {/* {mainStreamManager !== undefined ? (
                  <div id="main-video" className="col-md-6">
                    <UserVideoComponent
                      streamManager={mainStreamManager}
                    />
                    <input
                      className="btn btn-large btn-success"
                      type="button"
                      id="buttonSwitchCamera"
                      onClick={switchCamera}
                      value="Switch Camera"
                    />
                  </div>
                ) : null} */}
                    {/* <div id="video-container" className="col-md-6"> */}
                    <Grid
                      container
                      spacing={{ xs: 1, md: 1 }}
                      columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                      {publisher !== undefined ? (
                        <Grid
                          item
                          sm={4}
                          md={4}
                          onClick={() => handleMainVideoStream(publisher)}
                        >
                          <UserVideoComponent streamManager={publisher} />
                        </Grid>
                      ) : null}
                      {subscribers.map((sub, i) => (
                        <Grid
                          item
                          sm={4}
                          md={4}
                          key={i}
                          // className="stream-container col-md-6 col-xs-6"
                          onClick={() => handleMainVideoStream(sub)}
                        >
                          <UserVideoComponent streamManager={sub} />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                  <Box
                    id="settings"
                    sx={{
                      backgroundColor: "inherit",
                      width: "100%",
                      height: "10%",
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                  >
                    <Button>
                      <SettingsIcon />
                    </Button>
                    {audiostate ? (
                      <Button onClick={reverseAudioState}>
                        <MicOutlinedIcon color="success" />
                      </Button>
                    ) : (
                      <Button onClick={reverseAudioState}>
                        <MicOutlinedIcon color="disabled" />
                      </Button>
                    )}
                    {videostate ? (
                      <Button onClick={reverseVideoState}>
                        <VideocamIcon color="success" />
                      </Button>
                    ) : (
                      <Button onClick={reverseVideoState}>
                        <VideocamIcon color="disabled" />
                      </Button>
                    )}
                    <Button onClick={leaveSession}>
                      <ExitToAppIcon color="error" />
                    </Button>
                  </Box>
                </Box>
                <Box
                  id="chat"
                  sx={{
                    // backgroundColor: 'grey',
                    width: "25%",
                    height: "100%",
                    // margin: 10
                  }}
                >
                  {/* <div className="chatbox__footer"> */}
                  <Box
                    className="chatspace"
                    sx={{
                      backgroundColor: "#ddd",
                      width: "100%",
                      height: "400px",
                      borderRadius: "20px",
                    }}
                  >
                    <h3>채팅</h3>
                    <Box
                      className="chatbox__messages"
                      sx={{
                        backgroundColor: "#A8C0D6",
                        margin: "10px",
                        width: "80%",
                        height: "300px",
                        borderRadius: "20px",
                        overflow: "auto",
                      }}
                    >
                      <Messages messages={messages} myUserName={myUserName} />
                      {/* <div />
            </div> */}
                    </Box>
                    <input
                      id="chat_message"
                      type="text"
                      style={{
                        margin: "10px",
                        width: "70%",
                        borderRadius: "20px",
                        border: "none",
                      }}
                      placeholder="Write a message..."
                      onChange={handleChatMessageChange}
                      onKeyPress={sendMessageByEnter}
                      value={message}
                    />
                    <Button
                      className="chatbox__send--footer"
                      sx={{ borderRadius: "20px", border: "none" }}
                      onClick={sendMessageByClick}
                    >
                      Enter
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : null}
        </ThemeProvider>
      </Wrapper>
    </Container>
  );
};

function BasicModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>게임 방법</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            몸으로 말해요
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            1. 출제자는 몸짓으로만 제시어를 묘사합니다. <br />
            2. 참여자는 출제자의 묘사를 통해 정답을 유추합니다. <br />
            3. 참여자는 채팅으로 정답을 맞춥니다.
          </Typography>
          <Button onClick={handleClose}>닫기</Button>
        </Box>
      </Modal>
    </div>
  );
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

const Container = styled.div`
  // position: sticky;
  // align-self: center;
  // top: 0;
  // left: 0;
  // height: 60px;
  // width: 100%;
  // // padding:150px 0;
  // background-color: #D7D7D7;
`;

const Wrapper = styled.div`
  display: flex;
  // align-items: center;
  // text-align: center;
  // background-color: #D7D7D7;
  justify-content: center;
  // z-index: 5;
`;

const InvitePageHead = styled.h1`
  color: #000000;
  margin: 40px;
`;

const InvitePageMsg = styled.h5`
  color: #000000;
  margin: 40px;
  font-size: 16px;
`;

const InvitePageForm = styled.div`
  // display: flex;
  // flex-direction: column;
  // align-items: right;
  width: 500px;
  display: inline-block;
  // position: absolute;
`;

const InvitePageInput = styled.div`
  // display: flex;
  // flex-direction: column;
  // width: 500px;
  // text-align: center;
  // align-items: center;
  margin: 15px 0px;
`;

const InvitePageButton = styled.button`
  height: 40px;
  margin-bottom: 24px;
  border: none;
  border-radius: 0.25rem;
  box-sizing: border-box;
  background-color: #3396f4;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  transition: background-color 0.08s ease-in-out;
  cursor: pointer;
  &:hover {
    background-color: #2878c3;
  }
  @media (max-width: 575px) {
    font-size: 15px;
  }
`;

const NickNameButton = styled.button`
  height: 40px;
  margin-bottom: 24px;
  border: none;
  border-radius: 0.25rem;
  box-sizing: border-box;
  background-color: #39a2db;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  transition: background-color 0.08s ease-in-out;
  cursor: pointer;
  &:hover {
    background-color: #2878c3;
  }
  @media (max-width: 100px) {
    font-size: 15px;
  }
`;

// const InvitePageMsg = styled.div`
//   text-decoration: none;
//   font-size: 14px;
//   font-weight: bold;
// `;

export default InvitePage;
