#   OpenGL  ES着色器语言(GLSK ES)

* 数据、变量和变量类型。
* 矢量、矩阵、结构体、数组、采样器（纹理）。
* 运算、程序刘、函数。
* attribute、uniform和 varying变量
* 精度限定器。
* 预处理和指令。

##  回顾：着色器代码示例:
```javascript
/* 顶点着色器 */
attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_MvpMatrix;
varying vec4 v_Color;
void main(){
    gl_Position = u_MvpMatrix * a_Position;
    v_Color = a_Color;
}

/* 片元着色器 */
#ifdef GLSL_ES
precision medium float;
#endif
varying vec4 v_Color
void main(){
    gl_FragColor = v_Color;
}
/* GLSL ES1.00 语法与C语言类似*/
```

##  你好，着色器！

* 基础
    1. 程序是大小写敏感的（比如 - max 及 Max不同）；
    2. 每一个语句都应该以一个英文分号(;)结束；
* 执行次序
    从main()函数开始执行，有且仅有一个main()函数，不接受参数；
    无返回值函数名前加void，有返回值指明返回值类型
* 注释
    1. 单行 - / /
    2. 多行 - /* */

##  数据值类型(数值和布尔值)

* 数值类型  (整型值 - 无小数点 及 浮点数 - 有小数点)
* 布尔值 (true | false)
* 不支持字符串类型

##  变量

* 只包含a-z,A-Z,0-9和下划线(_)。
* 首字母不能是数字(0-9)。
* 不能是GLSL ES关键字和保留字。
* 不能以gl_ / webgl_ / _webgl_开头，这些前缀以及被OpenGL ES保留了。

##  GLSL ES是强类型语言

    变量定义时要声明数据类型，返回值要指明返回类型

##  基础类型

* float(浮点型)
* int(整型)
* bool (true/false)

### 赋值和类型转换

    赋值（=） ，转换（float() - int() - bool()）

### 运算符（与js类似）

##  矢量和矩阵

### 值类型
    
    类别  GLSL ES数据类型             描述
    
    矢量  vec2、vec3、vec3          具有2/3/4个浮点元素的矢量    
          ivec2、ivec3、ivec4      具有2/3/4个整型元素的矢量
          bvec2、bvec3、bvec4      具有2/3/4个布尔元素的矢量
    矩阵  mat2、mat3、mat4          2x2/3x3/4x4的浮点元素矩阵

##  结构体

    GLSL ES支持用户自定义的类型，及结构体。关键字 struct

##  数组

##  取样器

##  运算符优先级

##  程序流程控制

##  函数

##  内置函数

##  全局变量和局部变量

##  存储限定字

##  精度限定字

##  预处理命令

##  总结
