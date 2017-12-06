#   架构型设计模式（Architectural Design Model）

##  死心眼 —— 同步模块模式

    SMD（Synchronous Module Definition）：请求发出后，无论模块是否存在，立即执行后续的逻辑，实现模块开发中对模块的立即引用。

```javascript

// 定义模块管理器单体对象
var F = F || {};
/**
 * 定义模块方法
 * @param str 模块路由
 * @param fn  模块方法
*/
F.define = function(str, fn){
    var parts = str.split('.'), // 解析模块路由
        old = parent = this, // old当前模块的祖父模块,parent当前模块父模块,如果在闭包中，为了屏蔽对模块直接访问，建议将模块添加给闭包内部私有变量
        i = len = 0; // i 模块层级 ， len模块层级长度
    // 如果第一个模式是模块管理器单体对象，则移除
    if(parts[0] === F){
        parts = parts.slice(1);
    }
    // 屏蔽对define与module模块方法的重写
    if(parts[0] === 'define' || parts[0] === 'module'){
        return;
    }
    // 遍历路由模块并定义每层模块
    for(len = parts.length;i < len;i ++){
        // 如果父模块中不存在当前模块
        if(typeof parent[parts[i]] === 'undefined'){
            // 声明当前模块
            parent[parts[i]] = {};
        }
        // 缓存下一层级的祖父模块
        old = parent;
        // 缓存下一层级父模块
        parent = parent[parts[i]];
    }
    // 如果给定模块方法则定义该模块方法
    if(fn){
        // 此时i等于parts.length，故减一
        old[parts[--i]] = fn();
    }
    // 返回模块管理器单体对象
    return this;
};
```

##  大心脏 —— 异步模块模式

    AMD(Asynchronous Module Definition): 请求发出后，继续其他业务逻辑，直到模块加载完成执行后续的逻辑，实现模块开发中对模块加载完成后的引用。

##  分而治之 —— Widget 模式

    Widget：Widget模式是指借用Web widget思想将页面分解成部件，针对部件开发，最终组合成完整的页面。


##  三人行 —— MVC 模式

    MVC即模型（modle） - 视图（view） - 控制器（controller）：用一种将业务逻辑、数据、视图分离的方式组织架构代码。

*   M 数据 - 页面初始化获取的同步数据以及交互时通过AJAX获取的异步数据等
*   V 视图 - 创建视图
*   C 交互 - 各种页面交互与页面特效

##  三军统帅 —— MVP 模式

    MVP即模型（model） - 视图（view） - 管理器（presenter）：View层不直接引用Model层内的数据，而是通过presenter层实现对Model层内的数据访问。
    即所有层次的交互都发生在Presenter层中。

    益处：通过MVP模式我们可以解决视图层和数据层之间的耦合
    缺憾：但是每次创建页面时，视图层都要被管理器直接调用，也就是说创建什么样的视图由管理器说了算。

##  视图的逆袭 —— MVVM 模式

    MVVM模式，模型（Model） - 视图（View） - 视图模型（ViewModek）：为视图层（View）量身定做一套视图模型（ViewModel），并在视图模型（ViewModel）
    中创建属性和方法，为视图层（View）绑定数据（Model）并实现交互。
    
```javascript
// ~屏蔽压缩报错
~(function(){
    // 在闭包中获取全局变量
    var window = this || (0,eval)('this');
    // 获取页面字体大小，作为创建页面UI尺寸参照物
    var FONTSIZE = function(){
        // 获取页面body元素字体大小并转化为整数
        return parseInt(document.body.currentStyle ? document.body.currentStyle['fontSize']:getComputedStyle(document.body,false)['fontSize']);
    }();
    // 视图模型对象
    var VM = function(){
        // 组件创建策略对象
        var Method = {
            /**
             * 进度条组件创建方法
             * dom  进度条容器
             * data 进度条数据模型
            */
            progressbar: function(dom,data){
                var progress = document.createElement('div'),   // 进度条进度完成容器
                    param = data.data;  // 数据模型数据，结构：{position: 50}
                // 设置进度完成容器尺寸
                progress.style.width = (param.position || 100) + '%';
                // 为进度条组件添加UI样式
                dom.className += ' ui-progressbar';
                // 进度完成容器元素插入进度条容器中
                dom.appendChild(progress);    
            },
            /**
             * 滑动条组件创建方法
             * dom  滑动条容器
             * data 滑动条数据模型 
            */
            slider: function(dom,data){
                // 创建组件逻辑
                var bar = document.createElement('span'),       // 滑动条拨片
                    progress = document.createElement('div'),   // 滑动条进度容器
                    totalText = null,                           // 滑动条容量提示信息
                    progressText = null,                        // 滑动条拨片提示信息
                    param = data.data,                          // 数据模型数据 : {position:60,total:200}
                    width = dom.clientWidth,                    // 容器元素宽度
                    left = dom.offsetleft,                      // 容器元素横坐标
                    realWidth = (param.position || 100) * width / 100; // 拨片位置（以数据模型中positon数据计算）
                // 清空滑动条容器，为创建滑动条做准备
                dom.innerHTML = '';
                // 如果模型数据中提供容器总量信息（param.total），则创建滚动条提示文案
                if(param.total){
                    // 容器总量提示文案
                    totalText = document.createElement('b');
                    // 拨片位置提示文案
                    progressText = document.createElement('em');
                    // 设置容器总量提示文案
                    totalText.innerHTML = param.total;
                    // 将容器总量提示文案元素添加到滑动条组件中
                    dom.appendChild(totalText);
                    // 将拨片位置提示文案元素添加到滑动条组件中
                    dom.appendChild(progressText);
                }
                // 设置滑动条
                setStyle(realWidth);
                // 为滑动条组件添加UI样式类
                dom.className += ' ui-slider';
                // 将进度条容器添加到滑动条组件中
                dom.appendChild(progress);
                // 将拨片添加到滑动条组件中
                dom.appendChild(bar);
                // 设置滑动条
                function setStyle(w){
                    // 设置进容器宽度
                    progress.style.width = w + 'px';
                    // 设置拨片横坐标
                    bar.style.left = w - FONTSIZE / 2 + 'px';
                    // 如果有拨片提示文案
                    if(progressText){
                        // 设置拨片提示文案横坐标
                        progressText.style.left = w - FONTSIZE / 2 * 2.4 + 'px';
                        // 设置拨片提示文案内容
                        progressText.innerHTML = parseFloat(w / width * 100).toFixed(2) + '%';
                    };
                }
                // 按下鼠标拨片
                bar.onmousedown = function(){
                    // 移动拨片（鼠标光标在页面中移动，事件绑定给document是为了优化交互体验，使鼠标光标可以在页面中自由滑动）
                    document.onmousedown = function(event){
                        // 获取事件源
                        var e = event || window.event;
                        // 鼠标光标相对于滑动条容器位置原点移动的横坐标
                        var w = e.clientX - left;
                        // 设置滑动条
                        setStyle(w < width ? (w > 0 ? w : 0) : width);
                    }
                    // 阻止页面滑动选取事件
                    document.onselectstart = function(){
                        return false;
                    }
                }
                // 停止滑动交互（鼠标按键松开）
                document.onmouseup = function(){
                    // 取消文档鼠标光标移动事件
                    document.onmousemove = null;
                    // 取消文档滑动选取事件
                    document.onselectstart = null;
                }
            }
        };
        /**
         * 获取视图层组件渲染数据的映射信息
         * dom 组件元素
        */
        function getBindData(dom){
            // 获取组件自定义属性data-bind值
            var data = dom.getAttribute('data-bind');
            // 将自定义属性 data-bind 值转化为对象
            return !!data && (new Function("return ({"+ data +"})"))();
        }

        // 组件实例化方法
        return function(){
            var doms = document.body.getElementsByTagName('*'), // 获取页面中所有元素
                ctx = null;     // 元素自定义数据句柄
            // ui 处理是会想页面中插入元素，此时doms.length会改变，此时动态获取doms.length
            for(var i = 0; i < doms.length; i++){
                // 获取元素自定义数据
                ctx = getBindData(doms[i]);
                // 如果元素是UI组件，则根据自定义属性中组件类型，渲染该组件
                ctx.type && Method[ctx.type] && Method[ctx.type](doms[i], ctx);
            }    
        }
    }();
    // 将视图模型对象绑定在window上，供外部获取
    window.VM = VM;
})();

// model
    // 带有提示文案的滑动条
var demo1 = {
        position : 60,
        total: 200
    },
    // 简易版滑动条
    demo2 = {
        position: 20
    },
    // 进度条
    demo3 = {
        position: 50
    };

window.onload = function(){
    VM();
};

// view
<div class="first" data-bind="type: 'slider',data: demo1"></div>
<div class="second" data-bind="type: 'slider',data: demo2"></div>
<div class="third" data-bind="type: 'progressbar',data: demo3"></div>

```