<template>
  <div class="modal-overlay" v-show="vModelShow">
    <div class="modal">
      <div class="modal-header" v-if="headerShow">
        {{headerTitle}}
        <span class="modal-header-close" @click="closeModal" v-if="closeable">&times;</span>
      </div>
      <div class="modal-container">
        <slot></slot>
      </div>
      <div class="modal-footer" v-if="footerShow">
        <div class="modal-button" v-if="okButtonShow" @click="okButtonClick" v-html="okButtonText"></div>
        <div
          class="modal-button modal-button-cancel"
          v-if="cancelButtonShow"
          @click="cancelButtonClick"
          v-html="cancelButtonText"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    vModelShow: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: () => false
    },
    headerShow: {
      type: Boolean,
      default: () => true
    },
    footerShow: {
      type: Boolean,
      default: () => true
    },
    headerTitle: {
      type: String,
      default: () => "Title"
    },
    closeable: {
      type: Boolean,
      default: () => true
    },

    cancelButtonShow: {
      type: Boolean,
      default: () => true
    },

    okButtonShow: {
      type: Boolean,
      default: () => true
    },

    okButtonAction: {
      type: Function,
      default: () => {}
    },
    cancelButtonAction: {
      type: Function,
      default: () => {}
    },

    okButtonText: {
      type: String,
      default: () => "Ok"
    },

    cancelButtonText: {
      type: String,
      default: () => "Cancel"
    }
  },
  methods: {
    okButtonClick() {
      this.okButtonAction();
    },
    cancelButtonClick() {
      this.closeModal();
      this.cancelButtonAction();
    },

    closeModal() {
      this.vModelShow = false;
    }
  }
};
</script>

<style lang="scss">
.modal-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 79;

  .modal {
    width: 80%;
    position: absolute;
    left: 10%;
    top: 17%;

    background-color: #fff;
    box-shadow: 0px 0px 6px 0px #000;
    border-radius: 0px 3px 0px 3px;
    font-size: 12px;

    flex-direction: column;
    padding: 3px;

    .modal-header {
      height: 35px;
      border-bottom: 1px solid tomato;
      line-height: 29px;
      text-indent: 7px;

      .modal-header-close {
        display: block;
        float: right;
        width: 29px;
        height: 29px;
        line-height: 29px;
        font-weight: bold;
        font-size: 16px;
        text-indent: 0px;
        text-align: center;
        cursor: pointer;

        &:hover {
          background-color: #ddd;
        }
      }
    }

    .modal-footer {
      height: 35px;
      border-top: 1px solid tomato;
    }

    .modal-container {
      display: flex;
      height: 100%;

      padding: 3px;
    }

    .modal-button {
      padding: 7px;
      display: inline-block;
      cursor: pointer;
      margin-top: 3px;
      background-color: #ff6347;
      color: #fff;

      float: right;
      margin-left: 7px;

      &:hover {
        background-color: darken($color: #ff6347, $amount: 7);
      }
    }
  }
}
</style>