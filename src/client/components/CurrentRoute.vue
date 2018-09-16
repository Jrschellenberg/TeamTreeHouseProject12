<template>
    <div v-if="loading" class="loader"></div>
    <div v-else>
        <div v-if="currentRoute" class="container-fluid">
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
            <div class="row">
                <div class="col-12">
                    <h1 >You currently have No Route. Please select and create a route</h1>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		name: "CurrentRoute",
        computed: {
          
        },
		data() {
			return {
                currentRoute: usersCurrentRoute,
                updatedStop: false,
                loading: false
			};
		},
        mounted(){
	        this.$root.$on('successCall', (currentRoute) => { // here you need to use the arrow function or bind
              console.log("hit this MyEvent function... UPdating this.currentRoute");
              this.currentRoute = currentRoute;
              this.updatedStop = true;
              this.loading = false;
	        });
	        this.$root.$on('failCall', () => {
              this.loading = false;
            });
	        this.$root.$on('startLoading', () => {
              this.loading = true;
            })
        },
		methods: {

		}
	};
</script>