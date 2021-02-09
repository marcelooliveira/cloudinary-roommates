import loki from 'lokijs';
import lfsa from 'lokijs/src/loki-fs-structured-adapter';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default function getDB(callback) {
  var adapter = new lfsa();
  let db;
  db = new loki(publicRuntimeConfig.lokiDatabase,
    {
      adapter: adapter,
      autoload: true,
      autoloadCallback: loadHandler
    });

  function loadHandler() {
    callback(db);
  }
}