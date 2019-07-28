import assert = require('assert');
import debug = require('debug');
import EventEmitter = require('events');
import { Entry } from 'ipfs-log';

import IPFS from 'ipfs';

import { ClientActions, PinnerActions } from './actions';

import IPFSNode from './IPFSNode';

const logMonitor = debug('pinion-monitor:log');
const logError = debug('pinion-monitor:error');

interface Options {
  ipfsPrivateKey?: string;
  ipfsRepo?: string;
}

class Pinion {
  private readonly ipfsNode: IPFSNode;

  public readonly events: EventEmitter;

  constructor(
    room: string,
    { ipfsPrivateKey, ipfsRepo = './ipfs' }: Options = {},
  ) {
    assert(room && room.length, 'Pinning room is required for pinion to start');

    this.events = new EventEmitter();

    this.ipfsNode = new IPFSNode(this.events, room, {
      repo: ipfsRepo,
      privateKey: ipfsPrivateKey,
    });
  }

  public async start(): Promise<void> {
    await this.ipfsNode.start();
    logMonitor(`Monitor ID: ${this.ipfsNode.id}`);
  }

  public async close(): Promise<void> {
    logMonitor('Closing...');
    await this.ipfsNode.stop();
    this.events.removeAllListeners();
  }
}

export default Pinion;
