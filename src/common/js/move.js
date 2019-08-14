/**
 * @param {Object} el document对象
 * @param {String} handle 要操作的元素
 * @param {String} move 要移动的元素
 * @param {String} parentBox 父容器，相对于它移动
 * @param {Object} data 数据
 * @param {Function} callback 移动完调用的方法
 */
export default (el, handle, move, parentBox = 'body', data = {}, callback) => {
  const handleDom = el.querySelector(handle)
  const moveDom = el.querySelector(move)
  handleDom.style.cssText += 'cursor:move;'

  const obj = {
    startX: 0,
    startY: 0,
    moveX: 0,
    moveY: 0,
    slidingX: 0,
    slidingY: 0,
    moveStatus: false,
    moveBoole: false
  }
  const result = {
    x: 0,
    y: 0
  }
  // 当前选择的元素, 鼠标按下
  handleDom.onmousedown = (e) => {
    const event = window.event || e
    // 开始坐标
    obj.startX = event.pageX || event.clientX
    obj.startY = event.pageY || event.clientY
    // 鼠标经过为true
    obj.moveStatus = true
    // 鼠标经过，全局事件
    document.onmousemove = (e) => {
      const event = window.event || e
      // 根据鼠标up状态判断是否进行
      if (!obj.moveStatus) {
        return
      }
      // 设置鼠标经过状态为true
      obj.moveBoole = true
      // 经过坐标
      obj.moveX = event.pageX || event.clientX
      obj.moveY = event.pageY || event.clientY
      // 滑动距离
      obj.slidingX = obj.moveX - obj.startX
      obj.slidingY = obj.moveY - obj.startY
      // 得到父级盒子的宽高
      const W = document.querySelector(parentBox).clientWidth
      const H = document.querySelector(parentBox).clientHeight

      // 得到当前块的宽高
      const domW = moveDom.clientWidth
      const domH = moveDom.clientHeight
      // 初始偏移
      const offTop = moveDom.offsetTop
      const offLeft = moveDom.offsetLeft
      // 设置边界值
      let X = obj.slidingX
      let Y = obj.slidingY
      if ((X + domW + offLeft) >= W) {
        X = W - domW - offLeft
      } else if ((X + offLeft) <= 0) {
        X = -offLeft
      }
      if ((Y + domH + offTop) >= H) {
        Y = H - domH - offTop
      } else if ((Y + offTop) <= 0) {
        Y = -offTop
      }
      // 此时当前的索引值为去到的索引值 父盒子距离改变
      moveDom.style.transform = 'translate3D(' + X + 'px, ' + Y + 'px, 0)'
      result.x = X / W
      result.y = Y / H
    }
    document.onmouseup = (e) => {
      obj.moveStatus = false
      // 鼠标离开不往下进行，鼠标up才进行
      if (!obj.moveBoole) {
        return
      }
      // 得到父级盒子的宽高
      const W = document.querySelector(parentBox).clientWidth
      const H = document.querySelector(parentBox).clientHeight

      moveDom.style.left = +moveDom.style.left.replace('%', '') + +(result.x * 100).toFixed(6) + '%'
      moveDom.style.top = +moveDom.style.top.replace('%', '') + +(result.y * 100).toFixed(6) + '%'
      // 设置当前相对于父级元素的移动信息
      if (callback) {
        const obj = {
          data,
          left: moveDom.style.left,
          top: moveDom.style.top
        }
        callback(obj)
      }
      // 设置鼠标经过状态
      obj.moveBoole = false
      // 清除3D移动
      moveDom.style.transform = 'translate3D(0, 0, 0)'
    }
  }
}
