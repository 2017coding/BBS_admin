import './alart.css'
export default {
  bind (el, binding) {
    el.addEventListener('click', e => {
      const src = e.target.currentSrc
      const body = document.querySelector('body')
      const imgAlart = document.createElement('div')
      imgAlart.className = 'g-img-alart'
      imgAlart.innerHTML = `
        <div class="g-img-alart-mask"></div>
        <div class="g-img-alart-content">
          <img class="g-img-alart-img" src="${src}">
        </div>
      `
      body.appendChild(imgAlart)

      // 监听到遮罩层点击
      imgAlart.addEventListener('click', e => {
        if (e.target.className === 'g-img-alart-mask') {
          body.removeChild(imgAlart)
        }
      }, false)
    }, false)
  }
}
