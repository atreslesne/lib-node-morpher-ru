'use strict';

const EntityNumber = require('../src/entity/number');
const assert = require('chai').assert;
const helpers = require('./helpers');

const dataNumber = {
    value: 235,
    number: {
        i: 'двести тридцать пять',
        r: 'двухсот тридцати пяти',
        d: 'двумстам тридцати пяти',
        v: 'двести тридцать пять',
        t: 'двумястами тридцатью пятью',
        p: 'двухстах тридцати пяти'
    },
    unit: {
        i: 'рублей',
        r: 'рублей',
        d: 'рублям',
        v: 'рублей',
        t: 'рублями',
        p: 'рублях'
    }
};

describe('entity.EntityNumber', () => {
    let number = new EntityNumber(dataNumber, true);

    it('get properties', () => {
        helpers.checkPropertiesGet({
            i: 'двести тридцать пять рублей', r: 'двухсот тридцати пяти рублей', d: 'двумстам тридцати пяти рублям',
            v: 'двести тридцать пять рублей', t: 'двумястами тридцатью пятью рублями', p: 'двухстах тридцати пяти рублях',
            value: 235
        }, number);

        helpers.checkObjectGet(['number', 'unit'], number);

        helpers.checkPropertiesGet({
            i: 'двести тридцать пять', r: 'двухсот тридцати пяти', d: 'двумстам тридцати пяти',
            v: 'двести тридцать пять', t: 'двумястами тридцатью пятью', p: 'двухстах тридцати пяти'
        }, number['число']);

        helpers.checkPropertiesGet({
            i: 'рублей', r: 'рублей', d: 'рублям',
            v: 'рублей', t: 'рублями', p: 'рублях'
        }, number['единица измерения']);
    });

    it('set properties', () => {
        assert.throws(() => number['i'] = 'fsdg', "'set' on proxy: trap returned falsish for property 'i'");

        number['some'] = 'aaa';
        assert.equal('aaa', number['some']);
    });

    it('has properties', () => {
        helpers.checkPropertiesHas(['i', 'r', 'd', 'v', 't', 'p', 'value', 'unit', 'number'], number);
        helpers.checkPropertiesHas(['i', 'r', 'd', 'v', 't', 'p'], number['number']);
        helpers.checkPropertiesHas(['i', 'r', 'd', 'v', 't', 'p'], number['unit']);
        assert.isTrue('some' in number);
    });

    it('delete properties', () => {
        assert.throw(() => delete number['i'], "'deleteProperty' on proxy: trap returned falsish for property 'i'")
        delete number['some'];
        assert.isFalse('some' in number);
    });
});
