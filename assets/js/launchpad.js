// your custom app logic goes here:

$(function(){
	var turbo = Turbo({site_id: '5920beabfa74760011d2dfad'})
	var currentUser = window.__CURRENT_USER__
	if (currentUser != null)
		$('#span-login').html('<a class="btn btn-sm btn-round btn-danger mr-0 ml-20" href="https://www.turbo360.co/dashboard">Hello '+currentUser.username+'</a>')

	$('#btn-sign-up').click(function(event){
		event.preventDefault()
        var startup = {
        	name: $('#input-startup-name').val(),
        	// email: $('#input-email').val(),
        	// password: $('#input-password').val()
        }

        var email = $('#input-email').val()
        var password = $('#input-password').val()

		if (startup.name.length == 0){
			alert('Please enter the name of your startup')
			return
		}

		if (email.length == 0){
			alert('Please enter your email')
			return
		}

		if (password.length == 0){
			alert('Please enter your password')
			return
		}


		var profile = {
			username: email.split('@')[0],
			email: email,
			referrer: window.location.href
		}

		$.ajax({
			url: '/account/register',
			type: 'POST',
			data: JSON.stringify(profile),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, status) {
				console.log('CREATE STARTUP: ' + JSON.stringify(data))
				startup['admin'] = {
					id: data.user.id,
					username: data.user.username,
					slug: data.user.slug,
					image: data.user.image
				}

				$.ajax({
					url: '/api/company',
					type: 'POST',
					data: JSON.stringify(startup),
					contentType: 'application/json; charset=utf-8',
					dataType: 'json',
					async: false,
					success: function(data, status) {
						// window.location.href = 'https://www.turbo360.co/dashboard'
						document.getElementById('btn-confirmation').click()
					},
					error: function(xhr, status, error) { 
						// alert("Status: " + status); alert("Error: " + error) 
					}
				})
			},
			error: function(xhr, status, error) { 
				// alert("Status: " + status); alert("Error: " + error) 
			}
		})
	})

	$('#btn-modal-login').click(function(event){
		console.log('LOGIN')
		event.preventDefault()

		var visitor = {
			email: $('#login-email').val(),
			password: $('#login-password').val()
		}

		if (visitor.email.length == 0){
			alert('Please Enter Your Email.')
			return
		}

		if (visitor.password.length == 0){
			alert('Please Enter Your Password.')
			return
		}

		// console.log('Log In: ' + JSON.stringify(visitor))
		$.ajax({
			url: '/account/login',
			type: 'POST',
			data: JSON.stringify(visitor),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, status) {
				if (data.confirmation != 'success'){
					alert('ERROR: '+data.message)
					return
				}

				window.location.href = 'https://www.turbo360.co/dashboard'
			},
			error: function(xhr, status, error) {
				alert('ERROR: '+error.message)
			}
		})
	})

	var fetchEvents = function(){
		// Returns list up upcoming events:
		// https://api.meetup.com/velocity360/events?key=fd12585580517f2f616110c7161c
		// https://api.meetup.com/NY-JavaScript/events?key=fd12585580517f2f616110c7161c

		var params = {
			key: 'fd12585580517f2f616110c7161c'
		}

	    $.ajax({
	        url: 'https://api.meetup.com/velocity360/events',
	        type: 'GET',
	        data: JSON.stringify(params),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'jsonp',
	        async: true,
	        success: function(response, status) {
	        	console.log('EVENTS: '+JSON.stringify(response.data))
	        	if (response.data == null){
	        		$('#events').html('')
	        		return
	        	}
	        	
	        	var events = response.data
				if (events.length == 0){
	        		$('#events').html('')
					// $('#event-rows').html('<tr><td><div class="meetup" style="padding:24px;text-align:center"><h2>No Scheduled Events</h2></div></td></tr>')
					return
				}

				var rows = ''
				events.forEach(function(meetup, i){
					rows += '<tr><td>'
					rows += '<div class="meetup" style="padding:24px"><span>'+moment(meetup.time).format("MMM DD, hh:mm a")+'</span><br /><a target="_blank" href="'+meetup.link+'"><h2>'+meetup.name+'</h2></a>'+meetup.description.substring(0, 360)+'...<a style="color:red" target="_blank" href="'+meetup.link+'">Read More</a><br /><br /><a style="margin-left:0px" class="btn btn-info" target="_blank" href="'+meetup.link+'">Attend Event</a>'+'</div>'
					rows += '</td></tr>'
				})

				$('#event-rows').html(rows)

				return
	        },
		    error: function(xhr, status, error) { 
		    	alert('Error: '+error.message)
				return
		    }
	    })
	}

	fetchEvents()
})








