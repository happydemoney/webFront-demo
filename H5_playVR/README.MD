#   H5-VR流程

源文件：src/

入口文件: play.html

1. 处理URL：

locationUrl = 'http://192.168.1.223:8081/h5_playVR/play.html?autoPlay=false&playType=uLive&userVideoID=10050087&userID=17847';

getUrl = '?autoPlay=false&playType=uLive&userVideoID=10050087&userID=17847';

playType = 'uLive';
playId = 10050087;

2. 通过AJAX 与服务器地址 'flashplayerAction!flashParamJson.action' + getUrl 交互

返回一串JSON，格式如下：

{
    "a": "720P",
    "action1": "no",
    "action2": "no",
    "action3": "no",
    "adPath1": "no",
    "adPath2": "no",
    "adPath3": "no",
    "controlStyle": 0,
    "controlStyleColor": "28AAFA",
    "duration1": "no",
    "duration2": "no",
    "f": "rtmp://192.168.1.206:1935/live/61159db4f5?liveID=10050087",
    "i": "http://192.168.1.35/img/liveimage/1513751254948171/41563af975ad0320421dec5b61dab0bc_10050087_4.jpg",
    "isShowBarrage": "1",
    "isShowLogo": 1,
    "la": 1,
    "leftMenu": "云宙多媒体技术有限公司|http://www.simope.com",
    "liveName": "直播间",
    "liveState": "1",
    "liveStatusUrl": "http://192.168.1.223:8081/flashplayerAction!liveParam.action?liveId=10050087",
    "lp": "http://192.168.1.35/img/logo/1513751254948171/4e9ab6952fe2cd722226d1bb2a4bbfe6_7_1.png",
    "lv": 1,
    "my_url": "http://192.168.1.223:8081",
    "onlights": "1",
    "overTimeLive": 1517277368000,
    "p": "0",
    "personLimit": 0,
    "playCount": "212",
    "replayFlag": 0,
    "shareCopy": "http://192.168.1.223:8081/yzplayerAction!play2.action?autoPlay=false$#$playType=uLive$#$userVideoID=10050087|<iframe marginWidth=0 marginHeight=0 src=http://192.168.1.223:8081/yzplayerAction!play2.action?autoPlay=false$#$playType=uLive$#$userVideoID=10050087 frameBorder=0 width=900 scrolling=no height=600 allowTransparency></iframe>",
    "shareDisplay": "1",
    "shareOption": "1|1|1|1|1|1",
    "shareUrl": "http://service.weibo.com/share/share.php?url=http://192.168.1.223:8081/yzplayerAction!play2.action?autoPlay=false$#$playType=uLive$#$userVideoID=10050087$#$title=直播间$#$pic=http://192.168.1.35/null|http://share.v.t.qq.com/index.php?c=share$#$atx=index$#$url=http://192.168.1.223:8081/yzplayerAction!play2.action?autoPlay=false$#$playType=uLive$#$userVideoID=10050087$#$title=直播间$#$pic=http://192.168.1.35/null|http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=http://192.168.1.223:8081/yzplayerAction!play2.action?autoPlay=false$#$playType=uLive$#$userVideoID=10050087$#$title=直播间$#$pics=http://192.168.1.35/null|http://s.jiathis.com/?webid=weixin$#$url=http://192.168.1.223:8081/yzplayerAction!play2.action?autoPlay=false$#$playType=uLive$#$userVideoID=10050087$#$title=直播间$#$isexit=false|http://connect.qq.com/widget/shareqq/index.html?url=http://192.168.1.223:8081/yzplayerAction!play2.action?autoPlay=false$#$playType=uLive$#$userVideoID=10050087$#$title=直播间$#$pics=http://192.168.1.35/null|http://share.renren.com/share/buttonshare.do?link=http://192.168.1.223:8081/yzplayerAction!play2.action?autoPlay=false$#$playType=uLive$#$userVideoID=10050087$#$title=直播间$#$pic=http://192.168.1.35/null",
    "source_url": "http://192.168.1.22",
    "sp": "one",
    "startTimeLive": 1517190968000,
    "systemTimeLive": 1517191542563,
    "title": "直播间",
    "tm": "0",
    "userId": "0",
    "userVideoID": "10050087",
    "videoVRType": 7,
    "watchPass": ""
}

3. 解析参数
playCount = json.playCount;
videoVRType = json.videoVRType;

// 直播
if(playType = 'uLive'){
    var f = json.f;
	url = f.substring(f.indexOf("/live/"), f.lastIndexOf("?")) + "/playlist.m3u8?liveID=" + playId;
}
// 点播

4. vr.js
three.js / hls.js

    three.js:

THREE.Euler(x, y, z, 'YXZ')
THREE.Quaternion()
THREE.CanvasTexture(_canvas2DPic)
THREE.LinearFilter
THREE.VideoTexture(_videoCtl)
THREE.PerspectiveCamera(_fov, window.innerWidth / window.innerHeight, 1, 1000)
THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 0, 30);
THREE.Scene();
THREE.SphereGeometry(20, 20, 20, Math.PI / 2); //radius, widthSegments, heightSegments, phiStart
THREE.MeshBasicMaterial({ map: _texture });
THREE.Mesh(geometry, material);
THREE.ShaderMaterial({
    uniforms: _uniforms,
    vertexShader: VertexHalfSphere,
    fragmentShader: FragmentHalfSphere
});
THREE.SphereGeometry(20, 20, 20, Math.PI / 2);
THREE.PlaneGeometry(window.innerWidth, window.innerHeight)
THREE.WebGLRenderer();

three.js - demo
three.js 全景视频DEMO 圆柱全景图
https://github.com/mrdoob/three.js/blob/master/examples/webgl_video_panorama_equirectangular.html

three.js 全景视频DEMO 鱼眼-全景
http://192.168.110.90:8080/examples/#canvas_geometry_panorama_fisheye

