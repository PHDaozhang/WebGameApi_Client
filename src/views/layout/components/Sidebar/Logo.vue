<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <div v-if="collapse" key="collapse" class="sidebar-logo-link">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1  class="sidebar-title">{{ title }} </h1>
      </div>
      <div v-else key="expand" class="sidebar-logo-link">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }} </h1>
      </div>
    </transition>
  </div>
</template>

<script>
import logoImg from '@/assets/index/logo.png'
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '速云金服',
      logo: logoImg
    }
  }
}
</script>

<style lang="scss" scoped>
.hideSidebar .sidebar-logo-container { padding-left: 10px;}
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 60px;
  line-height: 50px;
  background: rgb(48, 65, 86);
  padding-left: 20px;
  padding-top: 10px;
  overflow: hidden;

  & .sidebar-logo-link {
    cursor:pointer;
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: auto;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
