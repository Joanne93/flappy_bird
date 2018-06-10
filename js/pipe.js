/*
	Author: Joanne
	Date: 2018-05-07
	Description: 描述管子类
    属性：
        pipe_up: 上管子
        pipe_down: 下管子
        interval: 管子之间的间隙
        up_length：上管子长度
        down_length：下管子长度
        speed：移动速度
        step：移动的距离
        isScore: 当前管子是否被小鸟穿过
    
*/

define(function(require, exports, module) {

    function Pipe(pipe_up, pipe_down, speed) {
        this.pipe_up = pipe_up;
        this.pipe_down = pipe_down;
        this.interval = 150;
        this.up_length = (Math.random() * 248) + 1;
        this.down_length = 250 - this.up_length;
        this.speed = speed;
        this.step = 0;
        this.isScore = false;
    }
    
    Pipe.prototype = {
        constructor: Pipe,
    
        // 管子移动方法
        move: function() {
            this.step ++;
        },
    
        // 创建管道
        create: function() {
            return new Pipe(this.pipe_up, this.pipe_down, 3);
        }
    }

    module.exports = Pipe;
})
