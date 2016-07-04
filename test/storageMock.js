'use strict';

const util = require('util');
const Storage = require('../src/storage');

function StorageMock(on) {
    this.storage = {
        text: {},
        name: {},
        number: {}
    };
    this.on = on;
}
util.inherits(StorageMock, Storage);

StorageMock.prototype.get = function (type, hash) {
    if (this.on == 'get') {
        return new Promise((resolve, reject) => {
            reject(new Error('Storage error'));
        });
    }
    return new Promise((resolve, reject) => {
        resolve(this.storage[type][hash] || null);
    });
};

StorageMock.prototype.set = function (type, hash, value) {
    if (this.on == 'set') {
        return new Promise((resolve, reject) => {
            reject(new Error('Storage error'));
        });
    }
    return new Promise((resolve, reject) => {
        value.hash = hash;
        this.storage[type][hash] = value;
        resolve(value);
    });
};

StorageMock.prototype.contains = function (type, hash) {
    return new Promise((resolve, reject) => {
        resolve(this.storage[type][hash] ? true : false);
    });
};

module.exports = StorageMock;
