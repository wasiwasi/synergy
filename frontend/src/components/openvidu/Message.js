import React, { Component } from "react";
import styled from "styled-components"; // npm i styled-components
import './Message.css';
const Username = styled.p`
  // display: inline-flex;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 5px;
`;

const MessageContainer = styled.div`
  // width: 200px;
  width: 100%;
`;

const Text = styled.p`
  // display: inline-flex;
  font-size: 0.8rem;
  padding: 5px;
`;


class Message extends Component {
  
  render() {
    
    const { text, userName, boxClass, myUserName } = this.props;

    return ( 
      <div>
         {userName === myUserName ? 
         <MessageContainer id='mycontainer'>
        <Username id='myname'>{userName}</Username>
        <Text id='me' className={boxClass}>{text}</Text>
      </MessageContainer> : 
      <MessageContainer id='yourcontainer'>
        <Username id='yourname'>{userName}</Username>
        <Text id='you' className={boxClass}>{text}</Text>
      </MessageContainer>}
      
      </div>
     
    );
  }
}

export default Message;
