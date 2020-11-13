$(function () {
    const bodyElem = $('body');
    const callBtnElem = $('.js-btn_contact');
    const modalElem = $('.js-modal-contacts');
    const modalCloseBtnElem = $('.js-callback-close-btn');

    const callbackFormElem = $('.js-callback-input');
    const phoneInputElem = $('.js-callback-phone');
    const nameInputElem = $('.js-callback-name')

    // определение ширины скролла
    const paddingShift = (window.innerWidth - $(window).width()) + 'px';

    // вызов функции по клику на кнопке звонка
    callBtnElem.on('click', callBtnHandler);
    // функция-обработчик клика на кнопке звонка
    function callBtnHandler() {
        // добавляем <body> паддинг на величину скролла
        bodyElem.css('padding-right', paddingShift);
        // переключние класса на <body>, открываем окно
        bodyElem.toggleClass('open-modal');
        // передача фокуса на поле ввода имени
        setTimeout(function () {
            nameInputElem.focus();
        }, 1000);
        // навешивание обработчика события по клику на модальном окне
        modalElem.bind('click', modalCloseHandler);
        // навешивание обработчика по нажатию клавиши на <body>
        bodyElem.bind('keydown', keyEscHandler);
    }
    // функция-обрабочки клика на на модальном окне
    function modalCloseHandler(event) {
        if (
            modalCloseBtnElem.is(event.target) || // если клик на кнопке закрытия
            modalElem.is(event.target) // или вне окна формы обратной связи
        ) {
            closeModal();
        };
    }
    // функция-обрабочик нажатия клавиши Esc
    function keyEscHandler(event) {
        if (event.keyCode === 27) { // 27 - код клавиши esc, если она нажата, то
            closeModal();
        }
    }
    // функция закрытия модального окна
    function closeModal() {
        modalElem.unbind('click', modalCloseHandler); // снимаем обработчик клика с модального окна
        bodyElem.unbind('keydown', keyEscHandler); // снимаем обработчик нажатия ESC с body
        bodyElem.toggleClass('open-modal'); // переключаем класс на <body>
        bodyElem.attr('style', ''); // убираем стили навешенные при открытии
    }

    // маска для поля ввода телефона (модуль jquery.maskedinput)
    phoneInputElem.mask("+7 (999) 999-9999");

    // обработчик отправки формы
    callbackFormElem.submit(function () { // перехватываем все при событии отправки
        var form = $(this); // запишем в переменную чтобы потом не было проблем с this
        var error = false; // ставим переменную в false - предварительно ошибок нет

        form.find('input[required]').each(function () { // проходим по каждому обязательному для заполнения полю в форме
            if ($(this).val() == '') { // если находим пустое
                alert('Пожалуйста заполните поля в соответствии с указаниями!'); // уведомление о необходимости заполнить

                error = true; // ошибка
                console.log('ошибка');
            }
        });
        if (!error) { // если ошибки нет
            var data = form.serialize(); // подготавливаем данные

            $.ajax({ // инициализируем ajax запрос
                type: 'POST', // отправляем в POST формате
                url: 'mail.php', // путь до обработчика
                dataType: 'json', // ответ ждем в json формате
                data: data, // данные для отправки

                beforeSend: function (data) { // событие до отправки
                    form.find('input[type="submit"]').attr('disabled', 'disabled'); // отключим кнопку, чтобы не жали по 100 раз
                },

                success: function (data) { // событие после удачного обращения к серверу и получения ответа
                    if (data['error']) { // если обработчик вернул ошибку
                        alert(data['error']); // покажем её текст
                    } else { // если все прошло ок
                        alert('Письмо отправлено!'); // сообщаем что все ок

                        callbackFormElem[0].reset(); // очищаем поля формы
                    }
                },

                error: function (xhr, ajaxOptions, thrownError) { // в случае неудачного завершения запроса к серверу
                    alert(xhr.status); // покажем ответ сервера
                    alert(thrownError); // и текст ошибки
                },

                complete: function (data) { // событие после любого исхода
                    form.find('input[type="submit"]').prop('disabled', false); // в любом случае включим кнопку обратно
                }
            });

            closeModal();
        }
        return false; // отключаем стандартную отправку формы
    });

});
