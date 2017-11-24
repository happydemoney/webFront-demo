#   架构型设计模式（Architectural Design Model）

##  死心眼 —— 同步模块模式

    SMD（Synchronous Module Definition）：请求发出后，无论模块是否存在，立即执行后续的逻辑，实现模块开发中对模块的立即引用。

```javascript

// 定义模块管理器单体对象
var F = F || {};
/**
 * 定义模块方法
 * @param str 模块路由
 * @param fn  模块方法
*/
F.define = function(str, fn){
    var parts = str.split('.'), // 解析模块路由
        old = parent = this, // old当前模块的祖父模块,parent当前模块父模块,如果在闭包中，为了屏蔽对模块直接访问，建议将模块添加给闭包内部私有变量
        i = len = 0; // i 模块层级 ， len模块层级长度
    // 如果第一个模式是模块管理器单体对象，则移除
    if(parts[0] === F){
        parts = parts.slice(1);
    }
    // 屏蔽对define与module模块方法的重写
    if(parts[0] === 'define' || parts[0] === 'module'){
        return;
    }
    // 遍历路由模块并定义每层模块
    for(len = parts.length;i < len;i ++){
        // 如果父模块中不存在当前模块
        if(typeof parent[parts[i]] === 'undefined'){
            // 声明当前模块
            parent[parts[i]] = {};
        }
        // 缓存下一层级的祖父模块
        old = parent;
        // 缓存下一层级父模块
        parent = parent[parts[i]];
    }
    // 如果给定模块方法则定义该模块方法
    if(fn){
        // 此时i等于parts.length，故减一
        old[parts[--i]] = fn();
    }
    // 返回模块管理器单体对象
    return this;
};
```

##  大心脏 —— 异步模块模式

    AMD(Asynchronous Module Definition): 请求发出后，继续其他业务逻辑，直到模块加载完成执行后续的逻辑，实现模块开发中对模块加载完成后的引用。

##  分而治之 —— Widget 模式

    Widget：Widget模式是指借用Web widget思想将页面分解成部件，针对部件开发，最终组合成完整的页面。



##  三人行 —— MVC 模式

    MVC即模型（modle） - 视图（view） - 控制器（controller）：用一种将业务逻辑、数据、视图分离的方式组织架构代码。

*   M 数据 - 页面初始化获取的同步数据以及交互时通过AJAX获取的异步数据等
*   V 视图 - 创建视图
*   C 交互 - 各种页面交互与页面特效

##  三军统帅 —— MVP 模式

    MVP即模型（model） - 视图（view） - 管理器（presenter）：View层不直接引用Model层内的数据，而是通过presenter层实现对Model层内的数据访问。
    即所有层次的交互都发生在Presenter层中。

##  视图的逆袭 —— MVVM 模式


