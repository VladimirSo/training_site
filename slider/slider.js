const slider = document.querySelector('.swiper-container');

let mySwiper = new Swiper(slider, {
    preventClicks: true,
    slideToClickedSlide: true,
    loop: true,
    breakpoints: {
        // when window width is >= 320px
        320: {
            slidesPerView: 1,
            spaceBetween: 20
        },

        // when window width is >= 768px
        768: {
            slidesPerView: 2,
            spaceBetween: 35
        },

        // when window width is >= 1200px
        1200: {
            slidesPerView: 3,
            spaceBetween: 30
        },
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
})
