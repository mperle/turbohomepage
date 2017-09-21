// your custom app logic goes here:
// - - - - - - - - - - - - User Registration and Login - - - - - - - - - - - - - - - //

(function(){
	var spinnerOpts = {
		lines: 11, // The number of lines to draw
		length: 15, // The length of each line
		width: 10, // The line thickness
		radius: 30, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		direction: 1, // 1: clockwise, -1: counterclockwise
		color: '#fff', // #rgb or #rrggbb
		trail: 60, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 10e10, // The z-index (defaults to 2000000000)
		top: 'auto', // Top position relative to parent in px
		left: 'auto' // Left position relative to parent in px
	}

	var spinner = null
	var spinner_div = $('#spinner').get(0)
	// $('#spinner').css({display:'none'}) // hide spinner container
	// var spinner = new Spinner(spinnerOpts).spin(spinner_div)

	var turbo = Turbo({site_id: '5920beabfa74760011d2dfad'})
	var currentUser = window.__CURRENT_USER__
	if (currentUser != null)
		$('#span-login').html('<a class="btn btn-sm btn-round btn-danger mr-0 ml-20" href="https://www.turbo360.co/dashboard">Hello '+currentUser.username+'</a>')      
	

	// turbo.loadStripeHandler(params, callback)...
	var premiumParams = {
		key: 'pk_live_yKFwKJsJXwOxC0yZob29rIN5',
		image: '/dist/images/logo_260.png',
		label: 'Purchase: $35.00',
		action: 'charge',
		amount: 35, // should come from entity in backend
		description: 'Premium Membership Purchase'
	}

	var stripePremiumHandler = turbo.loadStripeHandler(premiumParams, function(err, data){
		if (err){
			alert(err.message)
			return
		}

		// console.log('CHARGE: ' + JSON.stringify(data))
		// CHARGE: {"confirmation":"success","charge":{"id":"ch_1An3dRC5b8QCRB75laMLMFLQ",
		// "object":"charge","amount":500,"amount_refunded":0,"application":null,"application_fee":null,
		// "balance_transaction":"txn_1An3dSC5b8QCRB754JxK8Tir","captured":true,"created":1501844789,
		// "currency":"usd","customer":null,"description":"Premium Tutorials Purchase","destination":null,
		// "dispute":null,"failure_code":null,"failure_message":null,"fraud_details":{},"invoice":null,
		// "livemode":true,"metadata":{},"on_behalf_of":null,"order":null,"outcome":{"network_status":
		// "approved_by_network","reason":null,"risk_level":"normal","seller_message":"Payment complete.",
		// "type":"authorized"},"paid":true,"receipt_email":null,"receipt_number":null,"refunded":false,
		// "refunds":{"object":"list","data":[],"has_more":false,"total_count":0,
		// "url":"/v1/charges/ch_1An3dRC5b8QCRB75laMLMFLQ/refunds"},"review":null,"shipping":null,
		// "source":{"id":"card_1An3dNC5b8QCRB75NM6IHx4o","object":"card","address_city":"Woodcliff Lake",
		// "address_country":"United States","address_line1":"12 Lyons Court","address_line1_check":"pass",
		// "address_line2":null,"address_state":"NJ","address_zip":"07677","address_zip_check":"pass",
		// "brand":"Visa","country":"US","customer":null,"cvc_check":"pass","dynamic_last4":null,
		// "exp_month":6,"exp_year":2020,"fingerprint":"hltRklDPg2R0e0Tx","funding":"debit","last4":"9072",
		// "metadata":{},"name":"Denny Kwon","tokenization_method":null},"source_transfer":null,
		// "statement_descriptor":null,"status":"succeeded","transfer_group":null},"customer":
		// {"email":"dennykwon2@gmail.com","name":"Denny Kwon","firstName":"Denny","lastName":"Kwon"}}

		if (spinner != null){
			spinner.spin(spinner_div)
			$('#spinner').css({display:''})
		}

		// user logged in
		if (currentUser){ // updgrade account to premium
			$.ajax({
				url: '/account/update',
				type: 'POST',
				data: JSON.stringify({id:currentUser.id, accountType:'premium'}),
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: true,
				success: function(response, status) {
					if (spinner != null){ // stop spinner:
						spinner.stop(spinner_div)
						$('#spinner').css({display:'none'})
					}

					if (response.confirmation != 'success'){
						alert(response.message)
						return
					}

					// console.log('LOGGED IN: '+JSON.stringify(response))
					window.location.href = 'https://www.turbo360.co/dashboard?selected=tutorials'
					return
				},
			    error: function(xhr, status, error) {
					if (spinner != null){ // stop spinner:
						spinner.stop(spinner_div)
						$('#spinner').css({display:'none'})
					}

			    	alert('Error: ' + error.message)
					return
			    }
		    })

			return
		}

		// new user register:
		var credentials = data.customer
		credentials['accountType'] = 'premium'
		credentials['referrer'] = window.location.href

		$.ajax({
			url: '/account/register',
			type: 'POST',
			data: JSON.stringify(credentials),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: true,
			success: function(response, status) {
				if (spinner != null){ // stop spinner:
					spinner.stop(spinner_div)
					$('#spinner').css({display:'none'})
				}

				if (response.confirmation != 'success'){
					alert(response.message)
					return
				}

				// console.log('LOGGED IN: '+JSON.stringify(response))
				window.location.href = 'https://www.turbo360.co/dashboard?selected=tutorials'
				return
			},
			error: function(xhr, status, error) {
				if (spinner != null){ // stop spinner:
					spinner.stop(spinner_div)
					$('#spinner').css({display:'none'})
				}

				alert('Error: ' + error.message)
				return
			}
		})
	})

	$('#btn-purchase-premium').click(function(event){
		event.preventDefault()
		stripePremiumHandler.open({
			name: 'Premium Membership',
			description: '$35.00'
		})
	})


	// turbo.loadStripeHandler(params, callback)...
	var membershipParams = {
		key: 'pk_live_yKFwKJsJXwOxC0yZob29rIN5',
		image: '/dist/images/logo_260.png',
		label: 'Join: $15 per month',
		action: 'card',
		// amount: 35, // should come from entity in backend
		description: '2nd Gear Membership Registration'
	}

	var stripeMembershipHandler = turbo.loadStripeHandler(membershipParams, function(err, data){
		if (err){
			alert(err.message)
			return
		}

		// console.log('CARD: ' + JSON.stringify(data))
		// CARD: {"confirmation":"success","card":{"lastFour":"9072","exp_month":6,"exp_year":2020,"brand":"Visa"},
		// "customer":{"id":"cus_BD7A4zOcMmX8PC","email":"dennykwon2@gmail.com","name":"Denny Kwon","firstName":"Denny",
		// "lastName":"Kwon"}}

		if (spinner != null){
			spinner.spin(spinner_div)
			$('#spinner').css({display:''})
		}

		// user logged in
		if (currentUser){ // updgrade account to premium
			$.ajax({
				url: '/account/update',
				type: 'POST',
				data: JSON.stringify({id:currentUser.id, accountType:'2nd gear', creditCard:data.card, stripeId:data.customer.id}),
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: true,
				success: function(response, status) {
					if (spinner != null){ // stop spinner:
						spinner.stop(spinner_div)
						$('#spinner').css({display:'none'})
					}

					if (response.confirmation != 'success'){
						alert(response.message)
						return
					}

					// console.log('USER UPDATED: '+JSON.stringify(response))
					window.location.href = 'https://www.turbo360.co/dashboard'
					return
				},
			    error: function(xhr, status, error) {
					if (spinner != null){ // stop spinner:
						spinner.stop(spinner_div)
						$('#spinner').css({display:'none'})
					}

			    	alert('Error: ' + error.message)
					return
			    }
		    })

			return
		}

		// new user register:
		var credentials = data.customer
		credentials['accountType'] = '2nd gear'
		credentials['creditCard'] = data.card
		credentials['stripeId'] = data.customer.id
		credentials['referrer'] = window.location.href

		$.ajax({
			url: '/account/register',
			type: 'POST',
			data: JSON.stringify(credentials),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: true,
			success: function(response, status) {
				if (spinner != null){ // stop spinner:
					spinner.stop(spinner_div)
					$('#spinner').css({display:'none'})
				}

				if (response.confirmation != 'success'){
					alert(response.message)
					return
				}

				console.log('USER CREATED: '+JSON.stringify(response))
				window.location.href = 'https://www.turbo360.co/dashboard'
				return
			},
			error: function(xhr, status, error) {
				if (spinner != null){ // stop spinner:
					spinner.stop(spinner_div)
					$('#spinner').css({display:'none'})
				}

				alert('Error: ' + error.message)
				return
			}
		})
	})


	$('#btn-second-gear').click(function(event){
		console.log('Show Stripe!')
		event.preventDefault()
		stripeMembershipHandler.open({
			name: '2nd Gear Membership',
			description: '$15 per month'
		})
	})

	$('#btn-third-gear').click(function(event){
		event.preventDefault()
		stripeMembershipHandler.open({
			name: '3rd Gear Membership',
			description: '$35 per month'
		})
	})

	var tutorial = window.__CURRENT_ENTITY__
})()

$(function(){
	var register = function(profile, redirect){
		if (profile.fullName != null){
			var parts = profile.fullName.split(' ')
			profile['firstName'] = parts[0]
			profile['lastName'] = (parts.length > 1) ? parts[parts.length-1] : ''
		}

		profile['username'] = profile.email.split('@')[0]
		profile['referrer'] = window.location.href
		console.log('Register: ' + JSON.stringify(profile))

		$.ajax({
			url: '/account/register',
			type: 'POST',
			data: JSON.stringify(profile),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, status) {
				// window.location.href = '/dashboard'
				window.location.href = redirect
			},
			error: function(xhr, status, error) { 
				// alert("Status: " + status); alert("Error: " + error) 
			}
		})
	}

	var validate = function(visitor){
		if (visitor.fullName != null){
			if (visitor.fullName.length == 0)
				return 'full name'
		}
		
		if (visitor.email != null){
			if (visitor.email.length == 0)
				return 'email'
		}

		if (visitor.password != null){
			if (visitor.password.length == 0)
				return 'password'
		}
				
		return null
	}


	$('#modal-sign-up').click(function(event){
		event.preventDefault()

		var visitor = {
			fullName: $('#modal-name').val(),
			email: $('#modal-email').val(),
			password: $('#modal-password').val(),
			landing: $('#modal-landing').val(),
			confirmed: 'yes'
		}

		var missing = validate(visitor)
		if (missing != null){
			alert('Please enter your ' + missing)
			return
		}

		// console.log('Sign Up: ' + JSON.stringify(visitor))
		register(visitor, 'https://www.turbo360.co/dashboard')
	})

	$('#btn-sign-up').click(function(event){
		event.preventDefault()

		var visitor = {
			fullName: $('#input-name').val(),
			email: $('#input-email').val(),
			password: $('#input-password').val(),
			landing: $('#input-landing').val(),
			confirmed: 'yes'
		}

		var missing = validate(visitor)
		if (missing != null){
			alert('Please enter your ' + missing)
			return
		}

		// console.log('Sign Up: ' + JSON.stringify(visitor))
		register(visitor, 'https://www.turbo360.co/dashboard')
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


