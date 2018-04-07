#   jquery-1.12-stabled 源码阅读

源链接：https://github.com/jquery/jquery/tree/1.12-stable

    整体源码 按照 AMD 规范重新编写了一遍，具体打包流程暂时不清楚，待了解。

*   入口: src/core.js

source：
    "./var/deletedIds", // 待删除id数组？ return deletedIds;
	"./var/document",   // window.document
	"./var/slice",      // deletedIds.slice,  备注：Array.slice(start,end) 方法可从已有的数组中返回选定的元素,该方法并不会修改数组，而是返回一个子数组
	"./var/concat",     // deletedIds.concat, 备注：Array.concat() 方法用于连接两个或多个数组。该方法不会改变现有的数组，而仅仅会返回被连接数组的一个副本
	"./var/push",       // deletedIds.push; 
	"./var/indexOf",    // deletedIds.indexOf; 
	"./var/class2type", // class2type["object Array"] = 'array'; ? 
	"./var/toString",   // class2type.toString;
	"./var/hasOwn",     // class2type.hasOwnProperty; 当前对象是否有该key，不含原型链
	"./var/support"
供当前模块使用的变量模块。

source：
    // Support: Android<4.1, IE<9
    // Make sure we trim BOM and NBSP
    rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

reader：
    这个正则是jquery的trim的去掉前后空格的：
    \s：空格
    \uFEFF：字节次序标记字符（Byte Order Mark），也就是BOM,它是es5新增的空白符
    \xA0：禁止自动换行空白符，相当于html中的&nbsp;

camelCase:
    camelCase函数的功能就是将形如 background-color 转化为驼峰表示法：backgroundColor。

jQuery.extend
    继承: 接受一个/两个参数，第二参数为true时为深拷贝，false浅拷贝

jQuery.isNumeric ?

jQuery.isPlainObject ?  // 是否是纯粹的对象 - 非null，非dom对象、非window对象、构造对象为Object

jQuery.globalEval  //

isArrayLike  // 数组，类数组的对象

