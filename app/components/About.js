import React, { useEffect } from "react";
import Page from "./Page";

function About() {
  return (
    <Page title="About Us">
      <h2>About Us</h2>
      <p className="lead text-muted">CodeApp was created from a greate course by Brad Shiff. Essentially a blog so I figured I would use this to save info on difference courses.</p>
      <p>Could probably add something whereby users could add their own ratings/ comments. Will see.. </p>
      <p>For now, its up and running on the web. Frontend hosted on Netlify and backend on Heroku with database on Mongodb/cloud.</p>
    </Page>
  );
}

export default About;
