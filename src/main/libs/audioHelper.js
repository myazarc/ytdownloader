import dataurl from 'dataurl';
const fs = require('fs')

export default {
  audio: new Audio(),
  isStart:false,
  list: [],
  async playOne(filePath){
    this.audio.pause();
    this.readFile(filePath).then((res) => {
      this.audio.src = dataurl.convert({ data: res, mimetype: 'audio/mp3' });
      this.audio.load();
      this.audio.play();
      this.isStart=true;
      this.audioEvents();
    });
  },
  audioEvents(){
    var self = this;
    self.audio.addEventListener('ended',function(){
      if(self.list.length){
        const next=self.list.shift();
        self.playOne(next.fullPath);
      }else {
        self.audio.removeEventListener('ended',() => {});
        self.isStart=false;
      }
    });
  },
  addList(data){
    this.list.push(data);
  },
  readFile(path) {
    return new Promise((res, rej) => {
        fs.readFile(path, (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
  }

}

