import { useState } from 'react';
import {Row, Col} from 'react-bootstrap'
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { faUserCheck as fasUserCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { mutate } from 'swr'
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const ApproveButton = (props) => {
  let userEmail = props.userEmail;
  let room = props.room;
  let requester = props.requester;

  const [showApproveButton, setShowApproveButton] = useState(true)
              
  const approveRequest = async (room, requester) => {
    fetch('/api/rooms/' + room._id, {
      method: 'POST',
      body: JSON.stringify({ approvedRequester: requester }),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(res => {
      setShowApproveButton(false)
      return mutate(room);
    });
  }

  return showApproveButton 
    && (userEmail && userEmail == room.owner
      && room.pendingRequests)
    ? (<Row>
    <Col>
      <Card className="shadow">
        <Card.Body>
          <Card.Text>
            User <b>{requester}</b> has requested to watch this video.
            &nbsp;
            <Button size="sm" className="btn-success"
            onClick={approveRequest.bind(this, room, requester)}>
              <FontAwesomeIcon icon={fasUserCheck} />&nbsp;Approve
            </Button>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  </Row>)
  : null
}

export default ApproveButton;