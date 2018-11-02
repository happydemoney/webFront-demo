#   JavaScript中的call、apply、bind深入理解


##  函数的三种角色

```javascript
function Fn() {
    var num = 500;
    this.x = 100;
}
Fn.prototype.getX = function () {
    console.log(this.x);
}
Fn.aaa = 1000;

var f = new Fn;

f.num // undefined
f.aaa // undefined
var res = Fn(); // res是undefined  Fn中的this是window
```

1. 普通函数

    对于Fn而言，它本身是一个普通的函数，执行的时候会形成私有的作用域，然后进行形参赋值、预解
    析、代码执行、执行完成后内存销毁；

2. 类(构造函数)

    它有自己的实例，f就是Fn作为类而产生的一个实例，也有一个叫做prototype的属性是自己的原型，
    它的实例都可以指向自己的原型；

3. 普通对象

    Fn和 var obj = {} 中的obj一样，就是一个普通的对象（所有的函数都是Function的实例），它
    作为对象可以有一些自己的私有属性，也可以通过__proto__找到Function.prototype；

##  call深入

    call方法的作用：首先寻找call方法，最后通过原型链在Function的原型中找到call方法，
    然后让call方法执行，在执行call方法的时候，让fn方法中的this变为第一个参数值obj，
    最后再把fn这个函数执行。

```javascript
// 模拟Function.prototype.call
Function.prototype.myCall = function( context ){
    // myCall方法中的this就是当前我要操作和改变其this关键字的那个函数名

    // 1、让fn中的this关键字变为context的值->obj
    // 让this这个函数中的"this关键字"变为context
    // eval(this.toString().replace("this","obj"));

    // 2、让fn方法在执行
    // this();
}
// test
var obj = { name: 'obj name' }; 
function getName(){
	console.log(this);
	console.log(this.name);
}
getName.call(obj);
```