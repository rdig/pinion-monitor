#!/usr/bin/env node
const { default: Pinner } = require('../lib');
const { config } = require('dotenv');
const debug = require('debug').default;

const logMonitor = debug('pinion-monitor:log');
const logError = debug('pinion-monitor:fault');

if (process.env.NODE_ENV !== 'production') config();

const {
  PINION_ROOM: room,
  PINION_IPFS_PRIVATE_KEY: ipfsPrivateKey,
  PINION_IPFS_REPO: ipfsRepo,
} = process.env;

if (!room) {
  throw new Error('PINION_ROOM has to be specified.');
}

const pinner = new Pinner(room, {
  ipfsPrivateKey,
  ipfsRepo,
});

pinner
  .start()
  .then(() => {
    logMonitor(`Started in room ${room}`);
  })
  .catch(caughtError => {
    logError('CRASHED!');
    logError('Exiting...');
    logError(caughtError);
    process.exit(1);
  });
