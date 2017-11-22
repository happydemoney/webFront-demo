```javascript

setTimeout(function(){ 
    console.log('定时器开始啦')
});
new Promise(function(resolve){ 
    console.log('马上执行for循环啦'); 
    for(var i = 0; i < 100; i++){
        //console.log(i);
        i == 99 && resolve();
    }
})
.then(function(){ 
    console.log('执行then函数啦')
});
console.log('代码执行结束');

//  预期输出结果：
//  马上执行for循环了
//  代码执行结束
//  执行then函数啦
//  定时器开始啦

```

```javascript

console.log('1');

setTimeout(function () {
    console.log('2');
    process.nextTick(function () { console.log('3'); });
    new Promise(function (resolve) { console.log('4'); resolve(); })
        .then(function () { console.log('5') })
});

process.nextTick(function () { console.log('6'); });

new Promise(function (resolve) { console.log('7'); resolve(); })
    .then(function () { console.log('8') });

setTimeout(function () { 
    console.log('9'); 
    process.nextTick(function () { console.log('10'); }); 
    new Promise(function (resolve) { console.log('11'); resolve(); })
    .then(function () { console.log('12') }) 
});

/*
    预期输出结果：
    1
    7
    6
    8
    2
    4
    3
    5
    9
    11
    10
    12
*/

```

##  js的异步
    我们从最开头就说javascript是一门单线程语言，不管是什么新框架新语法糖实现的所谓异步，其实都是用同步的方法去模拟的，牢牢把握住单线程这点非常重要。
##  事件循环Event Loop
    事件循环是js实现异步的一种方法，也是js的执行机制。
##  javascript的执行和运行
    执行和运行有很大的区别，javascript在不同的环境下，比如node，浏览器，Ringo等等，执行方式是不同的。而运行大多指javascript解析引擎，是统一的。
##  setImmediate
    微任务和宏任务还有很多种类，比如 setImmediate 等等，执行都是有共同点的，有兴趣的同学可以自行了解。