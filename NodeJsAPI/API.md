    NODEJS API(v8.7.0)

#   assert - 断言

    assert 模块提供了断言测试的函数，用于测试不变式。

#   Buffer - 缓冲

    在 ECMAScript 2015 (ES6) 引入 TypedArray 之前，JavaScript 语言没有读取或操作二进制数据流的机制。 Buffer 类被引入作为 Node.js API 的一部分，使其可以在 TCP 流或文件系统操作等场景中处理二进制数据流。

    TypedArray 现已被添加进 ES6 中，Buffer 类以一种更优化、更适合 Node.js 用例的方式实现了 Uint8Array API。

    Buffer 类的实例类似于整数数组，但 Buffer 的大小是固定的、且在 V8 堆外分配物理内存。 Buffer 的大小在被创建时确定，且无法调整。

    Buffer 类在 Node.js 中是一个全局变量，因此无需使用 require('buffer').Buffer。

#   child_process - 子进程

    child_process 模块提供了衍生子进程的功能，它与 popen(3) 类似，但不完全相同。 

    默认情况下，在 Node.js 的父进程与衍生的子进程之间会建立 stdin、stdout 和 stderr 的管道。 数据能以非阻塞的方式在管道中流通。 注意，有些程序会在内部使用行缓冲 I/O。 虽然这并不影响 Node.js，但这意味着发送到子过程的数据可能无法被立即使用。

#   cluster - 集群

    Node.js在单个线程中运行单个实例。 用户(开发者)为了使用现在的多核系统，有时候,用户(开发者)会用一串Node.js进程去处理负载任务。

    cluster 模块允许简单容易的创建共享服务器端口的子进程。

#   console - 控制台

    console 模块提供了一个简单的调试控制台，类似于 Web 浏览器提供的 JavaScript 控制台。

    该模块导出了两个特定的组件：

    一个 Console 类，包含 console.log() 、 console.error() 和 console.warn() 等方法，可以被用于写入到任何 Node.js 流。

    一个全局的 console 实例，可被用于写入到 process.stdout 和 process.stderr。 全局的 console 使用时无需调用 require('console')。

    注意：全局的 console 对象的方法既不总是同步的（如浏览器中类似的 API），也不总是异步的（如其他 Node.js 流）。

#   crypto - 加密

    crypto 模块提供了加密功能，包含对 OpenSSL 的哈希、HMAC、加密、解密、签名、以及验证功能的一整套封装。

#   dgram - 数据报

    dgram模块提供了 UDP 数据包 socket 的实现。

#   dns - 域名服务器

    dns 模块包含两类函数：

    1) 第一类函数，使用底层操作系统工具进行域名解析，且无需进行网络通信。 这类函数只有一个：dns.lookup()。

    2) 第二类函数，连接到一个真实的 DNS 服务器进行域名解析，且始终使用网络进行 DNS 查询。 这类函数包含了 dns 模块中除 dns.lookup() 以外的所有函数。 这些函数使用与 dns.lookup() 不同的配置文件（例如 /etc/hosts）。 这类函数适合于那些不想使用底层操作系统工具进行域名解析、而是想使用网络进行 DNS 查询的开发者。

#   Error - 错误

    Node.js 中运行的应用程序一般会遇到以下四类错误：

    标准的 JavaScript 错误：
        <EvalError> : 当调用 eval() 失败时抛出。
        <SyntaxError> : 当 JavaScript 语法错误时抛出。
        <RangeError> : 当值不在预期范围内时抛出。
        <ReferenceError> : 当使用未定义的变量时抛出。
        <TypeError> : 当传入错误类型的参数时抛出。
        <URIError> : 当全局的 URI 处理函数被误用时抛出。

    由底层操作系触发的系统错误，例如试图打开一个不存在的文件、试图通过一个已关闭的 socket 发送数据等。

    由应用程序代码触发的用户自定义的错误。

    断言错误是错误的一个特殊类别，每当 Node.js 检测到一个不应该发生的异常逻辑时触发。 这类错误通常由 assert 模块引起。
    所有由 Node.js 引起的 JavaScript 错误与系统错误都继承自或实例化自标准的 JavaScript <Error> 类，且保证至少提供类中的属性。

#   events - 事件

    大多数 Node.js 核心 API 都采用惯用的异步事件驱动架构，其中某些类型的对象（触发器）会周期性地触发命名事件来调用函数对象（监听器）。

    例如，net.Server 对象会在每次有新连接时触发事件；fs.ReadStream 会在文件被打开时触发事件；流对象 会在数据可读时触发事件。

    所有能触发事件的对象都是 EventEmitter 类的实例。 这些对象开放了一个 eventEmitter.on() 函数，允许将一个或多个函数绑定到会被对象触发的命名事件上。 事件名称通常是驼峰式的字符串，但也可以使用任何有效的 JavaScript 属性名。

    当 EventEmitter 对象触发一个事件时，所有绑定在该事件上的函数都被同步地调用。 监听器的返回值会被丢弃。

#   fs - 文件系统

    文件 I/O 是对标准 POSIX 函数的简单封装。 通过 require('fs') 使用该模块。 所有的方法都有异步和同步的形式。

    异步方法的最后一个参数都是一个回调函数。 传给回调函数的参数取决于具体方法，但回调函数的第一个参数都会保留给异常。 如果操作成功完成，则第一个参数会是 null 或 undefined。

    当使用同步方法时，任何异常都会被立即抛出。 可以使用 try/catch 来处理异常，或让异常向上冒泡。

#   global - 全局变量

    全局变量在所有模块中均可使用。 但以下变量的作用域只在模块内，详见 module文档：

    __dirname
    __filename
    exports
    module
    require()

#   http

    要使用 HTTP 服务器与客户端，需要 require('http')。

    Node.js 中的 HTTP 接口被设计成支持协议的许多特性。 比如，大块编码的消息。 这些接口不缓冲完整的请求或响应，用户能够以流的形式处理数据。

    为了支持各种可能的 HTTP 应用，Node.js 的 HTTP API 是非常底层的。 它只涉及流处理与消息解析。 它把一个消息解析成消息头和消息主体，但不解析具体的消息头或消息主体。

#   https

    HTTPS 是 HTTP 基于 TLS/SSL 的版本。在 Node.js 中，它被实现为一个独立的模块。

#   module - 模块

    Node.js 有一个简单的模块加载系统。 在 Node.js 中，文件和模块是一一对应的（每个文件被视为一个独立的模块）。

#   net - 网络

    net 模块提供了创建基于流的 TCP 或 IPC 服务器(net.createServer())和客户端(net.createConnection()) 的异步网络 API。

    通过以下方式引入:
    const net = require('net');

#   os - 操作系统

    os 模块提供了一些操作系统相关的实用方法。可以这么引用它:

#   path - 路径

    path 模块提供了一些工具函数，用于处理文件与目录的路径。可以通过以下方式使用：
    const path = require('path');

#   process - 进程

    process 对象是一个 global （全局变量），提供有关信息，控制当前 Node.js 进程。作为一个对象，它对于 Node.js 应用程序始终是可用的，故无需使用 require()。

#   querystring - 查询字符串

    querystring 模块提供了一些实用函数，用于解析与格式化 URL 查询字符串。

#   readline - 逐行读取

    require('readline') 模块提供了一个接口，用于从可读流（如 process.stdin）读取数据，每次读取一行。 

#   repl - 交互式解释器

    repl 模块提供了一种“读取-求值-输出”循环（REPL）的实现，它可作为一个独立的程序或嵌入到其他应用中。

#   stream - 流

    流（stream）在 Node.js 中是处理流数据的抽象接口（abstract interface）。 stream 模块提供了基础的 API 。使用这些 API 可以很容易地来构建实现流接口的对象。

    Node.js 提供了多种流对象。 例如， HTTP 请求 和 process.stdout 就都是流的实例。

    流可以是可读的、可写的，或是可读写的。所有的流都是 EventEmitter 的实例。

    尽管所有的 Node.js 用户都应该理解流的工作方式，这点很重要， 但是 stream 模块本身只对于那些需要创建新的流的实例的开发者最有用处。 对于主要是 消费 流的开发者来说，他们很少（如果有的话）需要直接使用 stream 模块。

#   string_decoder - 字符串解码器

    string_decoder 模块提供了一个 API，用于把 Buffer 对象解码成字符串，但会保留编码过的多字节 UTF-8 与 UTF-16 字符。使用以下方法引入：

    const { StringDecoder } = require('string_decoder');

#   timer - 定时器

    timer 模块暴露了一个全局的 API，用于在某个未来时间段调用调度函数。 因为定时器函数是全局的，所以使用该 API 无需调用 require('timers')。

    Node.js 中的计时器函数实现了与 Web 浏览器提供的定时器类似的 API，除了它使用了一个不同的内部实现，它是基于 Node.js 事件循环构建的。

#   tls - 安全传输层

    tls 模块是对安全传输层（TLS）及安全套接层（SSL）协议的实现，建立在OpenSSL的基础上。 按如下方式引用此模块:

    const tls = require('tls');

#   tty - 终端

    tty 模块提供了 tty.ReadStream 类和 tty.WriteStream 类。 使用以下方法引入：
    const tty = require('tty');

#   url - 链接地址

    url 模块提供了一些实用函数，用于 URL 处理与解析。

#   util - 实用工具

    util 模块主要用于支持 Node.js 内部 API 的需求。 大部分实用工具也可用于应用程序与模块开发者。 

#   v8

    v8 模块暴露了特定于V8版本内置到 Node.js 二进制文件中的API. 通过以下方式使用：
    const v8 = require('v8');

#   vm - 虚拟机

    vm 模块提供了一系列 API 用于在 V8 虚拟机环境中编译和运行代码。 它可以通过以下方式使用：
    const vm = require('vm');

    JavaScript 代码可以被编译并立即运行，或编译、保存然后再运行。

    Note: The vm module is not a security mechanism. Do not use it to run untrusted code.

#   Zlib

    zlib模块提供通过 Gzip 和 Deflate/Inflate 实现的压缩功能，可以通过这样使用它：
    const zlib = require('zlib');

    压缩或者解压数据流(例如一个文件)通过zlib流将源数据流传输到目标流中来完成。
