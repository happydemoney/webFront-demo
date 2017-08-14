#   面向对象编程（object-oriented programming）

##  灵活的语言——JavaScript

### 真假对象
```javascript
var checkObj = function(){
    return {
        aMethod : function(){},
        bMethod : function(){}
    };
}
var a = checkObj();
a.aMethod();
```

### 类
```javascript
var checkObj = function(){
    this.aMethod = function(){};
    this.bMethod = function(){};
}
// --- or
var checkObj = function(){};
checkObj.prototype = {
    aMethod : function(){},
    bMethod : function(){}
}
// --- 链式调用方法
var checkObj = function(){};
checkObj.prototype = {
    aMethod : function(){
        // do something
        return this;
    },
    bMethod : function(){
        // do something
        return this;
    }
}
var check = new checkObj();
check.aMethod().bMethod();
```
### 函数祖先
```javascript
//  给函数祖先定义一个 添加方法 的函数
Function.prototype.addMethod = function(name,fn){
    this[name] = fn;    // 函数式调用 
    this.prototype[name] = fn;   // 类式调用
    return this; // 可以链式调用 -- addMethod
}
var methods = function(){};
// 函数式调用
methods.addMethod('aMethod',function(){
    console.log("i'm aMethod!");
    return this;
}).addMethod('bMethod',function(){
    console.log("i'm bMethod!");
    return this;
});
methods.aMethod().bMethod();
// 类式调用
var methodExample = new methods();
methodExample.aMethod().bMethod();
```
### QUESTION
* 真假对象一节如何实现方法的链式调用？
* 试着定义一个可以为函数添加多个方法的addMethod方法。
* 试着定义一个既可为函数原型添加方法又可为其自身添加方法的addMethod方法。

##  写的都是看到的 —— 面向对象编程