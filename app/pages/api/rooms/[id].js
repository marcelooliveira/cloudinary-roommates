import { data as roomData } from '../../../data/data.js';
import sanityClient from '@sanity/client'
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default async (req, res) => {
  const roomId = req.query['id'];
  
  switch (req.method) {
    case 'GET':
      if (!roomId) {
        res.status(400).end() //Bad Request
        return;
      }

      if (parseInt(roomId) > 0) {
        getRoom(res, roomId);
        return;
      }

      getAllRooms(res);
      break
    case 'POST':
      updateRoom(res, roomId, req.body);
      break
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break
  }

};

function getSanityClient() {
  return sanityClient({
    projectId: publicRuntimeConfig.sanityProjectId,
    dataset: 'rooms',
    token: publicRuntimeConfig.sanityApiToken,
    useCdn: false
  })
}

function getRoom(res, roomId) {
  const client = getSanityClient()

  const query = '*[_type == "room"]'
  const params = {}
  
  client.getDocument(roomId.toString()).then(doc => {
    if (!doc) {
      res.status(404).end(`room Id=${roomId} Not Found`);
      return;
    }

    res.status(200).json(doc);
  })
}

function getAllRooms(res) {
  const client = getSanityClient()

  const query = '*[_type == "room"]'
  const params = {}
  
  client.fetch(query, params).then(docs => {
    
    if (docs
      && docs.length > 0) {
        res.status(200).json(docs)
        return
    }

    roomData.forEach(room => {
      let doc = room
      doc._id = room.number.toString()
      doc._type = 'room'
      client.createOrReplace(doc)
    })
  
    client.fetch(query, params).then(docs => {
      res.status(200).json(docs)
    })
  })
}

function updateRoom(res, roomId, requestBody) {
  const client = getSanityClient()
  
  client.getDocument(roomId.toString()).then(doc => {
    if (!doc) {
      res.status(404).end(`room Id=${roomId} Not Found`);
      return;
    }

    if (requestBody.videoId) {
      doc.videoId = requestBody.videoId;
    }

    if (requestBody.pic) {
      doc.pic = requestBody.pic;
    }

    if (requestBody.requester) {
      if (!doc.pendingRequests) {
        doc.pendingRequests = [];
      }

      if (doc.pendingRequests.filter(e => e.login === requestBody.requester.login).length == 0) {
        doc.pendingRequests.push(requestBody.requester);
      }
    }

    if (requestBody.approvedRequester) {
      var filtered = doc.pendingRequests.filter(function(pendingRequest, index, arr){ 
        return pendingRequest.login != requestBody.approvedRequester.login;
      });
      
      doc.pendingRequests = filtered;
  
      if (!doc.approvedRequests) {
        doc.approvedRequests = [];
      }
      doc.approvedRequests.push(requestBody.approvedRequester);
    }

    client.createOrReplace(doc)

    res.status(200).json(doc)
  })

}