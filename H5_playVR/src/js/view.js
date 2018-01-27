'use strict';
$(function () {
	orient();
	browserRedirect();
	/*聊天*/
	var number = playId;

	var cur_city = "未知";
	var is_get_region = 0;
	//var socket = io("http://chat.wsview.com:3000", {query:{id:number}});
	var socket = io("http://chat.wsview.com:3000");
	socket.emit("room_id", number);

	var chat = new Chat();

	$("#chatMess").bind("click", function () {
		$(this).focus();
	});

	$("#sendBtn").bind("click touchstart touchend", function () {
		var str = $("textarea").val();
		if (str == '' || str.trim().length == 0 || str.replace(/\s+/g, "").length == 0) {
			return false;
		} else {
			var msg = {};
			msg.time = 1;   //city0(其他网友)，city1(自己)
			msg.color = 1;
			msg.font = 1;
			msg.usr_id = 1;
			if (is_get_region == 0) {
				socket.emit("get_region");
				msg.content = '未知' + '::' + str;
			} else {
				msg.content = cur_city + '::' + str;
			}
			socket.emit('message', JSON.stringify(msg));
			str = chat.replace_em(str);
			chat.sendMsg('city1', cur_city, str);
		}

	});

	socket.emit('get_region');

	socket.on('online', function (count) {
		if (typeof count == 'number') {
			$('#online').text(playCount + "人");
		}
	});
	socket.on('server', function (str) {
		try {
			var msg = JSON.parse(str);
		} catch (err) {
			msg = null;
		}

		if (msg != null) {
			msg.content = chat.replace_em(msg.content);
			var str = msg.content.split('::');
			if (str.length < 2) {
				return;
			} else if (str.length > 2) {
				str[1] = msg.content.substr(str[0].length + 2, msg.content.length);
			}
		}
		chat.sendMsg('city0', str[0], str[1]);
	});


	socket.on('client_region', function (region) {
		if (typeof region != 'string') {
			is_get_region == 0;
			cur_city = "深圳";
		} else {
			is_get_region = 1;
			cur_city = region;
		}
	});

	/*播放器相关*/
	/*时间*/
	var liveTime = document.getElementById('live-time');
	/*播放/暂停按钮*/
	var btnPlay = document.getElementById('btn-play');
	/*陀螺仪*/
	var gyroscope = document.getElementById('gyroscope');
	var loadingmc = document.getElementById('loading');
	var textfile = document.getElementById('textfile');
	var reversalbtn = document.getElementById('reversal');
	var vrBtn = document.getElementById("vrBtn");
	//var full = document.getElementById("fullscreen");
	var obj = new Array(6);
	obj[0] = liveTime;
	obj[1] = gyroscope;
	obj[2] = btnPlay;
	obj[3] = loadingmc;
	obj[4] = reversalbtn;
	obj[5] = vrBtn;
	var videoVRType = 1;
	//var playId;
	//var playType='uLive';
	//obj[4]=full;
	if ("uLive" == playType) liveTime.innerHTML = "00:00:00"; else liveTime.innerHTML = "00:00:00/00:00:00";
	//var ulr='http://192.168.1.209:8080/live/ce15dbb7b0/playlist.m3u8?liveID=100006121&accessCode=7a41eae6'
	/* 0:全景 1:半景 2:小行星 3:鱼眼  */
	var vr_mode = 0;
	if ("uLive" == playType && '0' != liveType) {
		if (videoVRType == 7) vr_mode = 0;
		else if (videoVRType == 3 || videoVRType == 4) vr_mode = 1;
		else if (videoVRType == 11) vr_mode = 2;
		else if (videoVRType == 10) vr_mode = 3;
	} else {
		if (videoVRType == 3) vr_mode = 0;
		else if (videoVRType == 6 || videoVRType == 7) vr_mode = 1;
		else if (videoVRType == 11) vr_mode = 2;
		else if (videoVRType == 10) vr_mode = 3;
	}
	init(url, obj, vr_mode, playType);

	/*聊天图标按钮*/
	var chatBtn = document.getElementsByClassName("chatBtn")[0];
	chatBtn.addEventListener('click', chatBtnfun, false);
	chatBtn.addEventListener('touchstart', chatBtnfun, false);
	chatBtn.addEventListener('touchend', chatBtnfun, false);
	function chatBtnfun() {
		$(".chatTab").show(100);
		$(".chatOp").show(100);
		//$("textarea#chatMess").focus();
		$(".videoTab").hide();
		$(this).hide();
	}
	/*关闭聊天*/
	var closeBtn = document.getElementsByClassName("closeBtn")[0];
	closeBtn.addEventListener('click', closeBtnfun, false);
	closeBtn.addEventListener('touchstart', closeBtnfun, false);
	closeBtn.addEventListener('touchend', closeBtnfun, false);
	function closeBtnfun() {
		$(".chatTab").hide(100);
		$(".chatOp").hide(100);
		$(".chatBtn").show(100);
		$(".videoTab").show();
	}
});


$(window).bind('orientationchange', function () {
	orient();
});

/*横屏隐藏发表评论*/
function orient() {
	if (window.orientation == 0 || window.orientation == 180) {
		console.log('portrait竖屏');
		$(".chatBtn").show();

	} else if (window.orientation == 90 || window.orientation == -90) {
		console.log('landscape横屏');
		$(".chatBtn").hide();
		$(".chatTab").hide();
		$(".chatOp").hide();
	}
}
/*PC时，视为横屏，可发评论*/
function browserRedirect() {
	var sUserAgent = navigator.userAgent.toLowerCase();
	var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
	var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
	var bIsMidp = sUserAgent.match(/midp/i) == "midp";
	var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
	var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
	var bIsAndroid = sUserAgent.match(/android/i) == "android";
	var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
	var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
	if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
		document.getElementsByTagName('html')[0].style.fontSize = 480 * 100 / 375 + 'px';
		$(".chatBtn").show(); /*PC时，视为横屏，可发评论*/
		console.log("PC");
	}
}