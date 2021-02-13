import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const VideoPlayer = (props) => {

  const videoUrl = 'https://player.cloudinary.com/embed/'
  + '?cloud_name=' + publicRuntimeConfig.cloudinaryCloudName
  + '&public_id=' + props.room.videoId
  + '&fluid=true&controls=true&source_types%5B0%5D=mp4';

  return <iframe
    src={videoUrl}
    height="400"
    allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
    allowFullScreen
    frameBorder="0"></iframe>
}

export default VideoPlayer