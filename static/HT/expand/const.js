/**
 * 全局常量定义
 * Created by zqx on 2018/2/6.
 */

/**
 * 服务器配置
 * @type {string}
 */
const DATA_SERVER_URL = "http://10.61.16.204:3000"; // socket.io数据服务器url

/**
 * socket.io 事件定义
 * @type {string}
 */
const EVENT_CONNECT = "connect"; // 连接服务器
const EVENT_DISCONNECT = "disconnect"; // 与服务器断开连接
const EVENT_STATION_DATA = "onStationData"; // 接收测点数据
