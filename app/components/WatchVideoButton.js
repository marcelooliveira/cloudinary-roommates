import Button from "react-bootstrap/Button";
import { faPlay as fasPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const WatchVideoButton = (props) => {
  let room = props.room;
  let userEmail = props.userEmail;

  return (room.videoId && userEmail && userEmail != room.owner
    && room.approvedRequests
    && room.approvedRequests
    .filter(e => e && (e == userEmail)).length > 0) 
    ? 
    <span>
      <Button target="_blank" size="sm" className="btn-success"
      href={`/details/${room._id}`}>
        <FontAwesomeIcon icon={fasPlay} />&nbsp;Watch Video
      </Button>
      &nbsp;
    </span>
    : null
}

export default WatchVideoButton
