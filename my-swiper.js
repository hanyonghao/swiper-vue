
Vue.component('swiper', {
    data: function () {
        return {
            currentIndex: 1, //当前幻灯片下标
            currentWidth: document.body.clientWidth, //当前幻灯片宽度
            currentInterval: 0, //当前计时器ID
            currentTimeout: 0, //当前计时器ID
            currentStatus: 'move',
            options: {
                autoPlay: true,
                speed: 3000 //ms
            },
            slideStatus: {
                normal: {
                    'swiper-list': true
                },
                move: {
                    'swiper-list': true,
                    'swiper-list-transition': true
                }
            },
            slides: [
                {id: "6a4e6879b8e44c748894bc0e6b71cc21", src: "img_test_1.jpg"},
                {id: "db96fdc0057e43a3bff145d1de0b53b9", src: "img_test_2.jpg"},
                {id: "f37897928229442285a9f0b2e8be547d", src: "img_test_3.jpg"},
                {id: "3661566005924585867cd68470931aa9", src: "img_test_4.jpg"},
                {id: "485fba24b7684479881250c88c48bd6d", src: "img_test_5.jpg"},
                {id: "032648f467dc42f99ac789089234369a", src: "img_test_6.jpg"}
            ]
        }
    },
    template: '<div class="swiper">' +
                    '<div :class="slideStatus[currentStatus]" :style="swiperListStyle">' +
                        '<img class="swiper-item" :src="item.src" :style="swiperItemStyle" v-for="item in currentSlides"/>' +
                    '</div>' +
                    '<div class="swiper-control">' +
                        '<div :class="swiperControlClass(item)" v-for="(item, index) in slides" @click="skipIndex(index)"></div>' +
                    '</div>' +
              '</div>',
    computed: {
        currentSlides: function () {
            var self = this;
            var array = [];

            array.push(self.slides[self.slides.length - 1]);

            for(var i = 0; i < self.slides.length; i++){
                array.push(self.slides[i]);
            }

            array.push(self.slides[0]);

            return array;
        },
        swiperListStyle: function () {
            var self = this;
            return {
                width: self.currentWidth * self.currentSlides.length + 'px',
                left: "-" + (self.currentIndex * self.currentWidth) + "px"
            }
        },
        swiperItemStyle: function () {
            var self = this;
            return {
                width: self.currentWidth + 'px',
                height: "100%"
            }
        }
    },
    methods: {
        currentDeviation: function () {

            var dom = document.querySelector(".swiper-list");
            var right = window.getComputedStyle(dom).getPropertyValue("left");

            return right;
        },
        swiperControlClass: function (item) {

            var self = this;
            var slide = self.currentSlides[self.currentIndex];

            return {
                'swiper-control-item': true,
                'swiper-control-active': slide && item.id == slide.id
            }
        },
        startPlay: function () {

            var self = this;

            if(self.options.autoPlay && !self.currentInterval){

                self.currentInterval = setInterval(function () {

                    self.currentStatus = 'move';

                    self.currentIndex++;

                }, self.options.speed)
            }

        },
        stopPlay: function () {

            var self = this;

            if(self.currentInterval){
                clearTimeout(self.currentTimeout);
                clearInterval(self.currentInterval);
                self.currentInterval = 0;
            }

        },
        skipIndex: function (index) {
            var self = this;

            self.stopPlay();

            self.currentIndex = index + 1;

            self.startPlay();
        }
    },
    watch: {
        currentIndex : function (val) {

            var self = this;

            if(val == self.currentSlides.length - 1){

                clearTimeout(self.currentTimeout);

                self.currentTimeout = setTimeout(function () {

                    self.currentStatus = 'normal';
                    self.currentIndex = 1;

                }, self.options.speed - 20)

            }else if(val == 0){

                clearTimeout(self.currentTimeout);

                self.currentTimeout = setTimeout(function () {

                    self.currentStatus = 'normal';
                    self.currentIndex = self.currentSlides.length - 2;

                }, self.options.speed - 20)

            }
        }
    },
    mounted: function(){
        var self = this;
        self.currentWidth = document.querySelector('.swiper').clientWidth;
        self.startPlay();
    }
});
