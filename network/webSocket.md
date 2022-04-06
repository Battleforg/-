# WebSocket
WebSocket(ws://) + SSL = wss:// 

## 什么是WebSocket
1. 可以在浏览器里使用
2. 双向通信
3. 基于TCP，复用HTTP的握手通道的应用层协议

## 建立连接的过程
WebSocket复用HTTP的握手通道，指的是客户端通过HTTP请求与WebSocket服务端协商升级协议。协议升级完成后，后续的数据交换则遵照WebSocket协议的规定。

1. 客户端发起协议升级请求，采用标准的HTTP请求报文格式，只能用GET方法。关键的请求首部：Connection: Upgrade，表示要升级协议；Upgrade: websocket，表示要升级到websocket协议；Sec-WebSocket-Version: 13，表示websocket的版本，如果服务器不支持该版本，需要返回一个Sec-WebSocket-Version首部，里面包含服务器支持的版本；Sec-WebSocket-Key，与服务器响应首部的Sec-WebSocket-Accept是配套的的，提供基本的防护。
2. 服务器返回响应报文，101状态码表示协议切换。到此完成协议升级，后续的数据都是用新协议。

### Sec-WebSocket-Accept
Sec-WebSocket-Accept由请求首部的Sec-WebSocket-Key计算而来：
1. Sec-WebSocket-Key 跟 258EAFA5-E914-47DA-95CA-C5AB0DC85B11 拼接
2. 通过SHA-1计算散列，再经过base64转换

## 数据帧格式
WebSocket客户端、服务端通信的最小单位是帧。发送方将消息切割成多个帧发送给接收方，接收方接收消息帧并将关联的帧重新组装成完整的消息。

### 主要字段

FIN：1个比特，1表示是消息的最后一个片段，0表示不是最后一个片段

RSV1、RSV2、RSV3：各占1比特。默认情况全为0。当客户端和服务端协商采用WebSocket扩展时，这三个标志位可以非0，值的含义由扩展定义。如果出现非零且没有采用WebSocket扩展，连接出错。

Opcode：4个比特，操作代码，决定了应该怎么解析后续的数据载荷，如果操作代码是不认识的，接收端应该断开连接。可选的操作代码：
1. %x0：表示这是一个延续帧，本次数据传输采用了数据分片，当前收到的数据帧为其中的一个数据分片
2. %x1：表示这是一个文本帧
3. %x2：表示这是一个二进制帧
4. %x3-7：保留的操作代码，用于后续定义的非控制帧
5. %x8：表示连接断开
6. %x9：表示这是一个ping操作
7. %xA：表示这是一个pong操作
8. %xB-F：保留的操作代码，用于后续定义的控制帧

Mask：1个比特，表示是否要对数据载荷进行掩码操作。从客户端项服务端发送数据时，需要对数据进行掩码操作，从服务端向客户端发送数据时，不需要对数据进行掩码操作。如果服务端收到的数据没有进行过掩码操作，服务端需要断开连接。如果Mask为1，在Masking-key中会定义一个掩码键，用于对数据载荷进行反掩码。

Payload length：数据载荷的长度，占据多个字节时，采用大端字节序（又称网络字节序）

Masking-key：0或4字节，根据Mask是否为1决定

Payload data：载荷数据，包含扩展数据、应用数据

### 掩码算法
有原始数据的第i字节，j为```i mod 4```的结果，则转换后的数据第i字节为原始数据的第i字节与掩码键（Masking-key，存在时为4个字节）异或的结果

## 数据交换
建立WebSocket连接后，后续数据交换都是基于数据帧的传递。WebSocket根据操作代码（Opcode）区分操作的类型。

WebSocket的每条消息可能被切分成多个数据帧。当接收方收到一个数据帧时，会根据FIN的值判断，当接收到最后一个数据帧时，接收方可以开始对消息进行处理，反之还需要继续监听接收其余的数据帧

## 维持连接
为了维持客户端和服务端间的实施双向通信，需要确保客户端和服务端之间的TCP连接没有断开。在长时间没有数据往来时，需要通过心跳来保持连接。

发送方-》接收方：ping

接收方-》发送方：pong

ping、pong对于WebSocket的两个控制帧

## 数据掩码的作用
这是为了防止早期版本的协议中存在的代理缓存污染攻击，这是一种针对代理服务器设计缺陷的攻击，能让攻击者利用WebSocket协议向代理服务器缓存恶意信息。



## 参考
[WebSocket协议：5分钟从入门到精通 ](https://www.cnblogs.com/chyingp/p/websocket-deep-in.html)

[mdn](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)