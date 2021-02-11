import React, { useState, useEffect } from 'react';
import Layout from "../components/Layout";
import {Row, Col} from 'react-bootstrap'
import Card from "react-bootstrap/Card";
import Image from 'next/image'
import { faHome as fasHome, faBed as fasBed, faBath as fasBath, faCar as fasCar } 
    from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { config } from '@fortawesome/fontawesome-svg-core'
import { default as NumberFormat } from 'react-number-format';
import netlifyIdentity from 'netlify-identity-widget';
import useSWR, { mutate } from 'swr'
import getConfig from 'next/config';
import UploadButton from "../components/UploadButton";
import PlayButton from "../components/PlayButton";
import RequestButton from "../components/RequestButton";
import PendingRequestButton from "../components/PendingRequestButton";
import ApprovedRequestButton from "../components/ApprovedRequestButton";

const { publicRuntimeConfig } = getConfig();

const fetcher = (url) => fetch(url).then((r) => r.json());

const Home = () => {
  config.autoAddCss = false
  const [userEmail, setUserEmail] = useState('');
  const [widgetInitialized, setWidgetInitialized] = useState(false);
  const { data, error } = useSWR('/api/rooms/0', fetcher)

  useEffect(() => {
    if (!widgetInitialized) {
      netlifyIdentity.on('init', () => {
        setUserEmail(netlifyIdentity.currentUser()?.email)
      })
      netlifyIdentity.on('login', () => {
        setUserEmail(netlifyIdentity.currentUser()?.email)
      })
      netlifyIdentity.on('logout', () => {
        setUserEmail('')
      })
      netlifyIdentity.init();
      setWidgetInitialized(true)
    }
  })

  return (
    <Layout>
      <div className="center-panel">
        <h3>Rooms Available</h3>
        <Row>
          {data && data.map((room) => {

            return (
              <Col key={room.number} id="hits" className="col-xs-12 col-sm-6 col-md-4 p-3">
                <Card className="shadow">
                  <Image src={room.pic} className="card-img-top img-estate" width={500} height={333}></Image>
                  <Card.Body>
                    <h5 className="card-title">
                      <NumberFormat value={room.price} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                      &nbsp; /&nbsp; week
                      <FontAwesomeIcon icon={farHeart} className="text-danger float-right" />
                    </h5>
                    <Card.Text><b>{room.address}</b></Card.Text>
                    {/* <Card.Text><b>{JSON.stringify(room)}</b></Card.Text> */}
                    <Card.Text><b>owner: {room.owner}</b></Card.Text>
                    <Card.Text className="description" title="{realEstate.description}">
                      <b>
                        <FontAwesomeIcon icon={fasBed} />
                        <span>&nbsp;{room.bedrooms}&nbsp;</span>
                        <FontAwesomeIcon icon={fasBath} />
                        <span>&nbsp;{room.bathrooms}&nbsp;</span>
                        <FontAwesomeIcon icon={fasCar} />
                        <span>&nbsp;{room.cars}&nbsp;</span>
                      </b>
                    </Card.Text>
                    <Card.Text>
                      <UploadButton userEmail={userEmail} room={room}/>
                      <PlayButton userEmail={userEmail} room={room}/>
                      <RequestButton userEmail={userEmail} room={room}/>
                      <PendingRequestButton userEmail={userEmail} room={room}/>
                      <ApprovedRequestButton userEmail={userEmail} room={room}/>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </Layout>
  );
}

export default Home
