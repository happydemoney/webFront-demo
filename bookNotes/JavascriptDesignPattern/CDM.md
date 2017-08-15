#   创建型设计模式（Creation Design Model）

##  神奇的魔术师 —— 简单工厂模式

```javascript
/**
 *  1、 简单工厂模式（Simple Factory）
 *  又名静态工厂方法，由一个工厂对象决定常见某一种产品对象类的实例。
 *  主要用来创建同一类对象
*/
// 篮球基类
var Basketball = function () {
    console.log('篮球盛行于美国');
};
Basketball.prototype = {
    getMember: function () {
        console.log('每个队伍需要五个成员');
    },
    getBallSize: function () {
        console.log('篮球很大');
    }
};
// 足球基类
var Football = function () {
    console.log('足球在全世界范围内流行');
};
Football.prototype = {
    getMember: function () {
        console.log('每个队伍需要十一个成员');
    },
    getBallSize: function () {
        console.log('足球很大');
    }
};
// 网球基类
var Tennis = function () {
    console.log('每年有很多网球公开赛');
};
Tennis.prototype = {
    getMember: function () {
        console.log('每个队伍需要一个成员');
    },
    getBallSize: function () {
        console.log('网球很小');
    }
};
// 运动工厂
var SportsFactory = function (name) {
    switch (name) {
        case 'NBA':
            return new Basketball();
            break;
        case 'worldCup':
            return new Football();
            break;
        case 'FrenchOpen':
            return new Tennis();
            break;
        default: break;
    }
}
var football = SportsFactory('worldCup');
football.getMember();
football.getBallSize();
/**
 *  --- 简单工厂方法 和 类 有什么异同点?
 *      同：静态值和静态方法的集合
 *      异：简单工厂方法由多个类构成，根据传入的参数生成具体产品类的实例
*/
```

##  给我一张名片 —— 工厂方法模式

```javascript
/**
 *  2、工厂方法模式（Factory Method）
 *  通过对产品类的抽象使其创建业务主要负责用于创建多类产品的实例。
*/
var Factory = function (type, content) {
    //  安全模式
    if (this instanceof Factory) {
        var s = new this[type](content);
        return s;
    } else {
        return new Factory(type, content);
    }
};
Factory.prototype = {
    alert: function (content) {
        layer.alert(content);
    },
    confirm: function (content) {
        layer.confirm(content);
    }
};

```

##  出现的都是幻觉 —— 抽象工厂模式

```javascript
/**
 *  3、 抽象工厂模式（Abstract Factory）
 *  通过多类的工厂抽象使其业务用于对产品类簇的创建，而不负责创建某一类产品的实例。
*/
// 抽象工厂方法
var VehicleFactory = function (supType, superType) {
    // 判断抽象工厂中是否有该抽象类
    if (typeof VehicleFactory[superType] === "function") {
        // 缓存类
        function F() { };
        // 继承父类属性和方法
        F.prototype = new VehicleFactory[superType]();
        // 将子类构造方法指向子类
        supType.constructor = supType;
        // 子类原型继承 '父类'
        supType.prototype = new F();
    } else {
        throw new Error('未创建该抽象类');
    }
};

// 小汽车抽象类
VehicleFactory.Car = function () {
    this.type = 'car';
}
VehicleFactory.Car.prototype = {
    getPrice: function () {
        return new Error('抽象方法不能调用');
    },
    getSpeed: function () {
        return new Error('抽象方法不能调用');
    }
};
var BMW = function (price, speed) {
    this.price = price;
    this.speed = speed;
};
VehicleFactory(BMW, 'Car');
BMW.prototype.getPrice = function () {
    return this.price;
};
BMW.prototype.getSpeed = function () {
    return this.speed;
};
var BMW1 = new BMW('$1,000', '200KM/S');
console.log(BMW1);  // BMW{..}
console.log(BMW1.type); // car
/**
 *  谈谈对抽象工厂模式的理解
 *  说说抽象工厂模式 与 工厂方法模式 以及 简单工厂模式 之间的异同点及其关系。
 *  同：创建的结果都是一个完整的个体，创建过程不可见，只了解创建的结果对象；
*/
```

##  分即是合 —— 建造者模式

```javascript
/**
 *  4、建造者模式 (Bulider)
 *  将一个复杂对象的构建层与其表示层分离，同样的构建过程可采用不同的表示。
*/

```

##  语言之魂 —— 原型模式

```javascript
/**
 *  基于已经存在的模板对象克隆出新对象的模式
 *  浅复制（引用类型属性共享），若实际需要可自行深复制（引用类型属性复制）
*/
function prototypeExtend() {
    var F = function () { },
        args = arguments,
        i = 0,
        len = args.length;

    for (; i < len; i++) {
        for (var j in args[i]) {
            F.prototype = args[i][j];
        }
    }

    return new F();
}
```

##  一个人的寂寞 —— 单例模式

```javascript
/**
 *  6、单例模式 (singleton)
 *  又称单体模式，是指允许实例化一次的对象类。有时我们也用一个对象来规划一个命名空间，井井有条的管理对象上的属性和方法。
 *  定义命名空间 ；管理代码库的各个模块 ； 管理静态变量
*/

// 静态变量
var Conf = (function () {
    // 私有变量
    var conf = {
        MAX_NUM: 100,
        MIN_NUM: 1,
        COUNT: 100
    };

    // 返回取值器对象
    return {
        get: function (name) {
            return conf[name] ? conf[name] : null;
        }
    }
})();

var maxNum = Conf.get('MAX_NUM');
console.log(maxNum);

/**
 *  惰性创建
*/
// 惰性载入单例
var lazySingle = (function () {

    // 单例实例应用
    var _instance = null;
    function Single() {

        return {
            publicMethod: function () { },
            publicProperty: '1.0'
        };
    }

    return function () {
        // 如果为创建单例将创建单例
        if (!_instance) {
            _instance = Single();
        }

        return _instance;
    };

})();

console.log(lazySingle().publicProperty);
```