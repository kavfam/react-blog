"use STRICT";

import React, { useState, useReducer, useEffect, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";
Axios.defaults.baseURL = process.env.BACKENDURL || "https://reactapp-bs-backend.herokuapp.com";

import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

// My components
//const compdir = "./components"
import LoadingDotsIcon from "./components/LoadingDotsIcon";
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Home from "./components/Home";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
//import CreatePost from "./components/CreatePost";
const CreatePost = React.lazy(() => import("./components/CreatePost"));
//import ViewSinglePost from "./components/ViewSinglePost";
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"));
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
//import Search from "./components/Search";
const Search = React.lazy(() => import("./components/Search"));
//import Chat from "./components/Chat";
const Chat = React.lazy(() => import("./components/Chat"));

//  myimports = [Header, HomeGuest, Home, Footer, About, Terms, CreatePost, ViewSinglePost, FlashMessage, Profile, EditPost, NotFound, Search]
//  myimports.map( imp => {import imp from "./components/imp"})

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("complexappToken"),
      username: localStorage.getItem("complexappUsername"),
      avatar: localStorage.getItem("complexappAvatar")
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0
  };

  function ourReducer(draft, action) {
    // state is the prev or current state and here, update and return this.
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data;
        return;
      case "logout":
        draft.loggedIn = false;
        return;
      case "flashMessage":
        draft.flashMessages.push(action.value);
        return;
      case "openSearch":
        draft.isSearchOpen = true;
        return;
      case "closeSearch":
        draft.isSearchOpen = false;
        return;
      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen;
        return;
      case "closeChat":
        draft.isChatOpen = false;
        return;
      case "incrementUnreadChatCount":
        draft.unreadChatCount++;
        return;
      case "clearUnreadChatCount":
        draft.unreadChatCount = 0;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);
  // first parm is a piece of state (function) and second arg is the initial value you want to give the state,

  // below, useEffect(a,b), where b is a list or array of dependencies that you want to watch for changes and a is a function that will run anytime that b changes.
  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("complexappToken", state.user.token);
      localStorage.setItem("complexappUsername", state.user.username);
      localStorage.setItem("complexappAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("complexappToken");
      localStorage.removeItem("complexappUsername");
      localStorage.removeItem("complexappAvatar");
      // why not reset the screen here to starup splashscreen?
    }
  }, [state.loggedIn]);
  // console.log("====================");
  // console.log("LoggedIn: ", loggedIn);
  // console.log("ChkLogin: ", ChkLogin());
  //console.log(localStorage.getItem("complexappToken"));
  // console.log("====================");

  //console.log("loggedIn", loggedIn);

  //check if token has expire or not on first render
  useEffect(() => {
    if (state.loggedIn) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.post("/checkToken", { token: state.user.token }, { cancelToken: ourRequest.token });
          //console.log(response.data);
          if (!response.data) {
            dispatch({ type: "logout" });
            dispatch({ type: "flashMessage", value: "Your session has expired. Please log in again!" });
          }
        } catch (e) {
          console.log("There was a problem or the request was cancelled.");
        }
      }
      fetchResults();
      return () => ourRequest.cancel();
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Suspense fallback={<LoadingDotsIcon />}>
            <Routes>
              <Route path="/profile/:username/*" element={<Profile />} />
              <Route path="/" element={state.loggedIn ? <Home /> : <HomeGuest />} />
              <Route path="/post/:id" element={<ViewSinglePost />} />
              <Route path="/post/:id/edit" element={<EditPost />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/about-us" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              // line below must be LAST route item
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

//ReactDOM.render(<Main />, document.querySelector("#app"));
const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

if (module.hot) {
  module.hot.accept();
}
