import Button from "react-bootstrap/Button";
import { faPlay as fasPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const PlayButton = (props) => {
  let room = props.room;
  let userEmail = props.userEmail;

  return (room.videoId && userEmail === room.owner)
  ? (<span>
        <Button
        href={`/details/${room.number}`}
        target="_blank" size="sm" className="btn-success"><FontAwesomeIcon icon={fasPlay} />&nbsp;Play Video
        </Button>
        &nbsp;
      </span>)
  : null
}

export default PlayButton;