var todoStorage = new TodoStorage(localStorage);
var todo1 = new Todo('Thesenpapier 1', false);
var todo2 = new Todo('Prototyp 1', true);
var todo3 = new Todo('Prototyp 2', false);

todoStorage.deleteAll().save(todo1).save(todo2).save(todo3);

var appointmentStorage = new AppointmentStorage(localStorage);
var appointment1 = new Appointment('Prüfung 1', 10, 'red', '6.0D21');
var appointment2 = new Appointment('Prüfung 2', 14, 'blue', '6.2D12');

appointmentStorage.deleteAll().save(appointment1).save(appointment2);

var appointmentTempData = {
    'text': '',
    'hour': 'HH',
    'place': '',
    'color': 'red'
};

$(document).ready( function () {

    $('.fhnw-nav-tabs-tab').click( function () {
        $('.fhnw-nav-tabs-tab.active').removeClass('active');
        $(this).addClass('active');
    });

    $('.fhnw-page[data-id="todos"]').on('fhnw-show', function () {
        var todoList = '',
            todos = todoStorage.loadAll();

        for (var i = 0; i < todos.length; i++) {
            todoList += todos[i].renderTodo(i);
        }

        $(this).find('.fhnw-todos-list').html(todoList);
    });

    $('.fhnw-page[data-id="calendar-day"]').on('fhnw-show', function () {
        var markupStart = '<tr><td>',
            markupEnd = '</td> <td><hr></td></tr>';

        var mainMarkup = '';

        for (var i = 0; i <= 24; i += 2) {
            mainMarkup += markupStart + i + ':00' + markupEnd + markupStart +  markupEnd;
        }

        $('.fhnw-calendar-day').html(mainMarkup);

        var appointments = appointmentStorage.loadAll();

        for (i = 0; i < appointments.length; i++) {
            $(this).append(appointments[i].render());
        }
    });

    $('body').on('change', '.fhnw-todos-todo-checkbox', function () {
        todoStorage.save(new Todo($(this).next('label').text(), $(this).is(':checked')));
    }).on('click', '[data-submit]', function () {
        switch ($(this).data('submit')) {
            case 'fhnw-todo-textinput':
                var input = $('#fhnw-todo-textinput');
                todoStorage.save(new Todo(input.val(), false));
                input.val('');
                $('[data-target="todos"]').trigger('click');
                return;
            case 'fhnw-appointment':
                var inputText = $('.fhnw-input[data-input="title"]'),
                    inputPlace = $('.fhnw-input[data-input="place"]'),
                    inputHour = $('.fhnw-input[data-input="hour"]'),
                    inputColor = $('.fhnw-input[data-input="color"]');

                appointmentStorage.save(new Appointment(inputText.val(), inputHour.val(), inputColor.val(), inputPlace.val()));
                $('[data-target="calendar-day"]').trigger('click');
                return;
        }
    }).on('click', '.fhnw-day-appointment', function () {
        appointmentTempData.text = $(this).data('text');
        appointmentTempData.hour = $(this).data('hour');
        appointmentTempData.place = $(this).data('place');
        appointmentTempData.color = $(this).data('color');
    }).on('click', '[data-target]', function () {
        var id = $(this).data('target'),
            page = $('.fhnw-page[data-id="' + id + '"]');

        $('.fhnw-subnav').addClass('hidden');
        $('.fhnw-subnav[data-id="nav-' + id + '"]').removeClass('hidden');
        $('.fhnw-page').addClass('hidden');
        page.removeClass('hidden');
        page.trigger('fhnw-show');

        $('.fhnw-input[data-input="title"]').val(appointmentTempData.text);
        $('.fhnw-input[data-input="place"]').val(appointmentTempData.place);
        $('.fhnw-input[data-input="color"]').val(appointmentTempData.color);
        $('.fhnw-input[data-input="hour"]').val(appointmentTempData.hour);

        appointmentTempData = {
            'text': '',
            'hour': 'HH',
            'place': '',
            'color': 'red'
        };
    });
});

function noop() {}