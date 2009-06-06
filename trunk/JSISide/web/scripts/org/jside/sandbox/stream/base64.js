/*
 * JavaScript Integration Framework
 * License LGPL(您可以在任何地方免费使用,但请不要吝啬您对框架本身的改进)
 * http://www.xidea.org/project/jsi/
 * @author jindw
 * @version $Id: fn.js,v 1.5 2008/02/24 08:58:15 jindw Exp $
 */


/**
 * bytes(String) to base64
 * @public
 */
var btoa = window.btoa;//tobase64
/**
 * base64 to bytes(String)
 * @public
 */
var atob = window.atob;//base64tostring
var b64chars
    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

var b64codes = [];
var b64map = {};
var i = 65;
while (i--){
	b64codes[i] = b64chars.charCodeAt(i);
	b64map[b64chars.charAt(i)] = i;
}
/**
 * 字节数组（小整数数组）转化成Base64字符串
 * @pulic
 */
function byteArrayToBase64(bs) {
    var b64 = [];
    var bi = 0;
    while (bi < bs.length) {
        var b0 = bs[bi++];
        var b1 = bs[bi++];
        var b2 = bs[bi++];
        var data = (b0 << 16) + (b1 << 8) + (b2||0);
        b64.push(
        	b64codes[(data >> 18) & 0x3F ],
        	b64codes[(data >> 12) & 0x3F],
        	b64codes[isNaN(b1) ? 64 : (data >> 6) & 0x3F],
        	b64codes[isNaN(b2) ? 64 : data & 0x3F]) ;
    }
    return String.fromCharCode.apply(String, b64);
}

/**
 * Base64字符串转化成字节数组（小整数数组）
 * @public
 */
function base64ToByteArray(b64) {
    b64 = b64.replace(/[^A-Za-z0-9+\/]+/g, '');
    var bin = [];
    var padlen = b64.length % 4;
    for (var i = 0, l = b64.length; i < l; i += 4) {
        var data = (b64map[b64.charAt(i  )] << 18)
            |   (b64map[b64.charAt(i+1)] << 12)
            |   (b64map[b64.charAt(i+2)] <<  6)
            |   b64map[b64.charAt(i+3)];
        bin.push(
            data >> 16 ,
            (data >>  8) & 0xff ,
            data & 0xff 
        );
    }
    bin.length -= [0,0,2,1][padlen];
    return bin;
};

/**
 * UTF8字节数组转化成UTF16字节数组
 * @private
 */


function stringToByteArray(str) {
	var result = [];
    var i = str.length ;
    while(i--){
    	result[i] = str.charCodeAt(i) & 0xFF;
    }
    return result;
}
function stringToUTF16ByteArray(str) {
    var result = [];
    var i = str.length * 2;
    while(i--){
    	var c = str.charCodeAt(i);
    	result[i--] = c && 0xFF;
    	result[i] = c>>8;
    }
    return result;
}

/**
 * 将字符串转化成UTF8字节数组
 * @private
 */
function stringToUTF8ByteArray(str) {
    for(var result=[],i=0,len=str.length;i<len;i++){
	    var n = str.charCodeAt(i);
        if (n < 0x80){
            result.push(n);
        }else if (n < 0x800){
            result.push(
                0xc0 | (n >>>  6),
                0x80 | (n & 0x3f));
        }else{
            result.push(
                0xe0 | ((n >>> 12) & 0x0f),
                0x80 | ((n >>>  6) & 0x3f),
                0x80 |  (n         & 0x3f));
        }
    }
    return result;
}

function UTF16ByteArrayToString(bin){
	var uni = [];
    for (var i = 0, l = bin.length; i < l; i++) {
        uni.push((bin[i++] << 8 ) | bin[i]);
    }
    return String.fromCharCode(null,uni);
}
function UTF8ByteArrayToString(bin){
	var uni = [];
    for (var i = 0, l = bin.length; i < l; i++) {
        var c0 = bin[i];
        if(c0 < 0x80) {
            uni.push(c0);
        } else {
            var c1 = bin[++i];
            if (c0 < 0xe0) {
                uni.push(((c0 & 0x1f) << 6) | (c1 & 0x3f));
            } else {
                var c2 = bin[++i];
                uni.push(
                       ((c0 & 0x0f) << 12) | ((c1 & 0x3f) << 6) | (c2 & 0x3f)
                );
            }
        }
    }
    return String.fromCharCode(null,uni);
}
if ('function' == typeof (btoa && atob)) {
    base64ToByteArray = function(base64){
    	return stringToByteArray(atob(base64))
    }
    byteArrayToBase64 = function(byteArray){
    	return btoa(String.fromCharCode.apply(null,byteArray))
    }
}else {
    btoa = function (stream) {
        return byteArrayToBase64(stringToByteArray(stream))
    };
    atob = function(base64) {
        return String.fromCharCode.apply(null,base64ToByteArray(base64));
    };
}
