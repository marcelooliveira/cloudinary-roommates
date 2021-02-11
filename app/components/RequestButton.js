import Button from "react-bootstrap/Button";
import { faDownload as fasDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { mutate } from 'swr'

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
      return mutate('/api/rooms/' + room._id);
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

export default RequestButton;
