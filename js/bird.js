/*
	Author: Joanne
	Date: 2018-05-07
	Description: 描述小鸟类
    属性：
        arr:小鸟的数组
        idx:当前小鸟的序号
        fall:下落的距离
        temp:辅助变量
        state：当前的状态
        
*/
define(function(require, exports, module) {
    
    function Bird (arr) {
        this.arr = arr;
        this.idx = parseInt(Math.random() * this.arr.length);
        this.fall = 0;
        this.temp = 0;
        this.state = "D";
    }
    
    Bird.prototype = {
        constructor: Bird,
    
        // 飞翔方法，煽动翅膀
        fly: function() {
            // 0 1 2 0 1 2
            this.idx ++;
            this.idx %= this.arr.length;
        },
    
        // 下落的方法
        drop: function() {
            if(this.state === "D") {
                this.temp ++;
                // console.log("下降："+this.temp, Math.sqrt(this.temp), this.fall);
                this.fall += Math.sqrt(this.temp);
            } else {
                this.temp --;
                // console.log("上升："+this.temp, Math.sqrt(this.temp), this.fall);
                if(this.temp === 0 || this.fall === 0) {
                    this.state = "D";
                }
                this.fall -= Math.sqrt(Math.abs(this.temp));
            }
        },
    
        // 用户点击
        click: function() {
            this.temp = 20;
            this.state = "U";
        }
    }

    module.exports = Bird;
})
