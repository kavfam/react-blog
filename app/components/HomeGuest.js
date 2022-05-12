import React, { useEffect, useState } from "react";
import Page from "./Page";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";

function HomeGuest() {
  // const [username, setUsername] = useState();
  // const [email, setEmail] = useState();
  // const [password, setPassword] = useState();
  const initialState = {
    username: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0
    },
    email: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0
    },
    password: {
      value: "",
      hasErrors: false,
      message: ""
    },
    submitCount: 0
  };

  function ourReducer(draft, action) {
    const du = draft.username;

    switch (action.type) {
      case "usernameImmediately":
        du.hasErrors = false; // assume no errors then test
        du.value = action.value;
        if (du.value.length > 30) {
          du.hasErrors = true;
          du.message = "Username cannot exceed 30 characters";
        }
        if (du.value && !/^([a-zA=Z0-9]+)$/.test(du.value)) {
          du.hasErrors = true;
          du.message = "Username can only contain letters or numbers!";
        }
        return;

      case "usernameAfterDelay":
        // if (draft.username.value.length < 3) {
        //   draft.username.hasErrors = true;
        //   draft.username.message = "Username must have at least 3 characters.";
        // }
        // return;
        if (du.value.length < 3) {
          du.hasErrors = true;
          du.message = "Username must have at least 3 characters.";
        }
        // only if no errors then check db. can do this by incrementing checkCount and setting up a useEffect to "listen" for changes and then send off an axious request
        //if (!draft.hasErrors) {
        if (!draft.username.hasErrors) {
          du.checkCount++;
        }
        return;

      case "usernameUniqueResults":
        if (action.value) {
          draft.username.hasErrors = true;
          draft.username.isUnique = false;
          draft.username.message = "That username is already taken.";
        } else {
          draft.username.isUnique = true;
        }
        return;

      case "emailImmediately":
        draft.email.hasErrors = false; // assume no errors then test
        draft.email.value = action.value;
        return;

      case "emailAfterDelay":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true;
          draft.email.message = "You must provide a valid email address";
        }
        if (!draft.email.hasErrors) {
          draft.email.checkCount++;
        }
        return;

      case "emailUniqueResults":
        if (action.value) {
          draft.email.hasErrors = true;
          draft.email.isUnique = false;
          draft.email.message = "That email is already being used!";
        } else {
          draft.email.isUnique = true;
        }
        return;

      case "passwordImmediately":
        draft.password.hasErrors = false; // assume no errors then test
        draft.password.value = action.value;
        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true;
          draft.password.message = "Password cannot exceed 50 characters";
        }
        return;

      case "passwordAfterDelay":
        if (draft.password.value.length < 12) {
          draft.password.hasErrors = true;
          draft.password.message = "Password must be at least 12 characters!";
        }
        return;

      case "submitForm":
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  function Disp(type) {
    dispatch({ type });
  }

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => Disp("usernameAfterDelay"), 800);
      // const delay = setTimeout(() => dispatch({ type: "usernameAfterDelay" }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.username.value]);

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => Disp("emailAfterDelay"), 800);
      // const delay = setTimeout(() => dispatch({ type: "emailAfterDelay" }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.email.value]);

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => Disp("passwordAfterDelay"), 800);
      // const delay = setTimeout(() => dispatch({ type: "passwordAfterDelay" }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.password.value]);

  useEffect(() => {
    if (state.username.checkCount) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.post("/doesUsernameExist", { username: state.username.value }, { cancelToken: ourRequest.token });
          //console.log(response.data);
          dispatch({ type: "usernameUniqueResults", value: response.data });
        } catch (e) {
          console.log("There was a problem or the request was cancelled.");
        }
      }
      fetchResults();
      return () => ourRequest.cancel();
    }
  }, [state.username.checkCount]);

  useEffect(() => {
    if (state.email.checkCount) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.post("/doesEmailExist", { email: state.email.value }, { cancelToken: ourRequest.token });
          //console.log(response.data);
          dispatch({ type: "emailUniqueResults", value: response.data });
        } catch (e) {
          console.log("There was a problem or the request was cancelled.");
        }
      }
      fetchResults();
      return () => ourRequest.cancel();
    }
  }, [state.email.checkCount]);

  function handleSubmit(e) {
    e.preventDefault();
    // try {
    //   await Axios.post("/register", {
    //     username,
    //     email,
    //     password
    //   });
    //   console.log("User was successfully created.");
    // } catch (e) {
    //   console.log("Sign up problem!");
    //   console.log(e.response.data);
    // }
  }
  return (
    <Page title="Home Page" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Remember Writing?</h1>
          <p className="lead text-muted">Are you sick of short tweets and impersonal &ldquo;shared&rdquo; posts that are reminiscent of the late 90&rsquo;s email forwards? We believe getting back to actually writing is the key to enjoying the internet again.</p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input onChange={e => dispatch({ type: "usernameImmediately", value: e.target.value })} id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
              <CSSTransition in={state.username.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.username.message}</div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input onChange={e => dispatch({ type: "emailImmediately", value: e.target.value })} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
              <CSSTransition in={state.email.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.email.message}</div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input onChange={e => dispatch({ type: "passwordImmediately", value: e.target.value })} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
              <CSSTransition in={state.password.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.password.message}</div>
              </CSSTransition>
            </div>
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
              Sign up for ComplexApp
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
}

export default HomeGuest;
