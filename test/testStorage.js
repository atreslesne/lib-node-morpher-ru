'use strict';

const assert = require('chai').assert;
const Storage = require('../src/storage');

describe('Storage', () => {
    let storage = new Storage();

    it('должен возвращать ошибку при запросе неизвестного типа данных', () => {
        return storage.get('some', '12345').then(
            result => assert(result === null, 'Должна вернуться ошибка'),
            error => assert.equal(error.message, 'Неподдерживаемый тип данных: some')
        );
    });

    it('должен возвращать null для отсутствующих данных', () => {
        return storage.get('text', '12345').then(result => assert.isNull(result));
    });

    it('должен возвращать ошибку при проверке неизвестного типа данных', () => {
        return storage.contains('some', '12345').then(
            result => assert(result === null, 'Должна вернуться ошибка'),
            error => assert.equal(error.message, 'Неподдерживаемый тип данных: some')
        );
    });

    it('должен возвращать false при отсутствии данных', () => {
        return storage.contains('text', '12345').then(result => assert.isFalse(result));
    });

    it('должен возвращать ошибку при записи неизвестного типа данных', () => {
        return storage.set('some', '12345', { a: 'b' }).then(
            result => assert(result === null, 'Должна вернуться ошибка'),
            error => assert.equal(error.message, 'Неподдерживаемый тип данных: some')
        );
    });

    it('должен сохранять данные', () => {
        return storage.set('text', '12345', { a: 'b' }).then(result => {
            assert.equal(result.hash, '12345');
            assert.equal(result.a, 'b');
        });
    });

    it('должен возвращать true при наличии данных', () => {
        return storage.contains('text', '12345').then(result => assert.isTrue(result));
    });

    it('должен возвращать сохранённые данные', () => {
        return storage.get('text', '12345').then(result => assert.deepEqual(result, {
            'hash': '12345',
            'a': 'b'
        }));
    });
});
