
Vue.component('swiper', {
    data: function () {
        return {
            currentIndex: 1, //当前幻灯片下标
            currentWidth: document.body.clientWidth, //当前幻灯片宽度
            currentLeft: 0, //优先偏移数
            currentInterval: 0, //当前计时器ID
            currentTimeout: 0, //当前计时器ID
            currentStatus: 'move', //当前状态
            currentDrug: { //当前拖拽
                currentX: 0,
                startX: 0,
                endX: 0,
                startTime: 0,
                endTime: 0
            },
            options: { //设置
                autoPlay: true,
                speed: 3000 //ms
            },
            slideStatus: { //轮播状态
                normal: { //静止
                    'swiper-list': true
                },
                move: { //过渡动画
                    'swiper-list': true,
                    'swiper-transition': true
                }
            },
            slides: [ //轮播图片
                {id: "6a4e6879b8e44c748894bc0e6b71cc21", src: "img/img_test_1.jpg"},
                {id: "db96fdc0057e43a3bff145d1de0b53b9", src: "img/img_test_2.jpg"},
                {id: "f37897928229442285a9f0b2e8be547d", src: "img/img_test_3.jpg"},
                {id: "3661566005924585867cd68470931aa9", src: "img/img_test_4.jpg"},
                {id: "485fba24b7684479881250c88c48bd6d", src: "img/img_test_5.jpg"},
                {id: "032648f467dc42f99ac789089234369a", src: "img/img_test_6.jpg"}
            ]
        }
    },
    template: '<div class="swiper">' +

                    /** 轮播图片 **/
                    '<div :class="slideStatus[currentStatus]" :style="swiperListStyle" @touchstart.prevent="touchStart" @touchmove.prevent="touchMove" @touchend.prevent="touchEnd" @mousedown.prevent="mouseStart">' +
                        '<img class="swiper-item" :src="item.src" :style="swiperItemStyle" v-for="item in currentSlides"/>' +
                    '</div>' +

                    /** 轮播控制 **/
                    '<div class="swiper-control">' +
                        '<div :class="swiperControlClass(item)" v-for="(item, index) in slides" @click="skipIndex(index)"></div>' +
                    '</div>' +

              '</div>',
    computed: {
        //新轮播图数组，前后加入多一张图片做效果切换
        currentSlides: function () {
            var self = this;
            var array = [];

            if(self.slides.length > 1){
                array.push(self.slides[self.slides.length - 1]);

                for(var i = 0; i < self.slides.length; i++){
                    array.push(self.slides[i]);
                }

                array.push(self.slides[0]);
            }else{
                self.options.autoPlay = false;
                self.currentIndex = 0;
                array = self.slides;
            }

            return array;
        },
        //轮播列表样式
        swiperListStyle: function () {
            var self = this;
            return {
                width: self.currentWidth * self.currentSlides.length + 'px', //轮播图总长度
                left:  (self.currentLeft || ("-" + (self.currentIndex * self.currentWidth))) + "px" //如果没有指定偏移，就自动计算偏移
            };
        },
        //轮播项样式
        swiperItemStyle: function () {
            var self = this;
            return {width: self.currentWidth + 'px'}; //单屏宽度
        }
    },
    methods: {
        //当前轮播偏移量
        currentDeviation: function () {

            var dom = document.querySelector(".swiper-list");
            var right = window.getComputedStyle(dom).getPropertyValue("left");

            return right;
        },
        //轮播控制类名
        swiperControlClass: function (item) {

            var self = this;
            var slide = self.currentSlides[self.currentIndex];

            return {
                'swiper-control-item': true,
                'swiper-transition': true,
                'swiper-control-active': slide && item.id == slide.id
            };
        },
        //启动轮播
        startPlay: function () {

            var self = this;

            if(self.options.autoPlay && !self.currentInterval){

                self.currentStatus = 'move';

                self.currentInterval = setInterval(function () {

                    self.currentStatus = 'move';

                    self.currentIndex++;

                }, self.options.speed)
            }

        },
        //停止轮播
        stopPlay: function () {

            var self = this;

            if(self.currentInterval){
                clearTimeout(self.currentTimeout);
                clearInterval(self.currentInterval);
                self.currentInterval = 0; //清空当前id
            }

        },
        //跳转轮播位置
        skipIndex: function (index) {
            var self = this;

            self.stopPlay();

            self.currentIndex = index + 1;

            self.startPlay();
        },
        //开始触屏
        touchStart: function (e) {
            var self = this;
            //如果是触屏事件，且只允许单手操作
            if(e.type == 'touchstart' && e.changedTouches && e.changedTouches.length == 1){
                self.dragStart(e, e.changedTouches[0].clientX)
            }
        },
        //触屏移动
        touchMove: function (e) {
            var self = this;
            //如果是触屏事件，且只允许单手操作
            if(e.type == 'touchmove' && e.changedTouches && e.changedTouches.length == 1){
                self.dragMove(e, e.changedTouches[0].clientX)
            }
        },
        //触屏结束
        touchEnd: function (e) {
            var self = this;
            //如果是触屏事件，且只允许单手操作
            if(e.type == 'touchend' && e.changedTouches && e.changedTouches.length == 1){
                self.dragEnd(e, e.changedTouches[0].clientX)
            }
        },
        //鼠标按下
        mouseStart: function (e) {
            var self = this;
            // 如果是鼠标事件
            if(e.type == 'mousedown'){
                self.dragStart(e, e.clientX)
                document.onmousemove = function (e) {self.mouseMove(e);}; //绑定全局鼠标移动事件
                document.onmouseup = function (e) {self.mouseEnd(e);}; //绑定全局鼠标起来事件
            }
        },
        //鼠标移动
        mouseMove: function (e) {
            var self = this;
            // 如果是鼠标事件
            if(e.type == 'mousemove'){
                self.dragMove(e, e.clientX)
            }
        },
        //鼠标提起
        mouseEnd: function (e) {
            var self = this;
            // 如果是鼠标事件
            if(e.type == 'mouseup'){
                self.dragEnd(e, e.clientX);
                document.onmousemove = function () {}; //清空全局鼠标移动事件
                document.onmouseup = function () {}; //清空全局鼠标起来事件
            }
        },
        //开始拖拽
        dragStart: function (e, startX) {

            var self = this;

            if(!self.currentTimeout && self.options.autoPlay){
                var deviation = parseFloat(self.currentDeviation().replace(/px/g, ""));

                self.stopPlay(); //恢复轮播
                self.currentDrug.currentX = deviation; //当前偏移数
                self.currentDrug.startX = startX;
                self.currentDrug.startTime = new Date().getTime();
            }

        },
        //拖拽移动
        dragMove: function (e, moveX) {

            var self = this;

            if(!self.currentInterval){

                var left = self.currentDrug.currentX + (moveX - self.currentDrug.startX);

                if(left < 0 && left > - (self.currentSlides.length - 1) * self.currentWidth){
                    self.currentLeft = left;
                }

            }

        },
        //结束拖拽
        dragEnd: function (e, endX) {

            var self = this;
            var posX = - self.currentLeft % self.currentWidth;
            var index = posX > self.currentWidth / 2 ? - parseInt(self.currentLeft / self.currentWidth) + 1 : - parseInt(self.currentLeft / self.currentWidth);

            self.currentDrug.endX = endX;
            self.currentDrug.endTime = new Date().getTime();

            var time = self.currentDrug.endTime - self.currentDrug.startTime;

            if(time < 300){ //短时间滑动
                if(self.currentDrug.startX - self.currentDrug.endX < 0){
                    self.currentIndex = self.currentIndex - 1;  //左移，下一张
                }else if(self.currentDrug.startX - self.currentDrug.endX > 0){
                    self.currentIndex = self.currentIndex + 1; //右移，上一张
                }else{
                    self.click(self.currentIndex); //点击图片
                }
            }else{ //长时间滑动
                self.currentIndex = index;
            }

            self.startPlay(); //恢复轮播

            self.currentLeft = 0; //清空优先偏移数

        },
        //点击图片
        click: function (index) {
            console.log("点击", index);
        }
    },
    watch: {
        currentIndex : function (val) { //用于流畅过渡

            var self = this;

            if(self.options.autoPlay){
                if(val == self.currentSlides.length - 1){ //如果轮播到最后一个，自动切换到第一张图片

                    clearTimeout(self.currentTimeout);

                    self.currentTimeout = setTimeout(function () {

                        self.currentStatus = 'normal';
                        self.currentIndex = 1;
                        self.currentTimeout = 0; //清空当前id

                    }, 300)

                }else if(val == 0){ //如果轮播到第一个，自动切换到最后一张

                    clearTimeout(self.currentTimeout);

                    self.currentTimeout = setTimeout(function () {

                        self.currentStatus = 'normal';
                        self.currentIndex = self.currentSlides.length - 2;
                        self.currentTimeout = 0; //清空当前id

                    }, 300)

                }
            }
        }
    },
    mounted: function(){
        var self = this;
        self.currentWidth = document.querySelector('.swiper').clientWidth;
        window.onresize = function (){ self.currentWidth = document.querySelector('.swiper').clientWidth; };
        self.startPlay();
    }
});
