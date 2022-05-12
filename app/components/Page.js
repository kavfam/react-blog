import React, { useEffect } from "react";
import Container from "./Container";

function Page(props) {
  // useEffect(a,b) : a = function to run and b is the dependency being checked for changes. b =[] tells React only run this the FIRST time the component is rendered
  useEffect(() => {
    document.title = `${props.title} | ComplexApp`;
    window.scrollTo(0, 0);
  }, [props.title]);
  return <Container wide={props.wide}>{props.children}</Container>;
}

export default Page;
