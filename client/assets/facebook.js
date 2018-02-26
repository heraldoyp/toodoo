// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
  // console.log('statusChangeCallback');
  // console.log(response.authResponse.accessToken);
  if(response.authResponse.accessToken){
      localStorage.setItem('token', response.authResponse.accessToken)
  }
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
	// Logged into your app and Facebook.
		
		localStorage.setItem('status', response.status)
  testAPI();
  } else {
  // The person is not logged into your app or we are unable to tell.
  document.getElementById('status').innerHTML = 'Please log ' +
      'into this app.';
  }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
  FB.getLoginStatus(function(response) {
      // console.log(response.authResponse.accessToken)
      // localStorage.setItem('token')
  statusChangeCallback(response);
  });
}

window.fbAsyncInit = function() {
  FB.init({
  appId      : '174562106653306',
  cookie     : true,  // enable cookies to allow the server to access 
                      // the session
  xfbml      : true,  // parse social plugins on this page
  version    : 'v2.8' // use graph api version 2.8
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
  statusChangeCallback(response);
  });

};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', {fields : ['id','name','email']}, function(response) {
      localStorage.setItem('username', response.name)
    	localStorage.setItem('email', response.email)
      console.log(localStorage) 
      console.log(response)
      setLoginFacebook()
      console.log('Successful login for: ' + response.name);
  document.getElementById('status').innerHTML =
      'Thanks for logging in, ' + response.name + '!';
  });

}

function setLoginFacebook(){
  let data = {
		username: localStorage.getItem('username'),
		email: localStorage.getItem('email'),
		token: localStorage.getItem('token')
  }
  // console.log("ini ngambil data", data)
  axios.post('http://localhost:3000/users/facebook', data)
  .then(response=>{
			console.log('data for facebook has sent', response)
			localStorage.setItem('status', "connected")
			localStorage.setItem('UserId', response.data.data._id)
			localStorage.setItem('token', response.data.token)
  })
  .catch(error=>{
      console.log('setUser error ', error)
  })
}

function signIn(){
  let data = {
      username: $('#usernameIn').val(),
      password: $('#passwordIn').val()
  }
  console.log('signIn', data)
  axios.post('http://localhost:3000/users/signin', data)
  .then(response=>{
			console.log(response)
			console.log("dari signIn", localStorage)
			if(response.data.message === "correct"){
				$("#wrongPassword").hide()
				$("#valid").show()
				console.log("login berhasil")
				localStorage.setItem('UserId', response.data.data._id)
				localStorage.setItem('token', response.data.token)	
				localStorage.setItem('status', "connected")
			}else{
				console.log("login failed")
				$("#wrongPassword").show()
			}
  })
  .catch(error=>{
		$("#wrongPassword").show()
  })
}

function signUp(){
    let data = {
        username: $('#usernameUp').val(),
        password: $('#passwordUp').val(),
        email: $('#emailUp').val()
    }
    axios.post('http://localhost:3000/users', data)
    .then(response=>{
				console.log(response)
				if(response.data.message === "used"){
					$("#alreadyUsed").show();
				}
    })
    .catch(err=>{
        console.log(err)
    })
}

function logOut(){
	FB.logout(function(response) {
		if(response.status = "connected"){
			FB.getLoginStatus(function(response) {
				console.log(response)
				
				statusChangeCallback(response);
			});
		}
	});
		localStorage.removeItem('UserId')
		localStorage.removeItem('username')
		localStorage.removeItem('email')	
		localStorage.removeItem('status')		
		localStorage.removeItem('token')
}

// Start Using Vue

// Vue.component('todo-item', {
// 		template: '\
// 		<input type="checkbox" aria-label="Checkbox for following text input" @click="getDone()" >\
// 		<input type="text" placeholder="Input id here">\
// 			id: {{theTask._id}}, todo: {{theTask.todo}}\
//     ',
//     data: {
// 			getDone(){
// 				console.log($("#cekidot").val())
// 			}
// 		}
// })


var test = new Vue({
  el: '#getAllTask',
  data: {
        userid: '',
				allTask: [],
				task: '',
				allNews:[],
				oneTask: [],
				timeNow: {
					date: '',
					day: '',
					month: '',
					period: '',
					time: '',
					year: ''
				}
	},
	created(){
		this.getTask()
		this.news()
		this.getTime()
	},
	methods:{
		getTime () {
			axios.get('http://localhost:3000/users/time')
				.then(response=>{
					console.log(response)
					this.timeNow = {
						date: response.data.date,
						day: response.data.day, 
						month: response.data.month, 
						period: response.data.period,
						time: response.data.time,
						year: response.data.year
					}
				})
				.catch(error=>{
					console.log(error)
				})
		},
		addTask(){
			this.task = $('#exampleInputTask').val()
			this.allTask.push(this.task)
			console.log("eaaa ini", $('#exampleInputTask').val())

			let UserId = localStorage.getItem('UserId')
			let token = localStorage.getItem('token')
			// let TaskId = localStorage.setItem('TaskId')
			let data = {
				todo: $('#exampleInputTask').val(),
				isDone: false
			}
			axios.post(`http://localhost:3000/users/${UserId}/tasks`, data, {
				headers:{
					token: token
				}
			})
			.then(response=>{
				console.log(response)
			})
			.catch(error=>{
				console.log(error)
			})
		},

		getTask(){
			let UserId = localStorage.getItem('UserId')
			let token = localStorage.getItem('token')
			console.log(token)
			axios.get(`http://localhost:3000/users/${UserId}/tasks`, {
				headers: {
					token: token
				}
			})
			.then(response=>{
				console.log(response.data)
				let result = this.allTask
				response.data.data.forEach(element=>{
					let dataTask = {
						_id: element._id,
						todo: element.todo,
						isDone: element.isDone
					}
					result.push(dataTask)
				})
			})
			.catch(error=>{	
				console.log(error)
			})
		},

		news(){
			axios.get('http://localhost:3000/users/newsapi')
			.then(response=>{
				console.log(response.data.news.articles)
				let resultNews = response.data.news.articles
				this.allNews = resultNews
			})
			.catch(error=>{	
				console.log(error)
			})
		},

		getDone(taskId, todo, isDone){
			let UserId = localStorage.getItem('UserId')
			let token = localStorage.getItem('token')
			
			let data = {
				todo: todo,
				isDone: isDone,
			}
			console.log(data)
			axios.put(`http://localhost:3000/users/${UserId}/tasks/${taskId}`, data, {headers: {token: token}})
				.then(response=>{
					console.log(response)
					swal('Task Updated', "", "success")
				})
				.catch(error=>{
					swal("Update Failed", "Selected data failed to update", "error")
					console.log(error)
				})
		},
		deleteTask (taskId) {
			let UserId = localStorage.getItem('UserId')
			let token = localStorage.getItem('token')

			axios.delete(`http://localhost:3000/users/${UserId}/tasks/${taskId}`, {headers: {token: token}})
				.then(response=>{
					swal("Task deleted", "", "success")
					console.log(response)
				})
				.catch(error=>{
					swal("Delete Failed", "Selected data failed to delete", "error")
					console.log(error)
				})
		}
	}
})
