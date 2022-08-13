/* eslint-disable */
// import BasicSelect from '../components/common/Select';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'

import { useCallback, useEffect, useState, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import {Paper, Modal} from '@mui/material';
import Typography from '@mui/material/Typography';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import Input from "@mui/material/Input";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import styled from "@emotion/styled";
import {Button, Grid} from "@mui/material/";

import "./Signup.css";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { OpenVidu, Publisher, Session, StreamManager, Subscriber } from "openvidu-browser";
import "../components/openvidu/App.css";
import Messages from "../components/openvidu/Messages";
import UserVideoComponent from "../components/openvidu/UserVideoComponent";

import MicOutlinedIcon from '@mui/icons-material/MicOutlined';
import VideocamIcon from '@mui/icons-material/Videocam';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';


const OPENVIDU_SERVER_URL = process.env.REACT_APP_OPENVIDU_SERVER_URL;
const OPENVIDU_SERVER_SECRET = process.env.REACT_APP_OPENVIDU_SERVER_SECRET;
const BE_URL = process.env.REACT_APP_BACKEND_URL;

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

// interface IState {
//   OV: OpenVidu | null,
//   mySessionId: string,
//   myUserName: string,
//   session: Session | undefined,
//   mainStreamManager: Publisher | undefined,
//   publisher: Publisher | undefined,
//   subscribers: Subscriber[],
//   myConnectionId: string,
//   audiostate: boolean,
//   audioallowed: boolean,
//   videostate: boolean,
//   videoallowed: boolean,
//   messages: object[],
//   message: string,
// }

function SwipeableTextMobileStepper() {
  const [selectData, setSelectData] = useState([
    [],
    ['5', '10', '15', '20'],
  ])
  const [category, setCategory] = useState('')
  const [round, setRound] = useState('')
  
  const [info, setInfo] = useState<string[]>([]);
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = steps.length;

  const [accessToken, setAccessToken] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();

  const [OV, setOV] = useState<OpenVidu | null>(null);
  const [mySessionId, setMySessionId] = useState<string | null>("");
  const [myUserName, setMyUserName] = useState<string>("");
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [mainStreamManager, setMainStreamManager] = useState<Publisher | undefined>(undefined);
  const [publisher, setPublisher] = useState<Publisher | undefined>(undefined);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [currentVideoDeviceId, setCurrentVideoDeviceId] = useState<string | undefined>("");
  
  const [myConnectionId, setMyConnectionId] = useState<string>("");
   
  const [audiostate, setAudiostate] = useState<boolean>(true);
  const [audioallowed, setAudioallowed] = useState<boolean>(true);
  const [videostate, setVideostate] = useState<boolean>(true);
  const [videoallowed, setVideoallowed] = useState<boolean>(true);
     
  const [messages, setMessages] = useState<object[]>([]);
  const [message, setMessage] = useState<string>("");

  const [joinLink, setJoinLink] = useState<string>("");

  const emptyAllOV = () => {
    setOV(null);
    setSession(undefined);
    setSubscribers([]);
    setMySessionId("");
    setMyUserName("");
    setMainStreamManager(undefined);
    setPublisher(undefined);
  }
  //닉네임 확인
  const [nickName, setNickName] = useState<string>("");

  //에러메시지 저장
  const [nickNameError, setNickNameError] = useState<string>("");

  // 유효성 검사
  const [isNickName, setIsNickName] = useState<boolean>(false);

  // 닉네임 중복 체크
  const [usableNickName, setUsableNickName] = useState<boolean>(false);

  const [hostName, sethostName] = useState<string>("");

  const didMount = useRef(false);

  useEffect(() => {
    let token = localStorage.getItem("access-token");
    //토큰이 없으면 api호출안함
    if (!token) return;
    setAccessToken(token as string);

    axios.get(`${BE_URL}/subjects`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      const copy = [...selectData]
      res.data.data.map((d: any, i: any) => (
        copy[0].push(d.subject_name)
      ))
      console.log(copy[0])
      setSelectData(copy)
    });
    //닉네임 가져와서 세팅
    axios.get(`${BE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      setMyUserName(res.data.userNickName);
    });
  }, [])

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
    mySession?.on("streamCreated", (event : any) => {
      // Subscribe to the Stream to receive it. Second parameter is undefined
      // so OpenVidu doesn't create an HTML video by its own
      var subscriber = mySession?.subscribe(event.stream, "undefined");
      // Update the state with the new subscribers
      subscribers.push(subscriber);
      setSubscribers([...subscribers]);
    });

    // On every Stream destroyed...
    mySession?.on("streamDestroyed", (event: any) => {
      if (event.reason !== "disconnect") {
        //비정상적으로 연결끊긴 참가자 쫒아내기
        kickParticipant(event.stream.connection.connectionId);
      }
      // Remove the stream from 'subscribers' array
      deleteSubscriber(event.stream.streamManager);
    });

    // On every asynchronous exception...
    mySession?.on("exception", (exception) => {
      console.warn(exception);
    });

    mySession?.on("sessionDisconnected", (event: any) => {
      alert("서버와의 접속이 끊어졌습니다.");
      navigate("/");
    })

    // --- 4) Connect to the session with a valid user token ---

    // 'getToken' method is simulating what your server-side should do.
    // 'token' parameter should be retrieved and returned by your own backend
    getToken().then((token) => {
      // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
      // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
      mySession?.connect(String(token), { clientData: myUserName })
        .then(async () => {
          var devices = await OV?.getDevices();
          var videoDevices = devices?.filter(
            (device) => device.kind === "videoinput"
          );

          // --- 5) Get your own camera stream ---

          // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
          // element: we will manage it on our own) and with the desired properties
          let videoDevice = undefined;
          if (videoDevices && videoDevices?.length > 1) {
            videoDevice = videoDevices?.[0].deviceId;
            setCurrentVideoDeviceId(videoDevice);
          }

          let publisher = OV?.initPublisher("", {
            audioSource: undefined, // The source of audio. If undefined default microphone
            videoSource: videoDevice, // The source of video. If undefined default webcam
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
    mySession?.on("signal:chat", (event : any) => {
      let chatdata = event.data.split(",");
      // let chatdata = event.;
      if (chatdata[0] !== myUserName) {
        console.log("messages: "+messages);
  

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
          ],
        );
      }
    });
  }, [session, messages]);

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

  const sendMessageByClick = () => {
    if (message !== "") {
      // messages.push({
      //   userName: myUserName,
      //   text: message,
      //   boxClass: "messages__box--operator",
      // });

      // setMessages([...messages]);

      setMessages(
        [
          ...messages,
          {
            userName: myUserName,
            text: message,
            boxClass: "messages__box--operator",
          },
        ],
      );
      setMessage("");
      const mySession = session;

      mySession?.signal({
        data: `${myUserName},${message}`,
        to: [],
        type: "chat",
      });
    }
  }

  const sendMessageByEnter = (e : any) => {
    if (e.key === "Enter") {
      if (message !== "") {
        // messages.push({
        //   userName: myUserName,
        //   text: message,
        //   boxClass: "messages__box--operator",
        // });
  
        // setMessages([...messages]);

        setMessages([
            ...messages,
            {
              userName: myUserName,
              text: message,
              boxClass: "messages__box--operator",
            },
          ],
        );
        setMessage("");
        const mySession = session;

        mySession?.signal({
          data: `${myUserName},${message}`,
          to: [],
          type: "chat",
        });

      }
    }
  }

  const handleChatMessageChange = (e : any) => {
    console.log("message event occur");
    setMessage(e.target.value);
  }
  // chatting

  const componentDidMount = () => {
    window.addEventListener("beforeunload", onbeforeunload);
  }

  const componentWillUnmount = () => {
    window.removeEventListener("beforeunload", onbeforeunload);
  }

  const onbeforeunload = (event : any) => {
    leaveSession();
  }

  const handleChangeSessionId = (e: any) => {
    setMySessionId(e.target.value);
  }

  const handleChangeUserName = (e : any) => {
    setMyUserName(e.target.value);
  }

  const handleMainVideoStream = (stream : any) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
  }

  const deleteSubscriber = (streamManager : any) => {
    let varSubscribers = subscribers;
    let index = varSubscribers.indexOf(streamManager, 0);
    if (index > -1) {
      varSubscribers.splice(index, 1);
      setSubscribers(varSubscribers);
    }
  }
  // 호스트 백엔드에 등록
  const recordParticipant = (conId : string) => {
    const requestBody = JSON.stringify({
      connectionId: conId,
      nickName: myUserName,
    });
    console.log("put session id " + mySessionId);
    axios
      .put(`${BE_URL}/api/channels/generate/${mySessionId}`, requestBody, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
      });
  }

  const joinSession = () => {
    // --- 1) Get an OpenVidu object ---
    setOV(new OpenVidu());
  }

  const leaveSession = () => {
    axios
      .delete(`${BE_URL}/api/channels/leave/${mySessionId}`,
        {
          data : {
            nickName: myUserName,
            connectionId: myConnectionId,
          } 
        })
      .then((res) => {
        console.log("방 나가기 성공");
      })
      .catch((e) => {
        console.log("방 나가기 실패");
      })
      .finally(() => {
        deleteSession();
      });
    
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    const mySession = session;

    if (mySession) {
      mySession?.disconnect();
    }

    // Empty all properties...
    emptyAllOV();

  }

  const deleteSession = () => {
    axios
      .delete(`${BE_URL}/api/channels/delete/${mySessionId}`,
        {
          data : {
            nickName: myUserName,
            connectionId: myConnectionId,
          } 
        })
      .then((res) => {
        console.log("방 삭제 성공");
      })
      .catch((e) => {
        console.log("방 삭제 실패");
      });
    
    axios
    .delete(OPENVIDU_SERVER_URL + `/sessions/${mySessionId}`, {
      headers: {
        Authorization: "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
        "Content-Type": "application/json",
      },
    });
  }

  const kickParticipant = (conId : string) => {
    axios
      .post(`${BE_URL}/api/channels/kick/${mySessionId}`,
        {
          nickName: "",
          connectionId: conId,
        })
      .then((res) => {
        console.log("강제 퇴장 성공");
      })
      .catch((e) => {
        console.log("강제 퇴장 실패");
      });
  }

  const switchCamera = async() => {
    try {
      const devices = await OV?.getDevices();
      var videoDevices = devices?.filter(
        (device) => device.kind === "videoinput"
      );
      console.log((publisher));
      console.log(videoDevices);
      if (videoDevices && videoDevices.length > 1) {
        var newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== currentVideoDeviceId
        );

        if (newVideoDevice.length > 0) {
          // Creating a new publisher with specific videoSource
          // In mobile devices the default and first camera is the front one
          setCurrentVideoDeviceId(newVideoDevice[0].deviceId);
          var newPublisher = OV?.initPublisher("", {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });
          console.log((newPublisher));
          //newPublisher.once("accessAllowed", () => {
          await session?.unpublish(mainStreamManager as Publisher);

          await session?.publish(newPublisher as Publisher);
          // currentVideoDevice: newVideoDevice,
          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);
        }
      }
    } catch (e : any) {
      console.error(e);
    }
  }

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
  }

  const createSession = (sessionId : string) => {
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
        .then((response) => {
          console.log("CREATE SESSION", response);
          resolve(response.data.id);
        })
        .catch((response) => {
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
  }

  const createToken = (sessionId: string) => {
    generateJoinLink(sessionId as string);
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
        .then((response) => {
          console.log("TOKEN", response);
          console.log("connection id : " + response.data.id);
          setMyConnectionId(response.data.id);
          //TODO: setMyConnectionId가 늦게 작동하는 문제 해결 필요
          //임시로 connectionId를 인자로 넘겨주어 해결
          recordParticipant(response.data.id);
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  }

  //방생성 요청
  const handleCreateRoom = (event : any) => {
    event.preventDefault();

    createRandomSessionId().then(() => {
      joinSession();
    });
  }

  // SpringBoot Server로부터 무작위 세션 id 생성.
  const createRandomSessionId = () => {
    return new Promise<void>((resolve) => {
      axios
        .get(`${BE_URL}/api/channels/create`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          // setState 호출 시 render도 호출 (https://velog.io/@lllen/React-%EC%9D%B4%EB%B2%A4%ED%8A%B8)
          console.log("created random sessionId");
          // this.mySessionId = response.data;

          console.log(response);
          setMySessionId(response.data);
          resolve();
        });
    });
  }

  const generateJoinLink = (sessionId: string) => {
    const str = "https://i7a306.p.ssafy.io/join?channelid="+sessionId;
    setJoinLink(str);
  }

  const handleCopyClipBoard = () => {
    navigator.clipboard.writeText(joinLink);
  }

  //카메라, 마이크 온오프
  const reverseAudioState = () => {
    publisher?.publishAudio(!audiostate);
    setAudiostate(!audiostate);
  }

  const reverseVideoState = () => {
    publisher?.publishVideo(!videostate);
    setVideostate(!videostate);
  }

  return (
  <Container>
    {session === undefined ? (
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
            // <Link to="/channel/gamechannel" style={{ textDecoration: 'inherit'}}>
            //   <Button
            //     size="small"
            //     // onClick={()=> {데이터 서버로 전송}}
            //   >
            //     게임 생성
            //     {theme.direction === 'rtl' ? (
            //       <KeyboardArrowLeft />
            //     ) : (
            //       <KeyboardArrowRight />
            //     )}
            //   </Button>
            // </Link>
            <Button
                size="small"
                onClick={handleCreateRoom}
              >
                게임 생성
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
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
      ) : null}
      {/* session이 있을 때 */}
      {session !== undefined ? (
        <Box id='full'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0,
            height: '100vh',
            width: '100vw'
          }}>
         <Box id='header'
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '15%'
          }}>
          <Box id='logo'
          sx={{
            width: '20%',
            height: '100%',
            // bgcolor: 'green'
          }}>
          {/* <div id="session">
          <div id="session-header"> */}
              <h1 id="session-title">{mySessionId}</h1>
              <div>
                <Button onClick={handleCopyClipBoard}>초대 링크 복사하기 📋</Button>
              </div>
              </Box>
              <Paper id='info'
                sx={{
                  // position: 'sticky',
                  top: 0,
                  left: 0,
                  right: 0,

                  width: '60%',
                  height: '100%',
                  // bgcolor: 'orange',
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                  boxShadow: 4,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <h1 style={{
                    color: 'skyblue',
                    fontWeight: 'bold'
                  }}>게임 종류</h1>

              </Paper>
              <Box id='buttons'
                sx={{
                  width: '20%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
              }}>
              {/* <input
                className="btn btn-large btn-danger"
                type="button"
                id="buttonLeaveSession"
                onClick={leaveSession}
                value="Leave session"
              /> */}
          {/* </div> */}
          <Button>게임 시작</Button>
          <BasicModal/>        
        </Box>
      </Box>
      <Box id='main'
        sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '85%'
      }}>
        
           <Box id='conference'
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection:'column',
            width: '75%',
            height: '100%',
            display: 'flex'
            }}>
            
          <Box id='cam' 
            sx={{ 
            // display: 'flex',
            // backgroundColor: 'powderblue',
            width: '100%',
            height: '90%',
            // margin: 10
            }}>
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
          <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {publisher !== undefined ? (
                <Grid
                item sm={4} md={4}
                onClick={() =>
                  handleMainVideoStream(publisher)
                }
              >
                <UserVideoComponent streamManager={publisher} />
              </Grid>
              ) : null}
             {subscribers.map((sub, i) => (
                <Grid
                  item sm={4} md={4}
                  key={i}
                  // className="stream-container col-md-6 col-xs-6"
                  onClick={() => handleMainVideoStream(sub)}
                >
                  <UserVideoComponent streamManager={sub} />
                </Grid>
              ))}
                </Grid>
                </Box>

          <Box id='settings'
            sx={{
              backgroundColor: 'inherit',
              width: '100%',
              height: '10%',
              display: 'flex',
              justifyContent: 'space-evenly',
              alignItems: 'center'
            }}>
           <Button><SettingsIcon /></Button>
            
           {audiostate ? (
                <Button
                onClick={reverseAudioState}>
                  <MicOutlinedIcon
                  color='success'
                />
                </Button>
              ) : (
                <Button
                onClick={reverseAudioState}>
                  <MicOutlinedIcon
                  color="disabled"
                  />
                </Button>
              )}
              {videostate ? (
                <Button
                onClick={reverseVideoState}>
                  <VideocamIcon 
                  color='success'
                  />
                </Button>                 
              ) : (
                <Button
                onClick={reverseVideoState}>
                  <VideocamIcon
                  color="disabled"
                  />
                </Button>                   
              )}
                             
              <Button
              onClick={leaveSession}>
                <ExitToAppIcon
                  color='error' 
                />
              </Button>

          
          </Box>
        </Box>
          
          {/* <div>
            {audiostate ? (
              <button 
                onClick={reverseAudioState}
              >
                Audio Off
              </button>
            ) : (
              <button
                onClick={reverseAudioState}
              >
                Audio On
              </button>
            )}
          </div>
          <div>
          {videostate ? (
              <button 
                onClick={reverseVideoState}
              >
                Video Off
              </button>
            ) : (
              <button
                onClick={reverseVideoState}
              >
                Video On
              </button>
            )}
          </div> */}
          <Box id='chat' 
          sx={{
          width: '25%',
          height: '100%'
          // margin: 10
        }}>
          {/* <div className="chatbox__footer"> */}
          <Box className="chatspace" sx={{backgroundColor: '#ddd', width: '100%', height: '400px', borderRadius: '20px'}}>
          <h3>채팅</h3>
          <Box className="chatbox__messages" sx={{backgroundColor: '#A8C0D6', margin: '10px', width: '80%', height: '300px', borderRadius: '20px', overflow: 'auto'}}>
            <Messages messages={messages} myUserName={myUserName} />
            {/*<div />
           </div> */}
          </Box>
            <input
              id="chat_message"
              type="text"
              style={{margin: '10px', width:'70%', borderRadius: '20px', border: 'none'}}
              placeholder="Write a message..."
              onChange={handleChatMessageChange}
              onKeyPress={sendMessageByEnter}
              value={message}
            />
            <Button
              className="chatbox__send--footer"
              sx={{borderRadius: '20px', border: 'none'}}
              onClick={sendMessageByClick}
            >
              Enter
            </Button></Box>
          </Box>
          </Box></Box>
        ) : null}
      </Container>
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

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  height: '75%',
  bgcolor: 'white',
  border: '2px solid #000',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
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
            2. 참여자는 출제자의 묘사를 통해 정답을 유추합니다. <br/>  
            3. 참여자는 채팅으로 정답을 맞춥니다.
          </Typography>
          <Button onClick={handleClose}>닫기</Button>
        </Box>
      </Modal>
    </div>
  );
}
