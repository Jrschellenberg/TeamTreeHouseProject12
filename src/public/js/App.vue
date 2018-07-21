<template>
  <div id="app">
    <google-map />
  </div>
</template>

<script>
  import GoogleMap from "./components/GoogleMap";

  export default {
    name: "app",
    components: {
      GoogleMap
    }
  };
</script>