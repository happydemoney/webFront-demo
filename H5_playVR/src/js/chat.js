'use strict';
var  ts;
var  fontArgs;
function Chat(){
	this.init();
	$("textarea").bind("input propertychange", function(){
		var word = $(this).val();
		if(word.replace(/\s+/g, "").length !=0){
			$('.sendBtn').css({"background-color":"#42d6ff","color":"#FFF"});
		}else{
			$('.sendBtn').css({"background-color":"#464247","color":"#888688"});
		}
	});
}
Chat.prototype = {
	init: function () {
		ts=this.fontLib();
		fontArgs=ts.split('|');
		var chatTab ='<div class="chatTab">'+
						'<div class="chatList" id="chatList">'+
							'<ul id="chatListUl">'+
								'<li>欢迎进入直播间···</li>'+
								'<li>链接成功···</li>'+
							'</ul>'+
						'</div>	'+
						'<span class="closeBtn"></span>'+
					'</div>';
		
		var chatOp = '<div class="chatOp">'+
						'<div class="chatEmotion"><img src="images/emoji.png" id="emoji"></div>'+
						'<div class="chatWord">'+
							'<textarea id="chatMess"  maxlength="32"></textarea> <!--最多32个字符-->'+
						'</div>'+
						'<button id="sendBtn" class="sendBtn">发送</button>'+
					'</div>';
		$('body').append(chatTab);
		$('body').append(chatOp);
		this.initEmoji();
	},
	filter:function(msg){  
	    for(var i=0;i<fontArgs.length;i++){  
	        var reg = new RegExp(fontArgs[i],"g");  
	        var replaceWord =this.str_repeat("*",fontArgs[i].length);
	        msg= msg.replace(reg,replaceWord);  
	    }  
	   	// console.log(msg);
	    return msg;
	},  
	initEmoji:function(mst){
		var faceUrl = "images/emoji/";
		if ($('#emoji').length > 0){
			$('#emoji').qqFace({
				id: 'facebox',
				assign: 'chatMess',
				path: faceUrl //表情存放的路径
			});
		}	
	},
	sendMsg:function(usr,city,msg){
		var html = '<li>'+
						'<span class="'+usr+'">'+city+'网友 </span>'+
						'<span class="comments">'+msg+'</span>'+
					'</li>';
		$("#chatListUl").append(html);
		$("textarea").val("");
		$('.sendBtn').css({"background-color":"#464247","color":"#888688"});
		this.chatlistBottom();
	},
	replace_em:function(msg){
		msg = this.filter(msg);
		msg = msg.replace(/\</g, '&lt;');
	    msg = msg.replace(/\>/g, '&gt;');
	    msg = msg.replace(/\n/g, '<br/>');
	    var reg = msg.match(/\[[^@]{1,3}\]/g);
	    if (reg !== null) {
	        for (var i = 0; i < reg.length; i++) {
	            var img_url = getFace_index(reg[i]);
	            if (img_url) {
	                msg = msg.replace(reg[i],  '<img src="images/emoji/Expression_'+img_url+'@2x.png" border="0"/>');
	            }
	        }        
	    }
	    return msg;
	},
	chatlistBottom:function(){
		var chatListSH= document.getElementById("chatListUl").offsetHeight;
		document.getElementById('chatList').scrollTop = chatListSH  ;
	},
	closeChatTab:function(){
		$(".chatTab").hide(100);
		$(".chatOp").hide(100);
	},
	/**违法禁止使用语言---列表**/
	fontLib:function(){
		var font = "死全家|习近平|共产党|FUCK|SHIT|游行|集会|强奸|走私|强暴|轮奸|奸杀|杀死|摇头丸|白粉|冰毒|海洛因|假钞|人民币|假币|赌博|博彩|海洛因|大麻|吗啡|烂B|烂屄|烂逼|烂比|烂屌|狂操你全家|嫩B|嫩b|机八|机巴|鸡八|鸡巴|鸡叭|鸡鸡|鸡奸|口交|滥交|乱交|卖淫|性交|性虐|颜射|阴部|阴唇|阴道|阴蒂|阴核|阴户|阴茎|阴门|我操|我操你|我干|我日|我日你|操逼毛|煞笔|傻逼|傻B|操你妈|日你妈|妈的|妈逼|草你妈|他妈的|她妈的|骚B|骚逼|骚卵|骚货|傻吊|傻卵|傻子|去你妈|奸|日你|逼毛|去你妈";
		return font;
	},
	str_repeat:function(str, num){ 
		return new Array( num + 1 ).join( str ); 
	}
   
}

