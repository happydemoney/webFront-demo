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


##  命令模式


##  驻华大使 —— 访问者模式


##  媒婆 —— 中介者模式


##  做好笔录 —— 备忘录模式


##  点钞机 —— 迭代器模式


##  语言翻译 —— 解释器模式

