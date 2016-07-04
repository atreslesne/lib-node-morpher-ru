'use strict';

const EntityName = require('../src/entity/name');
const assert = require('chai').assert;
const helpers = require('./helpers');

const dataNameLFM = {
    i: 'Иванов Иван Иванович',
    r: 'Иванова Ивана Ивановича',
    d: 'Иванову Ивану Ивановичу',
    v: 'Иванова Ивана Ивановича',
    t: 'Ивановым Иваном Ивановичем',
    p: 'Иванове Иване Ивановиче',
    parts: {
        first: 1,
        middle: 2,
        last: 0
    },
    sex: 'male'
};

const dataNameLF = {
    i: 'Васечкин Вася',
    r: 'Васечкина Васи',
    d: 'Васечкину Васе',
    v: 'Васечкина Васю',
    t: 'Васечкиным Васей',
    p: 'Васечкине Васе',
    parts: {
        first: 1,
        middle: -1,
        last: 0
    }
};

const dataNameFM = {
    i: 'Александр Сергеевич',
    r: 'Александра Сергеевича',
    d: 'Александру Сергеевичу',
    v: 'Александра Сергеевича',
    t: 'Александром Сергеевичем',
    p: 'Александре Сергеевиче',
    parts: {
        first: 0,
        middle: 1,
        last: -1
    }
};

const dataNameLM = {
    i: 'Пушкин Сергеевич', r: 'Пушкина Сергеевича', d: 'Пушкину Сергеевичу',
    v: 'Пушкина Сергеевича', t: 'Пушкиным Сергеевичем', p: 'Пушкине Сергеевиче',
    parts: {
        first: -1,
        middle: 1,
        last: 0
    }
};

describe('entity.EntityName', () => {
    let nameLFM = new EntityName(dataNameLFM, true);
    let nameLF = new EntityName(dataNameLF);
    let nameFM = new EntityName(dataNameFM);
    let nameLM = new EntityName(dataNameLM);

    it('get properties', () => {
        helpers.checkPropertiesGet({
            i: 'Иванов Иван Иванович', r: 'Иванова Ивана Ивановича', d: 'Иванову Ивану Ивановичу',
            v: 'Иванова Ивана Ивановича', t: 'Ивановым Иваном Ивановичем', p: 'Иванове Иване Ивановиче',
            sex: 'male'
        }, nameLFM);

        helpers.checkPropertiesGet({
            i: 'Васечкин Вася', r: 'Васечкина Васи', d: 'Васечкину Васе',
            v: 'Васечкина Васю', t: 'Васечкиным Васей', p: 'Васечкине Васе'
        }, nameLF);

        helpers.checkPropertiesGet({
            i: 'Александр Сергеевич', r: 'Александра Сергеевича', d: 'Александру Сергеевичу',
            v: 'Александра Сергеевича', t: 'Александром Сергеевичем', p: 'Александре Сергеевиче'
        }, nameFM);

        helpers.checkPropertiesGet({
            i: 'Пушкин Сергеевич', r: 'Пушкина Сергеевича', d: 'Пушкину Сергеевичу',
            v: 'Пушкина Сергеевича', t: 'Пушкиным Сергеевичем', p: 'Пушкине Сергеевиче'
        }, nameLM);

        helpers.checkObjectGet(['firstName', 'lastName', 'middleName'], nameLFM);
        helpers.checkObjectGet(['firstName', 'lastName'], nameLF);
        helpers.checkObjectGet(['firstName', 'middleName'], nameFM);
        helpers.checkObjectGet(['lastName', 'middleName'], nameLM);
        assert.isUndefined(nameLF['middleName']);
        assert.isUndefined(nameLF['пол']);
        assert.isUndefined(nameFM['lastName']);
        assert.isUndefined(nameLM['firstName']);
        assert.isTrue(nameLFM['cached']);
        assert.isFalse(nameLF['cached']);

        helpers.checkPropertiesGet({
            i: 'Иванов', r: 'Иванова', d: 'Иванову', v: 'Иванова', t: 'Ивановым', p: 'Иванове'
        }, nameLFM['фамилия']);
        helpers.checkPropertiesGet({
            i: 'Васечкин', r: 'Васечкина', d: 'Васечкину', v: 'Васечкина', t: 'Васечкиным', p: 'Васечкине'
        }, nameLF['last']);

        helpers.checkPropertiesGet({
            i: 'Иван', r: 'Ивана', d: 'Ивану', v: 'Ивана', t: 'Иваном', p: 'Иване'
        }, nameLFM['имя']);
        helpers.checkPropertiesGet({
            i: 'Вася', r: 'Васи', d: 'Васе', v: 'Васю', t: 'Васей', p: 'Васе'
        }, nameLF['first']);

        helpers.checkPropertiesGet({
            i: 'Иванович', r: 'Ивановича', d: 'Ивановичу', v: 'Ивановича', t: 'Ивановичем', p: 'Ивановиче'
        }, nameLFM['отчество']);
    });

    it('set properties', () => {
        helpers.checkPropertiesSet(['i', 'r', 'd', 'v', 't', 'p', 'sex'], nameLFM);
        helpers.checkPropertiesSet(['i', 'r', 'd', 'v', 't', 'p'], nameLF);

        nameLFM['some'] = 'aaa';
        assert.equal('aaa', nameLFM['some']);

        assert.throws(() => nameLFM['имя']['i'] = 'sss', "'set' on proxy: trap returned falsish for property 'i'");
    });

    it('has properties', () => {
        helpers.checkPropertiesHas(['i', 'r', 'd', 'v', 't', 'p', 'firstName', 'middleName', 'lastName', 'sex', 'some'], nameLFM);
        helpers.checkPropertiesHas(['i', 'r', 'd', 'v', 't', 'p', 'firstName', 'lastName'], nameLF);
    });

    it('delete properties', () => {
        assert.throws(() => delete nameLFM['кто?'], "'deleteProperty' on proxy: trap returned falsish for property 'кто?'");
        assert.isTrue('some' in nameLFM);
        delete nameLFM['some'];
        assert.isFalse('some' in nameLFM);
    });
});
