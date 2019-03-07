/**
 * Created by zqx on 2018/3/5.
 */
// const pomelo = window.pomelo;
// const rid = 'hiei';
var sclient = null;
/**
 * 初始化数据监听
 */
function initDataListener() {
  sclient.on(EVENT_STATION_DATA, function (dataJson) {
    let d = null;
    if(typeof dataJson === 'string'){
      d = JSON.parse(dataJson);
    }else if(typeof  dataJson === 'object'){
      d = dataJson;
    }
    let id = d.k; // 控件分组名称——对应测点id
    let v = d.v; // 测点值
    let dataEntity = socketDataMap[id];
    if (!dataEntity) {
      return;
    }
    // 遍历绑定标识的控件
    for(let dataEntityValue in dataEntity){
      let htData = dataEntity[dataEntityValue]["data"]; // ht data 用作给控件赋值
      let attrList = dataEntity[dataEntityValue]["attr"]; // 缓存控件的 key 和 value 处理函数
      for(let attrKey in attrList) {
        let attr = attrList[attrKey];
        let k = attr["key"];
        let func = attr["func"];
        let bindType = attr["bindType"];
        let value;
        if (func) {
          value = func(v);
        } else {
          value = v;
        }
        // 类型 a 多用于值属性等(例如进度条刻度), s 多用于文字等(例如文字内容)
        switch(bindType) {
          case "a":
            htData.a(k, value);
            break;
          case "s":
            htData.s(k, value);
            break;
        }
      }
    }
  });
}


/**
 * 连接数据服务器
 */
function connectToSocketIOServer() {
  sclient = io(DATA_SERVER_URL);
  onConnect();
  onDisconnect();
}


/**
 * 连接到消息服务器
 */
function onConnect() {
  sclient.on(EVENT_CONNECT, () => {
    sclient.removeEventListener(EVENT_STATION_DATA)
    joinDataRoom();
    initDataListener();
  })
}

function joinDataRoom() {
  let roomArray = new Array();
  for(let k in socketDataMap) {
    roomArray.push(k)
  }
  if(roomArray.length > 0) {
    sclient.emit('login', roomArray);
  }
}

/**
 * 与服务器断开连接
 */
function onDisconnect() {
  sclient.on(EVENT_DISCONNECT, () => {
    console.log('disconnected!')
    sclient.removeAllListeners(EVENT_STATION_DATA);
  });
}




