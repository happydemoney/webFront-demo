/* imageCropped demo */
var configure = {
    editCropper: null,
    SliderZoom: null
};
$(document).ready(function () {

    initPages();

    // operating handler
    $('.operating_area').on('click', '#rotate_left,#rotate_right', rotate);

    // 裁剪图片
    $('.btn-wrap').on('click', '#save_btn', croppedImage);
});

function croppedImage() {
    // var $this = $(this);
    var roundedData = configure.editCropper.getData(),
        croppedUrl = configure.editCropper.getDataURL(),
        $croppedImage = $('#croppedImage');

    $croppedImage.append('<img src="' + croppedUrl + '" alt="croppedImage" >');
}

/**
 * 页面初始化
*/
function initPages() {
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

    configure.SliderZoom = new Slider("Slider-zoom", "Bar-zoom", {
        onMin: function () { },
        onMax: function () { },
        onMid: function () { },
        onMove: function () {
            configure.editCropper.zoom(this.GetValue() / 100);
        }
    });
}
/**
 *  裁剪就绪事件
*/
function cropReady() {

    var oMinRatio;

    oMinRatio = configure.editCropper.getZoomData();

    configure.SliderZoom.MinValue = parseFloat(oMinRatio.minRatio_horizontal * 100, 10);
    configure.SliderZoom.MaxValue = parseFloat(1.00 * 100, 10);
    configure.SliderZoom.SetValue(oMinRatio.minRatio_horizontal * 100);
}

/**
 * 顺/逆时针旋转90°
 * */
function rotate() {

    var curRatio,
        rotate,
        curMinRatio,
        curId = $(this).attr('id'),
        oMinRatio;

    oMinRatio = configure.editCropper.getZoomData();

    if (curId == 'rotate_right') {
        configure.editCropper.rotate(90);
    } else if (curId == 'rotate_left') {
        configure.editCropper.rotate(-90);
    }

    curRatio = configure.editCropper.getData().ratio;
    rotate = configure.editCropper.getData().rotate;

    if (rotate == 90 || rotate == 270) {
        curMinRatio = oMinRatio.minRatio_vertical;
    } else if (rotate == 0 || rotate == 180) {
        curMinRatio = oMinRatio.minRatio_horizontal;
    }

    configure.SliderZoom.MinValue = parseFloat(curMinRatio * 100, 10);

    ratioDiff = curRatio - curMinRatio;

    if (ratioDiff > 0 && ratioDiff < 0.00001 || !ratioDiff) {
        configure.SliderZoom.SetValue(curMinRatio * 100);
    } else {
        configure.SliderZoom.SetValue(curRatio * 100);
    }
}