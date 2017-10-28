<template>
	<h1>your token is {{token}}</h1>
</template>
<script>
	export default{
		name:"token",
		data(){
			return {
				token:""
			}
		},
		mounted(){
			let url = window.location.href.toLowerCase();
			let index = url.indexOf('token=');
			let token = "";
			if(index>0){
				token = url.substring(index+6);
			}
			if(token){
				window.localStorage['token'] = token;
				this.token = token;
			}
		}
	}

</script>