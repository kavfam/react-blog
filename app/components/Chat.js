import React, { useEffect, useContext, useRef } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import { useImmer } from "use-immer";
import { Link } from "react-router-dom";
import io from "socket.io-client";

function Chat() {
  // using useRef instead of state as dont want React to recreate this variable/micromanage it. Just want a basic mutable object thats not going to change so that the web Browser can consistently hold on to socket connectio
  const socket = useRef(null);
  const chatField = useRef(null);
  const chatLog = useRef(null);
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: []
  });

  function apDis(type) {
    appDispatch(`{ type: ` + type + `}`);
  }

  useEffect(() => {
    if (appState.isChatOpen) {
      chatField.current.focus();
      //apDis("clearUnreadChatCount");
      appDispatch({ type: "clearUnreadChatCount" });
    }
  }, [appState.isChatOpen]);

  useEffect(() => {
    socket.current = io(process.env.BACKENDURL || "https://reactapp-bs-backend.herokuapp.com");

    socket.current.on("chatFromServer", message => {
      setState(draft => {
        draft.chatMessages.push(message);
      });
    });
    return () => socket.current.disconnect();
  }, []); //[] only run first time rendered

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight;
    if (state.chatMessages.length && !appState.isChatOpen) {
      appDispatch({ type: "incrementUnreadChatCount" });
    }
  }, [state.chatMessages]); // check for changes in chatMessages

  function handleFieldChange(e) {
    //sometimes (e) does not behave correctly inside another function like setState() below so a way around this is to get the value first and then use it within the function
    const value = e.target.value;
    setState(draft => {
      draft.fieldValue = value;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    //send message to chat server: socket.emit(a,b), a = name of event type. Backend programmed to use event "chatFromBrowser", b = object with properties including token for trust.
    socket.current.emit("chatFromBrowser", { message: state.fieldValue, token: appState.user.token });

    setState(draft => {
      //add message to state collection of messages
      draft.chatMessages.push({ message: draft.fieldValue, username: appState.user.username, avatar: appState.user.avatar });
      draft.fieldValue = "";
    });
  }

  return (
    <div id="chat-wrapper" className={"chat-wrapper shadow border-top border-left border-right " + (appState.isChatOpen ? "chat-wrapper--is-visible" : "")}>
      <div className="chat-title-bar bg-primary">
        Chat
        <span onClick={() => appDispatch({ type: "closeChat" })} className="chat-title-bar-close">
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {state.chatMessages.map((message, index) => {
          if (message.username == appState.user.username) {
            return (
              <div key={index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
            );
          }

          return (
            <div key={index} className="chat-other">
              <Link to={`/profile/${message.username}`}>
                <img className="avatar-tiny" src={message.avatar} />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`/profile/${message.username}`}>
                    <strong>{message.username}: </strong>
                  </Link>
                  {message.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} id="chatForm" className="chat-form border-top">
        <input value={state.fieldValue} onChange={handleFieldChange} ref={chatField} type="text" className="chat-field" id="chatField" placeholder="Type a message…" autoComplete="off" />
      </form>
    </div>
  );
}

export default Chat;
