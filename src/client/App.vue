<template>
  <div id="app" class="row">
      <div class="col-lg-6 col-6">
        <google-map />
      </div>
      <div class="col-lg-6 col-6">
          <currentRoute />
      </div>
    
  </div>
</template>

<script>
  import GoogleMap from "./components/GoogleMap";
  import CurrentRoute from "./components/CurrentRoute";
  export default {
    name: "app-container",
    components: {
      GoogleMap,
      CurrentRoute
    }
  };
</script>