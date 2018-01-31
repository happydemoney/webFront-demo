(function ($) {
    $.fn.qqFace = function (options) {
        var defaults = {
            id: 'facebox',
            path: 'face/',
            assign: 'chatMess',
            tip: 'em_'
        };
        var option = $.extend(defaults, options);
        var assign = $('#' + option.assign);
        var id = option.id;
        var path = option.path;
        var tip = option.tip;
        if (assign.length <= 0) {
            alert('缺少表情赋值对象。');
            return false;
        }

        $("#emoji").bind("click", function (e) {
            if ($("#chatMess")) {
                $("#chatMess").blur();
            }

            var strFace = '';
            var labFace, offset, top;
            if ($('#' + id).length <= 0) {
                var windowWidth = $(window).width(),
                    control = '';
                strFace = '<div id="' + id + '" style="position:absolute;display:none;z-index:1002;width:' + windowWidth + 'px;padding: 0 1%;"><div class="qqFace-box" style="width:' + windowWidth * 5 + 'px">';
                for (var i = 1; i <= 5; i++) {
                    strFace += '<div class="qqFace" style="width:' + windowWidth + 'px">';
                    for (var j = 1; j <= 20; j++) {
                        var index = (i - 1) * 20 + j;
                        labFace = getFace_index(index);
                        if (!labFace) {
                            continue;
                        }
                        strFace += '<li onclick="$(\'#' + option.assign + '\').setCaret();$(\'#' + option.assign + '\').insertAtCaret(\'' + labFace + '\');"><img width="24" src="' + path + 'Expression_' + index + '@2x.png" /></li>';
                    }
                    strFace += '<li onclick="$(\'#' + option.assign + '\').deleteCaret();" ><img width="24" src="' + path + 'faceDelete@2x.png" /></li></div>';
                    if (i === 1) {
                        control += "<a class='active'></a>";
                    } else {
                        control += "<a></a>";
                    }
                }
                strFace += "<div style='clear:both'></div></div><div class='text-center' style='text-align:center;' >" + control + "</div></div>";
                $(this).parent().append(strFace);
                offset = $(this).position();
                top = offset.top + $(this).outerHeight();

                var chatOpH = document.getElementsByClassName('chatOp')[0].offsetHeight;

                $('#' + id).css('bottom', '0.365rem');
                $('#' + id).css('left', 0);
                $('#' + id).data('data', {
                    index: 0
                });
                var isDrag = false,
                    tx, x, el = $('#' + id).find(".qqFace-box").eq(0).get(0);
                $('#' + id)[0].addEventListener('touchstart', function (e) {
                    //  e.preventDefault();
                    //isDrag = true;
                    tx = e.touches[0].pageX;
                }, false);
                $('#' + id)[0].addEventListener('touchmove', function (e) {
                    e.preventDefault();
                    x = e.touches[0].pageX - tx;
                    var width = $(this).data('data').index * windowWidth;
                    var value = 'translate3d(' + (x - width) + 'px, 0, 0)';
                    el.style.webkitTransform = value;
                    el.style.mozTransform = value;
                    el.style.transform = value;
                    isDrag = true;
                }, false);
                $('#' + id)[0].addEventListener('touchend', function (e) {
                    if (isDrag) {
                        var index = $(this).data('data').index,
                            width = index * windowWidth;
                        if (x < -50) { //左滑
                            if (index < 4) {
                                index = index + 1;
                                $(this).data('data', {
                                    index: index
                                });
                                width += windowWidth;
                            }
                        } else if (x > 50) {
                            if (index >= 1) {
                                index = index - 1;
                                $(this).data('data', {
                                    index: index
                                });
                                width -= windowWidth;
                            }
                        }
                        $('#' + id).find(".text-center a").removeClass('active').eq(index).addClass('active');
                        var value = 'translate3d(-' + width + 'px, 0, 0)';
                        el.style.webkitTransform = value;
                        el.style.mozTransform = value;
                        el.style.transform = value;
                    }
                    isDrag = false;
                }, false);
                $('#' + id).bind("click touchstart touchend", "li", function (e) {
                    e.stopPropagation();
                });
                if (IsPC()) {
                    $(".text-center a").bind("click touchstart touchend", (function () {
                        $(this).addClass('active').siblings().removeClass('active');
                        var aIndex = $(this).index();
                        var width1 = $(window).width() * aIndex;
                        var value1 = 'translate3d(-' + width1 + 'px, 0, 0)';
                        el.style.webkitTransform = value1;
                        el.style.mozTransform = value1;
                        el.style.transform = value1;
                    }));
                }
            }

            $('#' + id).toggle();
            e.stopPropagation();
        });

        $(document).bind("click", function () {

            $('#' + id).hide();
        });
    };
})(jQuery);
jQuery.fn.extend({
    selectContents: function () {
        $(this).each(function (i) {
            var node = this;
            var selection, range, doc, win;
            if ((doc = node.ownerDocument) && (win = doc.defaultView) && typeof win.getSelection != 'undefined' && typeof doc.createRange != 'undefined' && (selection = window.getSelection()) && typeof selection.removeAllRanges != 'undefined') {
                range = doc.createRange();
                range.selectNode(node);
                if (i === 0) {
                    selection.removeAllRanges();
                }
                selection.addRange(range);
            } else if (document.body && typeof document.body.createTextRange != 'undefined' && (range = document.body.createTextRange())) {
                range.moveToElementText(node);
                range.select();
            }
        });
    },

    setCaret: function () {
        if (!(/msie/.test(navigator.userAgent.toLowerCase()))) return;
        var initSetCaret = function () {
            var textObj = $(this).get(0);
            textObj.caretPos = document.selection.createRange().duplicate();
        };
        $(this).click(initSetCaret).select(initSetCaret).keyup(initSetCaret);
    },

    insertAtCaret: function (textFeildValue) {
        document.getElementsByClassName('sendBtn')[0].style.backgroundColor = '#42d6ff';
        document.getElementsByClassName('sendBtn')[0].style.color = '#FFF';
        var textObj = $(this).get(0);
        if (document.all && textObj.createTextRange && textObj.caretPos) {
            var caretPos = textObj.caretPos;
            caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) === '' ?
                textFeildValue + '' : textFeildValue;
        } else if (textObj.setSelectionRange) {
            var rangeStart = textObj.selectionStart;
            var rangeEnd = textObj.selectionEnd;
            var tempStr1 = textObj.value.substring(0, rangeStart);
            var tempStr2 = textObj.value.substring(rangeEnd);
            textObj.value = tempStr1 + textFeildValue + tempStr2;
            var len = textFeildValue.length;
            textObj.setSelectionRange(rangeStart + len, rangeStart + len);
            textObj.blur(); //注释点为了让选择表情后输入框聚焦
            $(this).blur();
            if (!IsPC()) {
                textObj.blur(); //注释点为了让选择表情后输入框聚焦
                $(this).blur();

            } else {
                textObj.focus(); //注释点为了让选择表情后输入框聚焦
                $(this).focus();
            }

        } else {
            textObj.value += textFeildValue;
        }
    },
    /**
     * [deleteCaret description]
     * @return {[type]} [description]
     */
    deleteCaret: function () {
        var textObj = $(this),
            val = textObj.val(),
            reg = /(\[[^@]{1,3}\])$/;
        if (reg.test(val))
            val = val.replace(reg, '');
        else
            val = val.substring(0, val.length - 1);
        textObj.val(val);
    }
});
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"
    ];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

/**
 *	get array key or value
 *	@param val,string or num
 **/

function getFace_index(val) {
    var list = [],
        face_list = {
            '[微笑]': 1,
            '[撇嘴]': 2,
            '[色]': 3,
            '[发呆]': 4,
            '[得意]': 5,
            '[流泪]': 6,
            '[害羞]': 7,
            '[闭嘴]': 8,
            '[睡]': 9,
            '[哭]': 10,
            '[尴尬]': 11,
            '[发怒]': 12,
            '[调皮]': 13,
            '[呲牙]': 14,
            '[惊讶]': 15,
            '[难过]': 16,
            '[酷]': 17,
            '[汗]': 18,
            '[抓狂]': 19,
            '[吐]': 20,
            '[偷笑]': 21,
            '[愉快]': 22,
            '[白眼]': 23,
            '[傲慢]': 24,
            '[饥饿]': 25,
            '[困]': 26,
            '[惊恐]': 27,
            '[流汗]': 28,
            '[憨笑]': 29,
            '[悠闲]': 30,
            '[奋斗]': 31,
            '[咒骂]': 32,
            '[疑问]': 33,
            '[嘘]': 34,
            '[晕]': 35,
            '[疯了]': 36,
            '[衰]': 37,
            '[骷髅]': 38,
            '[敲打]': 39,
            '[再见]': 40,
            '[擦汗]': 41,
            '[抠鼻]': 42,
            '[鼓掌]': 43,
            '[糗大了]': 44,
            '[坏笑]': 45,
            '[左哼哼]': 46,
            '[右哼哼]': 47,
            '[哈欠]': 48,
            '[鄙视]': 49,
            '[委屈]': 50,
            '[快哭了]': 51,
            '[阴险]': 52,
            '[亲亲]': 53,
            '[吓]': 54,
            '[可怜]': 55,
            '[菜刀]': 56,
            '[西瓜]': 57,
            '[啤酒]': 58,
            '[篮球]': 59,
            '[乒乓]': 60,
            '[咖啡]': 61,
            '[饭]': 62,
            '[猪头]': 63,
            '[玫瑰]': 64,
            '[凋谢]': 65,
            '[嘴唇]': 66,
            '[爱心]': 67,
            '[心碎]': 68,
            '[蛋糕]': 69,
            '[闪电]': 70,
            '[炸弹]': 71,
            '[刀]': 72,
            '[足球]': 73,
            '[瓢虫]': 74,
            '[便便]': 75,
            '[月亮]': 76,
            '[太阳]': 77,
            '[礼物]': 78,
            '[拥抱]': 79,
            '[强]': 80,
            '[弱]': 81,
            '[握手]': 82,
            '[胜利]': 83,
            '[抱拳]': 84,
            '[勾引]': 85,
            '[拳头]': 86,
            '[差劲]': 87,
            '[爱你]': 88,
            '[NO]': 89,
            '[OK]': 90
        };

    if (typeof (val) === 'string') {
        return face_list[val];

    }
    if (typeof (val) === 'number') {
        for (var i in face_list) {
            list[face_list[i]] = i;
        }
        return list[val];
    }
}

