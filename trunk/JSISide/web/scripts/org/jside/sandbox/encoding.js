var xhr = new XMLHttpRequest();
xhr.open("get","http://www.xidea.org/project/jsi/images/logo.gif",false);
xhr.overrideMimeType("text/html;charset=ISO-8859-1");
function btoa(text) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var encoded = [];
    var bi = 0;
    var ai = 0;
    while (bi < text.length) {
        var b0 = text.charCodeAt(bi++);
        var b1 = text.charCodeAt(bi++);
        var b2 = text.charCodeAt(bi++);
        var buf = (b0 << 16) + ((b1 || 0) << 8) + (b2 || 0);
        var a0 = (buf & (63 << 18)) >> 18;
        var a1 = (buf & (63 << 12)) >> 12;
        var a2 = isNaN(b1) ? 64 : (buf & (63 << 6)) >> 6;
        var a3 = isNaN(b2) ? 64 : (buf & 63);
        encoded[ai++] = chars.charAt(a0);
        encoded[ai++] = chars.charAt(a1);
        encoded[ai++] = chars.charAt(a2);
        encoded[ai++] = chars.charAt(a3);
    }
    return encoded.join('');
}
function toHex(text){
    return text.replace(/[\s\S]/g,function(c){
        return (c.charCodeAt()).toString(16) +" "
    })
}
xhr.send('');

var replaceMap = {};
var list = "20ac 81 201a 192 201e 2026 2020 2021 2c6 2030 160 2039 152 8d 17d 8f 90 2018 2019 201c 201d 2022 2013 2014 2dc 2122 161 203a 153 9d 17e 178".split(" ")
var i=32;
while(i--){
    replaceMap[String.fromCharCode(parseInt(list[i],16))] = String.fromCharCode(0x80+i)
}
function replacer(c){
    return replaceMap[c];
}

prompt('',"data:image/png;base64,"+btoa(String(xhr.responseText).replace(/[\u0100-\uffff]/g,replacer)));


