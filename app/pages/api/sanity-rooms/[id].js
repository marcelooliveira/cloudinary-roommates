import sanityClient from '@sanity/client'
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default async (req, res) => {
  const client = sanityClient({
    projectId: 'vlc5ujic',
    dataset: 'rooms',
    token: publicRuntimeConfig.sanityApiToken,
    useCdn: false // `false` if you want to ensure fresh data
  })

  const doc = {
    _id: '1',
    _type: 'room',
    number: 1,
    price: 124,
    address: "4762  Francis Mine 07:46PM",
    pic: "/img/01.jpg",
    bedrooms: 5,
    bathrooms: 4,
    cars: 3,
    owner: "mclricardo@gmail.com",
    videoId: ""
  }

  client.createOrReplace(doc).then(result => {
    res.status(200).json(result);
  })
}