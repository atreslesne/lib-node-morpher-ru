'use strict';

const util = require('util');
const Entity = require('./entity');

function EntityNumber(data, cached, isPart) {
    EntityNumber.super_.apply(this, arguments);
    this.isPart = isPart;

    if (!isPart) {
        this.original = data;
        this.data = {};
        for (let key in data['number']) {
            /* istanbul ignore else */
            if (data['number'].hasOwnProperty(key) && key !== 'value') {
                this.data[key] = data['number'][key] + ' ' + data['unit'][key];
            }
        }
    }
}
util.inherits(EntityNumber, Entity);

EntityNumber.prototype.isPredefined = function (prop) {
    /* istanbul ignore else */
    if (typeof prop === 'string') {
        if (this.containsProperty(prop)) {
            return true;
        }
        if (!this.isPart && ['number', 'число', 'unit', 'единица измерения', 'value', 'значение'].includes(prop.toLowerCase())) {
            return true;
        }
    }
    return false;
};

EntityNumber.proxy = function (target, argumentsList) {
    return new Proxy(new target(...argumentsList), {
        get: function (target, prop) {
            if (typeof prop === 'string') {
                if (target.containsProperty(prop)) {
                    return target.getProperty(prop);
                }
                /* istanbul ignore else */
                if (!target.isPart) {
                    let key = prop.toLowerCase();
                    switch (key) {
                        case 'number':
                        case 'число':
                            return EntityNumber.proxy(EntityNumber, [target.original['number'], undefined, true]);
                        case 'unit':
                        case 'единица измерения':
                            return EntityNumber.proxy(EntityNumber, [target.original['unit'], undefined, true]);
                        case 'value':
                        case 'значение':
                            return target.original['value'];
                    }
                }
            }
            return target[prop];
        },

        set: function (target, prop, value) {
            if (target.isPredefined(prop)) {
                return false;
            }
            target[prop] = value;
            return true;
        },

        has: function (target, prop) {
            if (target.isPredefined(prop)) {
                return true;
            }
            return prop in target;
        },

        deleteProperty: function (target, prop) {
            if (target.isPredefined(prop)) {
                return false;
            }
            delete target[prop];
            return true;
        }
    });
};

module.exports = new Proxy(EntityNumber, {
    construct: function (target, argumentsList) {
        return EntityNumber.proxy(target, argumentsList);
    }
});
