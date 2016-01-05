function Appointment (text, hour, color, place) {
    this.text = text;
    this.hour = hour;
    this.color = color;
    this.place = place;
}
Appointment.prototype.render = function () {
    var markup = $('<div/>');
    markup.text(this.text + ' (' + this.place + ')')
        .addClass('fhnw-day-appointment')
        .addClass('fhnw-day-appointment-' + this.color)
        .css('top', (151 + (this.hour * 41)) + 'px')
        .attr('data-text', this.text)
        .attr('data-hour', this.hour)
        .attr('data-color', this.color)
        .attr('data-place', this.place)
        .attr('data-target', 'createedit-appointment')
    ;

    return $('<div/>').append(markup).html();
};

function AppointmentStorage (storage) {
    this.storage = storage;
    this.key = 'appointments';
}
AppointmentStorage.prototype.deleteAll = function () {
    this.saveAll([]);

    return this;
};
AppointmentStorage.prototype.loadAll = function () {
    var data,
        parsedData = [];

    try {
        data = JSON.parse(this.storage.getItem(this.key));
    } catch (error) {
        data = [];
    }

    for (var i = 0; i < data.length; i++) {
        parsedData.push(new Appointment(data[i].text, data[i].hour, data[i].color, data[i].place));
    }

    return parsedData;
};
AppointmentStorage.prototype.saveAll = function (all) {
    this.storage.setItem(this.key, JSON.stringify(all));
};
AppointmentStorage.prototype.save = function (appointment) {
    var all = this.loadAll();

    for (var i = 0; i < all.length; i++) {
        if (all[i].text === appointment.text) {
            all[i] = appointment;
            this.saveAll(all);

            return this;
        }
    }

    all.push(appointment);
    this.saveAll(all);

    return this;
};