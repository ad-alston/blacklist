/**
 * image_reader.js
 *
 * Provides functionality to parse the data within an image dynamically
 * from the front end.
 */

var image_reader = {

	/**
	 *  read_image_data
	 	params: file -- the file [as taken from a file input] from which to retrieve
	 				image data
	 			successCallback -- callack function taking as a single parameter the data read
	 */
	read_image_data : function(file, successCallback){
		(function(f, callback){
			var reader = new FileReader();
			reader.onloadend = function() {
				callback(reader.result);
			};

			if(f){ // If there actually is an image, start the read.
				reader.readAsDataURL(f);
			} // Othwerwise, do nothing.
		})(file, successCallback);
	}

};