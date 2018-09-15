<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <p v-if="currentRoute">You currently have a route Selected</p>
            </div>
            
        </div>
    </div>
</template>

<script>
	export default {
		name: "GoogleMap",
		data() {
			return {
                currentRoute: usersCurrentRoute
			};
		},

		methods: {
			
			

		}
	};
</script>