const express = require('express')
const {createCanvas , loadImage} = require('canvas')
const path = require('path')
const app = express()

app.use(express.static(__dirname + '/'))
console.log(__dirname + '/')
function Canvas(){
    return createCanvas(...arguments)
}

app.get('/drag_captcha' , async (req , res )=>{
    const { bgWidth: width } = req.query;
    const bgWidth = parseInt(width) || 320;
    const bgHeight = (width && parseInt(width * 180 / 320)) || 180;
    const dragPicWidth = 60;
    const dragPicHeight = 45;
    
    const bgCanvas = new Canvas(bgWidth, bgHeight);
    const dragCanvas = new Canvas(dragPicWidth, dragPicHeight);
    const background = bgCanvas.getContext('2d');
    const dragPic = dragCanvas.getContext('2d');
    // const image = await loadImage('http://localhost:7000/bg.jpg')
    const image = await loadImage('bg.jpg')
    const positionX = Math.floor(Math.random() * (bgWidth - dragPicWidth - 10) + 11);  // 空白拼图的定位X
    const positionY = Math.floor(Math.random() * (bgHeight - dragPicHeight - 10) + 11);
    background.drawImage(image, 0, 0, 320, 180, 0, 0, bgWidth, bgHeight);
    dragPic.drawImage(bgCanvas, positionX, positionY, dragPicWidth, dragPicHeight, 0, 0,
        dragPicWidth, dragPicHeight);
    background.clearRect(positionX, positionY, dragPicWidth, dragPicHeight);
    if(req.session) {
        req.session.dragCaptcha = {
            positionX,
            positionY 
        }
    }  
    res.send({bgCanvas : bgCanvas.toDataURL() , dragCanvas : dragCanvas.toDataURL()})
}) 



var server = app.listen(7000 , ()=>{

    var host = server.address().address
    var port = server.address().port
  
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
