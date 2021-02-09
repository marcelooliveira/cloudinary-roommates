import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import Head from "next/head";
import Header from "./Header";
import PropTypes from "prop-types";
import { config, dom } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

const Layout = ({ children }) => {

  return (
    <>
      <Head>
        <style>{dom.css()}</style>
        <title>Your Roommate Matching App</title>
        <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript"></script>
        <script type="text/javascript" src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
      </Head>
      <style jsx global>{`
      
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }
      
      body {
        margin: 0;
        color: #333;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        "Helvetica Neue", Arial, Noto Sans, sans-serif, "Apple Color Emoji",
        "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      }
      
      .container {
        max-width: 65rem;
        margin: 1.5rem auto;
        padding-left: 1rem;
        padding-right: 1rem;
      }
      `}</style>
      <Header />
      <main>
        <link rel="stylesheet" type="text/css" href="../app.css" />
        <div className="container">{children}</div>
      </main>
    </>
  );
};

export default Layout;

Layout.propTypes = {
  children: PropTypes.node,
};
