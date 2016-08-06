/**
 * crypto_util.js
 *
 * Provides functionality to parse the data within an image dynamically
 * from the front end.
 */

var crypto_util = {
	/**
	 * encrypt
	 * 		params: 
	 *			-- 16-byte key (as base64 string)
	 *			-- 16-byte iv (as base64 string)
	 *			-- plaintext
	 *  returns a dictionary containing the ciphertext and the iv
	 */
	encrypt : function(key, iv, plaintext){
		var p = CryptoJS.enc.Utf8.parse(plaintext);
		var k = CryptoJS.enc.Base64.parse(key);
		var i = CryptoJS.enc.Base64.parse(iv);

		var encrypted = CryptoJS.AES.encrypt(
	        plaintext, k,
	        {
	            iv: i,
	            mode: CryptoJS.mode.CBC,
	            padding: CryptoJS.pad.Pkcs7
	        }
	    );

	    return { "ciphertext": CryptoJS.enc.Base64.stringify(encrypted.ciphertext), "iv": iv };
	},

	/**
	 * encrypt
	 * 		params: 
	 *			-- 16-byte key (as base64 string)
	 *			-- 16-byte iv (as base64 string)
	 *			-- plaintext
	 *  returns the plaintext as a string
	 */
	decrypt : function(key, iv, ciphertext){
		var c = CryptoJS.enc.Base64.parse(ciphertext);
		var k = CryptoJS.enc.Base64.parse(key);
		var i = CryptoJS.enc.Base64.parse(iv);

		var decrypted = CryptoJS.AES.decrypt(
			{ciphertext: c},
			k,
			{
	            iv: i,
	            mode: CryptoJS.mode.CBC,
	            padding: CryptoJS.pad.Pkcs7
	        }
		);

		return CryptoJS.enc.Utf8.stringify(decrypted);
	},

	/** Returns a random 16-byte IV as a Base64 string. **/
	random_iv: function(){
		return CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.random(16));
	},

	/** 
		Stretches a password by repeatedly applying a hash.
		Returns a dictionary containing the stretched password and a verifying
		hash.
	 */
	stretch_password: function(password){
		var p = CryptoJS.enc.Utf8.parse(password);
		for(var i = 0; i < 500; i++){
			p = CryptoJS.SHA256(p);
		}

		p.words = p.words.slice(0,4);
		p.sigBytes = 16;

		var v = CryptoJS.SHA256(v);

		return {"stretched": CryptoJS.enc.Base64.stringify(p), "verifier": CryptoJS.enc.Base64.stringify(v)};
	},

	/**
	 * Returns the SHA256 hash as a Base64 string for the passed content.
	 */
	hash: function(content){
		var c = CryptoJS.enc.Utf8.parse(content);
		return CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(c));
	}

};