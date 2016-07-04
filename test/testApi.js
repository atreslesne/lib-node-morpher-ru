'use strict';

const assert = require('chai').assert;
const MorpherApi = require('../index');
const Storage = require('../src/storage');
const StorageMock = require('./storageMock');
const ServiceMock = require('./serviceMock');

describe('API', function () {
    this.timeout(30000);
    let api = new MorpherApi();
    let apiMock = new MorpherApi(new StorageMock('get'));
    let apiMock2 = new MorpherApi({ hosts: 'localhost:9013' });
    let apiMock3 = new MorpherApi(new StorageMock('set'));
    let apiAuth = null;

    let service = null;

    if (process.env.MORPHER_LOGIN && process.env.MORPHER_PASSWORD) {
        apiAuth = new MorpherApi({
            login: process.env.MORPHER_LOGIN,
            password: process.env.MORPHER_PASSWORD
        });
    }

    before((done) => {
        service = ServiceMock(9013, done);
    });

    it('конструктор должен проверять переданный объект Storage', () => {
        assert.throws(() => api.setStorage('ttt'), 'Storage object must be instance of morpher.Storage');
    });

    describe('обработка ошибок', () => {
        it('хранилища при вызове declension', () => {
            return apiMock.declension('проверка').then(
                result => assert(result === null, 'Должна вернуться ошибка'),
                error => assert.equal(error.message, 'Storage error')
            );
        });

        it('аргументов при вызове declension', () => {
            return apiMock.declension('  ').then(
                result => assert(result === null, 'Должна вернуться ошибка'),
                error => assert.equal(error.message, 'Ошибка запроса: "  "')
            );
        });

        it('сервиса при вызове declension', () => {
            return apiMock2.declension('проверка').then(
                result => assert(result === null, 'Должна вернуться ошибка'),
                error => assert.equal(error.message, 'IP заблокирован.')
            );
        });

        it('хранилища при вызове declensionName', () => {
            return apiMock.declensionName('Михаил Сергеевич').then(
                result => assert(result === null, 'Должна вернуться ошибка'),
                error => assert.equal(error.message, 'Storage error')
            );
        });

        it('aргументов при вызове declensionName', () => {
            return apiMock.declensionName(' иван').then(
                result => assert(result === null, 'Должна вернуться ошибка'),
                error => assert.equal(error.message, 'Ошибка запроса: "Иван"')
            );
        });

        it('сервиса при вызове declensionName', () => {
            return apiMock2.declensionName('Иван Иванович').then(
                result => assert(result === null, 'Должна вернуться ошибка'),
                error => assert.equal(error.message, 'IP заблокирован.')
            );
        });

        it('хранилища при вызове declensionNumber', () => {
            return apiMock.declensionNumber('1023').then(
                result => assert(result === null, 'Должна вернуться ошибка'),
                error => assert.equal(error.message, 'Storage error')
            );
        });

        it('аргументов при вызове declensionNumber (NaN)', () => {
            return apiMock.declensionNumber('иван').then(
                result => assert(result === null, 'Должна вернуться ошибка'),
                error => assert.equal(error.message, 'Ошибка запроса: иван is NaN')
            );
        });

        it('аргументов при вызове declensionNumber (<0)', () => {
            return apiMock.declensionNumber(-34).then(
                result => assert(result === null, 'Должна вернуться ошибка'),
                error => assert.equal(error.message, 'Ошибка запроса: -34 < 0')
            );
        });

        it('сервиса при вызове declensionNumber', () => {
            return apiMock2.declensionNumber(123).then(
                result => assert(result === null, 'Должна вернуться ошибка'),
                error => assert.equal(error.message, 'IP заблокирован.')
            );
        });
    });

    describe('метод declension', () => {
        it('должен склонять переданный текст', () => {
            return api.declension('Чукотский автономный округ').then(
                result => assert.deepEqual(result.data, {
                    hash: '5bb660c7af7c5eccb5e4a12d89dcd5e5724d162409164b60ab3bb1ced88b3b45',
                    i: 'Чукотский автономный округ',
                    r: 'Чукотского автономного округа',
                    d: 'Чукотскому автономному округу',
                    v: 'Чукотский автономный округ',
                    t: 'Чукотским автономным округом',
                    p: 'Чукотском автономном округе',
                    gender: 'unknown',
                    multiple: {
                        i: 'Чукотские автономные округа',
                        r: 'Чукотских автономных округов',
                        d: 'Чукотским автономным округам',
                        v: 'Чукотские автономные округа',
                        t: 'Чукотскими автономными округами',
                        p: 'Чукотских автономных округах'
                    }
                })
            );
        });

        it('должен сохранять результат в кеше', () => {
            return api.declension('Чукотский автономный округ').then(
                result => assert.isTrue(result.cached)
            )
        });

        it('обрабатывать ошибки записи в кеш', () => {
            return apiMock3.declension('Чукотский автономный округ').then(
                result => assert(result === null, 'Должна вернуться ошибка'),
                error => assert.equal(error.message, 'Storage error')
            )
        });

        if (apiAuth) {
            it('должен отправлять запрос с авторизацией', () => {
                return apiAuth.declension('программист').then(result => {
                    assert.deepEqual(result.data, {
                        hash: 'c6e1bfced8899e6f34d66fddbd59556fe75cb2ef2b3ac3df99485e292d36ca7f',
                        i: 'программист',
                        r: 'программиста',
                        d: 'программисту',
                        v: 'программиста',
                        t: 'программистом',
                        p: 'программисте',
                        po: 'о программисте',
                        gde: 'в программисте',
                        kuda: 'в программиста',
                        otkuda: 'из программиста',
                        gender: 'masculine',
                        multiple: {
                            i: 'программисты',
                            r: 'программистов',
                            d: 'программистам',
                            v: 'программистов',
                            t: 'программистами',
                            p: 'программистах',
                            po: 'о программистах'
                        }
                    });
                });
            });
        }
    });

    describe('метод declensionName', () => {
        it('должен склонять переданное имя', () => {
            return api.declensionName('иван иванович иванов').then(
                result => assert.deepEqual(result.data, {
                    hash: '8352db270d738f4bbd6d1f637130ce5e4c009fe9d0aba7ed3b7b691e1ddf52c7',
                    i: 'Иванов Иван Иванович',
                    r: 'Иванова Ивана Ивановича',
                    d: 'Иванову Ивану Ивановичу',
                    v: 'Иванова Ивана Ивановича',
                    t: 'Ивановым Иваном Ивановичем',
                    p: 'Иванове Иване Ивановиче',
                    sex: 'unknown',
                    parts: {
                        first: 1,
                        last: 0,
                        middle: 2
                    }
                })
            );
        });

        it('должен сохранять результат в кеше', () => {
            return api.declensionName('иван иванович иванов').then(
                result => assert.isTrue(result.cached)
            );
        });

        it('обрабатывать ошибки записи в кеш', () => {
            return apiMock3.declensionName('иван иванович иванов').then(
                result => assert(result === null, 'Должна вернуться ошибка'),
                error => assert.equal(error.message, 'Storage error')
            )
        });

        it('должен правильно склонять частичные имена (имя фамилия)', () => {
            return api.declensionName('иван иванов').then(
                result => assert.deepEqual(result.data, {
                    hash: '99ba3288cafe8a8e371a47fe0bd452f3fcb2ed775242c5a97a8ec6fece43ca06',
                    i: 'Иванов Иван',
                    r: 'Иванова Ивана',
                    d: 'Иванову Ивану',
                    v: 'Иванова Ивана',
                    t: 'Ивановым Иваном',
                    p: 'Иванове Иване',
                    sex: 'unknown',
                    parts: {
                        first: 1,
                        last: 0,
                        middle: -1
                    }
                })
            )
        });

        it('должен правильно склонять частичные имена (имя отчество)', () => {
            return api.declensionName('иван иванович').then(
                result => assert.deepEqual(result.data, {
                    hash: '8d63cd3006a526d923b34f895b3710e31f80e4832025b74e905e6a544fc0fe1a',
                    i: 'Иван Иванович',
                    r: 'Ивана Ивановича',
                    d: 'Ивану Ивановичу',
                    v: 'Ивана Ивановича',
                    t: 'Иваном Ивановичем',
                    p: 'Иване Ивановиче',
                    sex: 'unknown',
                    parts: {
                        first: 0,
                        last: -1,
                        middle: 1
                    }
                })
            )
        });

        if (apiAuth) {
            it('должен отправлять запрос с авторизацией', () => {
                return apiAuth.declensionName('иван иванович иванов').then(
                    result => assert.deepEqual(result.data, {
                        hash: '8352db270d738f4bbd6d1f637130ce5e4c009fe9d0aba7ed3b7b691e1ddf52c7',
                        i: 'Иванов Иван Иванович',
                        r: 'Иванова Ивана Ивановича',
                        d: 'Иванову Ивану Ивановичу',
                        v: 'Иванова Ивана Ивановича',
                        t: 'Ивановым Иваном Ивановичем',
                        p: 'Иванове Иване Ивановиче',
                        sex: 'male',
                        parts: {
                            first: 1,
                            last: 0,
                            middle: 2
                        }
                    })
                );
            });
        }
    });

    describe('метод declensionNumber', () => {
        it('должен переводить число "в пропись"', () => {
            return api.declensionNumber('235', 'рубль').then(
                result => assert.deepEqual(result.original, {
                    hash: '128cfc74180e0bb01eb0f11df57a62d99c433f3088032442be1860d4eef83428',
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
                })
            );
        });

        it('должен сохранять результат в кеше', () => {
            return api.declensionNumber('235', 'рубль').then(
                result => assert.isTrue(result.cached)
            );
        });

        it('обрабатывать ошибки записи в кеш', () => {
            return apiMock3.declensionNumber('235', 'рубль').then(
                result => assert(result === null, 'Должна вернуться ошибка'),
                error => assert.equal(error.message, 'Storage error')
            )
        });
    });
});
