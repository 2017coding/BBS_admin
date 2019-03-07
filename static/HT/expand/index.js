/**
 * idco 扩展入口
 * Created by zqx on 2018/2/6.
 */
var socketDataMap = null;
// var httpDataMap = null;

/**
 * 初始化函数
 */
function init(){
  let dataModel = new ht.DataModel();
  let graphView = new ht.graph.GraphView(dataModel);
  graphView.addToDOM();
  ht.Default.xhrLoad('previews/display.json', function (text) {
    var json = ht.Default.parse(text);
    if (json.title) document.title = json.title;
    dataModel.deserialize(json);
    // quickFinder = new ht.QuickFinder(dataModel, "displayName");
    transferDataModel2DataMap(dataModel);
    // getDataFromHttpServer();
    connectToSocketIOServer();
  });
}

/**
 * 将dataModel转换成我们想要的dataMap格式
 * @param dataModel HT's DataModel
 * @returns {*}
 */
function transferDataModel2DataMap(dataModel) {
  if(!dataModel){
    return null;
  }
  socketDataMap = {};
  dataModel.each(function (data) {
    let dataBindings = data.getDataBindings();
    if (dataBindings) {
      if(dataBindings.a) {
        generateBindMapFromDataBindings(data, dataBindings.a, socketDataMap, "a")
      }
      if (dataBindings.s) {
        generateBindMapFromDataBindings(data, dataBindings.s, socketDataMap, "s")
      }
    }
  });
}

/**
 * 根据 dataBindings 记录绑定关系
 * @param data
 * @param bindAttr 控件的绑定属性
 * @param dataMap socketDataMap
 * @param bindAttrType 控件绑定属性类型 a/s/其他
 */
function generateBindMapFromDataBindings(data, bindAttr, dataMap, bindAttrType) {
  for (var k in bindAttr) {
    var db = bindAttr[k];
    if(!db.id) continue;
    let attrMap = {};
    attrMap["data"] = data;
    attrMap["attr"] = [];
    let dataEntity = dataMap[db.id] || {};
    dataEntity[data._id] = attrMap;
    dataMap[db.id] = dataEntity;

    let bindMap = {};
    bindMap["key"] = k;
    bindMap["func"] = db.func;
    bindMap["bindType"] = bindAttrType;
    dataMap[db.id][data._id]["attr"].push(bindMap)
  }
}

