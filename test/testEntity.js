'use strict';

const assert = require('chai').assert;
const Entity = require('../src/entity/entity');

const dataBase = {
    i: 'Брынзодел',  r: 'Брынзодела',  d: 'Брынзоделу',
    v: 'Брынзодела', t: 'Брынзоделом', p: 'Брынзоделе'
};

const dataAdvanced = {
    gender: 'masculine', po: 'о Брынзоделе',
    gde: 'в Брынзоделе', kuda: 'в Брынзодела', otkuda: 'из Брынзодела'
};

describe('entity.Entity', function () {
    let entityBase = new Entity(dataBase);
    let entityAdvanced = new Entity(dataAdvanced);

    it('constructor', () => {
        assert.deepEqual(entityBase.data, dataBase);
        assert.isFalse(entityBase.cached);
        entityBase = new Entity(dataBase, true);
        assert.isTrue(entityBase.cached);
    });

    it('containsProperty', () => {
        assert.isTrue(entityBase.containsProperty('кто?'));
        assert.isTrue(entityAdvanced.containsProperty('о ком?'));
    });

    it('getProperty', () => {
        assert.equal(entityBase.getProperty('кто?'), 'Брынзодел');
        assert.equal(entityAdvanced.getProperty('о ком?'), 'о Брынзоделе');
    });

    it('setProperty', () => {
        assert.isTrue(entityBase.setProperty('кто?', '_Брынзодел_'));
        assert.isTrue(entityAdvanced.setProperty('о ком?', '_о Брынзоделе_'));
        assert.equal(entityBase.getProperty('i'), '_Брынзодел_');
        assert.equal(entityAdvanced.getProperty('po'), '_о Брынзоделе_');
    });
});
