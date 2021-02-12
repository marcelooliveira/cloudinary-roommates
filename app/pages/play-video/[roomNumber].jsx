import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import Layout from "../../components/Layout";
import {Row, Col} from 'react-bootstrap'
import Card from "react-bootstrap/Card";
import { faBed as fasBed, faBath as fasBath, faCar as fasCar } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { default as NumberFormat } from 'react-number-format';
import useSWR from 'swr'
import netlifyIdentity from 'netlify-identity-widget';
import ApproveButton from '../../components/ApproveButton'
import VideoPlayer from '../../components/VideoPlayer';

const fetcher = (url) => fetch(url).then((r) => r.json());

const PlayVideo = () => {
  const [userEmail, setUserEmail] = useState('');
  const [widgetInitialized, setWidgetInitialized] = useState(false);
  const router = useRouter()
  const { roomNumber } = router.query
  const { data, error } = useSWR('/api/rooms/' + roomNumber, fetcher)

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
  
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
    
  return (
    <Layout>
      <div className="component-container p-4">
        <div className="center-panel">
          <Row>
              <Col className="col-xs-12 col-sm-12 col-md-12 p-3">
                <Card className="shadow">
                  <VideoPlayer room={data}/>
                    <Card.Body>
                      <h5 className="card-title">
                        <NumberFormat value={data.price} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                        &nbsp;/&nbsp;week
                        <FontAwesomeIcon icon={farHeart} className="text-danger float-right" />
                      </h5>
                      <Card.Text><b>{data.address}</b></Card.Text>
                      <Card.Text><b>owner: {data.owner}</b></Card.Text>
                      <Card.Text><b>userEmail: {userEmail}</b></Card.Text>
                      {/* <Card.Text><b>{JSON.stringify(data)}</b></Card.Text> */}
                      <Card.Text className="description" title="{realEstate.description}">
                        <b>
                          <FontAwesomeIcon icon={fasBed} />
                          <span>&nbsp;{data.bedrooms}&nbsp;</span>
                          <FontAwesomeIcon icon={fasBath} />
                          <span>&nbsp;{data.bathrooms}&nbsp;</span>
                          <FontAwesomeIcon icon={fasCar} />
                          <span>&nbsp;{data.cars}&nbsp;</span>
                        </b>
                      </Card.Text>
                    </Card.Body>
                </Card>
              </Col>
            </Row>
            { 
            data.pendingRequests
              && data.pendingRequests.map((requester) => {
                return <ApproveButton key={data.requester} userEmail={userEmail} requester={requester} room={data}/>
              })
            }
        </div>
      </div>
    </Layout>
  );
};

export default PlayVideo;
