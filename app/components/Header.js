import React from "react";
import {Row, Col} from 'react-bootstrap'
import { useRouter } from "next/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome as fasHome, faBed as fasBed, faBath as fasBath, faCar as fasCar } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const router = useRouter();
  return (
    <header>
      <Row>
        <Col sm={6}>
          <nav className="login-menu">
            <ul>
              <li>
                <h3 className="title m-0 p-2">
                <FontAwesomeIcon icon={fasHome} />
                &nbsp;
                Roommate Matching App
                &nbsp;
                <FontAwesomeIcon icon={fasHome} />
                </h3>
              </li>
            </ul>
          </nav>
        </Col>
        <Col sm={6}>
          <div data-netlify-identity-menu></div>
        </Col>
      </Row>
      
      <style jsx>{`
        ul {
          display: flex;
          list-style: none;
          margin-left: 0;
          padding-left: 0;
        }

        li {
          margin-right: 1rem;
          display: flex;
        }

        li:first-child {
          margin-left: auto;
        }

        a {
          color: #fff;
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        a img {
          margin-right: 1em;
        }

        header {
          padding: 0.2rem;
          color: #fff;
          background-color: #333;
        }
      `}</style>
    </header>
  );
};

export default Header;
