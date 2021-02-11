import Button from "react-bootstrap/Button";
import { faUpload as fasUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { mutate } from 'swr'
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

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
          .then(res => mutate('/api/rooms/' + room._id));
        }

        if (result.info.resource_type == "video") {
          fetch('/api/rooms/' + room._id, {
            method: 'POST',
            body: JSON.stringify({ videoId: result.info.public_id }),
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(res => mutate('/api/rooms/' + room._id));
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
      <Button
        name="upload_widget"
        className="btn btn-primary btn-sm"
        onClick={uploadMediaClick.bind(this, room)}><FontAwesomeIcon icon={fasUpload} />&nbsp;Upload Media</Button>
    &nbsp;
    </span>)
    : null
}

export default UploadButton;