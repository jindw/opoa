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
	
// 解压
this.addScript("inflate.js","zip_inflate")

//压缩
this.addScript("deflate.js","zip_deflate");

this.addScript("gbkencoder.js","stringToGBKByteArray"
    ,"base64ToByteArray")