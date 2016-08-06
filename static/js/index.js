// DOM element that will be used to displaly the chosen image.
var currentImageData = null;

// onchange() callback for the image form item; reads the image data
function saveImageData(){
		var imageFile = $('#image-upload')[0].files[0];
	
		image_reader.read_image_data(imageFile, function(data){
		
		currentImageData = data;
	});
}

/**
 * Submits a request to post an image/blurb to the server.
 */
function uploadContent(){
	// Retrieve the password
	var password = $("#passphrase-entry").val();
	var stretched_password = crypto_util.stretch_password(password);
	var key = stretched_password.stretched;
	//var keyword = stretched_password.verifier;

	var keyword = $("#keyword-entry").val();

	keyword = crypto_util.hash(keyword.concat(password))
	
	// Retrieve random IV
	var iv = crypto_util.random_iv();

	// Construct the post object
	var postObject = { "image": currentImageData, "comment": $('#text-entry').val() };
	var postString = JSON.stringify(postObject);

	// Encrypt the post object
	var encryptedPostString = crypto_util.encrypt(key, iv, postString);
	// Construct the post request object
	var postRequest = { "keyword": JSON.stringify(keyword), "content": encryptedPostString.ciphertext, 
		"content-iv": encryptedPostString.iv, "content-hash": crypto_util.hash(postString) };
	// console.log(postRequest)
	$.ajax({
		type: "POST",
		url: "/upload",
		data: postRequest,
		success: function(response){
			// Reload the page once a response is received.
			$("#imagesent").attr("src", JSON.parse(postString).image);
			$("#keysent").text( keyword);
			$("#imageupload").attr("src", JSON.parse(postString).image);
			$("#commentupload").text( JSON.parse(postString).comment);

			console.log("data:image/png;ascii," + encryptedPostString.ciphertext);			
			//location.reload();
		}
	});
}

/**
 * Submits a request to get an image/blurb from the server.
 */
function searchContent(){
	// Retrieve the password
	var password = $("#searchsecret-entry").val();
	var stretched_password = crypto_util.stretch_password(password);
	var key = stretched_password.stretched;
	//var keyword = stretched_password.verifier;

	var keyword_hash = $("#searchterm-entry").val();

	var keyword = crypto_util.hash(keyword_hash.concat(password))

	// Construct the post request object
	var postRequest = { "keyword": JSON.stringify(keyword) };

	(function(key){
		$.ajax({
			type: "POST",
			url: "/search",
			data: postRequest,
			success: function(response){
				console.log(response.success)
				if( response.success == true){
					var decryptedContent = crypto_util.decrypt(key, response.content_iv, response.content);
					$("#keyreceived").text( keyword);
					$("#image").attr("src", JSON.parse(decryptedContent).image);
					$('#comment').html(JSON.parse(decryptedContent).comment);
					console.log(JSON.parse(decryptedContent).comment);
				}
				else {

				}
				//location.reload();
			}
		});
	})(key);
}


