'use strict';

const crypto = require('crypto');

const MorpherError = require('./src/error');
const Client = require('./src/client');
const Storage = require('./src/storage');
const Morpher = require('./src/morpher');

const EntityDeclension = require('./src/entity/declension');
const EntityName = require('./src/entity/name');
const EntityNumber = require('./src/entity/number');

function MorpherAPI(params, storage) {
    if (params && params instanceof Storage) {
        storage = params;
        params = {};
    }
    this.morpher = new Morpher(new Client(params));
    this.setStorage(storage);
}
MorpherAPI.Storage = Storage;

MorpherAPI.prototype.setStorage = function (storage) {
    if (!storage) storage = new Storage();
    if (!(storage instanceof Storage)) throw new MorpherError('Storage object must be instance of morpher.Storage');
    this.storage = storage;
};

MorpherAPI.prototype.hash = function (value) {
    return crypto.createHash('sha256').update(value).digest('hex');
};

MorpherAPI.prototype.declension = function (text) {
    return new Promise((resolve, reject) => {
        let value = text.trim();
        if (!value.length) return reject(new MorpherError(`Ошибка запроса: "${text}"`));
        let hash = this.hash(value.toLowerCase());

        this.storage.get('text', hash).then(
            result => {
                if (result) {
                    resolve(new EntityDeclension(result, true));
                } else {
                    this.morpher.declension(value).then(
                        result => this.storage.set('text', hash, result).then(
                            result => resolve(new EntityDeclension(result)),
                            error => reject(error)
                        ),
                        error => reject(error)
                    )
                }
            },
            error => reject(error)
        )
    });
};

MorpherAPI.prototype.declensionName = function (name) {
    return new Promise((resolve, reject) => {
        name = this.morpher.fullName(name);
        if (!name.length || name.indexOf(' ') === -1) return reject(new MorpherError(`Ошибка запроса: "${name}"`));
        let hash = this.hash(name);

        this.storage.get('name', hash).then(
            result => {
                if (result) {
                    resolve(new EntityName(result, true));
                } else {
                    this.morpher.declensionName(name).then(
                        result => this.storage.set('name', hash, result).then(
                            result => resolve(new EntityName(result)),
                            error => reject(error)
                        ),
                        error => reject(error)
                    );
                }
            },
            error => reject(error)
        );
    });
};

MorpherAPI.prototype.declensionNumber = function (number, unit) {
    return new Promise((resolve, reject) => {
        let value = this.morpher.prepareNumber(number, unit);
        if (isNaN(value.number)) return reject(new MorpherError(`Ошибка запроса: ${number} is NaN`));
        if (value.number < 0) return reject(new MorpherError(`Ошибка запроса: ${number} < 0`));
        let hash = this.hash(value.unit + value.number.toString());

        this.storage.get('number', hash).then(
            result => {
                if (result) {
                    resolve(new EntityNumber(result, true));
                } else {
                    this.morpher.declensionNumber(value).then(
                        result => this.storage.set('number', hash, result).then(
                            result => resolve(new EntityNumber(result)),
                            error => reject(error)
                        ),
                        error => reject(error)
                    );
                }
            },
            error => reject(error)
        );
    });
};

module.exports = MorpherAPI;
