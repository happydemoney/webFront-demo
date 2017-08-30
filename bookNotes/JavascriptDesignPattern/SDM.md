#   结构性设计模式（Structural Design Model）

##  套餐服务 —— 外观模式
```javascript
/**
 *  外观模式(Facade)：为一组复杂的子系统接口提供一个更高级的统一接口，通过这个接口是的对子系统接口的访问更容易。
 *  在Javascript中有时也会用于对底层结构兼容性做统一封装来简化用户使用。
*/
// 外观模式实现DOM2级事件绑定
function addEvent(dom, type, fn) {
    // 对于支持DOM2级事件处理程序 addEventListener 方法的浏览器(W3C规范推荐)
    if (dom.addEventListener) {
        dom.addEventListener(type, fn, false);
    }
    // 对于不支持DOM2级事件处理程序 addEventListener 方法但支持 attachEvent 的浏览器
    else if (dom.attachEvent) {
        dom.attachEvent('on' + type, fn);
    }
    // 对于既不支持DOM2级事件处理程序 addEventListener 方法也不支持 attachEvent 的浏览器
    else {
        dom['on' + type] = fn;
    }
}
// -- 解决低版本浏览器兼容问题
/**
 * Question: 通过外观封装一个获取元素css样式的方法
*/
```
##  水管弯弯 —— 适配器模式

```javascript
/**
 *  适配器模式(Adapter)
 *  将一个类（对象）的接口（方法或属性）转化成另外一个接口，以满足用户需求，使类（对象）之件接口的不兼容问题通过适配器得以解决。
 */
 ```

##  牛郎织女 —— 代理模式

```javascript
/**
 *  代理模式（Proxy）
 *  由于一个对象不能直接引用另一个对象，所以需要通过代理对象在这两个对象之间起到中介的作用；
*/
```

##  房子装修 —— 装饰者模式

```javascript
/**
 *  装饰者模式（Decorator）
 *  在不改变原对象的基础上，通过对其进行包装拓展（添加属性或方法）是原有对象可以满足用户的更复杂需求
*/
var decorator = function (input, eventType, fn) {
    var input = document.getElementById(input);
    if (typeof input['on' + eventType] === 'function') {
        var oldFn = input['on' + eventType];
        input['on' + eventType] = function () {
            oldFn();
            fn();
        }
    } else {
        input['on' + eventType] = fn;
    }
}
```

##  城市间公路 —— 桥接模式

```javascript
/**
 *  桥接模式（Bridge）
 *  在系统沿着对个唯独变化时，又不增加其复杂度并已达到解耦。
 *
 *  -- 特点：将实现层和逻辑层解耦分离，使两部分可以独立变化。
*/

/**
 *  Q: 创建一个对象桥接method，实现为对象拓展方法的功能
*/
Object.prototype.addMethod = function (fnName, fn) {
    this[fnName] = fn;
};

// test
var oTest = {
    name: 'testNmae'
};

oTest.addMethod('showName', function () {
    console.log(this.name);
});
oTest.showName();
```

##  超值套餐 —— 组合模式

```javascript
/**
 *  组合模式（Composite）
 *  又称部分-整体模式，将对象组合成树形结构以表示“部分整体”的层次结构。
 *  组合模式使得用户对单个对象和组合对象的使用具有一致性。
 *
 *  -- 每个成员要有祖先
 *  -- 组合要有容器类
*/
```

##  城市公交车 —— 享元模式

```javascript
/**
 *  组合模式（Composite）
*/
```