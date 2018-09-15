<template>
  <div id="app" class="row">
      <div class="col-lg-6 col-6">
        <google-map />
        
      </div>
    
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