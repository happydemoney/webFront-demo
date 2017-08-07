/**
 * author: monkey
 * create time: 2017-02-14
 * modify time: 2017-03-23
 * e-mail: 674425534@qq.com
 */
"use strict";
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    var pluginName = 'cropbox';
    var cropbox = function(options, el){
        
        /**
         * 裁剪框主要结构
         */
        var structure   =  '<div class="crop-area">\
                                <div class="cropbox-container">\
                                    <div class="cropbox-canvas"></div>\
                                    <div class="imageBox"></div>\
                                    <div class="cropBox-wrap">\
                                        <div class="cropBox">\
                                            <button class="warning-tooltip-warning" data-toggle="tooltip" data-placement="bottom"></button>\
                                            <button class="warning-tooltip-error" data-toggle="tooltip" data-placement="bottom"></button>\
                                        </div>\
                                    </div>\
                                    <div class="spinner" style="display: none">Loading...</div>\
                                </div>\
                            </div>',
            imageSrc = '';

        el.parent().append(structure);
        el.addClass('cropbox-hidden');            
        imageSrc = el[0].src;

        el = el.parent().find('.cropbox-container');

        var obj =
            {
                state : {
                            dragable : false
                        },        
                data :  options.data || {
                    "rotate" : 0, /*  1~360 */
                    "ratio" : 1.1
                },
                sourceImageData: {
                            "firstLoad": true,
                            "naturalWidth" : 0,
                            "naturalHeight" : 0,
                            "userScrollLeft" : 0, // 记住用户操作移动的横坐标
                            "userScrollTop" : 0 ,// 记住用户操作移动的纵坐标
                            "minRatio" : 0.1,
                            "minRatio_horizontal": 0.1,
                            "minRatio_vertical": 0.1,
                            "SliderZoomFirstLoad": true,
                            "SliderRotateFirstLoad": false
                        },
                options : options,
                cropboxCanvas : el.find('.cropbox-canvas'),
                imageBox : el.find('.imageBox'),
                cropBox : el.find('.cropBox'),
                spinner : el.find('.spinner'),
                image : new Image(),
                getCropboxedCanvas:function(){

                    var canvas = document.createElement("canvas"),
                        context = canvas.getContext("2d"),

                        sourceImageWidth = obj.sourceImageData.naturalWidth,
                        sourceImageHeight = obj.sourceImageData.naturalHeight,

                        canvasWidth = sourceImageWidth,
                        canvasHeight = sourceImageHeight;

                    canvas.width = canvasWidth;
                    canvas.height = canvasHeight;

                    if(obj.data.rotate != 0){

                    var rotatedSize = this.getRotatedSize({
                            width: canvasWidth,
                            height: canvasHeight,
                            degree: this.data.rotate
                        }),
                        rotation,
                        costheta,sintheta,

                        translateX,translateY;

                    if(obj.data.rotate >= 360){
                        obj.data.rotate = obj.data.rotate % 360;
                    }

                    if(obj.data.rotate > 0){
                        rotation = Math.PI * obj.data.rotate / 180;  
                    }else{
                        rotation = Math.PI * (360 + obj.data.rotate) / 180;  
                    }

                    costheta = Math.round(Math.cos(rotation) * 1000) / 1000;  
                    sintheta = Math.round(Math.sin(rotation) * 1000) / 1000;  

                    canvasWidth = rotatedSize.newWidth;
                    canvasHeight = rotatedSize.newHeight;

                    canvas.width = canvasWidth;
                    canvas.height = canvasHeight;

                    if (rotation <= Math.PI/2) {  

                        translateX = sintheta*sourceImageHeight;
                        translateY = 0;

                    } else if (rotation <= Math.PI) {  

                        translateX = canvasWidth;
                        translateY = -costheta*sourceImageHeight;

                    } else if (rotation <= 1.5*Math.PI) {  

                        translateX = -costheta*sourceImageWidth;
                        translateY = canvasHeight;

                    } else {  

                        translateX = 0;
                        translateY = -sintheta*sourceImageWidth;
                    }  

                    context.save();
                    
                    context.fillStyle = "#fff";   
                    context.fillRect(0, 0, canvas.width, canvas.height);

                    context.translate(translateX,translateY);
                    context.rotate(obj.data.rotate*Math.PI/180);
                    context.drawImage(obj.image, 0,0);

                    context.restore();

                    }else{
                        context.drawImage(obj.image, 0,0);
                    }

                    return canvas;
                },
                getRotatedSize: function(data) {

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
                getDataURL: function (){

                    var canvas = document.createElement("canvas"),
                        context = canvas.getContext("2d"),

                        cropboxCanvas = obj.cropboxCanvas[0],
                        offsetLeft = cropboxCanvas.offsetLeft,
                        offsetTop = cropboxCanvas.offsetTop,

                        //在画布上放置图像的 x / y坐标位置。
                        dx,dy,

                        //要使用的图像的宽度/高度
                        dwidth,dheight,
                        roundedData;

                    roundedData =  this.getData();

                    dx = - roundedData.x ;
                    dy = - roundedData.y ;

                    dwidth = roundedData.sourceCanvasWidth;
                    dheight = roundedData.sourceCanvasHeight;

                    canvas.width = roundedData.width;
                    canvas.height = roundedData.height;
                    
                    if(roundedData.rotate != 0){

                        context.save();
                        
                        context.fillStyle = "#fff";   
                        context.fillRect(0, 0, canvas.width, canvas.height);
                        
                        context.drawImage(this.getCropboxedCanvas(), dx, dy, dwidth, dheight);
                        context.restore();

                    }else{
                        context.drawImage(this.image, dx, dy, dwidth, dheight);
                    }

                    return canvas.toDataURL('image/jpeg');
                },
                getBlob: function(){

                    var imageData = this.getDataURL();
                    var b64 = imageData.replace('data:image/jpeg;base64,','');
                    var binary = atob(b64);
                    var array = [];
                    for (var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }
                    return  new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
                },
                getBlobUrl:function(){
                    var URL = window.URL || window.webkitURL;
                    var imgBlob = this.getBlob();
                    var blobUrl = URL.createObjectURL(imgBlob);

                    return blobUrl;
                },
                revokeBlobURL:function(objectURL){
                    var URL = window.URL || window.webkitURL;
                    URL.revokeObjectURL(objectURL);
                },
                zoomIn: function (){
                    this.data.ratio*=1.1;
                    setCropboxCanvasPosition();
                },
                zoomOut: function (){
                    this.data.ratio*=0.9;
                    setCropboxCanvasPosition();
                },
                /**
                 * type: float
                 * ratio: 取值 minRatio ~ maxRatio
                 ***/
                zoom: function(ratio){
                    if(obj.sourceImageData.SliderZoomFirstLoad){
                        
                        obj.sourceImageData.SliderZoomFirstLoad = false;
                        // 检测像素是否符合匹配条件
                        checkPixels();
                        return;
                    }
                    var ratio = Number(ratio),
                        zoomData = this.getZoomData();
                    
                    if(ratio < zoomData.minRatio || ratio > zoomData.maxRatio){
                        return;
                    }else{
                        this.data.ratio = ratio;
                        setCropboxCanvasPosition();
                    }
                },
                /**
                 * 或者当前上传图片的最小 和 最大放大比率
                 * **/
                getZoomData:function(){
                    
                    var minRatio = obj.sourceImageData.minRatio,
                        maxRatio = 1;
                    
                    return {
                        minRatio : minRatio,
                        minRatio_horizontal : obj.sourceImageData.minRatio_horizontal,
                        minRatio_vertical : obj.sourceImageData.minRatio_vertical,
                        maxRatio: maxRatio
                    };
                },
                /***
                 * 根据当前 imageBox的长宽 和 ratio 的值 计算出四个边界的值
                 * return  Boundary -- { left: 0,....,bottom: 0 }
                 **/
                getBoundary: function(){

                    var Boundary = {
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0
                        },
                        width = this.cropBox.width(),
                        height = this.cropBox.height(),

                        viewWidth = el.width(),
                        viewHeight = el.height(),
                        
                        childCanvas = obj.cropboxCanvas.find('canvas')[0],
                        cropboxCanvasWidth = childCanvas.width * obj.data.ratio,
                        cropboxCanvasHeight = childCanvas.height * obj.data.ratio;
                    
                    if(obj.data.rotate % 90 == 0){
                        Boundary.left =  0;
                        Boundary.top =  0;
                        Boundary.right =  width - cropboxCanvasWidth;
                        Boundary.bottom =  height - cropboxCanvasHeight;
                    }
                    
                    return Boundary;
                },
                /**
                 *  angle : 0~360 / Number
                 **/
                rotate: function(angle){
                    // deg
                    if(obj.sourceImageData.SliderRotateFirstLoad){
                        obj.sourceImageData.SliderRotateFirstLoad = false;
                        checkPixels();
                        return;
                    }
                    var angleType = typeof angle,
                        sourceAngle,
                        newAngle;
                    
                    if(angleType != Number){
                        angle = parseInt(angle);
                    }
                    
                    if(angle % 90 == 0){
                        
                        obj.data.rotate = obj.data.rotate - obj.data.rotate%90 + angle;

                        if(obj.data.rotate < 0){
                            obj.data.rotate = obj.data.rotate + 360;
                        }
                    }else{
                        sourceAngle = (obj.data.rotate - obj.data.rotate % 90);
                        newAngle = sourceAngle + angle;
                        
                        obj.data.rotate = sourceAngle + newAngle;
                    }
                    
                    initCropboxCanvas();
                    
                    var ratioDiff = obj.data.ratio - obj.sourceImageData.minRatio;
                    
                    if(ratioDiff > 0 && ratioDiff < 0.00001 || !ratioDiff){
                        obj.sourceImageData.minRatio = suitRatio();
                        obj.data.ratio = suitRatio();
                    }
                    setCropboxCanvasPosition();
                },
                /**
                 * data:
                 *  Type: Object
                 *  Properties: See the getData method.
                 *  Change the cropped area position and size with new data (base on the original image).
                 */
                setData: function(){

                    var width = this.cropBox.width(),
                        height = this.cropBox.height(),

                        viewWidth = el.width(),
                        viewHeight = el.height();

                    // obj.options.data
                    obj.cropboxCanvas.css({
                        "left" : (viewWidth / 2 - width / 2) - obj.options.data.x * obj.data.ratio,
                        "top" : (viewHeight / 2  - height / 2) - obj.options.data.y * obj.data.ratio
                    });
                    
                    obj.imageBox.css({
                        "left" : (viewWidth / 2 - width / 2) - obj.options.data.x * obj.data.ratio,
                        "top" : (viewHeight / 2  - height / 2) - obj.options.data.y * obj.data.ratio
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
                getData: function(){

                    var rounded = {},
                        width = this.cropBox.width(),
                        height = this.cropBox.height(),

                        viewWidth = el.width(),
                        viewHeight = el.height(),

                        cropboxCanvas = obj.cropboxCanvas[0],
                        offsetLeft = cropboxCanvas.offsetLeft,
                        offsetTop = cropboxCanvas.offsetTop,

                        cropboxCanvasWidth = obj.cropboxCanvas.width(),
                        cropboxCanvasHeight = obj.cropboxCanvas.height(),
                        rotatedPoint;
                    
                    rounded.x = Math.floor((viewWidth / 2 - width / 2 - offsetLeft) / obj.data.ratio);
                    rounded.y = Math.floor((viewHeight / 2  - height / 2 - offsetTop)/ obj.data.ratio);
                    rounded.width = Math.floor(width/ obj.data.ratio);
                    rounded.height = Math.floor(height/ obj.data.ratio);
                    
                    rounded.sourceCanvasWidth =  Math.floor(cropboxCanvasWidth/ obj.data.ratio);
                    rounded.sourceCanvasHeight = Math.floor(cropboxCanvasHeight/ obj.data.ratio);
                    
                    rounded.rotate = obj.data.rotate;
                    rounded.ratio = obj.data.ratio;

                    return rounded;
                }
            },
            initCropboxCanvas = function (){

                var newCanvas = obj.getCropboxedCanvas(),
                    img = '<img alt="showImage" src="'+ newCanvas.toDataURL('image/jpeg') +'">';

                obj.cropboxCanvas.empty();
                obj.cropboxCanvas.append(newCanvas);

                obj.imageBox.empty();
                obj.imageBox.append(img);
            },
            /** 
             * 适配最适合当前外边尺寸的图片比率
             */
            suitRatio = function (){

                var elWidth = el.width(),
                    elHeight = el.height(),
                    childCanvas = obj.cropboxCanvas.find('canvas')[0],
                    canvasWidth = childCanvas.width,
                    canavsHeight = childCanvas.height,

                    widthRatio = elWidth/canvasWidth,
                    heightRatio = elHeight/canavsHeight;
                
                return widthRatio > heightRatio ? widthRatio : heightRatio;
            },
            setCropboxCanvasPosition = function(){
                var elWidth = el.width(),
                    elHeight = el.height(),
                    childCanvas = obj.cropboxCanvas.find('canvas')[0],
                    cropboxCanvasWidth = childCanvas.width * obj.data.ratio,
                    cropboxCanvasHeight = childCanvas.height * obj.data.ratio,
                    offsetLeft = (elWidth - cropboxCanvasWidth) / 2 + obj.sourceImageData.userScrollLeft,
                    offsetTop = (elHeight - cropboxCanvasHeight) / 2 + obj.sourceImageData.userScrollTop,
                    Boundary = obj.getBoundary();
                
                if(offsetLeft > Boundary.left || offsetLeft < Boundary.right || offsetTop > Boundary.top || offsetTop < Boundary.bottom){
                    
                	 obj.data.ratio = elWidth / childCanvas.width > elHeight / childCanvas.height ? elWidth / childCanvas.width : elHeight / childCanvas.height;
                    
                     cropboxCanvasWidth = childCanvas.width * obj.data.ratio;
                     cropboxCanvasHeight = childCanvas.height * obj.data.ratio;
                     offsetLeft = (elWidth - cropboxCanvasWidth) / 2 ;
                     offsetTop = (elHeight - cropboxCanvasHeight) / 2 ;
                     
                     obj.sourceImageData.userScrollLeft = obj.sourceImageData.userScrollTop = 0;
                }
                
                obj.cropboxCanvas.css({
                    "width" : cropboxCanvasWidth,
                    "height" : cropboxCanvasHeight,
                    "left" : offsetLeft,
                    "top" : offsetTop
                });

                obj.imageBox.css({
                    "width" : cropboxCanvasWidth,
                    "height" : cropboxCanvasHeight,
                    "left" : offsetLeft,
                    "top" : offsetTop
                });
                
                // 检测像素是否符合匹配条件
                checkPixels();
            },
            imgMoveStart = function(e){
            	
                e.stopImmediatePropagation();
                
                var clientX,clientY;
                if(e.type == 'touchstart'){
                    clientX = e.originalEvent.touches[0].clientX;
                    clientY = e.originalEvent.touches[0].clientY;
                }else if(e.type == 'mousedown'){
                    clientX = e.clientX;
                    clientY = e.clientY;
                }
                obj.state.dragable = true;
                obj.state.mouseX = clientX;
                obj.state.mouseY = clientY;
            },
            imgMove = function(e){
                e.stopImmediatePropagation();
                
                if (obj.state.dragable){
                	
                	var clientX,clientY;
                    if(e.type == 'touchmove'){
                    	
                    	e.preventDefault();
                    	
                        clientX = e.originalEvent.touches[0].clientX;
                        clientY = e.originalEvent.touches[0].clientY;
                    }else if(e.type == 'mousemove'){
                        clientX = e.clientX;
                        clientY = e.clientY;
                    }
                    
                    // cropbox 的边界坐标原点
                    var Boundary = obj.getBoundary(),
                        cropboxCanvas = obj.cropboxCanvas[0],
                        offsetLeft = cropboxCanvas.offsetLeft,
                        offsetTop = cropboxCanvas.offsetTop;
                	

                    var x = clientX - obj.state.mouseX,
                        y = clientY - obj.state.mouseY;

                    var newOffsetLeft = x + offsetLeft,
                        newOffsetTop = y + offsetTop;
                    
                    if(obj.data.rotate % 90 == 0){
                        newOffsetLeft = newOffsetLeft < Boundary.left ? newOffsetLeft : Boundary.left;
                        newOffsetTop = newOffsetTop < Boundary.top ? newOffsetTop : Boundary.top;
                        newOffsetLeft = newOffsetLeft > Boundary.right ? newOffsetLeft : Boundary.right;  
                        newOffsetTop = newOffsetTop > Boundary.bottom ? newOffsetTop : Boundary.bottom;
                    }
                    
                    obj.sourceImageData.userScrollLeft += newOffsetLeft - offsetLeft;
                    obj.sourceImageData.userScrollTop += newOffsetTop - offsetTop;
                    
                    
                    obj.cropboxCanvas.css({
                        "left" : newOffsetLeft,
                        "top" : newOffsetTop
                    });

                    // imgaeBox
                    obj.imageBox.css({
                        "left" : newOffsetLeft,
                        "top" : newOffsetTop
                    });
                    
                    obj.state.mouseX = clientX;
                    obj.state.mouseY = clientY;
                }
            },
            imgMoveEnd = function(e){
                e.stopImmediatePropagation();
                
                obj.state.dragable = false;
            },
            zoomImage = function(e){
                e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0 ? obj.data.ratio*=1.1 : obj.data.ratio*=0.9;
                setCropboxCanvasPosition();
            },
            /**
             * 当前设备是否为移动设备
             * 支持触控 (touch) 相关事件
             * */
           isMobile =  function (){
            	
            	var userAgent = window.navigator.userAgent,
            		regMobile = /Mobile/g,
            		reIpad = /iPad/g;
            	
            	if(regMobile.test(userAgent) || reIpad.test(userAgent)){
            		return true;
            	}else{
            		return false;
            	}
            },
            /** 
             * 适配最适合当前外边尺寸的图片比率
             */
            currentImageInitRatio = function (imageData,wrapWidth,wrapheight,callback){

                var image = new Image(),
                    sourceWidth = 0,
                    sourceHeight = 0,
                    widthRatio = 0,
                    _widthRatio = 0,
                    heightRatio = 0,
                    _heightRatio = 0,
                    minRatio_horizontal = 0,
                    minRatio_vertical = 0,
                    callback = callback || function(){};

                obj.image.onload = function(){
                    // 保存当前加载图片的源数据 -- 长度和宽度
                    obj.sourceImageData.naturalWidth = obj.image.width;
                    obj.sourceImageData.naturalHeight =  obj.image.height;

                    sourceWidth = obj.image.width,
                    sourceHeight = obj.image.height;

                    widthRatio = wrapWidth / sourceWidth;
                    heightRatio = wrapheight / sourceHeight;
                    
                    _widthRatio = wrapWidth / sourceHeight;
                    _heightRatio = wrapheight / sourceWidth;
                    
                    minRatio_horizontal = widthRatio > heightRatio ? widthRatio : heightRatio;
                    minRatio_vertical = _widthRatio > _heightRatio ? _widthRatio : _heightRatio;
                    	
                    callback(minRatio_horizontal,minRatio_vertical);
                };

                obj.image.src = imageData;
            },
            checkPixels = function(){
            	// obj.options.productType  --  postcard / integralPrints
            	var errorWidth,errorHeight,
            		warningWidth,warningHeight;
            	
            	switch(obj.options.productType){
            		
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
	            		
	            		switch(sizeRatio){
	            			case '3:2':
	            				if(direction == 'vertical'){
	            					errorWidth = 900;
		    	            		errorHeight = 1350;
		    	            		warningWidth = 1440;
		    	            		warningHeight = 2160;
	            				}else{
	            					errorWidth = 1350;
		    	            		errorHeight = 900;
		    	            		warningWidth = 2160;
		    	            		warningHeight = 1440;
	            				}
	            				break;
	            			case '4:6':
	            				if(direction == 'vertical'){
	            					errorWidth = 600;
		    			        	errorHeight = 900;
		    			        	warningWidth = 960;
		    			        	warningHeight = 1440;
	            				}else{
	            					errorWidth = 900;
		    	            		errorHeight = 600;
		    	            		warningWidth = 1440;
		    	            		warningHeight = 960;
	            				}
	            				break;
	            			case '5:7':
	            				if(direction == 'vertical'){
	            					errorWidth = 750;
	        			        	errorHeight = 1050;
	        			        	warningWidth = 1200;
	        			        	warningHeight = 1680;
	            				}else{
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
            	
            	setTimeout(function(){
            		var croppedData = obj.getData();
            		// 适用于postcard产品
                	if (croppedData.width < errorWidth || croppedData.height < errorHeight) {
                		
                		obj.cropBox.hasClass('error') ? '' : obj.cropBox.addClass('error');
                		obj.cropBox.hasClass('warning') ? obj.cropBox.removeClass('warning') : '';
                	}else if(croppedData.width < warningWidth || croppedData.height < warningHeight){
                		
                		obj.cropBox.hasClass('warning') ? '' : obj.cropBox.addClass('warning');
                		obj.cropBox.hasClass('error') ? obj.cropBox.removeClass('error') : '';
                	}else{
                		
                		obj.cropBox.hasClass('error') ? obj.cropBox.removeClass('error') : '';
                		obj.cropBox.hasClass('warning') ? obj.cropBox.removeClass('warning') : '';
                	}
            	},100);
            };
             
//      obj.spinner.fadeIn();
        currentImageInitRatio(imageSrc,el.width(),el.height(),function(minRatio_horizontal,minRatio_vertical){
//          obj.spinner.fadeOut();
            if(obj.data.ratio == 1.1){
                obj.data.ratio = minRatio_horizontal;
            }
            
            obj.sourceImageData.minRatio_horizontal = minRatio_horizontal;
            obj.sourceImageData.minRatio_vertical = minRatio_vertical;
            
            if(obj.data.rotate == 90 || obj.data.rotate == 270){
            	obj.sourceImageData.minRatio = minRatio_vertical;
       		}else if(obj.data.rotate == 0 || obj.data.rotate == 180){
       			obj.sourceImageData.minRatio = minRatio_horizontal;
       		}
                    
            initCropboxCanvas();
            setCropboxCanvasPosition();
            
            if(obj.data.width){
                obj.setData();
            }
            
            // 根据设备类型对事件区分分别绑定
            if(isMobile()){
                obj.cropBox.on('touchstart', imgMoveStart);
                obj.cropBox.on('touchmove', imgMove);
                obj.cropBox.on('touchend',imgMoveEnd);
                $(window).on('touchend', imgMoveEnd);
            }else{
                obj.cropBox.on('mousedown', imgMoveStart);
                obj.cropBox.on('mousemove', imgMove);
                obj.cropBox.on('mouseup',imgMoveEnd);
                $(window).on('mouseup', imgMoveEnd);
            }

        });

        if(isMobile()){
            obj.cropBox.on('remove', function(){$(window).off('touchend', imgMoveEnd)});
        }else{
            obj.cropBox.on('remove', function(){$(window).off('mouseup', imgMoveEnd)});
        }

        return obj;
    };

    jQuery.fn[pluginName] = function(options){
        return new cropbox(options, this);
    };
}));