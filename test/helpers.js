'use strict';

const assert = require('chai').assert;

const properties = {
    i: ['i', 'nominativus', 'Именительный', 'кто?', 'что'],
    r: ['r', 'genitivus', 'родительный', 'кого', 'чего'],
    d: ['d', 'dativus', 'дательный', 'кому', 'чему'],
    v: ['v', 'accusativus', 'винительный'],
    t: ['t', 'ablativus', 'творительный', 'кем', 'чем'],
    p: ['p', 'praepositionalis', 'предложный'],
    po: ['po', 'о', 'о ком', 'о чём', 'о чем'],
    gde: ['gde', 'где'],
    kuda: ['kuda', 'куда?'],
    otkuda: ['otkuda', 'откуда'],
    gender: ['gender', 'род'],
    some: ['some'],
    multiple: ['multiple', 'множественное'],
    sex: ['sex', 'пол'],
    firstName: ['firstName', 'first', 'имя'],
    lastName: ['lastName', 'last', 'фамилия'],
    middleName: ['middleName', 'middle', 'отчество'],
    number: ['number', 'число'],
    unit: ['unit', 'единица измерения'],
    value: ['value', 'значение']
};

function checkGet(keys, value, data) {
    keys.forEach((key) => assert.equal(data[key], value));
}

function checkSet(keys, key, data) {
    let original = data[key];
    keys.forEach(a => {
        let v = 'some:' + a;
        data[a] = v;
        keys.forEach(b => assert.equal(data[b], v));
    });
    data[key] = original;
}

module.exports.properties = properties;

module.exports.checkPropertiesGet = function (values, data) {
    for (let key in values) { checkGet(properties[key], values[key], data); }
};

module.exports.checkObjectGet = function (values, data) {
    values.forEach(key => {
        properties[key].forEach(k => assert.isObject(data[k]));
    });
};

module.exports.checkPropertiesSet = function (keys, data) {
    keys.forEach(key => checkSet(properties[key], key, data));
};

module.exports.checkPropertiesHas = function (keys, data) {
    keys.forEach(key => {
        if (key in properties) {
            properties[key].forEach(k => assert.isTrue(k in data));
        } else {
            assert.isTrue(key in data);
        }
    });
};
