'use strict';

const assert = require('chai').assert;
const Client = require('../src/client');
const Morpher = require('../src/morpher');

describe('Morpher', () => {
    let morpher = new Morpher(new Client());

    it('prepareName', () => {
        assert.equal(morpher.prepareName('святозаров-пЕрвеславский'), 'Святозаров-Первеславский');
        assert.equal(morpher.prepareName(' иВаНоВ!'), 'Иванов');
    });

    it('fullName', () => {
        assert.equal(morpher.fullName(' иванов   ИВАН иванович!!!'), 'Иванов Иван Иванович');
    });

    it('prepareNumber', () => {
        assert.deepEqual(morpher.prepareNumber('1023', 'Рубль'), {
            number: 1023,
            unit: 'рубль'
        });
        assert.deepEqual(morpher.prepareNumber('1023'), {
            number: 1023,
            unit: 'бобр'
        });
    });

    it('gender', () => {
        assert.equal(morpher.gender('Мужской'), 'masculine');
        assert.equal(morpher.gender('Женский'), 'feminine');
        assert.equal(morpher.gender('Средний'), 'neuter');
        assert.equal(morpher.gender('Шоав'), 'unknown');
    });

    it('sex', () => {
        assert.equal(morpher.sex('Мужской'), 'male');
        assert.equal(morpher.sex('Женский'), 'female');
        assert.equal(morpher.sex('Средний'), 'unknown');
    });
});
