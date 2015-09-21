function content(d1,d2){
	return contentTpl(d1)
}

exports.index = content;

var contentTpl = 
	<div class="yzh-center-f">
		<div class="yzh-center-f-a ">
			<table class="yzh-center-f-table">
				<thead class="yzh-center-f-theadß">
					<tr>
						<td></td>
						<td>地址</td>
						<td>账单日期</td>
						<td>费用类型</td>
						<td>费用期间</td>
						<td>到期日</td>
						<td>面积(平方米)</td>
						<td>单价(元/平米/月)</td>
						<td>上月读数</td>
						<td>本月读数</td>
						<td>未付</td>
						<td>已付</td>
						<td>金额(元)</td>
					</tr>
				</thead>
				<tbody class="yzh-center-f-tbody-tbody">
					<c:for name="item" value="${list}">
					<tr>
						<td><input type="checkbox" /></td>
						<td>${item.addr}</td>
						<td><c:format value="${item.date}"/></td>
						<td>${item.type}</td>
						<td>${item.from}<br/>${item.end}</td>
						<td>${item.lastDay}</td>
						<td>${item.size}</td>
						<td>${item.price}</td>
						<td>${item.previousValue}</td>
						<td>${item.currentValue}</td>
						<td>${item.topay}</td>
						<td>${item.paied}</td>
						<td>${item.amount}</td>
					</tr>
					</c:for>
					<c:else>
					<tr>
						<td colspan="12">没有数据</td>
					</tr>
					</c:else>
				</tbody>
			</table>
		</div>
		 <div class="yzh-center-f-table-b">
				<div class="left">
					<input type="checkbox" id="checkall"/>
					全选&nbsp;&#160;已选择<span id="span_count">0</span>个费用
				</div>
				<div class="right yzh-center-f-table-b-right">
					<p class="right yzh-center-f-table-b-p" id="qujie" style="cursor: pointer;">去结算</p>
					<p class="right yzh-center-f-table-b-p2" id="heji">合计：￥0</p>
				</div>
		</div> 
	</div>