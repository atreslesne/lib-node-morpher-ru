'use strict';

const util = require('util');
const Entity = require('./entity');

function EntityName(data, cached, isPart) {
    EntityName.super_.apply(this, arguments);
    this.isPart = isPart;
}
util.inherits(EntityName, Entity);

EntityName.prototype.part = function (index) {
    let data = {};
    for (let key in this.data) {
        if (['sex', 'parts'].includes(key)) continue;
        data[key] = this.data[key].split(' ')[index];
    }
    return EntityName.proxy(EntityName, [data, undefined, true]);
};

EntityName.proxy = function (target, argumentsList) {
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
                        case 'sex':
                        case 'пол':
                            if (target.data['sex']) return target.data['sex'];
                            break;
                        case 'firstname':
                        case 'first':
                        case 'имя':
                            if (target.data['parts']['first'] > -1) return target.part(target.data['parts']['first']);
                            break;
                        case 'lastname':
                        case 'last':
                        case 'фамилия':
                            if (target.data['parts']['last'] > -1) return target.part(target.data['parts']['last']);
                            break;
                        case 'middlename':
                        case 'middle':
                        case 'отчество':
                            if (target.data['parts']['middle'] > -1) return target.part(target.data['parts']['middle']);
                            break;
                    }
                }
            }
            return target[prop];
        },

        set: function (target, prop, value) {
            /* istanbul ignore else */
            if (typeof prop === 'string') {
                if (target.isPart) return false;
                if (target.containsProperty(prop)) {
                    return target.setProperty(prop, value);
                }
                if (['sex', 'пол'].includes(prop.toLowerCase()) && !target.isPart) {
                    target.data['sex'] = value;
                    return true;
                }
            }
            target[prop] = value;
            return true;
        },

        has: function (target, prop) {
            /* istanbul ignore else */
            if (typeof prop === 'string') {
                /* istanbul ignore else */
                if (target.containsProperty(prop) || ['sex', 'пол'].includes(prop.toLowerCase())) {
                    return true;
                } else if (!target.isPart) {
                    switch (prop.toLowerCase()) {
                        case 'firstname':
                        case 'first':
                        case 'имя':
                        case 'lastname':
                        case 'last':
                        case 'фамилия':
                            return true;
                        case 'middlename':
                        case 'middle':
                        case 'отчество':
                            return target.data['i'].split(' ').length === 3;
                    }
                }
            }
            return prop in target;
        },

        deleteProperty: function (target, prop) {
            if (typeof prop === 'string' && target.containsProperty(prop)) {
                return false;
            }
            delete target[prop];
            return true;
        }
    });
};

module.exports = new Proxy(EntityName, {
    construct: function (target, argumentsList) {
        return EntityName.proxy(target, argumentsList);
    }
});
