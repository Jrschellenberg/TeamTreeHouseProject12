<template>
    <div v-if="loading" class="loader"></div>
    <div v-else>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div v-if="registeredPhoneNumber && currentRoute">
                        <button @click="textRoute()">Text Route To Phone</button>
                    </div>
                    <label>Add Phone Number to Account:</label>
                    <input type="number" v-model="phoneNumberInput" placeholder="EX: 2041234567">
                    <button @click="updateNumber()">Add Number</button>
                </div>
            </div>
        </div>
        <div v-if="currentRoute" class="container-fluid">
            <div v-if="serviceUnavailable" class="row">
                <div class="col-12">
                    <h2 class="error-service-unavailable">Service is Currently Unavailable, Please Try again in 5 minutes!</h2>
                </div>
            </div>
            <div v-if="updatedStop" class="row">
                <transition name="fade">
                    <div class="col-12">
                        <h1>Successfully Updated Route</h1>
                    </div>
                </transition>
            </div>
            <div v-else class="row">
                <div class="col-12">
                    <h1>Current Route</h1>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <p>Drive from <strong>{{currentRoute.startingAddress.streetAddress}}</strong> to <strong>{{currentRoute.stops[0].streetAddress}}</strong></p>
                </div>
            </div>
            
            <div v-for="(stop, index) in currentRoute.stops" class="row">
                <div v-if="index !== 0" class="col-12">
                    <p>Drive from <strong>{{currentRoute.stops[index -1].streetAddress}}</strong> to <strong>{{currentRoute.stops[index].streetAddress}}</strong></p>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <p>Drive from <strong>{{currentRoute.stops[currentRoute.stops.length -1].streetAddress}}</strong> to <strong>{{currentRoute.endingAddress.streetAddress}}</strong></p>
                </div>
            </div>
        </div>
        <div v-else class="container-fluid">
            <div v-if="serviceUnavailable" class="row">
                <div class="col-12">
                    <h2 class="error-service-unavailable">Service is Currently Unavailable, Please Try again in 5 minutes!</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <h1 >You currently have No Route. Please select and create a route</h1>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import UserApi from '../services/api/user';
	export default {
		name: "CurrentRoute",
        computed: {
          
        },
		data() {
			return {
                currentRoute: usersCurrentRoute,
                updatedStop: false,
                loading: false,
                serviceUnavailable: false,
                registeredPhoneNumber: usersPhoneNumber,
                usersIdentity: usersIdentification,
                phoneNumberInput: usersPhoneNumber ? usersPhoneNumber : ''
			};
		},
        mounted(){
	        this.$root.$on('successCall', (currentRoute) => { // here you need to use the arrow function or bind
              console.log("hit this MyEvent function... UPdating this.currentRoute");
              this.currentRoute = currentRoute;
              this.updatedStop = true;
              this.loading = false;
              this.serviceUnavailable = false;
	        });
	        this.$root.$on('failCall', (err) => {
	        	if(err.message && err.message === "Request failed with status code 503"){
	        		this.serviceUnavailable = true;
                }
              this.loading = false;
              
            });
	        this.$root.$on('startLoading', () => {
              this.loading = true;
            })
        },
		methods: {
            textRoute(){
            	console.log("pressed button");
            },
          updateNumber(){
            	let payload = {};
            	payload.phoneNumber = this.phoneNumberInput;
            	UserApi.updatePhoneNumber(this.usersIdentity, payload)
                  .then(data => {
                  	console.log("successfully updated PhoneNumber");
                  	// update this.registeredPhoneNumber now....
                  })
                  .catch(error => {
                  	console.log(error);
                  	console.log("Error occured!");
                  });
          }
		}
	};
</script>