this.addScript("base64.js",
	['UTF8ByteArrayToString'
	,'UTF16ByteArrayToString'
	,'stringToByteArray'
	,'stringToUTF8ByteArray'
	,'stringToUTF16ByteArray'
	,'base64ToByteArray','atob'
	,'byteArrayToBase64','btoa'
	])
	
this.addScript("zip.js","Zip"
	,["byteArrayToBase64","stringToByteArray","stringToUTF8ByteArray"])
	
this.addScript("inflate.js","zip_inflate")


this.addScript("deflate.js","zip_deflate")