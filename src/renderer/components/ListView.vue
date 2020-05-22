<template>
  <div class="listview-container" style="max-height:80%">
    <div class="listview-info">
      Type<select>
        <option>Video</option>
        <option>Audio</option>
      </select>
    </div>
    <div class="listview-header">
      <div class="listview-row">
        <div class="listview-col listview-col_1">#</div>
        <div class="listview-col listview-col_2">Format</div>
        <div class="listview-col listview-col_1">Quality</div>
        <div class="listview-col listview-col_1">Bitrate</div>
      </div>
    </div>
    <div class="listview-body">
      <div class="listview-row" v-for="(format,formatIndex) in this.formats" :key="formatIndex">
        <div class="listview-col listview-col_1">
          <input type="radio"/>
        </div>
        <div class="listview-col listview-col_2" :title="`codec(s): ${format.codec}`">{{format.ext}}</div>
        <div class="listview-col listview-col_1">{{format.quality}}</div>
        <div class="listview-col listview-col_1">{{format.bitrate}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    data:{
      type:Object,
      default() {
        return {
        formats:[]
        }
      },
    }
  },
  computed:{
    formats(){

      return this.data.formats.map(format => {
        const parsedMime=this.parseMime(format.mimeType);
        return {
          ...parsedMime,
          quality:format.quality,
          bitrate: format.bitrate,
          itag: format.itag
        };
      })
    }
  },
  data(){
    return {
      mimeTypes:{
        'video/mp4': 'mp4',
        'video/webp': 'webp',
      }
    }
  },
  methods:{
    parseMime(mime){
      const parsedMime=mime.split(';');


      return {
        ext:this.convertExt(parsedMime[0]),
        codec: this.convertCodec(parsedMime[1]),
      };
    },
    convertExt(mimeType){
      if(mimeType in this.mimeTypes){
        return this.mimeTypes[mimeType];
      }
      return mimeType;
    },
    convertCodec(codecStr){
      const regx=/(\=\")(.*)(\")/gmi;

      const res=regx.exec(codecStr);

      return res[2];
    },
  },
} 
</script>

<style lang="scss">
  .listview-header{
    height: 25px;
    width: 100%;
    
    .listview-row{
      height: 25px;
      border-bottom: 1px solid #aaa;
      width: 100%;
    
      .listview-col{
        float:left;
        text-align: center;
        font-weight: bold;
        line-height: 25px;

        &_1{
          width: (100% / 5);
        }

        &_2{
          width: (100%/4);
        }

        &_3{
          width: (100%/3);
        }

        &_4{
          width: (100%/2);
        }

        &_5{
          width: (100%/1);
        }
      }
    }
    
  }

  .listview-body{
    height: 25px;
    width: 100%;
    
    .listview-row{
      height: 25px;
      border-bottom: 1px solid #aaa;
      width: 100%;
    
      .listview-col{
        float:left;
        line-height: 25px;

        &_1{
          width: (100% / 5);
        }

        &_2{
          width: (100%/4);
        }

        &_3{
          width: (100%/3);
        }

        &_4{
          width: (100%/2);
        }

        &_5{
          width: (100%/1);
        }
      }
    }
    
  }
</style>