# image cropped

image cropped is a plugins for image cropped base on Jquery.

## events

*   ready
--  crop image already load.
*   cropstart
--  mousedown / touchstart on the crop iamge.
*   cropmove
--  mousemove / touchmove on the crop iamge.
*   cropend
--  mouseup / touchend on the crop iamge.

## optios

*   aspectRatio: 16/9
--  the aspectRatio of the crop area.
*   domStyle: {containerWidth: 320,containerHeight:180}
--  the crop area dom style(width and height or only width)

## code
HTML:
```
<img id="cropImage" src="images/test-large.jpg" alt="cropImage" />
```
JAVASCRIPT:
```
var options = {
    data: {
        ratio: 1.1,
        rotate: 0
    },
    domStyle: {
        containerWidth: 320
    },
    aspectRatio: 160 / 99,
    // 编辑图片加载完成之后的的事件
    ready: cropReady,
    cropstart: function () {
        console.log('cropstart');
    },
    cropmove: function () {
        console.log('cropmove');
    },
    cropend: function () {
        console.log('cropend');
    }
};

configure.editCropper = $('#cropImage').imageCropped(options);
```