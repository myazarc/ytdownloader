import path from 'path';
import {appMainPath} from './pathHelper';

const Datastore = require('nedb')
  , db = new Datastore({ filename: path.join(appMainPath,'.ytDownloaderList.db'), autoload: true });

export default db;