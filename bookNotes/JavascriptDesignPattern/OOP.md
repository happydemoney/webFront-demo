#   面向对象编程（object-oriented programming）

##  灵活的语言——JavaScript

### 真假对象
```javascript
var checkObj = function(){
    return {
        aMethod : function(){

        },
        bMethod : function(){

        }
    };
}
var a = checkObj();
a.aMethod();
```

### 类
```javascript
var checkObj = function(){
    this.aMethod = function(){

    }
    this.bMethod = function(){

    }
}
// --- or
var checkObj = function(){};
checkObj.prototype = {
    aMethod : function(){

    },
    bMethod : function(){

    }
}
// --- 链式调用方法
var checkObj = function(){};
checkObj.prototype = {
    aMethod : function(){
        // do somethis
        return this;
    },
    bMethod : function(){
    // do somethis
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
    this[name] = fn;
}
var methods = function(){};
methods.addMethod('aMethod',function(){
    console.log("i'm aMethod!");
});
methods.aMethod();
```

##  写的都是看到的 —— 面向对象编程