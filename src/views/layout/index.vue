<template>
  <div class="app-wrapper">
    <Sidebar class="sidebar-container"></Sidebar>
    <div class="main-container">
      <navbar/>
      <tags-view/>
      <app-main/>
    </div>
  </div>
</template>

<script>
import {AppMain, Sidebar, Navbar, TagsView} from './components'
export default {
  name: 'Layout',
  components: {
    AppMain,
    Sidebar,
    Navbar,
    TagsView
  }
}
</script>

<style scoped lang="scss">
  .app-wrapper{
    height: 100%;
    display: flex;
    .sidebar-container{
      width: 220px;
      // transition: transform .3s;
    }
    .main-container{
      flex: 1;
    }
  }
</style>
