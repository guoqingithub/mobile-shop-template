
var buy_car=new Map();
var buy_car_product=new Map();

/*//
$('.mai').on('tap',function(){
	$(this).next().css('display','block');
	$('.mai').css('display','block');
	$(this).css('display','none');
	$('.add').on('tap',function(){		
	})
	sub()
})
//商品中的点击加一事件 
$(document).on("tap",'.add',function(){
	$(this).prev().html(parseInt($(this).prev().html())+1);
	var add=$(this).prev().html();
	if(add>0){
		$('.submit_order').css({'background-color':'#FD5100','color':'#fff'});	
		$(".fenshu").css('display','block');
		
	}
	sub()
})
//商品中的点击减一事件 
$(document).on("tap",'.sub',function(){
	$(this).next().html(parseInt($(this).next().html())-1);
	var sub1=$(this).next().html();
	if(sub1<=0){
		$(this).next().html(0);
		$(this).prev().css({'background-color':'#999999','color':'#fff'});
		$(".fenshu").css('display','none');
	}
	sub();
})
function sub(){
	var sum=0;
	$(".fenshu").html($(".fenshu2").html());
}*/
//
var hei=$('body').height()-$('.banner').height()-$('.dianpu').height();
console.log(hei);
$('.mui-slider').css('height',hei);
$('#bottomPopover').css('top',hei);
//
var hei1=$('.mui-slider').height()-$('#sliderSegmentedControl').height();
$('.mui-slider-group').css('height',hei1);
console.log(hei1);
//
$('.ss').on('tap',function(){
	$('.fenxiang').css('display','block')
})
$('.ss').on('tap',function(e){
	$('.fenxiang').css('display','block');
	$(document).on("tap",function(e){
		if(e.target.className=="fenxiang"){
			$('.fenxiang').css('display','none');
		}
	})
})
//

//声明购物车

//var shopId=getQueryString('shopId');

//
$(document).on('tap','.mai',function(){
    $(this).next().css('display','block');
    $('.mai').css('display','block');
    $(this).css('display','none');
    $('.add').on('tap',function(){
    })
    sub()
})
//商品中的点击加一事件
$(document).on("tap",".aa",function(){
    $(this).prev().html(parseInt($(this).prev().html())+1);
    var add=$(this).prev().html();
    var productId=$(this).parent().parent().attr('data-id');
    $("#"+PRODUCTKEY+productId).html(add);
    if(add>0){
        $('.submit_order').css({'background-color':'#FD5100','color':'#fff'});
        $(".fenshu").css('display','block');
    }
    var price=$(this).parent().parent().attr('data-price');
    var name=$(this).parent().parent().attr('data-name');
    var product=new Product();
    product.productId=productId;
    product.price=price;
    product.quantity=add;
    product.money=add*price;
    product.name=name;
    buy_car.put(PRODUCTKEY+productId,product);
    //计算总价
    var total_money=getTotalMoney(buy_car);
    sub()
})
//商品中的点击减一事件
$(document).on("tap",".ss",function(){
    $(this).next().html(parseInt($(this).next().html())-1);
    var sub1=$(this).next().html();
    var productId=$(this).parent().parent().attr('data-id');
    $("#"+PRODUCTKEY+productId).html(sub1);
    //当商品数量为零时把商品从 购物车移除
    if(sub1<=0){
        $(this).next().html(0);
//		$(this).parent().css('display','none');
//		$(this).parent().prev().css('display','block');
        if($(this).hasClass('sub1')){
            $(this).parent().parent().remove();
        }
        var fenshu=document.getElementsByClassName('fenshu')[0].innerHTML;
        if(fenshu<=1){
            $('.submit_order').css({'background-color':'#999999','color':'#fff'});
            $(".fenshu").css('display','none');
        }
        buy_car.remove(PRODUCTKEY+productId);
        //计算总价
        var total_money=getTotalMoney(buy_car);
    }else{
        var price=$(this).parent().parent().attr('data-price');
        var name=$(this).parent().parent().attr('data-name');
        var product=new Product();
        product.productId=productId;
        product.price=price;
        product.quantity=sub1;
        product.money=sub1*price;
        product.name=name;
        buy_car.put(PRODUCTKEY+productId,product);
        //计算总价
        var total_money=getTotalMoney(buy_car);
    }
    sub();
})
function sub(){
    var sum=0;
    $(".choose").each(function(a){
        sum+=parseInt($(".choose").eq(a).find(".fenshu1").html())
    })
//	$(".fenshu").css('display','block');
    $(".fenshu").html(sum);
    return sum;
}
function getTotalMoney(map){
    var total_money=0;
    map.each(function(key,value,index){
        total_money+=value.money;
    })
    document.getElementById('total_money').innerHTML='￥'+total_money;
    localStorage.setItem(SHOPKEY+shopId,JSON.stringify(map));
    return total_money;
}

//更新购物车
$(document).on('tap','#end',function(){
    console.log(buy_car.data);
    addHtmlForTemplte(buy_car,'buy_car_info','buy_car_info_templete');
})
//清空购物车
$(document).on('tap','#clear_buy_car',function(){
    localStorage.removeItem(SHOPKEY+shopId);
    document.getElementById("buy_car_info").innerHTML="";
    location.reload();
})
//提交购物车
$(document).on('tap','#submit',function(){
    var buy_car_str=localStorage.getItem(SHOPKEY+shopId);
    var buy_car_obj=JSON.parse(buy_car_str);
    var buy_car_keys=buy_car_obj.keys;
    var productList=new Array();
    var origPrice=0.00;//原价
    var expressFee=0.00;//配送费
    var promotionId;//促销活动id
    var promotionAmount=0.00;//促销金额
    var actualPayment=0.00;//应付款
    console.log(buy_car_obj);
    console.log(buy_car_str);
    //把要购买的产品放入数组
    for (var i = 0; i <buy_car_keys.length; i++) {
        productList.push(buy_car_obj.data[buy_car_keys[i]]);
        origPrice+=buy_car_obj.data[buy_car_keys[i]].money;
    }
    var orderEntity=new BuyCar();
    orderEntity.productList=productList;
    orderEntity.shopId=shopId;
    orderEntity.origPrice=origPrice;
    orderEntity.expressFee=expressFee;
    orderEntity.actualPayment=origPrice+expressFee-promotionAmount;
    orderEntity.promotionId=promotionId;
    var userId=localStorage.getItem('userId');
    var url=window.location.href
    console.log(url);
    if(userId==null||userId==undefined){
        window.location.href='../enter/enter.html';
    }else{
        orderEntity.userId=userId;
    }
    console.log(orderEntity);
    $.ajax({
        type:'post',
        contentType: "application/json; charset=utf-8",
        url:rootPath+'/orderControllerapi/addOrder',
        data:JSON.stringify(orderEntity),
        dataType:'JSON',
        success:function(data){
            console.log(data);
            if(data.resultSuccess){
                localStorage.removeItem(SHOPKEY+shopId);
                window.location.href='../order/submit_order.html?orderId='+data.data;
            }else{
                mui.alert(data.resultDesc)
            }
        }
    })
})

function BuyCar(){};

function Product(){
    this.productId;
    this.price;
    this.quantity;
    this.money;
    this.name;
}
