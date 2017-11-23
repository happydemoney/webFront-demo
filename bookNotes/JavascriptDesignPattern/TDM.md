#   技巧型设计模式（Technical Design Model）

    技巧型设计模式是通过一些特定技巧来解决组件的某些方面的问题，这类技巧一般通过实践经验总结得到。

##  永无尽头 —— 链模式

    通过在对象方法中将当前对象返回，实现对同一个对象多个方法的链式调用。从而简化对该对象的多个方法的多次调用时，对该对象的多次引用。

```javascript

// 找个助手
var A = function(){
    return A.fn;
}
A.fn = A.prototype = {};

// 获取dom元素
var A = funciton(selecter){
    return A.fn.init(selecter);
}
A.fn = A.prototype = {
    init: funciton(selecter){ 
        return document.getElecmentById(selecter);
    },
    method:funciton(){}
};

// A返回当前对象
var A = funciton(selecter){
    return A.fn.init(selecter);
}
A.fn = A.prototype = {
    init: funciton(selecter){ 
        this[0] = document.getElecmentById(selecter);
        this.length = 1;
        return this;
    },
    method:funciton(){}
};

// 解决覆盖获取 - 使用new关键字复制创建新对象

// 对比jquery
var A = funciton(selecter){
    return A.fn.init(selecter);
}
A.fn = A.prototype = {
    // 强化构造器
    constructor: A,
    init: funciton(selecter){ 
        this[0] = document.getElecmentById(selecter);
        this.length = 1;
        return this;
    },
    method:funciton(){}
};
A.fn.init.prototype = A.fn;

// 对象拓展
A.extend = A.fn.extend = function(){
    var i = 1,
        len = arguments.length,
        target = arguments[0],
        j;
    if(i == len){
        target = this;
        i --;
    }
    for(; i < len; i ++){
        for(j in arguments[i]){
            target[j] = arguments[i][j];
        }
    }
    return target;
};

```

##  未来预言家 —— 委托模式

    Entrust:对个对象接受并处理同一请求，他们讲请求委托给另一个对象同一处理请求。

```javascript
// 将子元素li的事件委托给父元素ul上
ul.onclick = function(e){
    var e = e || window.event,
        tar = e.target || e.rcElement;
    
    if(tar.nodeName.toLowerCase() === 'li'){
        tar.style.backgroundColor = 'grey';
    }
};
```

##  数据管理器 —— 数据访问对象模式

    (Data access object - DAO): 抽象和封装对数据源的访问与存储，DAO通过对数据源链接的管理方便对数据的访问和存储。

```javascript
/****
 * 本地存储类
 * 参数 preId         本地存储数据库前缀
 * 参数 timeSign      时间戳与存储数据之前的连接符
 ***/
var BaseLocalStorage = function(preId, timeSign){
    // 定义本地存储数据库前缀
    this.preId = preId;
    // 定义时间戳与存储数据之前的拼接符
    this.timeSign = timeSign || '|-|';
};
//  本地存储类原型方法
BaseLocalStorage.prototype = {
    // 操作状态
    status: {
        SUCCESS  : 0,    //  成功
        FAILURE  : 1,    //  失败
        OVERFLOW : 2,    //  溢出
        TIMEOUT  : 3     //  过期
    },
    // 保存本地存储链接
    storage: localStorage || window.localStorage,
    // 获取本地存储数据库数据真实字段
    getKey: function(key){
        return this.preId + key;
    },
    /***
     * 添加（修改）数据
     * 参数 key       ：数据字段标识
     * 参数 value     ：数据值
     * 参数 callback  ：回调函数
     * 参数 time      ：添加时间
     **/
    set: function(key,value,callback,time){
        // 默认操作状态时 成功
        var status = this.status.SUCCESS,
            // 获取真实字段
            key = this.getKey(key);
        try{
            // 参数时间参数时获取时间戳
            time = new Date(time).getTime() || time.getTime();
        } catch(e){
            // 为传入时间参数或时间参数有误获取默认时间：一个月
            time = new Date().getTime() + 1000 * 60 * 60 * 24 * 31;
        } 

        try{
            // 向数据库中添加数据
            this.storage.setItem(key,time + this.timeSign + value);
        }catch(e){
            // 溢出失败，返回溢出状态
            status = this.status.OVERFLOW;
        }
        // 有回调函数则执行回调函数并传入参数操作状态，真实数据字段标识以及存储数据值
        callback && callback.call(this,status,key,value);
    },
    /**
     * 获取数据
     * 参数 key       ：数据字段标识
     * 参数 callback  ：回调函数
     **/
    get: function(key,callback){
        var status = this.status.SUCCESS,   // 默认操作状态时成功
            key = this.getKey(key), // 获取key
            value = null,   //  默认值为空
            timeSignLen = this.timeSign.length, //  时间戳与存储数据之间的拼接符长度
            that = this,
            index,  // 时间戳与存储数据之间的拼接符起始位置
            time,  // 时间戳
            resulte; // 最终获取的数据
        
        try{
            value = that.storage.getItem(key);
        }catch(e){
            // 如果失败则返回失败状态，数据结果为null
            result = {
                status  :   that.status.FAILURE,
                value   : null
            };
            // 执行回调并返回
            callback && callback.call(this,result,status,result.value);
        }
        // 如果成功获取数据字符串
        if(value){
            index = value.indexOf(that.timeSign);
            time = +value.slice(0,index);
            if(new Date(time).getTime() > new Date().getTime() || time == 0){
                value = value.slice(index + timeSignLen);
            }else{
                value = null,
                status = that.status.TIMEOUT;
                that.remove(key)
            }
        }else{
            status = that.status.FAILURE;
        }

        result = {
            status : status,
            value : value
        };

        // 执行回调
        callback && callback.call(this,result,status,result.value);

        return result;
    },
    /**
     *  删除数据
     *  参数 key      ： 数据字段标识
     *  参数 callback ： 回调函数
     **/
    remove: function(key,callback){
        var status = this.status.FAILURE,   // 设置默认操作状态为失败
            key = this.getKey(key),     //  获取实际数据字段名称
            value = null;       //  设置默认数据结果为空
        
        try{
            // 获取字段对应的数据
            value = this.storage.getItem(key);
        }catch(e){}
        
        // 如果数据存在
        if(value){
            try{
                // 删除数据
                this.storage.removeItem(key);
                // 设置操作成功
                status = this.status.SUCCESS;
            }catch(e){}
        }
        // 执行回调 注意传入回调函数中的数据值：如果操作状态成功则返回真实的数据结果，否则返回空
        callback && callback.call(this,status,status > 0 ? null : value.slice(value.indexOf(this.timeSign)+this.timeSign.length));
    }
};

// test
var MK_LS = new BaseLocalStorage('MK__');
MK_LS.set('a','monkey',function(){console.log(arguments);}); // [0, "MK__a", "monkey", callee: ƒ, Symbol(Symbol.iterator): ƒ]
MK_LS.get('a',function(){console.log(arguments);}); //  [{…}, 0, "monkey", callee: ƒ, Symbol(Symbol.iterator): ƒ]
MK_LS.remove('a',function(){console.log(arguments);}); // [0, "monkey", callee: ƒ, Symbol(Symbol.iterator): ƒ]
MK_LS.remove('a',function(){console.log(arguments);}); // [1, null, callee: ƒ, Symbol(Symbol.iterator): ƒ]
MK_LS.get('a',function(){console.log(arguments);}); // [{…}, 1, null, callee: ƒ, Symbol(Symbol.iterator): ƒ]

```

##  执行控制 —— 节流模式

    (Throttler)：对重复的业务逻辑进行节流控制，执行最后一次操作并取消其他操作，以提高性能。

```javascript
function extend(){
    var target, // 返回的新对象
        sourceObj = arguments[0],  // 元对象
        addObj = arguments[1] || {};  // 继承的新元素对象

    target = sourceObj;

    for(var key in addObj){
        target[key] = addObj[key];
    }

    return target;
}
// 节流器
var throttle = function(){
    // 获取第一个参数
    var isClear = arguments[0], fn;
    // 如果第一个参数时Boolean类型那么第一个参数则标识是否清除计时器
    if(typeof isClear == 'boolean'){
        // 第二个参数则为函数
        fn = arguments[1];
        // 函数的计时器句柄存在，则清除该计时器
        fn.__throttleID && clearTimeout(fn.__throttleID);
    }else{
        // 第一个参数为函数
        fn = isClear;
        // 第二个参数为函数执行时的参数
        param = arguments[1];
        // 对执行时的参数适配默认值，这里我们用到以前学过的 extend 方法
        var p = extend({
            context: null,  // 执行函数执行时的作用域
            args: [],       // 执行函数执行时的相关参数(IE下要为数组)
            time: 300       // 执行函数执行时的延迟执行时间
        },param);
        // 清除执行函数计时器句柄
        throttle(true,fn);
        // 为函数绑定计时器句柄，延迟执行函数
        fn.__throttleID = setTimeout(function(){
            // 执行函数
            fn.apply(p.context,p.args);
        },p.time);
    }
}

//  test
function moveScroll(){
    console.log('scroll');
}
$(window).on('scroll',function(){
    throttle(moveScroll);
});

// 图片延迟加载

```

##  卡片拼图 —— 简单模块模式

    ：通过格式化字符串拼凑出视图避免创建视图时大量节点操作。优化内存开销

```javascript

```

##  机器学习 —— 惰性模式

```javascript

```

##  异国战场 —— 参与者模式


```javascript

// 反 柯里化函数 - 方便对方法的调用
Function.prototype.uncurry = function(){
    var that = this;
    return  function(){
        return Function.prototype.call.apply(that,arguments);
    }
}

// test
var push = [].push.uncurry();
var demoObj = {};

push(demoObj,'第一个','第二个');
console.log(demoObj); // {0: "第一个", 1: "第二个", length: 2}

```

##  入场仪式 —— 等待者模式

    waiter：通过对多个异步进程监听，来触发未来发生的动作；

```javascript
// 等待对象
var Waiter =   function(){
    var dfd = [],   //  注册了的等待对象容器
        doneArr = [],   //  成功回调方法容器
        failArr = [],   //  失败回调方法容器
        slice   = Array.prototype.slice, //  缓存Array方法slice
        that = this;    //  保存当前等待者对象
    
    //  监控对象类
    var Primise = function(){
        this.resolved = false;  // 监控对象是否解决成功状态
        this.rejected = false;  // 监控对象是否解决失败状态
    };
    // 监控对象类原型方法
    Primise.prototype = {
        // 解决成功
        resolve: function(){
            //  设置当前监控对象解决成功
            this.resolved = true;
            // 如果没有监控对象则取消执行
            if(!dfd.length) return;
            // 遍历所有注册了的监控对象
            for(var i = dfd.length - 1; i >= 0 ; i --){
                // 如果有任意一个监控对象没有被解决或者解决失败则返回
                if(dfd[i] && !dfd[i].resolved || dfd[i].rejected){
                    return;
                }
                // 清除监控对象
                dfd.splice(i,1);
            }
            //  执行解决成功回调方法
            _exec(doneArr);
        }, 
        // 解决失败
        reject: function(){
            // 设置当前监控对象解决失败
            this.rejected = true;
            // 如果没有监控对象则取消执行
            if(!dfd.length) return;
            //  清除所有监控对象
            dfd.splice(0);
            // 执行解决失败回调方法
            _exec(failArr);
        }    
    };
    // 创建监控对象
    that.Deferred = function(){
        return new Primise();
    };
    // 回调执行方法
    function _exec(arr){
        var i = 0,
            len = arr.length;
        // 遍历回调函数执行回调
        for(;i<len;i++){
            try{
                arr[i] && arr[i]();
            }catch(e){
                console.log(e);
            }
        }    
    };
    // 监控异步方法 参数：监控对象
    that.when = function(){
        // 设置监控对象
        dfd = slice.call(arguments);
        // 获取监控对象数组长度
        var i = dfd.length;
        // 向前遍历监控对象，最后一个监控对象的索引值为 length-1
        for(--i;i>=0;i--){
            // 如果不存在监控对象，或者监控对象已经解决，或者不是监控对象
            if(!dfd[i] || dfd[i].resolved || dfd[i].rejected || !dfd[i] instanceof Primise){
                // 清理内存 清除当前监控对象
                dfd.splice(i,1);
            }
        }
        // 返回当前对象
        return that;
    };
    // 解决成功回电函数添加方法
    that.done = function(){
        // 向成功回调函数容器中添加回调方法
        doneArr = doneArr.concat(slice.call(arguments));
        // 返回等待者对象
        return that;
    };
    // 解决失败回调函数添加方法
    that.fail = function(){
        // 向失败回调函数容器中添加回调方法
        failArr = failArr.concat(slice.call(arguments));
        // 返回等待者对象
        return that;
    };
};

// test
var waiter = new Waiter();

var first = function(){
    var dtd = waiter.Deferred();
    setTimeout(function(){
        console.log('first finish');
        dtd.resolve();
    },2500);
    return dtd;
}();

var second = function(){
    var dtd = waiter.Deferred();
    setTimeout(function(){
        console.log('second finish');
        dtd.resolve();
    },5000);
    return dtd;
}();

waiter
    .when(first,second)
    .done(function(){
        console.log('success');
    },function(){
        console.log('success again');
    })
    .fail(function(){
        console.log('fail');
    });

/*
    first finish
    second finish
    success
    success again
*/

```