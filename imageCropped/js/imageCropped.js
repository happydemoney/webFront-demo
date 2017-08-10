/*!
 * imageCropped 1.0.0
 * https://github.com/happydemoney/webFront-demo/tree/master/imageCropped
 * @license MIT licensed
 *
 * Copyright (C) 2017  - A project by happydemoney
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {

    var pluginName = 'imageCropped';
    var imageCropped = function (options, el) {

        // Constant definition - 常量定义
        var WRAPPER = 'imageCropped-wrapper',
            WRAPPER_SEL = '.' + WRAPPER,

            CONTAINER = 'imageCropped-container',
            CONTAINER_SEL = '.' + CONTAINER,

            CANVASBOX = 'imageCropped-canvasBox',
            CANVASBOX_SEL = '.' + CANVASBOX,

            IMAGEBOX = 'imageCropped-imageBox',
            IMAGEBOX_SEL = '.' + IMAGEBOX,

            CROPBOX = 'imageCropped-cropBox',
            CROPBOX_SEL = '.' + CROPBOX,

            ACTIVE = 'active',
            ACTIVE_SEL = '.' + ACTIVE;

        // Creating some defaults, extending them with any options that were provided - 
        options = $.extend({
            debug: true,
            log: function (msg) {
                if (this.debug) { console.log(msg); }
            },
            state: {
                dragable: false
            },
            data: {
                "rotate": 0,
                "ratio": 1.1
            },
            sourceImageData: {
                "firstLoad": true,
                "naturalWidth": 0,
                "naturalHeight": 0,
                "userScrollLeft": 0,    // 记住用户操作移动的横坐标
                "userScrollTop": 0,     // 记住用户操作移动的纵坐标
                "minRatio": 0.1,
                "minRatio_horizontal": 0.1,
                "minRatio_vertical": 0.1,
                "SliderZoomFirstLoad": true,
                "SliderRotateFirstLoad": false
            },
            tooltip: {
                warning: 1440,
                error: 900
            },

            // Define the aspect ratio of the crop box
            aspectRatio: NaN,   // 16/9 - 5/4 - 4/3 - 3/2 - 2/1 - 1/1 

            // dom style
            domStyle: {
                containerWidth: 400,
                containerHeight: 300
            },

            // Shortcuts of events
            ready: null,
            cropstart: null,
            cropmove: null,
            cropend: null,
            crop: null,
            zoom: null,

            // dom node
            container: null,    // 裁剪区域父区域对象
            canvasBox: null,    // 裁剪canvas对象
            imageBox: null,     // 裁剪图片对象
            cropBox: null,      // 裁剪区域结构对象 
            image: null         // 被裁剪图像的容器对象
        }, options);

        var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
        var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints));
        var imageSrc = '';

        var isNumber = function (param) {
            return typeof param === 'number' && !isNaN(param);
        },
            // 初始化    
            _init = function () {
                var structure = '<div class="' + WRAPPER + '">\
                                <div class="'+ CONTAINER + '">\
                                    <div class="'+ CANVASBOX + '"></div>\
                                    <div class="'+ IMAGEBOX + '"></div>\
                                    <div class="'+ CROPBOX + '">\
                                        <button tabindex="-1" class="warning-tooltip-warning" data-toggle="tooltip" data-placement="bottom" title="裁剪尺寸较小"></button>\
                                        <button tabindex="-1" class="warning-tooltip-error" data-toggle="tooltip" data-placement="bottom" title="裁剪尺寸过小"></button>\
                                    </div>\
                                    <div class="spinner" style="display: none">Loading...</div>\
                                </div>\
                            </div>',
                    $wrapper,
                    containerWidth,
                    containerHeight;

                imageSrc = el[0].src;
                el.after(structure).addClass('imageCropped-hidden');
                $wrapper = el.siblings(WRAPPER_SEL);

                options.container = $wrapper.find(CONTAINER_SEL);
                options.canvasBox = $wrapper.find(CANVASBOX_SEL);
                options.imageBox = $wrapper.find(IMAGEBOX_SEL);
                options.cropBox = $wrapper.find(CROPBOX_SEL);
                options.image = new Image();

                containerWidth = options.domStyle.containerWidth;
                containerHeight = isNumber(options.aspectRatio) ? containerWidth / options.aspectRatio : options.domStyle.containerHeight;

                options.container.css({
                    width: containerWidth,
                    height: containerHeight
                });
            },
            _oFunctions = {
                getCropboxedCanvas: function () {

                    var canvas = document.createElement("canvas"),
                        context = canvas.getContext("2d"),

                        sourceImageWidth = options.sourceImageData.naturalWidth,
                        sourceImageHeight = options.sourceImageData.naturalHeight,

                        canvasWidth = sourceImageWidth,
                        canvasHeight = sourceImageHeight;

                    canvas.width = canvasWidth;
                    canvas.height = canvasHeight;

                    if (options.data.rotate != 0) {

                        var rotatedSize = this.getRotatedSize({
                            width: canvasWidth,
                            height: canvasHeight,
                            degree: options.data.rotate
                        }),
                            rotation,
                            costheta, sintheta,

                            translateX, translateY;

                        if (options.data.rotate >= 360) {
                            options.data.rotate = options.data.rotate % 360;
                        }

                        if (options.data.rotate > 0) {
                            rotation = Math.PI * options.data.rotate / 180;
                        } else {
                            rotation = Math.PI * (360 + options.data.rotate) / 180;
                        }

                        costheta = Math.round(Math.cos(rotation) * 1000) / 1000;
                        sintheta = Math.round(Math.sin(rotation) * 1000) / 1000;

                        canvasWidth = rotatedSize.newWidth;
                        canvasHeight = rotatedSize.newHeight;

                        canvas.width = canvasWidth;
                        canvas.height = canvasHeight;

                        if (rotation <= Math.PI / 2) {

                            translateX = sintheta * sourceImageHeight;
                            translateY = 0;

                        } else if (rotation <= Math.PI) {

                            translateX = canvasWidth;
                            translateY = -costheta * sourceImageHeight;

                        } else if (rotation <= 1.5 * Math.PI) {

                            translateX = -costheta * sourceImageWidth;
                            translateY = canvasHeight;

                        } else {

                            translateX = 0;
                            translateY = -sintheta * sourceImageWidth;
                        }

                        context.save();

                        context.fillStyle = "#fff";
                        context.fillRect(0, 0, canvas.width, canvas.height);

                        context.translate(translateX, translateY);
                        context.rotate(options.data.rotate * Math.PI / 180);
                        context.drawImage(options.image, 0, 0);

                        context.restore();

                    } else {
                        context.drawImage(options.image, 0, 0);
                    }

                    return canvas;
                },
                getRotatedSize: function (data) {

                    var deg = Math.abs(data.degree) % 180;
                    var arc = (deg > 90 ? (180 - deg) : deg) * Math.PI / 180;

                    var sinArc = Math.sin(arc);
                    var cosArc = Math.cos(arc);

                    var width = data.width;
                    var height = data.height;

                    var newWidth;
                    var newHeight;

                    newWidth = width * cosArc + height * sinArc;
                    newHeight = width * sinArc + height * cosArc;

                    return {
                        newWidth: newWidth,
                        newHeight: newHeight
                    };
                },
                getDataURL: function () {

                    var canvas = document.createElement("canvas"),
                        context = canvas.getContext("2d"),

                        cropboxCanvas = options.canvasBox[0],
                        offsetLeft = cropboxCanvas.offsetLeft,
                        offsetTop = cropboxCanvas.offsetTop,

                        //在画布上放置图像的 x / y坐标位置。
                        dx, dy,

                        //要使用的图像的宽度/高度
                        dwidth, dheight,
                        roundedData;

                    roundedData = this.getData();

                    dx = - roundedData.x;
                    dy = - roundedData.y;

                    dwidth = roundedData.sourceCanvasWidth;
                    dheight = roundedData.sourceCanvasHeight;

                    canvas.width = roundedData.width;
                    canvas.height = roundedData.height;

                    if (roundedData.rotate != 0) {

                        context.save();

                        context.fillStyle = "#fff";
                        context.fillRect(0, 0, canvas.width, canvas.height);

                        context.drawImage(this.getCropboxedCanvas(), dx, dy, dwidth, dheight);
                        context.restore();

                    } else {
                        context.drawImage(options.image, dx, dy, dwidth, dheight);
                    }

                    return canvas.toDataURL('image/jpeg');
                },
                getBlob: function () {

                    var imageData = this.getDataURL();
                    var b64 = imageData.replace('data:image/jpeg;base64,', '');
                    var binary = atob(b64);
                    var array = [];
                    for (var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }
                    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
                },
                getBlobUrl: function () {
                    var URL = window.URL || window.webkitURL;
                    var imgBlob = this.getBlob();
                    var blobUrl = URL.createObjectURL(imgBlob);

                    return blobUrl;
                },
                revokeBlobURL: function (objectURL) {
                    var URL = window.URL || window.webkitURL;
                    URL.revokeObjectURL(objectURL);
                },
                zoomIn: function () {
                    options.data.ratio *= 1.1;
                    setCanvasBoxPosition();
                },
                zoomOut: function () {
                    options.data.ratio *= 0.9;
                    setCanvasBoxPosition();
                },
                // ratio: 取值 minRatio ~ maxRatio
                zoom: function (ratio) {
                    if (options.sourceImageData.SliderZoomFirstLoad) {

                        options.sourceImageData.SliderZoomFirstLoad = false;
                        // 检测像素是否符合匹配条件
                        checkPixels();
                        return;
                    }
                    var ratio = Number(ratio),
                        zoomData = this.getZoomData();

                    if (ratio < zoomData.minRatio || ratio > zoomData.maxRatio) {
                        return;
                    } else {
                        options.data.ratio = ratio;
                        setCanvasBoxPosition();
                    }
                },
                //  获取当前上传图片的最小 和 最大放大比率
                getZoomData: function () {

                    var minRatio = options.sourceImageData.minRatio,
                        maxRatio = 1;

                    return {
                        minRatio: minRatio,
                        minRatio_horizontal: options.sourceImageData.minRatio_horizontal,
                        minRatio_vertical: options.sourceImageData.minRatio_vertical,
                        maxRatio: maxRatio
                    };
                },
                //  根据当前 imageBox的长宽 和 ratio 的值 计算出四个边界的值 -- Boundary -- { left: 0,....,bottom: 0 }
                getBoundary: function () {

                    var Boundary = {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    },
                        width = options.cropBox.width(),
                        height = options.cropBox.height(),

                        viewWidth = options.container.width(),
                        viewHeight = options.container.height(),

                        childCanvas = options.canvasBox.find('canvas')[0],
                        cropboxCanvasWidth = childCanvas.width * options.data.ratio,
                        cropboxCanvasHeight = childCanvas.height * options.data.ratio;

                    if (options.data.rotate % 90 == 0) {
                        Boundary.left = 0;
                        Boundary.top = 0;
                        Boundary.right = width - cropboxCanvasWidth;
                        Boundary.bottom = height - cropboxCanvasHeight;
                    }

                    return Boundary;
                },
                // angle: (0 - 360) , type: number
                rotate: function (angle) {
                    // deg
                    if (options.sourceImageData.SliderRotateFirstLoad) {
                        options.sourceImageData.SliderRotateFirstLoad = false;
                        checkPixels();
                        return;
                    }
                    var angleType = typeof angle,
                        sourceAngle,
                        newAngle;

                    if (angleType != Number) {
                        angle = parseInt(angle);
                    }

                    if (angle % 90 == 0) {

                        options.data.rotate = options.data.rotate - options.data.rotate % 90 + angle;

                        if (options.data.rotate < 0) {
                            options.data.rotate = options.data.rotate + 360;
                        }
                    } else {
                        sourceAngle = (options.data.rotate - options.data.rotate % 90);
                        newAngle = sourceAngle + angle;

                        options.data.rotate = sourceAngle + newAngle;
                    }

                    initCanvasBox();

                    var ratioDiff = options.data.ratio - options.sourceImageData.minRatio;

                    if (ratioDiff > 0 && ratioDiff < 0.00001 || !ratioDiff) {
                        options.sourceImageData.minRatio = suitRatio();
                        options.data.ratio = suitRatio();
                    }
                    setCanvasBoxPosition();
                },
                /**
                 * data:
                 *  Type: Object
                 *  Properties: See the getData method.
                 *  Change the cropped area position and size with new data (base on the original image).
                 */
                setData: function () {

                    var width = this.cropBox.width(),
                        height = this.cropBox.height(),

                        viewWidth = options.container.width(),
                        viewHeight = options.container.height();

                    // options.options.data
                    options.canvasBox.css({
                        "left": (viewWidth / 2 - width / 2) - options.options.data.x * options.data.ratio,
                        "top": (viewHeight / 2 - height / 2) - options.options.data.y * options.data.ratio
                    });

                    options.imageBox.css({
                        "left": (viewWidth / 2 - width / 2) - options.options.data.x * options.data.ratio,
                        "top": (viewHeight / 2 - height / 2) - options.options.data.y * options.data.ratio
                    });
                },
                /**
                 *  method: getData ([rounded])
                 *  x: the offset left of the cropped area
                 *  y: the offset top of the cropped area
                 *  width: the width of the cropped area
                 *  height: the height of the cropped area
                 *  sourceCanvasWidth: the width of the image scale width -- 导出的canvas的跨度(rotate为0时与用户上传的原图宽度一直，其他角度时会变大)
                 *  sourceCanvasHeight: the height of the image scale height -- 导出的canvas的高度(rotate为0时与用户上传的原图高度一直，其他角度时会变大)
                 *  rotate: the rotated degrees of the image
                 **/
                getData: function () {

                    var rounded = {},
                        width = options.cropBox.width(),
                        height = options.cropBox.height(),

                        viewWidth = options.container.width(),
                        viewHeight = options.container.height(),

                        cropboxCanvas = options.canvasBox[0],
                        offsetLeft = cropboxCanvas.offsetLeft,
                        offsetTop = cropboxCanvas.offsetTop,

                        cropboxCanvasWidth = options.canvasBox.width(),
                        cropboxCanvasHeight = options.canvasBox.height(),
                        rotatedPoint;

                    rounded.x = Math.floor((viewWidth / 2 - width / 2 - offsetLeft) / options.data.ratio);
                    rounded.y = Math.floor((viewHeight / 2 - height / 2 - offsetTop) / options.data.ratio);
                    rounded.width = Math.floor(width / options.data.ratio);
                    rounded.height = Math.floor(height / options.data.ratio);

                    rounded.sourceCanvasWidth = Math.floor(cropboxCanvasWidth / options.data.ratio);
                    rounded.sourceCanvasHeight = Math.floor(cropboxCanvasHeight / options.data.ratio);

                    rounded.rotate = options.data.rotate;
                    rounded.ratio = options.data.ratio;

                    return rounded;
                }
            },
            //  初始化 canvasBox 
            initCanvasBox = function () {

                var newCanvas = _oFunctions.getCropboxedCanvas(),
                    img = '<img alt="showImage" src="' + newCanvas.toDataURL('image/jpeg') + '">';

                options.canvasBox.empty();
                options.canvasBox.append(newCanvas);

                options.imageBox.empty();
                options.imageBox.append(img);
            },
            //  适配最适合当前外边尺寸的图片比率
            suitRatio = function () {

                var elWidth = options.container.width(),
                    elHeight = options.container.height(),
                    childCanvas = options.canvasBox.find('canvas')[0],
                    canvasWidth = childCanvas.width,
                    canavsHeight = childCanvas.height,

                    widthRatio = elWidth / canvasWidth,
                    heightRatio = elHeight / canavsHeight;

                return widthRatio > heightRatio ? widthRatio : heightRatio;
            },
            //  设置CanvasBox 长宽以及其在页面的定位样式
            setCanvasBoxPosition = function () {

                var elWidth = options.container.width(),
                    elHeight = options.container.height(),
                    childCanvas = options.canvasBox.find('canvas')[0],
                    canvasBoxWidth = childCanvas.width * options.data.ratio,
                    canvasBoxHeight = childCanvas.height * options.data.ratio,
                    offsetLeft = (elWidth - canvasBoxWidth) / 2 + options.sourceImageData.userScrollLeft,
                    offsetTop = (elHeight - canvasBoxHeight) / 2 + options.sourceImageData.userScrollTop,
                    Boundary = _oFunctions.getBoundary();

                if (offsetLeft > Boundary.left || offsetLeft < Boundary.right || offsetTop > Boundary.top || offsetTop < Boundary.bottom) {

                    options.data.ratio = elWidth / childCanvas.width > elHeight / childCanvas.height ? elWidth / childCanvas.width : elHeight / childCanvas.height;

                    canvasBoxWidth = childCanvas.width * options.data.ratio;
                    canvasBoxHeight = childCanvas.height * options.data.ratio;
                    offsetLeft = (elWidth - canvasBoxWidth) / 2;
                    offsetTop = (elHeight - canvasBoxHeight) / 2;

                    options.sourceImageData.userScrollLeft = options.sourceImageData.userScrollTop = 0;
                }

                options.canvasBox.css({
                    "width": canvasBoxWidth,
                    "height": canvasBoxHeight,
                    "left": offsetLeft,
                    "top": offsetTop
                });

                options.imageBox.css({
                    "width": canvasBoxWidth,
                    "height": canvasBoxHeight,
                    "left": offsetLeft,
                    "top": offsetTop
                });

                // 检测像素是否符合匹配条件
                checkPixels();
            },
            //  事件处理 - 鼠标按下 / 手指按下
            imgMoveStart = function (e) {

                e.stopImmediatePropagation();

                var clientX, clientY;
                if (e.type == 'touchstart') {
                    clientX = e.originalEvent.touches[0].clientX;
                    clientY = e.originalEvent.touches[0].clientY;
                } else if (e.type == 'mousedown') {
                    clientX = e.clientX;
                    clientY = e.clientY;
                }

                options.state.dragable = true;
                options.state.mouseX = clientX;
                options.state.mouseY = clientY;

                options.cropstart && options.cropstart();
            },
            //  事件处理 - 鼠标按下 / 手指按下
            imgMove = function (e) {
                e.stopImmediatePropagation();
                if (options.state.dragable) {

                    var clientX, clientY;
                    if (e.type == 'touchmove') {

                        e.preventDefault();

                        clientX = e.originalEvent.touches[0].clientX;
                        clientY = e.originalEvent.touches[0].clientY;
                    } else if (e.type == 'mousemove') {
                        clientX = e.clientX;
                        clientY = e.clientY;
                    }

                    // cropbox 的边界坐标原点
                    var Boundary = _oFunctions.getBoundary(),
                        canvasBox = options.canvasBox[0],
                        offsetLeft = canvasBox.offsetLeft,
                        offsetTop = canvasBox.offsetTop;


                    var x = clientX - options.state.mouseX,
                        y = clientY - options.state.mouseY;

                    var newOffsetLeft = x + offsetLeft,
                        newOffsetTop = y + offsetTop;

                    if (options.data.rotate % 90 == 0) {
                        newOffsetLeft = newOffsetLeft < Boundary.left ? newOffsetLeft : Boundary.left;
                        newOffsetTop = newOffsetTop < Boundary.top ? newOffsetTop : Boundary.top;
                        newOffsetLeft = newOffsetLeft > Boundary.right ? newOffsetLeft : Boundary.right;
                        newOffsetTop = newOffsetTop > Boundary.bottom ? newOffsetTop : Boundary.bottom;
                    }

                    options.sourceImageData.userScrollLeft += newOffsetLeft - offsetLeft;
                    options.sourceImageData.userScrollTop += newOffsetTop - offsetTop;

                    options.canvasBox.css({
                        "left": newOffsetLeft,
                        "top": newOffsetTop
                    });

                    // imgaeBox
                    options.imageBox.css({
                        "left": newOffsetLeft,
                        "top": newOffsetTop
                    });

                    options.state.mouseX = clientX;
                    options.state.mouseY = clientY;
                    options.cropmove && options.cropmove();
                }
            },
            imgMoveEnd = function (e) {
                e.stopImmediatePropagation();

                options.state.dragable = false;
                options.cropend && options.cropend();
            },
            zoomImage = function (e) {
                e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0 ? options.data.ratio *= 1.1 : options.data.ratio *= 0.9;
                setCanvasBoxPosition();
            },
            //  适配最适合当前外边尺寸的图片比率
            currentImageInitRatio = function (imageData, wrapWidth, wrapheight, callback) {

                var image = new Image(),
                    sourceWidth = 0,
                    sourceHeight = 0,
                    widthRatio = 0,
                    _widthRatio = 0,
                    heightRatio = 0,
                    _heightRatio = 0,
                    minRatio_horizontal = 0,
                    minRatio_vertical = 0,
                    callback = callback || function () { };

                options.image.onload = function () {
                    // 保存当前加载图片的源数据 -- 长度和宽度
                    options.sourceImageData.naturalWidth = options.image.width;
                    options.sourceImageData.naturalHeight = options.image.height;

                    sourceWidth = options.image.width;
                    sourceHeight = options.image.height;

                    widthRatio = wrapWidth / sourceWidth;
                    heightRatio = wrapheight / sourceHeight;

                    _widthRatio = wrapWidth / sourceHeight;
                    _heightRatio = wrapheight / sourceWidth;

                    minRatio_horizontal = widthRatio > heightRatio ? widthRatio : heightRatio;
                    minRatio_vertical = _widthRatio > _heightRatio ? _widthRatio : _heightRatio;

                    callback(minRatio_horizontal, minRatio_vertical);
                };

                options.image.src = imageData;
            },
            //  检查当前裁剪比例是否符合规则并给予提示
            checkPixels = function () {
                // options.options.productType  --  postcard / integralPrints
                var errorWidth, errorHeight,
                    warningWidth, warningHeight;

                switch (options.productType) {

                    case 'postcard':
                        errorWidth = 870;
                        errorHeight = 615;
                        warningWidth = 1392;
                        warningHeight = 984;
                        break;
                    case 'album':
                        errorWidth = 900;
                        errorHeight = 675;
                        warningWidth = 1440;
                        warningHeight = 1080;
                        break;
                    case 'integralPrints':
                        errorWidth = errorHeight = 480;
                        warningWidth = warningHeight = 768;
                        break;
                    case 'miniFramed':
                    case 'tabletopFrames':
                        var $upload = $('.upload'),
                            uploadClass = $upload.attr('class'),
                            reg = /horizontal|vertical/g,
                            directionMatch = uploadClass.match(reg),
                            direction = directionMatch[0],
                            sizeRatio = $('#sizeRatio').val();

                        switch (sizeRatio) {
                            case '3:2':
                                if (direction == 'vertical') {
                                    errorWidth = 900;
                                    errorHeight = 1350;
                                    warningWidth = 1440;
                                    warningHeight = 2160;
                                } else {
                                    errorWidth = 1350;
                                    errorHeight = 900;
                                    warningWidth = 2160;
                                    warningHeight = 1440;
                                }
                                break;
                            case '4:6':
                                if (direction == 'vertical') {
                                    errorWidth = 600;
                                    errorHeight = 900;
                                    warningWidth = 960;
                                    warningHeight = 1440;
                                } else {
                                    errorWidth = 900;
                                    errorHeight = 600;
                                    warningWidth = 1440;
                                    warningHeight = 960;
                                }
                                break;
                            case '5:7':
                                if (direction == 'vertical') {
                                    errorWidth = 750;
                                    errorHeight = 1050;
                                    warningWidth = 1200;
                                    warningHeight = 1680;
                                } else {
                                    errorWidth = 1050;
                                    errorHeight = 750;
                                    warningWidth = 1680;
                                    warningHeight = 1200;
                                }
                                break;
                            case '1:1':
                                errorWidth = 900;
                                errorHeight = 900;
                                warningWidth = 1440;
                                warningHeight = 1440;
                                break;
                            default: break;
                        }
                        break;
                    default:
                        errorWidth = 870;
                        errorHeight = 615;
                        warningWidth = 1392;
                        warningHeight = 984;
                        break;
                }

                setTimeout(function () {
                    var croppedData = _oFunctions.getData();
                    // 适用于postcard产品
                    if (croppedData.width < errorWidth || croppedData.height < errorHeight) {

                        options.cropBox.hasClass('error') ? '' : options.cropBox.addClass('error');
                        options.cropBox.hasClass('warning') ? options.cropBox.removeClass('warning') : '';
                    } else if (croppedData.width < warningWidth || croppedData.height < warningHeight) {

                        options.cropBox.hasClass('warning') ? '' : options.cropBox.addClass('warning');
                        options.cropBox.hasClass('error') ? options.cropBox.removeClass('error') : '';
                    } else {

                        options.cropBox.hasClass('error') ? options.cropBox.removeClass('error') : '';
                        options.cropBox.hasClass('warning') ? options.cropBox.removeClass('warning') : '';
                    }
                }, 100);
            };

        _init();

        // options.spinner.fadeIn();
        currentImageInitRatio(imageSrc, options.container.width(), options.container.height(), function (minRatio_horizontal, minRatio_vertical) {
            //  options.spinner.fadeOut();
            if (options.data.ratio == 1.1) {
                options.data.ratio = minRatio_horizontal;
            }

            options.sourceImageData.minRatio_horizontal = minRatio_horizontal;
            options.sourceImageData.minRatio_vertical = minRatio_vertical;

            if (options.data.rotate == 90 || options.data.rotate == 270) {
                options.sourceImageData.minRatio = minRatio_vertical;
            } else if (options.data.rotate == 0 || options.data.rotate == 180) {
                options.sourceImageData.minRatio = minRatio_horizontal;
            }

            initCanvasBox();
            setCanvasBoxPosition();

            if (options.data.width) {
                options.setData();
            }

            // 根据设备类型对事件区分分别绑定
            if (isTouchDevice) {
                options.cropBox.on('touchstart', imgMoveStart);
                options.cropBox.on('touchmove', imgMove);
                options.cropBox.on('touchend', imgMoveEnd);
                $(window).on('touchend', imgMoveEnd);
            } else {
                options.cropBox.on('mousedown', imgMoveStart);
                options.cropBox.on('mousemove', imgMove);
                options.cropBox.on('mouseup', imgMoveEnd);
                $(window).on('mouseup', imgMoveEnd);
            }

            // event ready
            options.ready && options.ready();
        });

        if (isTouchDevice) {
            options.cropBox.on('remove', function () { $(window).off('touchend', imgMoveEnd) });
        } else {
            options.cropBox.on('remove', function () { $(window).off('mouseup', imgMoveEnd) });
        }

        return _oFunctions;
    };

    jQuery.fn[pluginName] = function (options) {
        return new imageCropped(options, this);
    };
}));