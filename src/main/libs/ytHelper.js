import fs from 'fs';
const ytdl = require('ytdl-core');

export default {
  getInfo(url){
    return new Promise((resolve, reject) => {
      ytdl.getBasicInfo(url, (err, info) => {
        if (err) reject(err);
        resolve(info);
      });
    });
  },
  download(url,videoFullPath){
    return new Promise((resolve, reject) => {
      const video = ytdl(url);
        video.pipe(fs.createWriteStream(videoFullPath));
        video.on('response', function(res) {
          resolve(res);
        });
        video.on('error', function(res) {
          reject(res);
        });
      });
  },

};