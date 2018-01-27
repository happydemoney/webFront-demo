/**
 * Created by Administrator on 2016/10/24.
 */
/*global vr, Hls, alert */
"use strict";
// define globals
var objct,
    events,
    stats,
    tracks,
    gyro = false,
    isplaying = false;
var playType;
var ts = 0;
var vrs;
var isvrmode = false;
var channelREl = false;
//btn.addEventListener('click',reversalfun,false);
//function reversalfun()
//{
//
//
//}
// vr_mode, 0:全景 1:半景 2:小行星 3:鱼眼
function init(url, obj, vr_mode, _playType) {
    playType = _playType;
    console.log("init" + vr_mode);
    objct = obj;
    Setinit(url, vr_mode);
}
function Setinit(url, vr_mode) {
    console.log("onSubmit");
    var container;
    if (url != undefined) {
        // container = document.getElementById('main');
        //container.parentNode.removeChild(container);
        vrs = new vr;
        load_player(url, vr_mode);
        //loadScript("js/vr.js",load_player(ios));
    } else if (url) {
        // alert("Erro url, please make sure it is a  HLS .m3u8");
    }
}
//function loadScript(url,callback)
//{
//    var head = document.getElementsByTagName('head')[0],
//    script = document.createElement('script');
//    script.type = 'text/javascript';
//    script.src = url;
//    script.onreadystatechange = callback;
//    script.onload = callback;
//    head.appendChild(script);
//}
function load_player(url, vr_mode) {
    console.log('obj------', objct[2]);
    vrs.init(url, vr_mode);
    vrs.openGyros(true);
    window.setInterval(timefun, 500);
    $(objct[4]).click(isreversal);
    $(objct[2]).click(iscan);
    $(objct[5]).click(isVR);
    objct[2].addEventListener("touchstart", iscan, false);
    console.log(vr_mode);
    if (vr_mode == 0 || vr_mode == 1) {
        objct[1].style.display = "block";
        $(objct[1]).click(gyroscope);
        vrs.openGyros(true);
        vrs.MouseEvent(false);
        objct[1].className = 'gyroscope player_gyro_sel'; /*未开启*/
        objct[1].addEventListener("touchstart", gyroscope, false);
    }
    else {
        objct[1].style.display = "none";
        vrs.openGyros(false);
        vrs.MouseEvent(true);
    }
    vrs.setVCallback();

    /*全屏/退出全屏*/

    // objct[4].addEventListener('click',fullfun)
    //objct[4].addEventListener('touchmove',fullfun);

    //events = { url : url, t0 : performance.now(), load : [], buffer : [], video : [], level : [], bitrate : []};
}

function gyroscope(event) {
    //  objct[1].className = 'gyroscope player_gyro'; /*未开启*/
    event.preventDefault();
    var $gyroscope = $(objct[1]);
    // VR模式启动才起作用
    if (isvrmode) {
        if (vrs.isGyrosOn() == true) {
            vrs.openGyros(false);
            vrs.MouseEvent(true);
            objct[1].className = 'gyroscope player_gyro'; /*未开启*/
            $gyroscope.text('触控');
        }
        else {
            vrs.openGyros(true);
            vrs.MouseEvent(false);
            objct[1].className = 'gyroscope player_gyro_sel'; /*默认开启*/
            $gyroscope.text('陀螺仪');
        }
    }
}
/*全屏/退出全屏*/
function fullfun(event) {
    //var fullClass = objct[4].className;
    //if(fullClass == "fullscreen player_big"){
    //    launchFullscreen(document.documentElement); // 整个网页
    //    objct[4].className = "fullscreen player_small";
    //}else{
    //    exitFullscreen(); /*退出全屏*/
    //    objct[4].className = "fullscreen player_big";
    //}
}
function launchFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}
function formatTime(value) {
    if (isNaN(value)) value = 0;
    if (value > 0) objct[3].style.display = "none";
    var theTime = parseInt(value);// 秒
    var theTime1 = 0;// 分
    var theTime2 = 0;// 小时
    if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
        }
    }
    var result = "0" + parseInt(theTime);
    if (isNaN(parseInt(theTime))) result = "00";
    if (theTime >= 10) {
        result = "" + parseInt(theTime);
    }
    if (theTime1 > 0) {
        result = "" + parseInt(theTime1) + ":" + result;
    } else {
        result = "" + "00" + ":" + result;
    }
    if (theTime2 > 0) {
        result = "" + parseInt(theTime2) + ":" + result;
    } else {
        result = "" + "00" + ":" + result;
    }
    return result;
}
function handleVideoEvent(evt) {
    // console.log("HLS Error", autoPlay);
    // document.getElementById('result').innerText="dddddd"+evt.type;
    switch (evt.type) {
        case 'pause':
            // objct[2].className ="btn-play player_play";
            isplaying = false;
            break;
        case 'play':
            //    objct[2].className ="btn-play player_pause";
            isplaying = true;
            break;
        case 'canplay':
            //  objct[3].style.display="none";
            break;
        case 'onemptied':
            objct[3].style.display = "block";
            // alert("断开连接，刷新重试");
            break;
    }
}
function isreversal(event) {
    var $reversal = $(objct[4]);
    // VR模式启动才起作用
    if (isvrmode) {
        if (channelREl == false) {
            objct[4].className = "reversal overthrow_sel";
            $reversal.text('倒视');
            channelREl = true;
        } else {
            objct[4].className = "reversal overthrow";
            $reversal.text('正视');
            channelREl = false;
        }
        vrs.channelreversal(channelREl);
    }
}
function isVR(event) {
    var $vrchange = $(objct[5]),
        $videoTab = $('.videoTab');
    if (isvrmode == false) {

        objct[5].className = "vrchange vrchange1";
        isvrmode = true;
        $videoTab.addClass('vrMode');
    } else {


        objct[5].className = "vrchange vrchange0";
        isvrmode = false;
        $videoTab.removeClass('vrMode');
    }

    vrs.VrYesorNo(isvrmode);
}
function iscan(event) {
    event.preventDefault();
    if (isplaying == true) {
        vrs.pause();
        objct[2].className = "btn-play player_play";
        isplaying = false
    } else {
        isplaying = true
        vrs.play();
        objct[2].className = "btn-play player_pause";

    }
}
function timefun() {
    if ("uLive" == playType) {
        ts = vrs.getCurrentTime();
        if (isNaN(ts) || ts == undefined) ts = 0;
        objct[0].innerHTML = formatTime(ts);
    }
    else {
        ts = vrs.getduration();
        if (isNaN(ts) || ts == undefined) {
            ts = 0;
        }
        objct[0].innerHTML = formatTime(parseInt(vrs.getCurrentTime())) + "/" + formatTime(ts);
    }
}
//回调函数判断m3u8
function validateUrl(value) {
    return /^((https?|ftp):\/\/)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
}