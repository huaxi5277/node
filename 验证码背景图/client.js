// 向以前用原生js的开发工程师致敬
(function(factory){
   if(typeof module === 'object' && typeof module.exports === 'object' ) {
       module.exports = factory()
   } else {
       window.DragCaptcha = factory()
   }
})(function(){
   var extend = {
       addEventListener : function(target , type , handler ){
           var obj = target === 'document' ? document : target
           try {
               obj.addEventListener(type , handler , true)
           } catch(error) {
               obj.attachEvent('on' + type , handler )
           }   
       },
       removeEventListener : function(target , type , handler){
            var obj = target === 'document' ? document : target 
            try {
                obj.removeEventListener(type , handler , true)
            } catch(error){
                obj.detachEvent('on' + type , handler )
            }
       }
   }
   /**
    * @param targetId 添加到制定id的节点中
    * @param callback 拖动时松开鼠标的回调函数
    * @param bgWidth  背景图片的宽度 
    */

    class DragCaptcha {
        constructor(targetId , callback , bgWidth ){
          this.targetId = targetId
          this.callback = callback
          this.bgWidth = bgWidth 
          this.bgHeight = bgWidth * 180 / 320
          this.hasAddedEvent = false 
          this.defaultValue = {
            bgWidth : '320px',
            bgHeight : '180px',
            dragWidth : '60px',
            dragHeight : '45px'
          }
          this._init()
        }
        _init(){
            this.createElement()
            this.getImage(this.bgWidth)
        }
        appentHtml(targetId , child){
          var target = document.getElementById(targetId)
          target.appendChild(child)
        }
        createElement(){
            var canvasWrapper = document.createElement('div')
            canvasWrapper.style.position = 'relative' 
            canvasWrapper.style.width = this.bgWidth ? this.bgWidth + 'px' : this.defaultValue.bgWidth
            canvasWrapper.style.margin = '5px auto'
            


            var bgImage = document.createElement('img');
            bgImage.setAttribute('id', 'bg-canvas');
            bgImage.style.width = this.bgWidth ? this.bgWidth + 'px' : this.defaultValue.bgWidth;
            bgImage.style.height = this.bgHeight ? this.bgHeight + 'px' : this.defaultValue.bgHeight;


            var dragImage = document.createElement('img')
            dragImage.setAttribute('id' , 'drag-canvas')
            dragImage.style.position = 'absolute' 
            dragImage.style.top = 0;
            dragImage.style.left = 0;
            dragImage.style.width = this.defaultValue.dragWidth;
            dragImage.style.height = this.defaultValue.dragHeight;

            var tip = document.createElement('div')
            tip.innerHTML = '请滑拖动拼图填充完整图片'
            canvasWrapper.appendChild(bgImage);
            canvasWrapper.appendChild(dragImage);
            this.appentHtml(this.targetId , canvasWrapper)
            this.appentHtml(this.targetId  ,tip  )
        }
        getImage(bgWidth){
           var that = this 
           var xhr = new XMLHttpRequest()
           var response 
           var bgImage = document.querySelector('img#bg-canvas')
           var dragImage = document.querySelector('img#drag-canvas')
           xhr.open('get' , '/drag_captcha?bgWidth=' + bgWidth , true)
           xhr.send()
           xhr.onreadystatechange = function(){
               if(xhr.readyState == 4 && xhr.status == 200) {
                   response = JSON.parse(xhr.responseText)
                   dragImage.style.left = 0;
                   dragImage.style.top = 0;
                   bgImage.src = response.bgCanvas;
                   dragImage.src = response.dragCanvas;
   
                   if (that.hasAddedEvent) return;
                   that.hasAddedEvent = true;
                //    that.drag();
               }
           }
        }
        drag(){
           var that = this 
           var bgImage = document.querySelector('img#bg-canvas')
           var dragImage = document.querySelector('img#drag-canvas')
           var moveMaxValueX = bgImage.width - dragImage.width;  // 水平方向最大移动距离
           var moveMaxValueY = bgImage.height - dragImage.height;  // 垂直方向最大移动距离
           var dragStartX = dragImage.offsetLeft;  // 拼图初始水平位置
           var dragStartY = dragImage.offsetTop;  // 拼图初始垂直位置

           if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
               extend.addEventListener(dragImage , 'touchstart' , function(e){
                   if(e.preventDefault){
                       e.preventDefault()
                   } else {
                       window.event.returnValue = false;
                   }

                   var startClientX = e.targetTouches[0].pageX 
                   var startClientY = e.targetTouches[0].pageY
                   var dragMoveLeft = dragImage.offsetLeft
                   var dragMoveTop = dragImage.offsetTop 
                   var fnMouseMove = function(e){
                    var mouseMoveX = e.targetTouches[0].pageX - startClientX;
                    var mouseMoveY = e.targetTouches[0].pageY - startClientY;
                    var toX = dragMoveLeft + mouseMoveX 
                    var toY = dragMoveTop + mouseMoveY 
                    if(toX > mouseMoveX) {
                        toX = mouseMoveX
                    } else if (toX < dragMoveLeft){
                        toX = dragMoveLeft
                    } 


                    if(toY > mouseMoveY) {
                        toY = mouseMoveY
                    } else if (toY < dragMoveLeft){
                        toY = dragMoveLeft
                    } 

                    dragImage.style.left = toX + 'px';
                    dragImage.style.top = toY + 'px';

                   }
               })
           }
        }
    }
    return DragCaptcha
})