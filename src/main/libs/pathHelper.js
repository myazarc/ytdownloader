import path from 'path';
import fs from 'fs';
import {remote} from 'electron';

const {build} = require('../../../package.json');


const appMainPath = path.join(remote.app.getPath('documents'),build.productName);
if(!fs.existsSync(appMainPath)){
  fs.mkdirSync(appMainPath);
}

const appVideosPath = path.join(appMainPath,'Videos');
if(!fs.existsSync(appVideosPath)){
  fs.mkdirSync(appVideosPath);
}

const appMusicPath = path.join(appMainPath,'Music');
if(!fs.existsSync(appMusicPath)){
  fs.mkdirSync(appMusicPath);
}

export default {appMainPath,appVideosPath,appMusicPath};

export {appMainPath,appVideosPath,appMusicPath};