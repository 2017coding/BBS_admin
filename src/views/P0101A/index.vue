<template>
<div class="P0101A">
  <Map></Map>
  <search></search>
</div>

</template>

<script>
import Map from './components/map'
import search from './components/search'
export default {
  components: {
    Map,
    search
  }
}
</script>

<style lang="scss">
  .P0101A{
    height: 100%;
    overflow: hidden;
  }
</style>
