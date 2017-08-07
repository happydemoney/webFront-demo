/**
 *  @author: Monkey;
 *  @description: image magnify;
 *  @copyright: @2017 - 2018  小楠瓜;
 *
*/
(function ($) {

    $.fn.imageMagnify = function (options) {

        var Default = {
            debug: false,
            log: function (msg) { console.log(msg); },
            type: 'magnifier',    // 显示类型 1.magnifier(放大镜) 2. magnify-inner(内部放大)
            on: 'mouseover'      // 触发事件 1. mouseover (default) 2.click 3.toggle 4.grap
        };

        options = $.extend(Default, options);

        $(this).each(function () {

            var $this = $(this),
                soureImageSrc = $this.attr('data-image-src'),
                magnifyImageSrc = $this.attr('data-magnify-src'),
                template;

            template = '<img class="small" src="' + soureImageSrc + '" alt="sourceImage"><div class="large" style="background-image:url(' + magnifyImageSrc + ')"></div>';

            $this.append(template);

            var $small = $this.find('.small'),
                $large = $this.find('.large');

            var native_width = 0,
                native_height = 0,
                nativeImageRatio,  // 原图的长宽比值（width / height）
                currentImageRatio; // 当前显示区域的长宽比值（width / height）


            $this.addClass(options.type);

            switch (options.on) {
                case 'click':
                    $this.on('click', _magnifyClickHandler);
                    break;
                case 'toggle':
                    $this.on('click', _magnifyToggleHandler);
                    break;
                case 'grap':
                    $this.on('mousedown', _magnifyGrapHandler);
                    break;
                default:
                    $this.on('mousemove', _magnifyHandler);
                    $this.on('mouseleave', _magnifyHideHandler);
                    break;
            }
            // console.log($._data($this.get(0))["events"]);
            /**
             *  图片放大 主处理函数
             *
            */
            function _magnifyHandler(e) {

                if (!native_width && !native_height) {
                    var image_object = new Image();
                    image_object.src = magnifyImageSrc;

                    // 获取放大图片的原始 宽度 和 高度
                    native_height = image_object.height;
                    native_width = image_object.width;

                    nativeImageRatio = native_width / native_height;

                    _magnifyHandler(e);
                } else {

                    // Gets .maginfy offset coordinates.
                    var magnify_offset = $this.offset(),

                        // Gets coordinates within .maginfy.
                        mx = e.pageX - magnify_offset.left,
                        my = e.pageY - magnify_offset.top,
                        posX, posY;   //background-position: posX posY;

                    posX = mx;
                    posY = my;

                    // Checks the mouse within .maginfy or not.
                    if (mx < $this.width() && my < $this.height() && mx > 0 && my > 0) {
                        $large.fadeIn(100);
                    } else {
                        $large.fadeOut(100);
                    }

                    if ($large.is(":visible")) {

                        var rx, ry, bgp, px, py,
                            containerWidth = $this.width(),
                            containerHeight = $this.height(),
                            currentImageRatio = containerWidth / containerHeight,
                            largeWidth = $large.width(),
                            largeHeight = $large.height();

                        if (options.type === 'magnifier') {

                            if (currentImageRatio > nativeImageRatio) {

                                posY = my + (containerWidth / nativeImageRatio - containerHeight) / 2;
                                rx = Math.round(mx / containerWidth * native_width - largeWidth / 2) * -1;
                                ry = Math.round(posY / (containerWidth / nativeImageRatio) * native_height - largeHeight / 2) * -1;

                            } else if (currentImageRatio < nativeImageRatio) {

                                posX = mx + (containerHeight * nativeImageRatio - containerWidth) / 2;
                                rx = Math.round(posX / (containerHeight * nativeImageRatio) * native_width - largeWidth / 2) * -1;
                                ry = Math.round(my / containerHeight * native_height - largeHeight / 2) * -1;
                            } else if (currentImageRatio == nativeImageRatio) {

                                rx = Math.round(mx / containerWidth * native_width - largeWidth / 2) * -1;
                                ry = Math.round(my / containerHeight * native_height - largeHeight / 2) * -1;
                            }

                            bgp = rx + "px " + ry + "px";
                            px = mx - largeWidth / 2;
                            py = my - largeHeight / 2;

                            $large.css({
                                'left': px,
                                'top': py,
                                'backgroundPosition': bgp
                            });
                        } else if (options.type === 'magnify-inner') {

                            if (currentImageRatio > nativeImageRatio) {

                                posY = my + (containerWidth / nativeImageRatio - containerHeight) / 2;
                                rx = Math.round(mx / containerWidth * native_width - (mx / containerWidth) * largeWidth) * -1;
                                ry = Math.round(posY / (containerWidth / nativeImageRatio) * native_height - $(my / containerWidth) * largeHeight) * -1;

                            } else if (currentImageRatio < nativeImageRatio) {

                                posX = mx + (containerHeight * nativeImageRatio - containerWidth) / 2;
                                rx = Math.round(posX / (containerHeight * nativeImageRatio) * native_width - (mx / containerWidth) * largeWidth) * -1;
                                ry = Math.round(my / containerHeight * native_height - (my / containerWidth) * largeHeight) * -1;

                            } else if (currentImageRatio == nativeImageRatio) {

                                rx = Math.round(mx / containerWidth * native_width - (mx / containerWidth) * largeWidth) * -1;
                                ry = Math.round(my / containerHeight * native_height - (my / containerWidth) * largeHeight) * -1;
                            }
                            // 16.97056 是自定义鼠标图标的对角线一半的长度
                            // rx -= 16.97056;
                            // ry -= 16.97056;

                            /* 限定大图背景坐标范围 -- 最小 */
                            rx = rx > 0 ? 0 : rx;
                            ry = ry > 0 ? 0 : ry;

                            /* 限定大图背景坐标范围 -- 最大 */
                            rx = rx < - (native_width - containerWidth) ? - (native_width - containerWidth) : rx;
                            ry = ry < - (native_height - containerHeight) ? - (native_height - containerHeight) : ry;

                            bgp = rx + "px " + ry + "px";

                            $large.css({
                                'backgroundPosition': bgp
                            });
                        }
                    }
                }
            }
            /** 
             * click -- 点击激活
             */
            function _magnifyClickHandler(e) {

                $this.toggleClass('active');
                if ($this.hasClass('active')) {
                    $this.on('mousemove.click', _magnifyHandler);
                    $this.on('mouseleave.click', _magnifyHideHandler);
                    _magnifyHandler(e);
                } else {
                    $this.off('mousemove.click', _magnifyHandler);
                    $this.off('mouseleave.click', _magnifyHideHandler);
                    _magnifyHideHandler();
                }
            }

            /** 
             * toggle -- 点击放大激活一次，再次点击还原
             */
            function _magnifyToggleHandler(e) {

                $this.toggleClass('active');
                if ($this.hasClass('active')) {
                    _magnifyHandler(e);
                } else {
                    $large.fadeOut(100);
                }
            }

            /** 
             * grap -- 按住激活 松开还原
             */
            function _magnifyGrapHandler(e) {

                $this.on('mousemove.grap', _magnifyHandler);
                $this.on('mouseleave.grap', _magnifyHideHandler);
                _magnifyHandler(e);

                $this.one('mouseup', function () {
                    $this.off('mousemove.grap', _magnifyHandler);
                    $this.off('mouseleave.grap', _magnifyHideHandler);
                    _magnifyHideHandler();
                });
            }

            /** 
             * mouseleave -- 鼠标移开事件    
             */
            function _magnifyHideHandler() {
                if ($large.is(":visible")) {
                    $large.fadeOut(100);
                }
            }
        });
    };
})(jQuery);