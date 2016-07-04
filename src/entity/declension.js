'use strict';

const util = require('util');
const Entity = require('./entity');

function EntityDeclension(data, cached, isMultiple) {
    EntityDeclension.super_.apply(this, arguments);
    this.isMultiple = isMultiple;
}
util.inherits(EntityDeclension, Entity);

EntityDeclension.proxy = function (target, argumentsList) {
    return new Proxy(new target(...argumentsList), {
        get: function (target, prop) {
            /* istanbul ignore else */
            if (typeof prop === 'string') {
                if (target.containsProperty(prop)) {
                    return target.getProperty(prop);
                }
                if (['multiple', 'множественное'].includes(prop.toLowerCase()) && !target.isMultiple) {
                    return EntityDeclension.proxy(EntityDeclension, [target.data['multiple'], undefined, true]);
                }
            }
            return target[prop];
        },

        set: function (target, prop, value) {
            if (typeof prop === 'string' && target.containsProperty(prop)) {
                return target.setProperty(prop, value);
            }
            target[prop] = value;
            return true;
        },

        has: function (target, prop) {
            if (typeof prop === 'string'
                && (target.containsProperty(prop)
                || (['multiple', 'множественное'].includes(prop.toLowerCase()) && !target.isMultiple))
            ) {
                return true;
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

module.exports = new Proxy(EntityDeclension, {
    construct: function (target, argumentsList) {
        return EntityDeclension.proxy(target, argumentsList)
    }
});
