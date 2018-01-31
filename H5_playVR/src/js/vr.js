/**
 * Created by Administrator on 2017/2/14.
 */
/* global vr  app*/
var _ts;
function vr() {
    var _gyrosOn = false; // 是否启用陀螺仪
    var _isMouseDown;
    var _manualHRotate, _manualVRotate;
    var _manualHRotateOnStart, _manualVRotateOnStart;
    var _viewpointLon, _viewpointLat;
    var _viewpointLonOnStart, _viewpointLatOnStart;
    var _pointxOnStart, _pointyOnStart;
    var _touchXOnStart, _touchYOnStart;

    var _videoCtl = null;
    var _hls;
    var ChangeRel = false;
    var _initTimer;

    var _deviceAlpha, _deviceBeta, _deviceGamma;

    var _camera, _texture, _scene, _sphere, _renderer;
    var _fov;
    var _canvas2DPic; // Canvas渲染对象
    var _stats;
    var _needCanvas = false; // 是否需要canvas的渲染
    var _uniforms;
    var originallyMode = false; // false 是2d画面，不是全景
    var _vrMode; // 是否是vr模式
    var _firstClicked = false;
    var _lasty, _lastx, _lastz;
    var _updateOrientation = false;
    var _reversal = false; // 是否倒转镜头 就是全景影像全部倒转显示
    var isokt = false;

    // 定点半球
    var VertexHalfSphere =
        "varying vec3 vPos;" +
        "void main()" +
        "{" +
        "	vPos = position;" +
        " gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );" +
        "}"
        ;

    // 半景模式
    var FragmentHalfSphere =
        "varying vec3 vPos;" +
        "uniform sampler2D videoTexture;" +
        "const float PI = 3.1415926535897932384626433832795;" +
        "void main(void) {" +
        "	vec3 normalizedPos = normalize(vPos);" +
        "	float phi = atan(length(normalizedPos.xy) / -normalizedPos.z);" +
        "	if (phi < 0.0)" +
        "		phi += PI;" +
        "	float theta = atan(normalizedPos.y, normalizedPos.x);" +
        "	float r = phi / (0.5*PI);" +
        "	if (r <= 1.0) {" +
        "		vec2 planeCoords;" +
        "		planeCoords.x = r * cos(theta);" +
        "		planeCoords.y = r * sin(theta);" +
        "		planeCoords.x = planeCoords.x * 0.5 + 0.5;" +
        "		planeCoords.y = planeCoords.y * 0.5 + 0.5;" +
        "		gl_FragColor = texture2D(videoTexture, planeCoords);" +
        "	} else {" +
        "		gl_FragColor = vec4(vec3(0.0), 1.0);" +
        "	}" +
        "}"
        ;

    // 定点设置小行星模式
    var VertexLittlePlanet =
        "varying vec2 vUv;" +
        "void main()" +
        "{" +
        "	vUv = uv;" +
        "	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );" +
        "}"
        ;

    // 小行星模式
    var FragmentLittlePlanet =
        "varying vec2 vUv;" +
        "uniform sampler2D videoTexture;" +
        "uniform float scale, aspect;" +
        "uniform float phi0, lambda0;" +
        "" +
        "const float PI = 3.1415926535897932384626433832795;" +
        "" +
        "vec2 directionToTexturePos(vec2 coords) {" +
        "	float p = length(coords);" +
        "	float c = 2.0 * atan( p );" +
        "" +
        "	float lat = asin(cos(c) * sin(phi0) + coords.y * sin(c) * cos(phi0) / p);" +
        "	float lon = lambda0 + atan( (coords.x * sin(c)), (p * cos(phi0) * cos(c) - coords.y * sin(phi0) * sin(c)) );" +
        "" +
        "	return vec2( mod(lon/(2.0*PI), 1.0), 0.5+lat/PI ); " +
        "}" +
        "" +
        "void main(void) {" +
        "	vec2 vertexCoords;" +
        "	vec2 scaledCoords;" +
        "	vec2 texCoords;" +
        "" +
        "	vertexCoords = vUv * 2.0 - 1.0;" +
        "	scaledCoords = vertexCoords * vec2(scale * aspect, -scale);" +
        "	texCoords = directionToTexturePos(scaledCoords);" +
        "" +
        "	gl_FragColor = texture2D(videoTexture, texCoords);" +
        "}"
        ;

    // 鱼眼模式
    var FragmentFisheye =
        "varying vec2 vUv;" +
        "uniform sampler2D videoTexture;" +
        "uniform float scale, aspect;" +
        "uniform float phi0, lambda0;" +
        "" +
        "varying vec2 vertexCoords;" +
        "" +
        "const float PI = 3.1415926535897932384626433832795;" +
        "" +
        "vec2 directionToTexturePos(vec2 coords) {" +
        "    float r = length(coords);" +
        "    float theta = atan(coords.y, coords.x);" +
        "    float phi = r * scale * PI * 0.5;" +
        "    " +
        "    vec3 point;" +
        "    point.x = sin(phi) * cos(theta);" +
        "    point.y = sin(phi) * sin(theta);" +
        "    point.z = -cos(phi);" +
        "    " +
        "    mat3 rotate;" +
        "    float cosl = cos(lambda0);" +
        "    float sinl = sin(lambda0);" +
        "    float cosp = cos(phi0);" +
        "    float sinp = sin(phi0);" +
        "    rotate[0] = vec3(cosl, 0.0, -sinl);" +
        "    rotate[1] = vec3(sinl * sinp, cosp, cosl * sinp);" +
        "    rotate[2] = vec3(sinl * cosp, -sinp, cosl * cosp);" +
        "    " +
        "    vec3 point2 = rotate * point;" +
        "    " +
        "    vec2 longitudeLatitude = vec2( (atan(point2.x, -point2.z) / PI + 1.0) * 0.5," +
        "                              0.5 + asin(point2.y) / PI );" +
        "    return longitudeLatitude; " +
        "}" +
        "void main(void) {" +
        "    vec2 scaledCoords;" +
        "    vec2 texCoords;" +
        "    " +
        "    scaledCoords = vUv * 2.0 - 1.0;" +
        "    scaledCoords = scaledCoords * vec2(aspect, 1.0);" +
        "    if (length(scaledCoords) <= 1.0) {" +
        "        texCoords = directionToTexturePos(scaledCoords);" +
        "        gl_FragColor = texture2D(videoTexture, texCoords);" +
        "    } else {" +
        "        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);" +
        "    }" +
        "}"
        ;

    var _isIOS = false;
    var _isAndroid = false;
    var _mediaType = 0; /* 0: mp4, 1: m3u8 */

    function onDeviceOrientation(event) {
        event.preventDefault();
        _deviceAlpha = event.alpha;
        _deviceBeta = event.beta;
        _deviceGamma = event.gamma;
    }
    function onOrientationChange(event) {
        _updateOrientation = true;
    }

    function getScreenOrientation() {
        if (window.orientation !== undefined)
            return window.orientation;
        else
            return 0;
    }

    function getRotationQuat() {
        var degtorad = Math.PI / 180; // Degree-to-Radian conversion
        var y, x, z;
        if (_deviceAlpha == null) {
            y = 0 * degtorad;
            x = 90 * degtorad;
            z = 0 * degtorad;
        } else if (_gyrosOn || _updateOrientation) {
            y = _deviceAlpha * degtorad;
            x = _deviceBeta * degtorad;
            z = -_deviceGamma * degtorad;

            _lasty = y, _lastx = x, _lastz = z;
            _updateOrientation = false;
        } else {
            y = _lasty, x = _lastx, z = _lastz;
        }
        var screenOrientation = getScreenOrientation() * degtorad;
        if (screenOrientation == 0) {
            y += _manualHRotate * degtorad;
            x += _manualVRotate * degtorad;
        }
        else if (screenOrientation > 0) {
            y += _manualHRotate * degtorad;
            z += _manualVRotate * degtorad;
        }
        else {
            y += _manualHRotate * degtorad;
            z -= _manualVRotate * degtorad;
        }

        var euler = new THREE.Euler(x, y, z, 'YXZ');
        var quat = new THREE.Quaternion();
        quat.setFromEuler(euler);

        var euler2 = new THREE.Euler(-Math.PI * 0.5, 0, 0);
        var quat2 = new THREE.Quaternion();
        quat2.setFromEuler(euler2);

        var euler3 = new THREE.Euler(0, 0, -screenOrientation);
        var quat3 = new THREE.Quaternion();
        quat3.setFromEuler(euler3);

        quat2.multiplyQuaternions(quat2, quat3);
        quat.multiplyQuaternions(quat, quat2);

        return quat;
    }

    // 周期渲染函数，该函数被用于逐帧计数器函数调用
    function animate() {
        requestAnimationFrame(animate);
        _camera.lookAt(_scene.position);
        //if ( _videoCtl.readyState === video.HAVE_ENOUGH_DATA ) {
        //    var ctc = _canvas2DPic.getContext("2d");
        //    ctc.drawImage( _videoCtl, 0, 0 );
        //    if ( _texture ) _texture.needsUpdate = true;
        //
        //}
        // document.getElementById('result').innerText=_needCanvas+""+originallyMode
        if (_needCanvas || originallyMode == false) {
            var ctx = _canvas2DPic.getContext("2d");
            // ctx.drawImage(_videoCtl, 0, 0,_canvas2DPic.width, _canvas2DPic.height);
            if (originallyMode == true) ctx.drawImage(_videoCtl, 0, 0); else ctx.drawImage(_videoCtl, 0, 0, _canvas2DPic.width, _canvas2DPic.height)
            if (_texture) _texture.needsUpdate = true;
        }
        if (_vrMode <= 1 && originallyMode == true) {
            var quat = getRotationQuat();
            _camera.setRotationFromQuaternion(quat);
            //  _texture.needsUpdate = true;
        } else {
            if (originallyMode == true) {
                _uniforms.phi0.value = _viewpointLat;
                _uniforms.lambda0.value = _viewpointLon;
            }
        }
        _renderer.render(_scene, _camera);
        //_stats.update();
    }

    function onDocumentMouseDown(event) {
        event.preventDefault();
        _isMouseDown = true;
        _manualHRotateOnStart = _manualHRotate;
        _manualVRotateOnStart = _manualVRotate;
        _viewpointLonOnStart = _viewpointLon;
        _viewpointLatOnStart = _viewpointLat;
        _pointxOnStart = event.clientX;
        _pointyOnStart = event.clientY;
    }

    function onDocumentMouseMove(event) {
        if (_ts == false) return;
        if (_isMouseDown) {
            _manualHRotate = (event.clientX - _pointxOnStart) * 0.1 + _manualHRotateOnStart;
            _manualVRotate = (event.clientY - _pointyOnStart) * 0.1 + _manualVRotateOnStart;
            _viewpointLon = (event.clientX - _pointxOnStart) * 0.0025 + _viewpointLonOnStart;
            _viewpointLat = (event.clientY - _pointyOnStart) * 0.0025 + _viewpointLatOnStart;
        }
    }
    function onDocumentMouseUp(event) {
        _isMouseDown = false;
    }

    function onDocumentTouchStart(event) {
        event.preventDefault();

        var touch = event.touches[0];
        _touchXOnStart = touch.screenX;
        _touchYOnStart = touch.screenY;
    }

    function onDocumentTouchMove(event) {
        if (_ts == false) return;
        event.preventDefault();
        var touch = event.touches[0];
        _manualHRotate += (touch.screenX - _touchXOnStart) * 0.2;
        _manualVRotate += (touch.screenY - _touchYOnStart) * 0.2;
        _viewpointLon += (touch.screenX - _touchXOnStart) * 0.005;
        _viewpointLat += (touch.screenY - _touchYOnStart) * 0.005;
        _touchXOnStart = touch.screenX;
        _touchYOnStart = touch.screenY;
    }

    function onDocumentMouseWheel(e) {
        // cross-browser wheel delta
        var e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        //Math.max( sq.zoom, Math.min(sq.nw, sq.e.width + (sq.zoom * delta))) + "px"
        if (_vrMode <= 1) {
            _fov = _fov - (delta * 5);
            _fov = Math.max(30, Math.min(120, _fov));
            _camera.fov = _fov;
            _camera.updateProjectionMatrix();
        } else {
            _uniforms.scale.value -= delta * 0.1;
        }
        return false;
    }

    // 调整自适应画面
    function onWindowResize() {
        if (_vrMode <= 1 || originallyMode == false) {
            _camera.aspect = window.innerWidth / window.innerHeight;
            _camera.updateProjectionMatrix();

        } else {
            _uniforms.aspect.value = window.innerWidth / window.innerHeight;
        }
        _renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function OSDetect() {
        _isIOS = /i(Pad|Phone|Pod)/i.test(navigator.userAgent);
        _isAndroid = /android/i.test(navigator.userAgent);
    }

    // 视频是否是MP4或者m3u8
    function mediaTypeDetect(stream_url) {
        if (stream_url.indexOf('mp4') >= 0) {
            _mediaType = 0;
        } else if (stream_url.indexOf('m3u8') >= 0) {
            _mediaType = 1;
        } else {
            _mediaType = 2;
        }
    }

    // 主函数
    function init2() {

        if (_videoCtl.readyState === _videoCtl.HAVE_ENOUGH_DATA) {
            clearInterval(_initTimer);
        }
        else
            return;
        $("#showInfo").append("_needCanvas1" + _needCanvas + '<br/>');
        var width = _videoCtl.videoWidth || _videoCtl.width;
        var height = _videoCtl.videoHeight || _videoCtl.height;
        if (_needCanvas || originallyMode == false) {
            $("#showInfo").append("_needCanvas2" + _needCanvas + '<br/>');
            _canvas2DPic = document.createElement("canvas");
            _canvas2DPic.width = width;
            _canvas2DPic.height = height;
            _canvas2DPic.style.display = "none";
            _canvas2DPic.style.backgroundColor = "#000";
            if (_isIOS) {
                _texture = new THREE.CanvasTexture(_canvas2DPic);
                _texture.minFilter = THREE.LinearFilter;
                $("#showInfo").append("_isIOS3" + _isIOS + '<br/>');
            } else {
                _texture = new THREE.VideoTexture(_videoCtl);
                _texture.minFilter = THREE.LinearFilter;
                $("#showInfo").append("VideoTexture4" + '<br/>');
            }
        }
        if (_needCanvas == false || originallyMode == true) {
            if (!_isIOS) {
                _texture = new THREE.VideoTexture(_videoCtl);
                _texture.minFilter = THREE.LinearFilter;
            }
        }
        if (originallyMode == true) {
            $("#showInfo").append("_camera5" + originallyMode + '<br/>');
            _camera = new THREE.PerspectiveCamera(_fov, window.innerWidth / window.innerHeight, 1, 1000);
            if (_reversal == true) _camera.layers.enable(1); else _camera.layers.enable(0);
        } else {
            $("#showInfo").append("_camera6" + originallyMode + '<br/>');
            _camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2,
                0, 30);
        }

        if (_vrMode == 0 && originallyMode == true) {
            $("#showInfo").append("_vrMode7" + originallyMode + '<br/>');
            _scene = new THREE.Scene();
            var geometry = new THREE.SphereGeometry(20, 20, 20, Math.PI / 2); //radius, widthSegments, heightSegments, phiStart
            geometry.scale(-1, 1, 1);
            if (_reversal == true) {
                var uvs = geometry.faceVertexUvs[0];
                for (var i = 0; i < uvs.length; i++) {
                    for (var j = 0; j < 3; j++) {
                        uvs[i][j].x = 1 - uvs[i][j].x;
                        uvs[i][j].y = 1 - uvs[i][j].y;
                        uvs[i][j].z = 1 - uvs[i][j].z;
                    }
                }
            }
            var material = new THREE.MeshBasicMaterial({ map: _texture });

            _sphere = new THREE.Mesh(geometry, material);
            //mesh.rotation.y = - Math.PI / 2;
            if (_reversal == true) _sphere.layers.set(1); // display in left eye only
            _scene.add(_sphere);

            if (_reversal == true || ChangeRel == true) {
                ChangeRel = true;
                return;
            };

        } else if (_vrMode == 1 && originallyMode == true) {
            // 180 degree half sphere

            _uniforms = {
                videoTexture: { value: _texture },
            };
            var material = new THREE.ShaderMaterial({
                uniforms: _uniforms,
                vertexShader: VertexHalfSphere,
                fragmentShader: FragmentHalfSphere
            });

            var geometry = new THREE.SphereGeometry(20, 20, 20, Math.PI / 2); //radius, widthSegments, heightSegments, phiStart
            geometry.scale(-1, 1, 1);
            _scene = new THREE.Scene();
            _sphere = new THREE.Mesh(
                geometry,
                material
            );
            _scene.add(_sphere);

        } else if (_vrMode == 2 && originallyMode == true) {
            // Little planet mode
            _uniforms = {
                videoTexture: { value: _texture },
                scale: { value: 1.0 },
                aspect: { value: window.innerWidth / window.innerHeight },
                phi0: { value: 0.0 },
                lambda0: { value: 0.0 },
            };

            var material = new THREE.ShaderMaterial({
                uniforms: _uniforms,
                vertexShader: VertexLittlePlanet,
                fragmentShader: FragmentLittlePlanet
            });

            var geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
            _scene = new THREE.Scene();
            _sphere = new THREE.Mesh(
                geometry,
                material
            );
            _scene.add(_sphere);

        } else if (_vrMode == 3 && originallyMode == true) {
            // Fisheye mode
            _uniforms = {
                videoTexture: { value: _texture },
                scale: { value: 1.2 },
                aspect: { value: window.innerWidth / window.innerHeight },
                phi0: { value: 0.0 },
                lambda0: { value: 0.0 },
            };

            var material = new THREE.ShaderMaterial({
                uniforms: _uniforms,
                vertexShader: VertexLittlePlanet,
                fragmentShader: FragmentFisheye
            });

            var geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);

            _scene = new THREE.Scene();
            _sphere = new THREE.Mesh(
                geometry,
                material
            );
            _scene.add(_sphere);
        }
        if (originallyMode == false) {
            $("#showInfo").append("_vrMode10" + originallyMode + '<br/>');
            _scene = new THREE.Scene();
            _camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 0, 30);
            var material = new THREE.MeshBasicMaterial({ map: _texture, overdraw: 0.5 });
            var plane = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 0, 0);
            mesh = new THREE.Mesh(plane, material);
            mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;
            _scene.add(mesh);
        }
        if (isokt == true) return; else isokt = true;
        _renderer = new THREE.WebGLRenderer();
        _renderer.setClearColor(0x101010);
        _renderer.setPixelRatio(window.devicePixelRatio);
        _renderer.setSize(document.body.clientWidth, document.body.clientHeight);
        document.body.appendChild(_renderer.domElement);
        animate();
        // var container;
        // container = document.getElementById( 'container' );
        // _stats = new Stats();
        // container.appendChild( _stats.dom );

        // MouseEvent(false)
        _renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
        _renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
        _renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
        _renderer.domElement.addEventListener('mousewheel', onDocumentMouseWheel, false);
        _renderer.domElement.addEventListener('touchstart', onDocumentTouchStart, false);
        _renderer.domElement.addEventListener('touchmove', onDocumentTouchMove, false);


        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('orientationchange', onOrientationChange, false);

        _deviceAlpha = null;
        _deviceGamma = null;
        _deviceBeta = null;

    }
    this.MouseEvent = function (ts) {
        _ts = ts;
    }
    this.channelreversal = function (reversal) {
        _reversal = reversal;
        init2();
    }

    // 初始化设置
    this.init = function (stream_url, vrMode) {

        OSDetect();
        mediaTypeDetect(stream_url);
        _vrMode = vrMode;
        _isMouseDown = false;
        _manualHRotate = _manualVRotate = 0;
        _viewpointLon = 0;
        _viewpointLat = -Math.PI / 2;
        _fov = 65;
        _canvas2DPic = null;
        if (_vrMode == 3) {
            _viewpointLon = 0;
            _viewpointLat = 0;
        }

        _videoCtl = document.createElement("video");
        _videoCtl.setAttribute("webkit-playsinline", "");
        _videoCtl.setAttribute("preload", "auto");
        _videoCtl.crossOrigin = 'anonymous';
        _videoCtl.style.display = 'none';
        _videoCtl.loop = true;
        _videoCtl.src = stream_url;
        _videoCtl.autoplay = "autoplay";

        if (_isIOS) {
            $("#showInfo").append(_isIOS + '<br/>');
            // ios 10 use playsinline instead of webkit-playsinline

            _videoCtl.setAttribute("playsinline", "");
            _videoCtl.setAttribute("preload", "metadata");
            // Video texture cannot be loaded into webgl for m3u8. We should draw the video to a canvas, and then load canvas's texture into webgl
            if (_mediaType != 0) {
                _needCanvas = true;
            }
        } else if (_isAndroid) {
            // Tencent brower's attribute
            _videoCtl.setAttribute("x5-video-player-type", "h5");
            _videoCtl.setAttribute("autoplay", "autoplay");
        }
        // _videoCtl.id='video'
        //  document.body.appendChild(_videoCtl);
        // Media Source Extension
        if (_mediaType != 0 && Hls.isSupported()) {
            var oDiv = document.createElement('input');
            // document.body.appendChild(oDiv);

            _hls = new Hls({ debug: true });

            _hls.attachMedia(_videoCtl);
            _hls.on(Hls.Events.MANIFEST_PARSED, function (e) {

                // _videoCtl.play();
            });
            _hls.on(Hls.Events.ERROR, function (e) {
                // console.log("HLS Error", e.dataType);
                // alert("HLS Error", e.dataType);
                //   oDiv.placeholder= e.dataType;
                // alert("Error " + e.data.details);
            });
            // load the stream
            _hls.loadSource(stream_url);
        }
        else {
            if (navigator.userAgent.substr(navigator.userAgent.indexOf('OS') + 3).split('_')[0] < 10)
                _videoCtl.play();
        }

        _initTimer = setInterval(init2, 500);
    },
        this.isGyrosOn = function () {
            return _gyrosOn;
        },

        // 打开关闭陀螺仪
        this.openGyros = function (on) {
            if (on == true && _gyrosOn == false) {
                window.addEventListener('deviceorientation', onDeviceOrientation, false);
                //window.addEventListener( 'orientationchange', onDeviceOrientation, false );
            }
            else if (on == false && _gyrosOn == true) {
                //window.removeEventListener( 'deviceorientation', onDeviceOrientation, false );
                //window.removeEventListener( 'orientationchange', onDeviceOrientation, false );
            }
            _gyrosOn = on;
        },

        this.play = function () {

            _videoCtl.play();
            if (!_firstClicked) {
                _firstClicked = true;
            }
            init2();
        },

        this.pause = function () {

            _videoCtl.pause();
            clearInterval(_initTimer);
        },
        // 打开或者关闭vr模式
        this.VrYesorNo = function (isvrmode) {
            originallyMode = isvrmode;
            init2();
        }
    // 所有播放器的响应事件 - 比如暂停，播放错误等
    var eventTester = function (e) {
        _videoCtl.addEventListener(e, function () {
            $("#showInfo").append("_videoCtl---" + e + '<br/>');
        }, false);
    }
    this.setVCallback = function () {
        eventTester("loadstart");
        eventTester("progress");
        eventTester("suspend");
        eventTester("abort");
        eventTester("loadstart");
        eventTester("progress");
        eventTester("suspend");
        eventTester("abort");
        eventTester("error");
        eventTester("stalled");
        eventTester("play");
        eventTester("pause");
        eventTester("loadedmetadata");
        eventTester("loadeddata");
        eventTester("waiting");
        eventTester("playing");
        eventTester("canplay");
        eventTester("canplaythrough");
        eventTester("seeking");
        eventTester("seeked");
        eventTester("timeupdate");
        eventTester("ended");
        eventTester("ratechange");
        eventTester("durationchange");
        eventTester("volumechange");
    },

        // 当前播放时间
        this.getCurrentTime = function () {
            if (_videoCtl != null)
                return _videoCtl.currentTime;
            else
                return 0;

        },
        // 总的视频时间
        this.getduration = function () {

            if (_videoCtl != null)
                return _videoCtl.duration
            else
                return 0;
        }
};