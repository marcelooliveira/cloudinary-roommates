import Button from "react-bootstrap/Button";
import { faClock as fasClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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

export default PendingRequestButton;