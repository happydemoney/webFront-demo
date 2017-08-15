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

### 面向对象编程概念

    面向对象编程就是将你的需求抽象成一个对象，然后针对这个对象分析其特征（属性）和动作（方法）。这个对象我们称之为类。
    面向对象编程思想其中有一个特点是封装,就是说把你需要的功能放在一个对象里。

### 封装

* 创建一个类
* 属性和方法封装
* 闭包实现
* 创建对象的安全模式

### 继承

* 子类的原型对象 —— 类式继承
```javascript
// 类式继承
// 声明父类
function SuperClass(){
    this.superValue = true;
}
// 为父类添加共有方法
SuperClass.prototype.getSuperValue = function(){
    return this.superValue;
}
// 声明子类
function SubClass(){
    this.subValue = false;
}
// 继承父类
SubClass.prototype = new SuperClass();
// 为子类添加共有方法
SubClass.getSubValue = function(){
    return this.subValue;
}
// 缺点：无法传参，无法进行属性初始化
```
* 创建既继承 —— 构造函数继承
```javascript
function SuperClass(id){
    // 引用类型共有属性
    this.books = ['javascript','html','css'];
    // 值类型共有属性
    this.id = id;
}
// 父类声明原型方法
SuperClass.prototype.showBooks = function(){
    console.log(this.books);
}
// 声明子类
function SubClass(id){
    // 继承父类
    SuperClass.call(this,id);
}
// 缺点：子类各实例的引用类型属性更改会互有影响
```
* 将优点为我所用 —— 组合继承
    类式继承是通过子类的原型prototype对父类实例化来实现的;
    构造函数式继承是通过在子类的构造函作用环境中执行一次父类结构的构造函数类实现的;

```javascript
// 组合式继承
// 声明父类
function SuperClass(name){
    this.name = name;
    this.books = ['html','css','javascript'];
}
// 父类原型方法
SuperClass.prototype.getName = function(){
    console.log(this.name);
}
// 声明子类
function SubClass(name,time){
    // 构造函数式继承父类name属性
    SuperClass(this,name);
    // 子类新增共有属性
    this.time = time;
}
// 类式继承 子类原型继承父类
SubClass.prototype = new SuperClass();
// 子类原型方法
SubClass.prototype.getTime = function(){
    console.log(this.time); 
}
// 特点：将引用类型放在构造继承的父类中，避免子类实例互有影响，方法使用原型继承；
// 缺点：使用构造继承时执行了一遍父类的构造函数，实现子类原型的类式继承时又调用了一遍父类构造函数。因此父类构造函数调用了两次。
```
* 洁净的继承 —— 原型继承
```javascript
// 原型式继承
function inheritObject(o){
    // 声明一个过渡函数对象
    function F(){}
    // 过渡对象的原型继承父对象
    F.prototype = o;
    // 返回过渡对象的一个实例，该实例的原型继承了父对象
    return new F();
}
// 这种适合值类型继承，引用类型继承不推荐
```
* 如虎天翼 —— 寄生式继承
```javascript
// 寄生式继承
// 声明基对象
var book = {
    name : 'js book',
    alikeBook :　['css book', 'html book' ]
};
function createBook(obj){
    // 通过原型继承方式创建新对象
    var o = new inheritObject(obj);
    // 拓展新对象
    o.getName = function(){
        console.log(name);
    }
    // 返回拓展后的新对象
    return o;
}
```
* 终极继承者 —— 寄生组合式继承
```javascript
/**
 * 寄生式继承
 * 传递参数 subClass 子类
 * 传递参数 superClass 父类
 **/
function inheritPrototype(subClass,superClass){
    // 复制一份父类的原型副本保存在变量中
    var p = inheritObject(superClass.prototype);
    // 修正因为重写子类原型导致子类的 constructor 属性被修改
    p.constructor = subClass();
    // 设置子类的原型
    subClass.prototype = p;
} 
// 注意：子类再想添加原型方法必须通过prototype对象，通过.语法一个一个添加方法了，否则直接赋予对象就会覆盖掉从父类原型继承的对象了。
```
### 多继承

```javascript
// 单继承 - 属性复制 - 浅复制（值类型）
var extend = function(target,source){
    // 遍历源对象中的属性
    for(var property in source){
        target[property] = source[source];
    }
    // 返回目标对象
    return target;
}
// 多继承
var mix = function(){
    var i = 1,
        length = arguments.length,
        target = arguments[0],
        arg;

    for(;i < length; i ++){
        arg = arguments[i];
        for(var property in arg){
            target[property] = arg[property];
        }
    }
    return target;
}
// or 
Object.prototype.mix = function(){
    var i = 0,
        length = arguments.length,
        arg;

    for(;i < length; i ++){
        arg = arguments[i];
        for(var property in arg){
            this[property] = arg[property];
        }
    }    
}
```

### 多态

    对传入的参数长度做判断以实现多种调用方式；

### QUERSTION

    如何实现深复制(引用类型也复制而不仅仅是引用)?