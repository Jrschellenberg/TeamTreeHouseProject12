<template>
  <div>
    <div>
      <h2>Add a pin To your Current Route</h2>
      <label>
        <gmap-autocomplete
                @place_changed="setPlace">
        </gmap-autocomplete>
        <button @click="addMarker(false, false)">Add</button>
      </label>
      <br/>
    </div>
    
    <div>
      <h2>Add a Starting location to Current Route</h2>
      <input type="checkbox" id="checkbox" v-model="checked" checked> Starting location same as Finish Location?<br>
      <label>
        <gmap-autocomplete
                @place_changed="setPlace">
        </gmap-autocomplete>
        <button @click="addMarker(true, false)">Add</button>
      </label>
      <br/>
    </div>

    <div v-if="!checked">
      <h2>Add a Finish location to Current Route</h2>
      <label>
        <gmap-autocomplete
                @place_changed="setPlace">
        </gmap-autocomplete>
        <button @click="addMarker(true, true)">Add</button>
      </label>
      <br/>
    </div>
    
    
    
    <div>
      <h2>Submit Form</h2>
      <button @click="getMarkers">Submit Form</button>
    </div>
    <br>
    <gmap-map
            :center="center"
            :zoom="12"
            style="width:100%;  height: 400px;"
    >
      <gmap-marker
              :key="index"
              v-for="(m, index) in markers"
              :position="m.position"
              @click="center=m.position"
      ></gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
  import AlgorithmiaApi from '../services/api/algorithmia';
  export default {
    name: "GoogleMap",
    data() {
      return {
        // default to Winnipeg to keep it simple
        // change this to whatever makes sense
        center: { lat: 49.8951, lng: -97.1384 },
        markers: [],
        route: [],
        places: [],
        currentPlace: null,
        startingLocation: null,
	    finishLocation: null,
        checked: true
      };
    },

    mounted() {
      this.geolocate();
    },

    
    methods: {
      // receives a place object via the autocomplete component
      setPlace(place) {
        this.currentPlace = place;
      },
      addMarker(isStartOrFinishLocation, isAddFinishMarkerCalled) {
        if (this.currentPlace) {
          const marker = {
            lat: this.currentPlace.geometry.location.lat(),
            lng: this.currentPlace.geometry.location.lng()
          };
          if(!isStartOrFinishLocation) {
	          this.route.push({position: marker});
          }
          else{
          	if(isAddFinishMarkerCalled){
          		this.finishLocation = {position: marker};
            }
            else{
          		if(this.checked){
                  this.startingLocation = {position: marker};
                  this.finishLocation = {position: marker};
                }
                else{
                  this.startingLocation = {position: marker};
                }
            }
          }
          this.markers.push({position: marker});
          this.places.push(this.currentPlace);
          this.center = marker;
          this.currentPlace = null;
        }
      },
      
      getMarkers() {
      	if(!this.startingLocation && !this.finishLocation){
      		console.log("Please set a starting and ending location");
      		return;
        }
        let algoInput = {};
        algoInput.points = this.route.map((val) => {
        	return `${val.position.lat},${val.position.lng}`;
        });
        algoInput.startpoint = `${this.startingLocation.position.lat},${this.startingLocation.position.lng}`;
        algoInput.endpoint = `${this.finishLocation.position.lat},${this.finishLocation.position.lng}`;
        
        console.log(algoInput);
	
        AlgorithmiaApi.submitRoute(algoInput)
          .then(data => {
          	console.log(data);
          })
          .catch(error => {
          	console.log(error);
          });
      },
      geolocate: function() {
        navigator.geolocation.getCurrentPosition(position => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        });
      }
    }
  };
</script>