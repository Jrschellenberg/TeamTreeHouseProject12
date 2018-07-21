<template>
  <div id="app" class="thisIsTest">
    <google-map />
  </div>
</template>

<script>
  import GoogleMap from "./components/GoogleMap";

  export default {
    name: "app-container",
    components: {
      GoogleMap
    }
  };
</script>