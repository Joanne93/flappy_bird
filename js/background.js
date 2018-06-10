/*
	Author: Joanne
	Date: 2018-05-07
	Description: 描述背景类
    属性：
        img: 传进来的图片对象
        speed: 移动的速度
        step: 移动的距离
    
*/
define(function(require, exports, module) {
    
    function Background(img, speed) {
        this.img = img;
        this.speed = speed;
        this.step = 0;
    }
    
    Background.prototype = {
        constructor: Background,
    
        // 移动的方法
        move: function() {
            this.step ++;
            // this.step += 20;
        },
    }

    module.exports = Background;
})

