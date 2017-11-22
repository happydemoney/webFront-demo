#   技巧型设计模式（Technical Design Model）

    技巧型设计模式是通过一些特定技巧来解决组件的某些方面的问题，这类技巧一般通过实践经验总结得到。

##  永无尽头 —— 链模式

    通过在对象方法中将当前对象返回，实现对同一个对象多个方法的链式调用。从而简化对该对象的多个方法的多次调用时，对该对象的多次引用。

```javascript

```

##  未来预言家 —— 委托模式

```javascript

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
    // 定义时间戳与存储数据之前的连接符
    this.timeSign = timeSign;
};
//  本地存储类原型方法

```

##  执行控制 —— 节流模式

```javascript

```

##  卡片拼图 —— 简单模块模式

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