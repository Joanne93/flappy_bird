/*
	Author: Joanne
	Date: 2018-05-07
	Description: 描述游戏类
    属性：
        ctx: canvas的上下文
        bg: 背景
        land: 地面
        bird: 小鸟
        pipe: 管道 :是一个数组
        timer: 开始的定时器
        count： 用来减慢创建管子速度和小鸟煽动翅膀的速度
        score: 用来记录得分
        numArr： 得分数字数组
        game_over: 结束游戏提示
        isOver: 游戏结束标志
        lock: 用来节流。不能连续点击开始
        tutorial: 开始页面的图片
        top: 开始图片的y值
*/
define(function(require, exports, module) {

    function Game(ctx,bg, land, bird, pipe, numArr, game_over, tutorial) {
        this.ctx = ctx;
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;
        this.bg = bg;
        this.land = land;
        this.bird = bird;
        this.pipe = [pipe];
        this.timer = null;
        this.count = 0;
        this.score = 0;
        // this.isScore = false;
        this.numArr = numArr;
        this.game_over = game_over;
        this.isOver = false;
        this.lock = true;
        this.tutorial = tutorial;
        this.top = 0;
    }
    
    Game.prototype = {
        constructor: Game,
    
        // 初始化方法
        init: function() {
            this.renderBg();
            this.renderLand();
            this.renderPipe();
            // this.renderBird();
            this.renderStart();
        },
        // 渲染开始页面
        renderStart: function() {
            // 由于这里开始图片有一个下落的状态，所以也是使用的定时器
            var that = this;
            this.bindStartEvent();
            this.timer = setInterval(function() {
                that.clear();
                that.top ++;
                that.renderBg();
                that.renderLand();
                that.renderShadow();
                // 忽闪忽闪效果
                if(!(that.top % 20 > 10)) {
                    // console.log(that.top);
                    that.renderTutorial();
                }
            },10);
            
        },
        // 渲染导航
        renderTutorial: function() {
            this.ctx.drawImage(this.tutorial, (this.width-this.tutorial.width)/2, this.top > 200 ? 200: this.top);
        },
        // 点击开始事件
        bindStartEvent: function() {
            var that = this;
            this.ctx.canvas.onclick = function(e) {
                var x = e.offsetX;
                var y = e.offsetY;
                if(x > (that.width-that.tutorial.width)/2 && x < (that.width-that.tutorial.width) / 2 + that.tutorial.width && y > (that.top > 200 ? 200 : that.top) && y < (that.top > 200 ? 200: that.top) + that.tutorial.height ){
                    clearInterval(that.timer);
                    that.start();
                }
            }
        },
        // 清屏
        clear: function() {
            this.ctx.clearRect(0, 0, this.width, this.height);
        },
        // 开始
        start: function() {
            this.bindEvent();
            if(! this.lock) {
                return;
            }
            this.lock = false;
            var that = this;
    
            that.timer = setInterval(function() {
                that.isOver = false;
                that.count ++;
                that.clear();
                that.bg[0].move();
                that.land.move();
                that.pipeMove();
                if(!(that.count % 80)) {
                    that.create();
                }
                if(!(that.count % 5)) {
                    that.bird.fly();
                }
                that.bird.drop();
                that.checkBird();
                that.recordSocre();
                that.renderBg(); 
                that.renderLand();
                that.renderPipe();
                that.renderBird();
                that.renderScore();
                if( that.isOver) {
                    that.renderShadow();
                    that.renderOver();
                }
            }, 20)
    
        },
        // 1、渲染背景图方法 
        renderBg: function() {
            // 3 *1   4 *2   5 *3  6 *4
            this.ctx.drawImage(this.bg[0].img, 0 - this.bg[0].speed * this.bg[0].step  % (this.bg[0].img.width*4), 0);
            this.ctx.drawImage(this.bg[0].img, this.bg[1].img.width - (this.bg[0].speed * this.bg[0].step ) % (this.bg[0].img.width*4), 0);
            this.ctx.drawImage(this.bg[1].img, this.bg[1].img.width * 2 - (this.bg[0].speed * this.bg[0].step ) % (this.bg[0].img.width*4), 0);
            this.ctx.drawImage(this.bg[1].img, this.bg[1].img.width * 3 - (this.bg[0].speed * this.bg[0].step ) % (this.bg[0].img.width*4), 0);
            this.ctx.drawImage(this.bg[0].img, this.bg[0].img.width * 4 - 0 - this.bg[0].speed * this.bg[0].step  % (this.bg[0].img.width*4), 0);
            this.ctx.drawImage(this.bg[0].img, this.bg[0].img.width * 5 - 0 - this.bg[0].speed * this.bg[0].step  % (this.bg[0].img.width*4), 0);
        },
        // 2、渲染地面
        renderLand: function() {
            this.ctx.drawImage(this.land.img, 0 - (this.land.speed * this.land.step) % this.land.img.width, 400);
            this.ctx.drawImage(this.land.img, this.land.img.width - (this.land.speed * this.land.step) % this.land.img.width, 400);
            this.ctx.drawImage(this.land.img, this.land.img.width * 2 - (this.land.speed * this.land.step) % this.land.img.width, 400);
        },
        // 3、渲染管子
        renderPipe: function() {
            var that = this;
            that.pipe.forEach(function(item, index, array) {
                that.ctx.drawImage(item.pipe_up, 0, item.pipe_up.height - item.up_length, item.pipe_up.width, item.up_length, that.width - item.speed * item.step, 0, item.pipe_up.width, item.up_length);
                that.ctx.drawImage(item.pipe_down, 0, 0, item.pipe_down.width, item.down_length, that.width - item.speed * item.step, 150 + item.up_length, item.pipe_down.width, item.down_length);
            })
        },
        // 4、管子移动
        pipeMove: function() {
            var that = this;
            this.pipe.forEach(function(item, index, array) {
                item.move();
                // 检测管子是不是出去了
                if(item.speed * item.step > that.width + item.pipe_up.width) {
                    that.pipe.shift();
                }
            }) 
        },
        // 5、创建管子
        create: function() {
            this.pipe.push(this.pipe[0].create());
        },
        // 6、渲染小鸟 同时小鸟旋转
        renderBird: function() {
            this.ctx.save();
            this.ctx.translate(100, 100 + this.bird.fall);
            var deg = Math.PI / 180;    //**
            this.ctx.rotate( this.bird.state === "D" ? Math.sqrt(this.bird.fall) * deg : -Math.sqrt(this.bird.fall) * deg);
            this.ctx.drawImage(this.bird.arr[this.bird.idx], -24, -24);
            this.ctx.restore(); 
        },
        // 7、键盘按下小鸟上升  ***
        bindEvent: function() {
            var that = this;
            document.onkeydown = function(e) {
                if(e.keyCode === 32) {
                    that.bird.click();
                }else {
                    console.log("请按空格键");
                }
            }
        },
        // 8、检测小鸟是否撞到柱子或者地面
        checkBird: function() {
            this.ctx.save();
            this.clear();
            this.renderPipe();
            this.renderLand();
            this.ctx.globalCompositeOperation =  "source-in";
            this.renderBird();
            var data = this.ctx.getImageData(100-24, 0, 100+24, 512);
            // console.log(data);
            this.ctx.restore();
            for(var i = 0; i < data.data.length; i++) {
                if(data.data[i]) {
                    console.log("哎哟，撞死了吧！");
                    this.stop();
                    break;
                }
            }
        },
        // 9、记录得分
        recordSocre: function() {
            var pipe_r = this.width - this.pipe[0].speed * this.pipe[0].step + this.pipe[0].pipe_up.width;
            var bird = 100-24;
            // console.log(pipe_l, pipe_r, bird);
            if(bird > pipe_r && this.pipe[0].isScore == false) {
                this.score ++;
                this.pipe[0].isScore = true;
                /* this.pipe.forEach(function(item, index, array) {
                    item.move();
                }) */
                console.log("当前分数：" + this.score);
            }
        },
        // 10、渲染得分
        renderScore: function() {
            this.ctx.fillStyle = "#fff";
            this.ctx.strokeStyle = "#000";
            this.ctx.lineWidth = 1.5;
            this.ctx.font = "bold 40px Verdana";
            this.ctx.shadowOffsetX = 6;
            this.ctx.shadowOffsetY = 6;
            this.ctx.shadowBlur = 6;
            this.ctx.shadowColor = "rgba(0, 0, 0, .5)";
            this.ctx.fillText("Score：", 10, 465);
            this.ctx.strokeText("Score：", 10, 465);
            var a = this.score;
            // 方法一
            /* var i = 0;
            while(a / 10) {
                i ++;
                var num  = parseInt(a % 10);
                // console.log(num);
                this.ctx.drawImage(this.numArr[num], 170 + (3-i) * 26, 430);
                a = parseInt(a / 10);
            } */
            // 方法二
            var that = this;
            that.score.toString().split("").forEach(function(item, index, array) {
                that.ctx.drawImage(that.numArr[item], 170 + index * 24 , 430);
            })
        },
        // 11、渲染阴影
        renderShadow: function() {
            this.ctx.fillStyle = "rgba(0,0,0,.2)";
            this.ctx.fillRect(0, 0, 360, 512);
        },
        // 12、渲染结束图片
        renderOver: function() {
            this.ctx.drawImage(this.game_over, this.width/2-102, this.height/2-27);
        },
        // 游戏结束
        stop: function() {
            clearInterval(this.timer);
            this.isOver = true;
            this.lock = true;
        },
        // 暂停
        pause: function() {
            clearInterval(this.timer);
            this.renderShadow();
            this.isOver = false;
            this.lock = true;
        },
        // 重新开始
        restart: function() {
            // 重置背景，地面，管子，小鸟，分数
            this.bg[0].speed = 4;
            this.bg[0].step = 0;
            this.land.speed = 4;
            this.land.step = 0;
            this.bird.fall = 0;
            this.bird.temp = 0;
            this.bird.idx = 0;
            this.score = 0;
            this.pipe.forEach(function(item) {
                item.speed = 0;
                item.step = 0;
            })
            this.start();
        },
    }

    module.exports = Game;
})




