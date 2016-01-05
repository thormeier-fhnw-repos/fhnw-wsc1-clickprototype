function Todo (text, done) {
    this.text = text;
    this.done = done;
}
Todo.prototype.renderTodo = function (index) {
    var listItem = $('<li/>');
    listItem.addClass('fhnw-todos-todo');

    var checkBox = $('<input/>');
    checkBox.addClass('fhnw-todos-todo-checkbox')
        .attr('type', 'checkbox')
        .attr('id', 'todo_' + index);

    if (this.done) {
        checkBox.attr('checked', 'checked');
    }

    var label = $('<label/>');
    label.attr('for', 'todo_' + index).html(this.text);

    listItem.append(checkBox).append(label);

    return $('<div>').append(listItem).html();
};

function TodoStorage (storage) {
    this.storage = storage;
    this.key = 'todos';
}
TodoStorage.prototype.save = function (todo) {
    var all = this.loadAll();
    console.log(all);

    for (var i = 0; i < all.length; i++) {
        if (all[i].text === todo.text) {
            all[i] = todo;
            this.saveAll(all);

            return this;
        }
    }

    all.push(todo);
    this.saveAll(all);

    return this;
};
TodoStorage.prototype.loadAll = function () {
    var data;
    try {
        data = JSON.parse(this.storage.getItem(this.key));
    } catch (error) {
        data = [];
    }

    var parsedData = [];

    for (var i = 0; i < data.length; i++) {
        parsedData.push(new Todo(data[i].text, data[i].done));
    }

    return parsedData;
};
TodoStorage.prototype.saveAll = function (all) {
    this.storage.setItem(this.key, JSON.stringify(all));
};
TodoStorage.prototype.deleteAll = function () {
    this.saveAll([]);

    return this;
};
