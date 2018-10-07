<script>
import Vue from 'vue';
import fs from 'fs';
import vueSlider from 'vue-slider-component';
import audioHelper from '../../main/libs/audioHelper.js';

export default {
  props: {
    sliderAudio: {
      type: Number,
      default: () => 0,
    },
    sliderTime: {
      type: Number,
      default: () => 0,
    },
    info:{
      type: [Object,Array],
    },
  },
  components: {
    vueSlider
  },
  data(){
    return {
      sliderAudioVal: this.sliderAudio,
      sliderTimeVal: this.sliderTime,

      sliderMaxTime: 100,

      totalTime: 0,
      currTime: 0,

      playIcon: 'play',
      muteIcon: 'volume-up',

      playStatus: 0,
      muteStatus: 0,

      playList: [],
      playListIndex: 0,

      playListShow:false,
      playListCss: {
        button: '-20px',
        list: '0px',
      },
      playListItemSelectedIndex: -1,
      
    }
  },
  created(){
    audioHelper.audio.ontimeupdate=() => {
      this.currTime=parseInt(audioHelper.audio.currentTime);
      this.sliderTimeVal=this.currTime;
    };
    audioHelper.audio.onplaying= () => {
      this.totalTime=parseInt(audioHelper.audio.duration);
      this.sliderMaxTime=this.totalTime;
    };
    audioHelper.audio.onplay=() => {
      this.$eNotify.notify({ title: this.$eNotify.messages.getLocale('PLAY_MUSIC'), text: this.getTitle() });
      this.playIcon='pause';
      this.playStatus = 1;
    };
    audioHelper.audio.onpause=() => {
      this.playIcon='play';
      this.playStatus = 0;
    };
    const lastVol=localStorage.getItem('mplayer-vol') || audioHelper.audio.volume;
    audioHelper.audio.volume=lastVol;
    this.sliderAudioVal=lastVol * 100;

    this.$electron.ipcRenderer.on('mp-volume-up', () => {
      this.setVolumeUp();
    });

    this.$electron.ipcRenderer.on('mp-volume-down', () => {
      this.setVolumeDown();
    });

    this.$electron.ipcRenderer.on('mp-volume-mute', () => {
      this.setMute();
    });

    this.$electron.ipcRenderer.on('mp-media-next', () => {
      this.setNextMusic();
    });

    this.$electron.ipcRenderer.on('mp-media-prev', () => {
      this.setPrevMusic();
    });

    this.$electron.ipcRenderer.on('mp-play-pause', () => {
      this.setPlayPause();
    });
  },
  watch:{
    info() {
      this.setPlayerListAndPlay();
    } ,
  },
  methods: {
    setCurrentTime(time){
      audioHelper.audio.currentTime=time;
    },
    setCurrentVolume(vol){
      audioHelper.audio.volume=vol/100;
      localStorage.setItem('mplayer-vol',vol/100);
    },
    setVolumeDown(){
      if(0>audioHelper.audio.volume && audioHelper.audio.volume<=0.2){
        audioHelper.audio.volume=0;
        localStorage.setItem('mplayer-vol',0);
      }else if(audioHelper.audio.volume>0.2){
        audioHelper.audio.volume-=0.2;
        localStorage.setItem('mplayer-vol',audioHelper.audio.volume);
      }
          this.sliderAudioVal=audioHelper.audio.volume * 100;

    },
    setVolumeUp(){
      if(audioHelper.audio.volume>=0.8 && audioHelper.audio.volume<1){
        audioHelper.audio.volume=1;
        localStorage.setItem('mplayer-vol',1);
      }else if(audioHelper.audio.volume<0.8){
        audioHelper.audio.volume+=0.2;
        localStorage.setItem('mplayer-vol',audioHelper.audio.volume);
      }
      this.sliderAudioVal=audioHelper.audio.volume * 100;

    },
    setNextMusic(){
      if(!this.playList.length) return;
      if(this.playListIndex < this.playList.length && this.playListIndex != this.playList.length-1){
        this.playListIndex++;
      }else {
        this.playListIndex = 0; 
      }
      audioHelper.playOne(this.playList[this.playListIndex].fullPath);
    },
    setPrevMusic(){
      if(!this.playList.length) return;
      if(this.playListIndex > 0 && this.playListIndex != this.playList.length-1){
        this.playListIndex--;
      }else {
        this.playListIndex = this.playList.length - 1; 
      }
      audioHelper.playOne(this.playList[this.playListIndex].fullPath);
    },
    setPlayPause(){
      if(this.playStatus == 0) {
        if(!audioHelper.isStart){
          this.setPlayerListAndPlay();
        }else{
          audioHelper.audio.play();
        }
        
      } else {
        audioHelper.audio.pause();
        this.$eNotify.notify({ title: this.$eNotify.messages.getLocale('PAUSE_MUSIC'), text: this.getTitle() });
      }
    },
    setMute(){
      this.muteStatus=!this.muteStatus;

      if(this.muteStatus) {
        this.muteIcon = 'volume-off';
        audioHelper.audio.muted=true;
        this.$eNotify.notify({ title: this.$eNotify.messages.getLocale('MUTE_MUSIC'), text: this.getTitle() });
      } else {
        this.muteIcon = 'volume-up';
        audioHelper.audio.muted=false;
        this.$eNotify.notify({ title: this.$eNotify.messages.getLocale('UNMUTE_MUSIC'), text: this.getTitle() });
      }
    },
    setPlayerListAndPlay(){
      this.playListIndex=0;
      this.playList = new Array();
      audioHelper.audio.removeEventListener('ended',() => {});
      if(this.info.constructor.name == new Array().constructor.name) {
        this.playList = this.info;
      }else {
        this.playList.push(this.info);
      }
      this.playList.map(v => v.isError = false);
      /*
      if(this.playList.length > this.playListIndex) {
        while(true){
          if(fs.existsSync(this.playList[this.playListIndex].fullPath)){
            break;
          }else {
            if(this.playList.length > this.playListIndex) {
              this.playList[this.playListIndex].isError=true;
              this.playListIndex++;
            }else {
              return;
            }
          }
        }
      }
      */
      audioHelper.playOne(this.playList[this.playListIndex].fullPath);
      var self = this;
      audioHelper.audio.addEventListener('ended',function(){
        self.playListIndex++;        

        if(self.playList.length > self.playListIndex){
          /* while(true){
            if(fs.existsSync(self.playList[self.playListIndex].fullPath)){
              break;
            }else {
              if(self.playList.length > self.playListIndex) {
                self.playList[self.playListIndex].isError=true;
                self.playListIndex++;
              }else {
                audioHelper.audio.removeEventListener('ended',() => {});
                audioHelper.isStart=false;
                self.playListIndex = 0;
                self.totalTime = 0;
                self.currentTime = 0;
                return;
              }
            }
          }
          */
          audioHelper.playOne(self.playList[self.playListIndex].fullPath);
        }else {
          audioHelper.audio.removeEventListener('ended',() => {});
          audioHelper.isStart=false;
          self.playListIndex = 0;
          self.totalTime = 0;
          self.currentTime = 0;
        }
      });
    },
    getTitle(){
      if(this.playList.length){
        return this.playList[this.playListIndex].title;
      }

      return '';
    },
    showList(){
      this.playListShow = !this.playListShow;
      if(!this.playListShow) {
        this.playListCss.button = '-20px';
        this.playListCss.list = '0px';
      } else {
        this.playListCss.button = '-270px';
        this.playListCss.list = '-250px';
      }
    },
    selectListItem(item,index){
      this.playListItemSelectedIndex=index;
    },
    playListItem(item,index){
      this.playListIndex=index;
      audioHelper.playOne(this.playList[index].fullPath);
    },
  },
}
</script>

<template>
<div id="playAndListArea" class="noselect">
    <div id="listArea">
      <div id="listAreaButton" :style="{top: playListCss.button}" @click="showList">
        <font-awesome-icon icon="bars"/>
        ({{playList.length}})
      </div>
      <div id="listAreaList" :style="{top: playListCss.list}"
      >
        <div id="listAreaItem" v-for="(playItem,index) in playList"
        :class="{playing: playListIndex == index, active: playListItemSelectedIndex==index, error: playItem.isError}"
        :key="index"
        @click="selectListItem(playItem,index)"
        @dblclick="playListItem(playItem,index)"
        >
          <div id="itemText" v-text="playItem.title"></div>
          <div id="itemTime" v-text="fancyTimeFormat(playItem.length_seconds)"></div>
        </div>
      </div>
    </div>
  <div id="musicPlayer">
    <div id="playPauseArea" @click="setPlayPause">
      <font-awesome-icon :icon="playIcon"/>
    </div>

    <div id="playTitleArea" v-text="getTitle()">
    </div>

    <div id="playMuteArea">
      <div id="playMuteBtn" @click="setMute">
        <font-awesome-icon :icon="muteIcon"/>
      </div>
      <div id="playMuteSlider">
        <vue-slider ref="sliderAudio" v-model="sliderAudioVal" @callback="setCurrentVolume" :tooltip="false"></vue-slider>
      </div>
    </div>

    <div id="playSliderArea">
      <div id="playSlider">
        <vue-slider ref="sliderTime" v-model="sliderTimeVal" :max="sliderMaxTime" @callback="setCurrentTime" :tooltip="false"></vue-slider>
      </div>
      <div id="playSliderTime">
        {{fancyTimeFormat(currTime)}}/{{fancyTimeFormat(totalTime)}}
      </div>
    </div>
  </div>
</div>
</template>

<style lang="scss">

#playAndListArea{
  width: 100%;
  position: absolute;
  left: 0px;
  bottom: 0px;
  height: 65px;
}
  #listArea{
      position: absolute;
      top:0px;
      left: 0px;
      width: 100%;
      z-index: 99;

      #listAreaButton{
        position: absolute;
        width: 40px;
        height: 20px;
        background-color: tomato;
        right: 9px;
        bottom: 65px;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        color: #fff;
        text-align: center;
        line-height: 20px;
        cursor: pointer;
        transition: top .8s ease-out;
        z-index: 101;

        &:hover {
          background-color: darken($color: #ff6347, $amount: 5);
        }
      }

      #listAreaList{
        width: 100%;
        height: 250px;
        z-index: 1;
        position: absolute;
        left: 0px;
        bottom: 0px;
        overflow-y: auto; 
        transition: top .8s ease-out;
        background-color: #ff6347;

       
        $item-height: 25px;

        #listAreaItem{
          width: 100%;
          height: $item-height;
          border-bottom: 1px solid lighten($color: rgb(255, 99, 71), $amount: 8);
          cursor: pointer;

          &.playing{
            color: rgb(107, 9, 76);
          }

          &.active{
            background-color: lighten($color: rgb(255, 99, 71), $amount: 8);
          }

          &.error{
            color: red;
          }

          #itemText{
            width: calc(100% - 80px);
            height: $item-height;
            float: left;
            line-height: $item-height;
            padding-left: 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          #itemTime{
            width: 80px;
            height: $item-height;
            float: left;
            line-height: $item-height;
            text-align: right;
            padding-right: 5px;
          }
        }

      }
      
    }

  #musicPlayer{
    width: 100%;
    height: 65px;
    background-color: tomato;
    position: absolute;
    left: 0px;
    bottom: 0px;
    z-index: 100;
    border-top: 1px solid #fff;
    

    #playPauseArea{
      width: 55px;
      height: 55px;
      margin-left: 5px;
      margin-top: 5px;
      text-align: center;
      line-height: 55px;
      font-size: 25px;
      color: #fff;
      border: 1px solid salmon;
      float: left;

      &:hover{
        background-color: salmon;
        cursor: pointer;
      }
      
    }

    #playTitleArea{
      width: calc(100% - 70px);
      float: left;
      height: 30px;
      color: #fff;
      margin-left: 10px;
      line-height: 30px;
    }

    #playMuteArea{
      float: left;
      width: 150px;
      height: 30px;
      margin-left: 10px;

      #playMuteBtn{
        width: 30px; 
        height: 30px;
        font-size: 20px;
        color: #fff;
        border: 1px solid salmon;
        text-align: center;
        line-height: 30px;
        float: left;
        
        &:hover{
          background-color: salmon;
          cursor: pointer;
        }
      }

      #playMuteSlider{
        width: 110px;
        height: 30px;
        float: left;
        margin-left: 10px;
      }

    }

    #playSliderArea{
      width: calc(100% - 230px);
      height: 30px;
      margin-left: 5px;
      float: left;

      #playSlider{
        width: calc(100% - 90px);
        height: 30px;
        float: left;
      }

      #playSliderTime{
        float: left;
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #fff;
        font-size: 12px;
      }
    }
  }
</style>
