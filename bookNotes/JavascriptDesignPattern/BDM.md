#   行为型设计模式（Behavioral Design Model）

    行为型设计模式用于不同对象之间职责划分或算法抽象，行为型设计模式不仅仅设计类和对象，还设计类或对象之间的交流模式并加以实现。

##  照猫画虎 —— 模板方法模式

    模板方法模式(Template Method): 父类中定义一组操作算法框架，而将一些实现步骤延迟到子类中，
    使得子类可以不改变父类的算法结构的同时可重新定义算法中某些具体实现步骤。

```javascript
// 模板类 - 基础提示框 data 渲染数据
var Alert = function(data){
    // 没有数据则返回，防止后面程序执行
    if(!data){
        return;
    }
    // 设置内容
    this.content = data.content;
    // 创建提示框面板
    this.panel = document.createElement('div');
    // 创建提示内容组件
    this.contentNode = document.createElement('p');
    // 创建确定按钮组件
    this.confirmBtn = document.createElement('span');
    // 创建关闭按钮组件
    this.closeBtn = document.createElement('b');
    // 为提示框面板添加类
    this.panel.className = 'alert';
    // 为关闭按钮添加类
    this.closeBtn.className = 'a-close';
    // 为确定按钮添加类
    this.confirmBtn.className = 'a-confirm';
    // 为确定按钮添加文案
    this.confirmBtn.innerHTML = data.confirm || '确认';
    // 为提示内容添加文本
    this.contentNode.innerHTML = this.content;
    // 点击确定按钮执行方法 如果 data 中有success方法则为success方法，否则为空函数
    this.success = data.success || function(){};
    // 点击关闭按钮执行方法
    this.fail = data.fail || function(){};
};
// 提示框原型方法
Alert.prototype = function(){
    // 初始化
    init: function(){
        // 生成提示框
        this.panel.appendChild(this.closeBtn);
        this.panel.appendChild(this.contentNode);
        this.panel.appendChild(this.confirmBtn);
        // 插入到页面中
        document.body.appendChild(this.panel);
        // 绑定事件
        this.bindEvent();
        // 显示提示框
        this.show();
    },
    bindEvent: function(){
        var me = this;
        // 关闭按钮点击事件
        this.colseBtn.onclick = function(){
            // 执行关闭取消方法
            me.fail();
            // 隐藏弹层
            me.hide();
        }
        // 确定按钮点击事件
        this.confirmBtn.onclick = function(){
            // 执行关闭确认方法
            me.success();
            // 隐藏弹层
            me.hide();
        }
    },
    // 隐藏弹层方法
    hide: function(){
        this.panel.style.display = 'none';
    },
    // 显示弹层方法
    show: function(){
        this.panel.style.display = 'block';
    }
};
```
    模板方法的核心在于对方法的重用，它将核心方法封装在基类中，让子类继承基类的方法，
    实现基类方法共享，达到方法共用。

##  通信卫星 —— 观察者模式

    观察者模式(Observe):又被称为发布-订阅者模式或消息模式，定义了一种依赖信息，
    解决了主体对象。
```javascript
// 将观察者放在闭包中，当页面接在就立即执行
var Observer = (function(){
    // 防止消息队列暴露而被篡改故将消息容器作为静态私有变量保存
    var _message = {};
    return {
        // 注册信息接口
        regist: function(type,fn){
            // 如果消息不存在则应该创建一个该消息类型
            if(typeof _message[type] === 'undefined'){
                // 将动作推入到该消息对应的动作执行队列中
                _message[type] = [fn];
            }
            // 如果消息存在
            else{
                // 将动作方法推入该消息对应的动作执行序列中
                _message[type].push(fn);
            }
        },
        // 发布信息接口
        fire: function(type,args){
            // 如果该消息没有被注册，则返回
            if(!_message[type]){
                return;
            }
            // 定义消息信息
            var events = {
                type : type,                // 消息类型
                args : args || {}           // 消息携带数据
            },
            i = 0,                          // 消息动作循环变量
            len = _message[type].length;    // 消息动作长度
            // 遍历消息动作
            for(; i < len; i ++){
                // 依次执行注册的消息对应的动作序列
                _message[type][i].call(this,events);
            }
        },
        // 移除信息接口
        remove: function(){
            // 如果消息动作队列存在
            if(_message[type] instanceof Array){
                // 从最后一个消息动作遍历
                var i = _message[type].length - 1;
                for(; i >= 0; i --){
                    // 如果存在该动作则在消息动作序列中移除相应动作
                    _message[type][i] === fn && _message[type].splice(i,1);
                }
            }
        }
    };
})();
Observer.regist('test',function(e){ console.log(e.type,e.args.msg) });
Observer.fire('test',{msg: '传递参数'});
```

    观察者模式最主要的作用是解决类或对象之间的耦合，解耦两个相互依赖的对象，使其依
    赖于观察者的消息机制。这样对于任意一个订阅者对象来说，其他订阅者对象的改变不会
    影响到自身。对于每一个订阅者来说，其自身既可以是消息的发出者也可以是消息的执行
    者，这都依赖于调用贯彻着对象的三种方法（订阅消息，注册消息，发布消息）中的哪一种。

##  超级玛丽 —— 状态模式

    状态模式(state)：当一个对象的内部状态发生改变时，会导致其行为的改变，这看起来像是改变了对象。
    状态模式既是解决程序中臃肿的分支判断语句问题，将每个分支转化为一种状态独立出来，方便每种状态的管理又不至于每次执行时遍历所有分支。

    主要目的：将条件判断的不同结果转化为状态对象的内部状态，既然是状态对象的内部状态，所以作为状态对象内部的私有变量，然后提供一个能够调用状态对象内部状态的接口方法对象。
    最终目的：简化分支判断流程

    当有许多判断时，如果用if或者switch条件判断语句来写，是很难维护的，因为增加或删除一个条件需要改动的地方太多了。
    其次组合条件用if或switch分支判断实现，无形中增加的成本是无法想象的。

```javascript
    //状态类
    var State = function(){
        var _currentState = {},
        states = {
            one : function(){
                console.log("状态one");
            },
            two : function(){
                console.log("状态two");
            },
            three : function(){
                console.log("状态three");
            },
            four : function(){
                console.log("状态four");
            },
            five : function(){
                console.log("状态five");
            }
        };
        //控制类
        var Action = {
            changeState : function(){
                //组合动作由多个参数实现
                var arg = arguments;
                //重置内部状态
                _currentState = {};
                if(arg.length){
                    for(var i=0, len = arg.length; i < len; i++){
                        //从内部状态添加动作
                        _currentState[arg[i]] = true;
                    }
                }
                return this;
            },
            goes : function(){
                //遍历内部状态保存的动作
                for(var i in _currentState){
                    //如果该动作就执行
                    states[i] && states[i]();
                }
                return this;
            }
        }
        return {
            change : Action.changeState,
            goes : Action.goes
        }
    }
//两种方式执行这个状态类
//1. 函数方式
State().change('one','three').goes().goes().change('two').goes();
//2. 实例化类
var state = new State();
state.change('one','three').goes().goes().change('two').goes();
```    
        状态模式即是解决程序中臃肿的分支判断语句问题，将每个分支转化为一种状态独立出来，
    方便每种状态的管理又不至于每次执行时遍历所有分支。在程序中到底产出哪种行为结果，决定
    于选择哪种状态，而选择何种状态又是在程序运行时决定的。当然状态模式最终的目的即是简化
    分支判断流程。

##  活诸葛 —— 策略模式

    策略模式（Strategry）:将定义的一组方法封装起来，使其相互之间可以替换。封装的算法具有一定独立性，不会随客户端变化而变化 
    
```javascript
// 表单正则验证策略对象
var InputStrategy = function (){
    var strategy = {
        // 是否为空
        notNull : function(value){
            return /\s+/.test(value) ?　'请输入内容' : '';
        },
        // 是否是一个纯数字
        number : function(value){
            return /^[0-9]+(\.[0-9]+)?$/.test(value) ? '' : '请输入数字';
        },
        // 是否是本地电话
        phone : function(value){
            return /^\d{3}\-\d{8}$|^\d{4}\-\d{7}$/.test(value) ? '' : '请输入正确的电话号码格式，如：010-12345678 或 0418-1234567';
        }
    }
    return{
        // 验证接口type算法value表单值
        check : function(type,value){
            // 去除首尾空白符
            value = value.replace(/^\s+|\s+$/g,'');
            return strategy[type] ?　strategy[type](value) : '没有该类型的检测方法';
        },
        // 添加策略
        addStrategy : function(type,fn){
            strategy[type] = fn;
        }
    }
}();

// 拓展 可以延伸算法
InputStrategy.addStrategy('email',function(value){
    return /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/i.test(value)? '' : '请输入正确的邮箱格式';
});

InputStrategy('number','123'); // ''

```

##  有序车站 —— 职责链模式

        职责连模式(Chain of Responsibility):解决请求的发送者与请求的接受者之间的耦合，通过职责链上的多个对象对分解其你去流程，
    实现多个对象之间的传递，知道最够一个对象完成请求的处理。

```javascript
//  1. 请求模块
/**
 *  异步请求对象（简化版）
 *  参数  data         请求数据
 *  参数  dealType     响应数据处理对象
 *  参数  dom          事件源
 */
var sendData = function(data , dealType , dom){
    //  XHR对象 简化 - IE另外处理
    var xhr = new XMLHttpRequest(),
        url = ''; // 请求路径
    xhr.onload = function(event){
        // 请求成功
        if((xhr.status >= 200 && xhr.status < 300>) || xhr.status === 304){
            dealType(xhr.responseText, dealType, dom);
        }else{
            // 请求失败
        }
    };
    // 拼接字符串
    for(var i in data){
        url += '&' + i + '=' + data[i];
    }
    // 发送异步请求
    xhr.open('get',url,true);
    xhr.send(null);
};
//  2. 响应数据适配模块
/**
 *  处理响应数据
 *  参数  data         响应数据
 *  参数  dealType     响应数据处理对象
 *  参数  dom          事件源
 */
var dealData = function(data , dealType , dom){
    // 对象toString方法简化引用
    var dataType = Object.prototype.toString.call(data);
    // 判断相应数据处理对象
    switch(dealType){
        // 输入框提示功能
        case 'sug':
            // 如果数据为数组
            if(dataType === "[object Array]"){
                // 创建提示框组件
                return createSug(data,dom);
            }
            // 将响应的对象数据转化为数组
            else if(dataType === "[object Object]"){
                var newData = [];
                for(var i in data){
                    newData.push(data[i]);
                }
                // 创建提示框组件
                return createSug(newData,dom);
            }
            // 将响应的其他数据转化为数组
            return createSug([data],dom);
            break;
        case 'validate':
            // 创建校验组件
            createValidateResult(data,dom);
            break;    
        default: break;    
    }
};
//  3. 创建组件模块
/**
 *  创建提示框组件
 *  参数  data         响应适配数据
 *  参数  dom          事件源
 */
var createSug = function(data,dom){
    var i = 0,
        len = data.length,
        html = '';
    // 拼接每一句提示语
    for(; i < len ; i ++){
        html += '<li>' + data[i] + '</li>';
    }    
    // 显示提示框
    dom.parentNode.getElementsByTagName('ul')[0].innerHtml = html;
};
 /**
 *  创建校验组件
 *  参数  data         响应适配数据
 *  参数  dom          事件源
 */
 var createValidateResult(data,dom){
     // 显示校验结果
     dom.parentNode.getElementsByTagName('span')[0].onnerHTML = data;
 };
```

##  命令模式

    命令模式(Command):将请求与实现解耦并封装成独立对象，从而使不同的请求对客户端的实现参数化。

```javascript
// canvas常用方法封装
var CanvasCommand = (function(){
    // 获取canvas
    var canvas = document.getElementById('canvas'),
        // canvas元素的上下文引用对象缓存在命令对象的内部
        ctx = canvas.getContext('2d');
    // 内部方法对象
    var Action = {
        // 填充色彩
        fillStyle : function(c){
            ctx.fillStyle = c;
        },
        // 填充矩形
        fillRect : function (x,y,width,height){
            ctx.fillRect(x,y,width,height);
        },
        // 描边色彩
        strokeStyle : function(c){
            ctx.strokeStyle = c;
        },
        // 描边矩形
        strokeRect : function(x,y,width,height){
            ctx.strokeRect(x,y,width,height);
        },
        // 填充字体
        fillText : function(text,x,y){
            ctx.fillText(text,x,y);
        },
        // 开启路径
        beginPath : function(){
            ctx.beginPath();
        },
        // 移动画笔触点
        moveTo : function(x,y){
            ctx.moveTo(x,y);
        },
        // 画笔连线
        lineTo : function(x,y){
            ctx.lineTo(x,y);
        },
        // 绘制弧线
        arc : function (x,y,r,begin,end,dir){
            ctx.arc(x,y,r,begin,end,dir);
        },
        // 填充
        fill : function(){
            ctx.fill();
        },
        // 描边
        stroke : function(){
            ctx.stroke();
        }
    };
    return {
        // 命令接口
        excute : function(msg){
            // 如果没有指令返回
            if(!msg)
                return;
            // 如果命令是一个数组
            if(msg.length){
                // 遍历执行多个命令
                for(var i = 0,len = msg.length; i < len; i++){
                    excute(msg[i]);
                }
            }
            // 执行一个命令
            else{
                // 如果msg.param不是一个数组，将其转化为数组,apply第二个参数要求格式
                msg.param = Object.prototype.toString.call(msg.param) === "[object Array]" ? msg.param : [msg.param];
                // Action 内部调用的方法可能引用this,为保证作用于中this指向正确，故传入Action
                Action[msg.command].apply(Action,msg.param);
            }    
        }
    };
})();

// 设置填充色彩为红色，并绘制一个矩形
CanvasCommand.excute([
    {command:'fillStyle',param:'red'},
    {command:'fillRect',param:[20,20,100,100]}
]);
```

##  驻华大使 —— 访问者模式

    访问者模式(Visitor):针对对象结构中的元素，定义在不改变该对象的前提下访问结构中元素的新方法。

```javascript
// 对象访问器
var Visitor = (function(){
    return  {
        // 截取方法
        splice : function(){
            // splice方法参数，从原参数的第二个参数开始算起
            var args = Array.prototype.splice.call(arguments,1);
            // 对第一个参数对象执行splice方法
            return Array.prototype.splice.apply(arguments[0],args);
        },
        // 添加数据方法
        push : function(){
            // 强化类数组数据，使他拥有length属性
            var len = arguments[0].length || 0;
            // 添加的数据从原参数的第二个参数算起
            var args = this.splice(arguments,1);
            // 校正length属性
            arguments[0].length = len + arguments.length - 1;
            // 对第一个参数对象执行push方法
            return Array.prototype.push.apply(arguments[0],args);
        },
        // 弹出最后一次添加的元素
        pop : function(){
            // 对第一个参数对象执行pop方法
            return Array.prototype.pop.apply(arguments[0]);
        }
    };
})();

var a = new Object();
console.log(a.length); // undefined

Visitor.push(a,1,2,3,4);
console.log(a.length); // 4

Visitor.push(a,4,5,6);
console.log(a); // {0:1,...,6:6,length:7}

Visitor.pop(a);
console.log(a); // {0:1,...,5:6,length:6}

Visitor.splice(a,2);
console.log(a); // {0:1,1:2,length:2}
```
        访问者模式解决数据与数据的操作方法之间的耦合，将数据的操作方法独立于数据，使其
    可以自由化演变。因此访问者更适合于那些数据稳定，但是数据的操作方法易变的环境下。因
    此当操作环境改变时，可以自由修改操作方法以适应操作环境，而不用修改原数据，实现操作
    方法的拓展。同时对于同一个数据，它可以被多个访问对象所访问，这极大增加了操作数据的
    灵活性。

##  媒婆 —— 中介者模式

        中介者模式(Mediator)：通过中介者对象封装一系列对象之间的交互模式，使对象之间不再相互引用，
    降低他们之间的耦合。有时中介者对象也可以改变对象之间的交互。

```javascript
// 中介者对象
var Mediator = function(){
    // 消息对象
    var _msg = {};
    return {
        /**
         *  订阅消息方法
         *  参数 type     消息名称
         *  参数 action   消息回调函数
         **/
        register : function(type , action){
            // 如果该消息存在
            if(_msg[type]){
                // 存入回调函数
                _msg[type].push(action);
            }else{
                // tan90 则建立该消息函数
                _msg[type] = [];
                // 存入新消息回调函数
                _msg[type].push(action);
            }
        },
        /***
         *  发布消息方法 
         *  参数 type 消息名称
         **/
        send : function(type){
            // 如果该消息已经被订阅
            if(_msg[type]){
                // 遍历已存储的消息回调函数
                for(var i = 0,len = _msg[type].length; i < len;i ++){
                    // 执行该回调函数
                    _msg[type][i] && _msg[type][i]();
                }
            }
        } 
    };
}();
// unit test
Mediator.register('demo',function(){
    console.log('first');
});
Mediator.register('demo',function(){
    console.log('second');
});
// 发布消息
Mediator.send('demo');
```

    Q: 通过中介者模式来实现点击键盘方向控制页面中盒子的移动

##  做好笔录 —— 备忘录模式

        备忘录模式（Memento）：在不破坏对象的封装性的前提下，在对象之外捕获并保存该对象内部的状态
    以便日后对象使用或者对象回复到以前的某个状态。

```javascript
// 缓存ajax数据
```    
    备忘录模式最主要的任务是对现有的数据或状态做缓存，为将来某个时刻使用或回复做准备。

##  点钞机 —— 迭代器模式

    迭代器模式（Iterator）：在不暴露对象内部结构的同时，可以顺序地访问聚合对象内部的元素。

```javascript
```

##  语言翻译 —— 解释器模式

    解释器模式(Interpreter):对于一种语言，给出其文法表现形式并定义一种解释器，通过使用这种解释器来
    解释语句中定义的句子。

```javascript
```