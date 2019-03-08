<template>
  <div class="app-wrapper">
    <Sidebar></Sidebar>
    <div class="main-container">
      <navbar/>
      <tags-view/>
      <app-main/>
    </div>
  </div>
</template>

<script>
import {AppMain, Sidebar, Navbar, TagsView} from './components';
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

</style>
