<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'ytdownloader',
  }
</script>

<style lang="scss">
*:focus {
    outline: none;
}
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html{
    height: 100%;
  }
  body{
    font-family: Ubuntu;
    font-size: 14px;
    background-color: #111111;
    overflow: hidden;
    height: 100%;
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}
    #app{
      height: 100%;
    }
  }

  header{
   background-color: #2C001E;
   height: 25px;
   width: 100%;

    .title{
      width: 100%;
      height: 25px;
      color: #fff;
      line-height: 25px;
      text-align: center;
    }
  }

  .form-area{
    width: 100%;

    height: 35px;

    input{
      width: calc( 100% - 112px );
      height: 35px;
      float: left;
      border: 0px;
      background-color: rgba(rgb(161, 73, 133), 0.7);
      color: #fff;
      padding: 0 5px;

      &::-webkit-input-placeholder {
        text-align: center;
        color: #aaa;
      }

    }
    .button-area{
      width: 112px;
      height: 35px;
      float: left;
    }

    .btn{
      display: inline-block;
      height: 35px;
      width: 35px;
      text-align: center;
      line-height: 35px;
      background-color: rgb(107, 9, 76);
      padding: 0 10px;
      color: white;
      text-decoration: none;
      outline: none;
      cursor: pointer;

      &:hover{
        background-color: darken($color: rgb(107, 9, 76), $amount: 5)
      }
    }
  }
</style>

