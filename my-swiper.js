/**
 * Created by LJH on 2017/1/18.
 */

Vue.component('swiper', {
    data: function () {
        return {
            currentIndex: 0,
            currentWidth: document.body.clientWidth,
            currentStatus: "normal",
            slideStatus: {
                enter: {
                    "swiper-list": true,
                    "swiper-list-enter": true
                },
                normal: {
                    "swiper-list": true,
                    "swiper-transition": true
                }
            },
            slides: [
                {src: "img_test_1.jpg"},
                {src: "img_test_2.jpg"},
                {src: "img_test_3.jpg"},
                {src: "img_test_4.jpg"},
                {src: "img_test_5.jpg"},
                {src: "img_test_6.jpg"}
            ]
        }
    },
    template: '<div class="swiper">' +
                    '<div :style="swiperListStyle" :class="slideStatus[currentStatus]">' +
                        '<img class="swiper-item" v-for="item in currentSlides" :src="item.src" :style="swiperItemStyle"/>' +
                    '</div>' +
              '</div>',
    computed: {
        currentSlides: function() {
            var self = this;
            var array = [];
            var previous = self.currentIndex == 0 ? self.slides.length - 1 : self.currentIndex - 1;
            var next = self.currentIndex == self.slides.length - 1 ? 0 : self.currentIndex + 1;

            array.push(self.slides[next]);
            array.push(self.slides[self.currentIndex]);
            array.push(self.slides[previous]);

            console.log(previous, self.currentIndex, next);

            return array;
        },
        swiperListStyle: function() {
            var self = this;
            return { width: self.currentWidth * 3 + "px" }
        },
        swiperItemStyle: function() {
            var self = this;
            return { width: self.currentWidth + "px" }
        }
    },
    methods: {

    },
    mounted: function(){
        var self = this;
        self.currentWidth = document.querySelector(".swiper").clientWidth;
    },
    created: function () {
        var self = this;

        setInterval(function () {

            if(self.currentIndex == self.slides.length - 1){
                self.currentIndex = 0;
            }else {
                self.currentIndex++;
            }

            self.currentStatus = "enter";

            setTimeout(function(){
                self.currentStatus = "normal";
            }, 20)

        }, 3000)

    }
});
