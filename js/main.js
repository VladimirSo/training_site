$(function () {
    const bodyElem = $('body');
    const headerTopElem = $('.js-main-header-top');
    const menuElem = $('.js-nav-list');
    const mobMenuBtnElem = $('.js-mobile-nav-btn');
    const promoElem = $('.js-promo-container');

    // величина скролла
    const paddingShift = (window.innerWidth - $(window).width()) + 'px';

    // вызов функции перехода по якорям
    menuElem.on('click', 'a', slideToAnchor);
    bodyElem.on('click', '.btn', slideToAnchor);
    // вызов функции обработчика клика на кнопке моб.меню
    mobMenuBtnElem.on('click', mobMenuBtnHandler);

    function slideToAnchor(event) {
        // получаем идентификатор блока с атрибута href нажатой ссылки меню
        const anchor = $(this).attr('href');

        if (
            typeof anchor !== 'undefined' && // проверяем что переменная определена, что у элемента есть атрибут href
            anchor !== '#' // проверяем что это ссылка на якорь, что href не равен просто #
        ) {
            // узнаем высоту от начала страницы до блока на который ссылается якорь
            const top = $(anchor).offset().top;
            // анимированный переход на расстояние равное top за 1000 мс
            $('body,html').animate({
                scrollTop: top
            }, 1000);
            // если переход к якорю был из мобильного меню, то
            if (headerTopElem.hasClass('open-mob-menu')) {
                headerTopElem.removeClass('open-mob-menu'); // закрываем меню
                cleaning();
            }
        }
    }
    // функция открытия/закрытия моб.меню 
    function mobMenuBtnHandler() {
        // ставим у боди паддинг на величину скролла и запрет скролла
        bodyElem.css({
            'padding-right': paddingShift,
            'overflow': 'hidden'
        });
        // фиксация высоты контролируемого блока
        headerTopElem.css('min-height', headerTopElem.outerHeight());
        // задаем позицию на которой откроется меню
        mobMenuBtnElem.parent().css({
            'top': mobMenuBtnElem.offset().top,
            'left': mobMenuBtnElem.offset().left
        })
        // открываем/закрываем моб.меню
        headerTopElem.toggleClass('open-mob-menu');
        // если нажатие кнопки закрыло меню убираем навешанное
        if (!headerTopElem.hasClass('open-mob-menu')) {
            cleaning();
        }
    }

    // уборка стилей с элементов после закрытия моб.меню
    function cleaning() {
        mobMenuBtnElem.parent().attr('style', '');
        headerTopElem.attr('style', '');
        bodyElem.attr('style', '');
    }

    //закрытие моб.меню после ресайза окна
    $(window).on('resize', function () {
        headerTopElem.removeClass('open-mob-menu');
        cleaning();
    });

    //реализация летающих тэгов на блоке promo
    $(window).on('scroll', function () {
        //если (величина отступа прокрутки сверху + высота окна) больше или равна (координата от начала окна до блока promo + высота блока promo)
        if (($(window).scrollTop() + $(window).height()) >= (promoElem.offset().top + promoElem.outerHeight())) {
            promoElem.css({ //применяем стили реализующие движение тэгов
                'background-position': 'center center',
                'background-size': '0px 0px'
            });
            //если (величина отступа прокрутки сверху + высота окна) меньше чем координата от начала окна до блока promo
        } else if (($(window).scrollTop() + $(window).height()) < promoElem.offset().top) {
            promoElem.attr('style', ''); //снимаем стили примененные к блоку promo
        }
    });

});
