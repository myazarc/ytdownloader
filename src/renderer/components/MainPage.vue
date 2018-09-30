<script>
import path from 'path';
import fs from 'fs';
const ytdl = require('ytdl-core');
import contextMenu from 'vue-context-menu';

import MusicPlayer from './MusicPlayer';

const ffmpeg = require('fluent-ffmpeg');

import {appMainPath,appVideosPath,appMusicPath} from '../../main/libs/pathHelper.js';
import ytHelper from '../../main/libs/ytHelper.js';
import db from '../../main/libs/dbHelper.js';
import audioHelper from '../../main/libs/audioHelper.js';


  export default {
    components: {MusicPlayer,contextMenu},
    data() {
      return {
        url: '',
        list: [],
        progressPercent: 0,
        progressShow: false,
        mPlayerInfo: {},
        menuData: null,
      };
    },
    created() {
      const self = this;
      db.find({}).limit(20).exec(function (err, docs) {
        self.list = docs;
      });
    },
    methods: {
      onCtxOpen(item) {
        this.menuData = item;
      },
      onCtxClose(item) {
      },
      resetCtxLocals() {
        this.menuData = null;
      },
      startMusic(data){
        if(fs.existsSync(data.fullPath)){
          this.mPlayerInfo = data;
        } else {
          this.$electron.remote.dialog.showMessageBox({
            type: 'error',
            buttons: ['Ok, Remove'],
            title: 'File Not Found!',
            message: 'The file could not be found in the location on the disk. You may have deleted or moved it. Removing it from the list.',
          });

          let currIndex = this.list.findIndex((item) => item.video_id == data.video_id);
          this.list.splice(currIndex,1);
          this.removeList(data);
        }
      },
      startAllMusic(){
        this.mPlayerInfo = this.list;
      },
      openDir(data){
        const {fullPath}=data;
        const newPathArr=fullPath.split('/');
        newPathArr.pop();
        const newPath=newPathArr.join('/');
        this.$electron.shell.openItem(newPath);
      },
      removeList(data){
        db.remove({
          video_id:data.video_id
        });
        const removedIndex=this.list.findIndex((item) => item.video_id == data.video_id);
        this.list.splice(removedIndex,1);
      },
      removeDisk(data){
        fs.unlinkSync(data.fullPath);
        this.removeList(data);
      },
      openSettings(){
        this.$electron.remote.getCurrentWindow().toggleDevTools();
      },
      pasteData(){
        document.execCommand('paste');
      },
      download(){
        
        ytHelper.getInfo(this.url).then((info) => {

          let output = path.resolve(appVideosPath, info.title+'.mp4');
          let outputMp3 = path.resolve(appMusicPath, info.title+'.mp3');
          info.fullPath=outputMp3;
          db.insert({
            video_id: info.video_id,
            title: info.title,
            thumbnail_url: info.thumbnail_url,
            length_seconds: info.length_seconds,
            fullPath: outputMp3,
          });

          info.progressShow=false;
          info.progressPercent=0;
                    this.list.push(info);

          let itemIndex=this.list.length - 1;
          ytHelper.download(this.url,output).then((res) =>{
            this.list[itemIndex].progressShow=true;
            let totalSize = res.headers['content-length'];
            let dataRead = 0;
            const self=this;
            res.on('data', function(data) {
              dataRead += data.length;
              let percent = dataRead / totalSize;
              self.list[itemIndex].progressPercent=(percent * 100).toFixed(2);
            });
            res.on('end', function() {
              self.list[itemIndex].progressShow = false;

              self.list[itemIndex].progressShow=true;
              let proc = new ffmpeg({source:output});

              if(process.env.NODE_ENV === 'production'){
                const ffPath=__dirname.replace('app.asar/dist/electron','app.asar.unpacked/node_modules/ffmpeg-binaries/bin/ffmpeg')
                proc.setFfmpegPath(ffPath);
              }else {
                proc.setFfmpegPath('./node_modules/ffmpeg-binaries/bin/ffmpeg');
              }
              proc.toFormat('mp3')
              .saveToFile(outputMp3)
              .on('progress', function(progress) {
                self.list[itemIndex].progressPercent = progress.percent.toFixed(2);
              })
              .on('end', () => {
                self.list[itemIndex].progressShow=false;
                fs.unlinkSync(output);
              });
            });
          });
        });
        

      }
    },
  }
</script>

<template>
  <div id="wrapper">
        <header>
      <div class="title noselect">YT.Downloader</div>
    </header>
    <div class="form-area">
      <input type="text" name="" v-model="url" class="url" placeholder="Paste Link" 
      @contextmenu.prevent="$refs.ctxMenuPaste.open($event)"/>
      <div class="button-area">
        <a class="btn fast-download" @click="download" title="Fast Download & Convert"><font-awesome-icon icon="angle-double-down" /></a>
        <a class="btn download" title="Download"><font-awesome-icon icon="download" /></a>
        <a class="btn settings" @click="openSettings" title="Settings"><font-awesome-icon icon="wrench" /></a>
      </div>
    </div>

    <section>
      <div class="title noselect">
        Downloads
      </div>

      <div class="download-list noselect" 
      @dblclick="startMusic(item)"
      @contextmenu.prevent="$refs.ctxMenu.open($event,item)"
      v-for="(item) in list"
      :key="item.video_id"
      >
        <div class="list-item">
          <div class="item-img">
            <img :src="item.thumbnail_url" alt="">
          </div>

          <div class="item-info">
            {{item.title}} - <small>{{fancyTimeFormat(item.length_seconds)}}</small><hr>

            <div class="progress-bar" v-show="item.progressShow">
             
              <div class="progress" :style="{width: item.progressPercent + '%' }"> 
                 {{item.progressPercent + '%'}}  
              </div>
            </div>
          </div>

          <div class="item-btn"></div>
        </div>
      </div>

      <context-menu id="context-menu" class="noselect" ref="ctxMenu" 
      @ctx-open="onCtxOpen" 
      @ctx-cancel="resetCtxLocals" 
      @ctx-close="onCtxClose">
        <li @click="startMusic(menuData)">Play</li>
        <li @click="startAllMusic">Play All</li>
        <li class="seperator"><hr/></li>
        <li @click="openDir(menuData)">Open in Directory</li>
        <li class="seperator"><hr/></li>
        <li @click="removeList(menuData)">Remove From List</li>
        <li @click="removeDisk(menuData)">Remove From Disk</li>
      </context-menu>

      <context-menu id="context-menu-paste" class="noselect" ref="ctxMenuPaste"
       >
        <li @click="pasteData">Paste <small>(CTRL + V)</small></li>
      </context-menu>

    </section>
    <music-player :info="mPlayerInfo"/>
  </div>
</template>

<style lang="scss">
  #wrapper{position: relative;height: 100%;}

  #context-menu, #context-menu-paste{
    li{
      cursor: pointer;
      height: 20px;
      line-height: 20px;
      padding-left: 3px;
        padding-right: 3px;
      
      &:hover:not(.seperator) {
        background-color: #aaa;
        color: #fff;
      }

      &.seperator{
        height: 6px;
        padding-top: 2.5px;
        
      }
    }
  }

  section{
      width: 100%;
    .title{
      height: 25px;
      text-align: center;
      line-height: 25px;
      width: 100%;
      color: #fff;
      border-bottom: 1px solid #aaa;
    }

    .download-list{
      width: 100%;
      height: 65px;
      background-color: #fff;

      &:hover{
        background-color: #aaa;
        cursor: pointer;
      }

      .item-img{
        width: 60px;
        height: 60px;
        margin-left: 5px;
        padding-top: 5px;
        text-align: center;
        float: left;

        img{
          width: 100%;
          height: 100%;
        }
      }

      .item-btn{
        width: 60px;
        height: 60px;
        margin-left: 5px;
        padding-top: 5px;
        float: right;
      }
      
      .item-info{
        float: left;
        width: calc(100% - 145px);
        height: 60px;
        padding-top: 5px;
        margin-left: 5px;

        .progress-bar{
          width: 100%;
          height: 25px;
          border: 1px solid #333;
          position: relative;

          .progress{
            position: absolute;
            width: 0%;
            height: 23px;
            background-color: crimson;
            top: 0px;
            left: 0px;
            text-align: center;
          line-height: 25px;
                    color: #333;

          }
        }
      }
    }
    
  }
</style>
