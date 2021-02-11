import React, { useState, useEffect } from 'react';
import Layout from "../components/Layout";
import {Row, Col} from 'react-bootstrap'
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Image from 'next/image'
import { faHome as fasHome, faBed as fasBed, faBath as fasBath, faCar as fasCar } from '@fortawesome/free-solid-svg-icons';
import { faUpload as fasUpload, faPlay as fasPlay, faDownload as fasDownload, faClock as fasClock } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { config } from '@fortawesome/fontawesome-svg-core'
import { default as NumberFormat } from 'react-number-format';
import netlifyIdentity from 'netlify-identity-widget';
import useSWR, { mutate } from 'swr'
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const fetcher = (url) => fetch(url).then((r) => r.json());

const UploadButton = (props) => {
    let room = props.room;
    let userEmail = props.userEmail;

    const uploadMediaClick = async (room) => {

      var myWidget = cloudinary.createUploadWidget({
        cloudName: publicRuntimeConfig.cloudinaryCloudName,
        upload_preset: publicRuntimeConfig.cloudinaryUploadPreset,
        showAdvancedOptions: true
      }, (error, result) => {
  
        if (result.event == "success") {
  
          console.log(result.info);
  
          if (result.info.resource_type == "image") {
            fetch('/api/rooms/' + room._id, {
              method: 'POST',
              body: JSON.stringify({ pic: result.info.secure_url }),
              headers: {
                'Content-Type': 'application/json'
              },
            })
            .then(res => mutate(room));
          }
  
          if (result.info.resource_type == "video") {
            fetch('/api/rooms/' + room._id, {
              method: 'POST',
              body: JSON.stringify({ videoId: result.info.public_id }),
              headers: {
                'Content-Type': 'application/json'
              },
            })
            .then(res => mutate(room));
          }
        }
        else {
          console.log(error);
        }
      })
  
      myWidget.update({tags: ['room-' + room._id]});
      myWidget.open();
    }
  
    return (userEmail === room.owner)
      ? (<span>
        <button
          name="upload_widget"
          className="btn btn-primary btn-sm"
          onClick={uploadMediaClick.bind(this, room)}><FontAwesomeIcon icon={fasUpload} />&nbsp;Upload Media</button>
      &nbsp;
      </span>)
      : null
  }


const PlayButton = (props) => {
  let room = props.room;
  let userEmail = props.userEmail;

  return (room.videoId && userEmail === room.owner)
  ? (<span>
        <Button
        href={`/play-video/${room.number}`}
        target="_blank" size="sm" className="btn-success"><FontAwesomeIcon icon={fasPlay} />&nbsp;Play Video
        </Button>
        &nbsp;
      </span>)
  : null
}

const RequestButton = (props) => {
  let room = props.room;
  let userEmail = props.userEmail;

  const requestVideo = async (room) => {
    fetch('/api/rooms/' + room._id, {
      method: 'POST',
      body: JSON.stringify({ requester: userEmail }),
      headers: {
          'Content-Type': 'application/json'
      },
    })
    .then(res => {
      alert('You have requested the video for this room. Wait until the owner accept your solicitation.')
      return mutate(room);
    });
  }

  return (room.videoId && userEmail && userEmail != room.owner
    && (!room.pendingRequests
      || room.pendingRequests
      .filter(e => e === userEmail).length === 0)
      && (!room.approvedRequests
        || room.approvedRequests
        .filter(e => e && (e == userEmail)).length == 0))
        ? (<span>
              <Button size="sm" className="btn-warning"
                onClick={requestVideo.bind(this, room)}>
                <FontAwesomeIcon icon={fasDownload} />&nbsp;Request Video
              </Button>
              &nbsp;
            </span>)
        : null
}

const PendingRequestButton = (props) => {
  let room = props.room;
  let userEmail = props.userEmail;

  return (room.videoId && userEmail && userEmail != room.owner
    && room.pendingRequests
    && room.pendingRequests
    .filter(e => e == userEmail).length > 0) 
    ? <span>
      <Button size="sm" className="btn-warning" disabled>
        <FontAwesomeIcon icon={fasClock} />&nbsp;Request Pending
      </Button>
      &nbsp;
    </span>
    : null
}

const ApprovedRequestButton = (props) => {
  let room = props.room;
  let userEmail = props.userEmail;

  return (room.videoId && userEmail && userEmail != room.owner
    && room.approvedRequests
    && room.approvedRequests
    .filter(e => e && (e == userEmail)).length > 0) 
    ? 
    <span>
      <Button target="_blank" size="sm" className="btn-success"
      href={`/play-video/${room._id}`}>
        <FontAwesomeIcon icon={fasPlay} />&nbsp;Watch Video
      </Button>
      &nbsp;
    </span>
    : null
}

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
