/* imageCropped demo */
var configure = {
    editCropper: null,
    SliderZoom: null
}, // 全局变量
oMinRatio = {
	minRatio_horizontal: 1,
	minRatio_vertical : 1
};
$(document).ready(function(){

    initPages();

    // operating handler
	$('.operating_area').on('click','#rotate_left,#rotate_right',rotate);

    // 裁剪图片
    $('.btn-wrap').on('click','#save_btn',croppedImage);
});

function croppedImage(){
    // var $this = $(this);
    var roundedData = configure.editCropper.getData(),
        croppedUrl = configure.editCropper.getDataURL(),
        $croppedImage = $('#croppedImage');

    $croppedImage.append('<img src="'+ croppedUrl +'" alt="croppedImage" >');
}

/**
 * 页面初始化
*/
function initPages(){
    var options = {
        "productType" : 'postcard',
        "data": {
            ratio : 1.1,
            rotate : 0
        }
    };

    configure.editCropper = $('#cropImage').cropbox(options);

    configure.SliderZoom = new Slider("Slider-zoom", "Bar-zoom", {
    	onMin: function(){  }, 
    	onMax: function(){  },
    	onMid: function(){  },
    	onMove: function(){
    		configure.editCropper.zoom(this.GetValue()/100);
    	}
    });

    imageInitRatio($('#cropImage')[0].src,444,315,function(minRatio_horizontal,minRatio_vertical){
		
		var curPercent = 0,
			curMinRatio,
			curRatio,
			ratioDiff,
			rotate;
		
		oMinRatio.minRatio_horizontal = minRatio_horizontal;
		oMinRatio.minRatio_vertical = minRatio_vertical;

        curPercent = minRatio_horizontal;
        configure.SliderZoom.MinValue = parseFloat(minRatio_horizontal*100, 10);
       	configure.SliderZoom.MaxValue = parseFloat(1.00*100, 10);
       	configure.SliderZoom.SetValue(curPercent*100);
   });
}

/**
 * 顺/逆时针旋转90°
 * */
function rotate(){
	
	var curRatio,
		rotate,
		curMinRatio,
		curId = $(this).attr('id');
	
	if(curId == 'rotate_right'){
		configure.editCropper.rotate(90);
	}else if(curId == 'rotate_left'){
		configure.editCropper.rotate(-90);
	}
	
	curRatio = configure.editCropper.getData().ratio;
	rotate = configure.editCropper.getData().rotate;
	
	if(rotate == 90 || rotate == 270){
		curMinRatio = oMinRatio.minRatio_vertical;
	}else if(rotate == 0 || rotate == 180){
		curMinRatio = oMinRatio.minRatio_horizontal;
	}
	
	configure.SliderZoom.MinValue = parseFloat(curMinRatio*100, 10);
	
	ratioDiff = curRatio - curMinRatio;

	if(ratioDiff > 0 && ratioDiff < 0.00001 || !ratioDiff){
		configure.SliderZoom.SetValue(curMinRatio*100);
	}else{
		configure.SliderZoom.SetValue(curRatio*100);
	}
}

/***
 * 求当前图片的最小的合适缩放比率
 **/
function imageInitRatio(imageData,wrapWidth,wrapheight,callback){

    var image = new Image(),
        sourceWidth = 0,
        sourceHeight = 0,
        widthRatio = 0,
        heightRatio = 0,
        _widthRatio = 0,
        _heightRatio = 0,
        callback = callback || function(){},
        minRatio_horizontal,
        minRatio_vertical;

    image.onload = function(){

        sourceWidth = image.width,
        sourceHeight = image.height;
        
        widthRatio = wrapWidth / sourceWidth;
        heightRatio = wrapheight / sourceHeight;
        
        _widthRatio = wrapWidth / sourceHeight;
        _heightRatio = wrapheight / sourceWidth;
        
        minRatio_horizontal = widthRatio > heightRatio ? widthRatio : heightRatio;
        minRatio_vertical = _widthRatio > _heightRatio ? _widthRatio : _heightRatio;
        
        callback(minRatio_horizontal,minRatio_vertical);
    };

    image.src = imageData;
}