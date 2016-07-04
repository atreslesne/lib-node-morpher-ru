'use strict';

const MorpherError = require('./error');

function Storage() {
    this.data = {
        text: {},
        name: {},
        number: {}
    };
}

Storage.prototype.get = function (type, hash) {
    return new Promise((resolve, reject) => {
        if (!this.data[type]) {
            reject(new MorpherError('Неподдерживаемый тип данных: ' + type));
        } else if (this.data[type][hash]) {
            resolve(this.data[type][hash]);
        } else {
            resolve(null);
        }
    });
};

Storage.prototype.set = function (type, hash, value) {
    return new Promise((resolve, reject) => {
        if (!this.data[type]) {
            reject(new MorpherError('Неподдерживаемый тип данных: ' + type));
        } else {
            value.hash = hash;
            this.data[type][hash] = value;
            resolve(value);
        }
    });
};

Storage.prototype.contains = function (type, hash) {
    return new Promise((resolve, reject) => {
        if (!this.data[type]) {
            reject(new MorpherError('Неподдерживаемый тип данных: ' + type));
        } else {
            resolve(this.data[type][hash] ? true : false);
        }
    });
};

module.exports = Storage;
