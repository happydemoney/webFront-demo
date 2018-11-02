#   Promise

    Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了Promise对象。

##  特点

1. 对象的状态不受外界影响。

    三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）

2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果。

##  缺点

1. 无法取消Promise，一旦新建它就会立即执行，无法中途取消。
2. 如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。
3. 当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

建议：
    如果某些事件不断地反复发生，一般来说，使用 Stream 模式是比部署Promise更好的选择。

##  基本用法

```javascript
let promise = new Promise(function(resolve, reject) {
    console.log('Promise');
    resolve();
});

promise.then(function() {
    console.log('resolved.');
}).catch(function(){
    console.log('catch');
}).finally(function(){
    console.log('finally');
});

console.log('Hi!');

// Promise
// Hi!
// resolved
// finally
```
##  原型方法
1. Promise.prototype.then( resolve, reject )

    then方法的第一个参数是resolved状态的回调函数，第二个参数（可选）是rejected状态的回调函数。
    then方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）。因此可以采用链式写法，即then方法后面再调用另一个then方法。

2. Promise.prototype.catch()

    Promise.prototype.catch方法是.then(null, rejection)的别名，用于指定发生错误时的回调函数。

3. Promise.prototype.finally()

    finally方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。该方法是 ES2018 引入标准的。

4. Promise.all() 

    Promise.all方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

5. Promise.race()

    Promise.race方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

6. Promise.resolve()

    有时需要将现有对象转为 Promise 对象，Promise.resolve方法就起到这个作用。

7. Promise.reject() 

    Promise.reject(reason)方法也会返回一个新的 Promise 实例，该实例的状态为rejected。

8. Promise.try()

    实际开发中，经常遇到一种情况：不知道或者不想区分，函数f是同步函数还是异步操作，但是想用 Promise 来处理它。因为这样就可以不管f是否包含异步操作，都用then方法指定下一步流程，用catch方法处理f抛出的错误。一般就会采用下面的写法。

##  自定义实现Promise

```javascript
// 1. MyPromise - 
// pending（进行中）、fulfilled（已成功）和rejected（已失败）
function MyPromise( fun ){
    
    this.value = ''; // 返回值
    this.status = 'pending'; // pending（进行中）、fulfilled（已成功）和rejected（已失败）
    this.resolveCallback = function(){};
    this.rejectCallback = function(){};
    this.finallyCallback = function(){}

    fun( this.resolve.bind(this), this.reject.bind(this) );
}

MyPromise.prototype = {
    resolve: function( val ){
        var self = this;
        if(this.status == 'pending'){
            self.status = "fulfilled";
            self.value = val;
            setTimeout(function() {
                self.resolveCallback(self.value);
                self.finallyCallback();
            })
        }
    },
    reject: function( val ){
        var self = this;
        if(this.status == 'pending'){
            self.status = "rejected";
            self.value = val;
            setTimeout(function() {
                self.rejectCallback(self.value);
                self.finallyCallback();
            });
        }
    },
    then: function(resolveCallback, rejectCallback){
        this.resolveCallback = resolveCallback;
        this.rejectCallback = rejectCallback;
        return this;
    },
    catch: function(rejectCallback){
        this.rejectCallback = rejectCallback;
        return this;
    },
    finally: function(finallyCallback){
        this.finallyCallback = finallyCallback;
        return this;
    }
};

// test
setTimeout(function(){
    console.log('the one setTimeout');
});
let myPromise = new MyPromise(function(resolve, reject) {
    console.log('Promise start');
    
    // resolve("promise is ok");
    reject("promise is not ok");
});

myPromise.then(function(data) {
    console.log(data);
})
.catch(function(err){
    console.log(err);
})
.finally(function(){
    console.log('finally');
});

console.log('last code');
```