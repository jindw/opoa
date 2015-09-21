function menu(d1,d2){
	var html = menuTpl(d1);
	return html
}
function itemClass(hash){
	var data = location.hash;
	if(data = data.substr(1)){
		data = decodeURIComponent(data);
		if(hash == data){
			return "yzh-nav-xz"
		}
	}
	
	return null;
}
var menuTpl = 
	<ul class="yzh-nav left">
		<c:for var="item" list="${items}">
			<c:var name="hash" value="${JSON.stringify(item.data)}"/>
			<li  id="${item.id}" class="${require('example-menu').itemClass(hash)}"  style="${item.style}">
				<a style="cursor: pointer;" href="#${hash}">${item.name}</a>
			</li>
		</c:for>
	</ul>;



exports.index = menu;
exports.itemClass =itemClass


































var menuTpl2 = 
	<ul class="menu">
		<c:var name="click">if(event.srcElement==this||event.srcElement.parentNode==this)this.className=(this.className == 'menu-close'?'menu-open':'menu-close')</c:var>
		<li c:for="item:items" class="${item.children?'menu-close':'menu-leaf'}"
		 onclick="${item.children?click:null}">
			<a href="#${JSON.stringify(item.data)}"> ${item.name}</a>
			<ul c:if="${item.children}"  class="menu" onclick="return false;">
				<li c:for="item:item.children">
					<a href="#${JSON.stringify(item.data)}"> ${item.name}</a>
				</li>
			</ul>
		</li>
	</ul>;