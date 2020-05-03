import Vue from 'vue';
import eNotify from 'electron-notify';

import App from './App'
import router from './router'
import store from './store'

import AppIcon from '~/build/icons/256x256.png';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faDownload, faAngleDoubleDown,faWrench,faPlay,faPause,faVolumeUp,faVolumeOff,faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faDownload,faAngleDoubleDown,faWrench,faPlay,faPause,faVolumeUp,faVolumeOff,faBars);
Vue.component('font-awesome-icon', FontAwesomeIcon)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false;

eNotify.setConfig({
  appIcon: AppIcon,
  displayTime: 6000
});

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

eNotify.messages= {
  getLocale(name){
    return this.en[name];
  },
  en: {
    START_DOWNLOAD   : 'Start Download',
    START_CONVERT    : 'Start Convert',
    COMPLETE_CONVERT : 'Complete Convert',

    PLAY_MUSIC : 'Playing',
    PAUSE_MUSIC : 'Paused',
    MUTE_MUSIC : 'Muted',
    UNMUTE_MUSIC : 'Unmuted',
  }
};

Vue.prototype.$eNotify = eNotify;

Vue.mixin({
  methods: {
    fancyTimeFormat(time) {   
      // Hours, minutes and seconds
      var hrs = ~~(time / 3600);
      var mins = ~~((time % 3600) / 60);
      var secs = time % 60;

      // Output like "1:01" or "4:03:59" or "123:03:59"
      var ret = "";

      if (hrs > 0) {
          ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
      }

      ret += "" + mins + ":" + (secs < 10 ? "0" : "");
      ret += "" + secs;
      return ret;
    },
  },
});
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app')
