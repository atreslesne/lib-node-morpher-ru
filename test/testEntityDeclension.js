'use strict';

const EntityDeclension = require('../src/entity/declension');
const assert = require('chai').assert;
const helpers = require('./helpers');

const dataBase = {
    i: 'программист', r: 'программиста', d: 'программисту',
    v: 'программиста', t: 'программистом', p: 'программисте',
    gender: 'unknown',
    multiple: {
        i: 'программисты', r: 'программистов', d: 'программистам',
        v: 'программистов', t: 'программистами', p: 'программистах'
    }
};

const dataAdvanced = {
    i: 'программист', r: 'программиста', d: 'программисту',
    v: 'программиста', t: 'программистом', p: 'программисте',
    po: 'о программисте', gender: 'masculine',
    gde: 'в программисте', kuda: 'в программиста', otkuda: 'из программиста',
    multiple: {
        i: 'программисты', r: 'программистов', d: 'программистам',
        v: 'программистов', t: 'программистами', p: 'программистах',
        po: 'о программистах'
    }
};

describe('entity.EntityDeclension', function () {
    let declensionBase = new EntityDeclension(dataBase, true);
    let declensionAdvanced = new EntityDeclension(dataAdvanced);

    it('get properties', () => {
        helpers.checkPropertiesGet({
            i: 'программист', r: 'программиста', d: 'программисту',
            v: 'программиста', t: 'программистом', p: 'программисте'
        }, declensionBase);

        helpers.checkPropertiesGet({
            i: 'программисты', r: 'программистов', d: 'программистам',
            v: 'программистов', t: 'программистами', p: 'программистах'
        }, declensionBase['множественное']);

        helpers.checkPropertiesGet({
            po: 'о программисте', gender: 'masculine', gde: 'в программисте',
            kuda: 'в программиста', otkuda: 'из программиста'
        }, declensionAdvanced);

        helpers.checkPropertiesGet({ po: 'о программистах' }, declensionAdvanced['множественное']);

        assert.isTrue(declensionBase['cached']);
    });

    it('set properties', () => {
        helpers.checkPropertiesSet(['i', 'r', 'd', 'v', 't', 'p'], declensionBase);
        helpers.checkPropertiesSet(['i', 'r', 'd', 'v', 't', 'p'], declensionBase['множественное']);
        helpers.checkPropertiesSet(['po', 'gender', 'gde', 'kuda', 'otkuda'], declensionAdvanced);
        helpers.checkPropertiesSet(['po'], declensionAdvanced['multiple']);

        declensionBase['cached'] = false;
        assert.isFalse(declensionBase['cached']);
    });

    it('has properties', () => {
        helpers.checkPropertiesHas(['i', 'r', 'd', 'v', 't', 'p', 'multiple', 'cached'], declensionBase);
        helpers.checkPropertiesHas(['po', 'gde', 'kuda', 'otkuda', 'gender', 'multiple', 'cached'], declensionAdvanced);
    });

    it('delete properties', () => {
        assert.throws(() => delete declensionBase['кто?'], "'deleteProperty' on proxy: trap returned falsish for property 'кто?'");
        declensionBase['some'] = 'value';
        assert.isTrue('some' in declensionBase);
        delete declensionBase['some'];
        assert.isFalse('some' in declensionBase);
    });
});
