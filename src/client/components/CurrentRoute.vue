<template>
    <div v-if="loading" class="loader"></div>
    <div v-else>
        <div class="container-fluid mt-5 mt-lg-0">
            <div class="row">
                <div class="col-12">
                    <h3 class="error-service-unavailable" v-if="formError">{{formError}}</h3>
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
            <transition v-if="updatedStop" name="fade">
                <div v-if="updatedStop" class="row">
                <div class="col-12">
                    <h1>Successfully Updated Route</h1>
                </div>
            </div>
            </transition>
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
            <div v-if="registeredPhoneNumber && currentRoute" class="row">
                <div class="col-12">
                    <button @click="textRoute()">Text Route To Phone</button><transition name="fade" v-on:enter="endTransition"><strong v-if="textSent"><span> Text Successfully Sent....</span></strong></transition>
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
    import TwilioApi from '../services/api/twilio';
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
                phoneNumberInput: usersPhoneNumber ? usersPhoneNumber : '',
                formError: false,
                textSent: false
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
            	if(!this.registeredPhoneNumber){
            		console.log("Require a phone number to send");
            		return;
                }
                let payload = {};
            	payload.data = this.buildMessage();

                TwilioApi.sendText(payload)
                  .then(data => {
                  	console.log("Sent text");
                  	console.log(data);
                  	this.textSent = true;
                  })
                  .catch(error => {
	                  console.log("Error occured!");
                  });
            },
            buildMessage(){
                let places = [];
                let initial = {};
	            initial.message = `Drive from ${this.currentRoute.startingAddress.streetAddress} to ${this.currentRoute.stops[0].streetAddress}`;
	            initial.url = `https://www.google.com/maps/dir/?api=1&origin=${this.currentRoute.startingAddress.lat},${this.currentRoute.startingAddress.long}&destination=${this.currentRoute.stops[0].lat},${this.currentRoute.stops[0].long}`;
                places.push(initial);
                
                this.currentRoute.stops.forEach((val, index) => {
                	if(index !==0 ){
                		let current = {};
                        current.message = `Drive from ${this.currentRoute.stops[index -1].streetAddress} to ${val.streetAddress}`;
                        current.url = `https://www.google.com/maps/dir/?api=1&origin=${this.currentRoute.stops[index -1].lat},${this.currentRoute.stops[index -1].long}&destination=${val.lat},${val.long}`;
                        places.push(current);
                    }
                });
                let final = {};
	            final.message = `Drive from ${this.currentRoute.stops[this.currentRoute.stops.length -1].streetAddress} to ${this.currentRoute.endingAddress.streetAddress}`;
	            final.url = `https://www.google.com/maps/dir/?api=1&origin=${this.currentRoute.stops[this.currentRoute.stops.length  -1].lat},${this.currentRoute.stops[this.currentRoute.stops.length  -1].long}&destination=${this.currentRoute.endingAddress.lat},${this.currentRoute.endingAddress.long}`;
	            places.push(final);
              
	            return places;
            },
            updateNumber(){
                if(!this.phoneNumberInput || !/^[0][1-9]\d{9}$|^[1-9]\d{9}$/g.test(this.phoneNumberInput)){
                    console.log("Form Validation failed, do stuff...");
                    this.formError = "Please Enter a 10 Digit Number with no Spaces!";
                    return;
                }
                let payload = {};
                payload.phoneNumber = this.phoneNumberInput;
                UserApi.updatePhoneNumber(payload)
                  .then(data => {
                    console.log("successfully updated PhoneNumber");
                    console.log(data);
                    this.formError = false;
                    this.registeredPhoneNumber = data.data.PhoneNumber;
                  })
                  .catch(error => {
                    console.log(error);
                    console.log("Error occured!");
                    this.formError = error.message;
                  });
            },
            endTransition(){
                let _this = this;
                setTimeout(() => {
                    _this.textSent = false;
                    
                }, 3000);
            }
		}
	};
</script>