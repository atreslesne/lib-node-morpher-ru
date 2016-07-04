'use strict';

const assert = require('chai').assert;
const mock = require('./serviceMock');
const Client = require('../src/client');

describe('Client', function () {
    this.timeout(5000);
    let service1 = null;
    let service2 = null;

    before((done) => {
        service1 = mock(9011, () => service2 = mock(9012, done), 2000);
    });

    describe('pool', () => {
        let client = new Client({
            hosts: ['localhost:9010', 'localhost:9011', 'localhost:9012'],
            login: 'test',
            password: 'pass',
            timeout: 1000
        });

        it('должен подключаться к первому доступному хосту', () => {
            return client.request('/test').then(result => {
                assert.deepEqual(result, {
                    'xml': {
                        '$': {
                            'xmlns': 'http://morpher.ru/',
                            'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
                            'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
                        },
                        'emptyQuery': ['true'],
                        'port': ['9011']
                    }
                });
            });
        });

        it('должен пропускать хост при таймауте', () => {
            return client.request('/timeout').then(result => {
                assert.deepEqual(result, {
                    'xml': {
                        '$': {
                            'xmlns': 'http://morpher.ru/',
                            'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
                            'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
                        },
                        'port': ['9012']
                    }
                });
            });
        });

        it('должен передавать аргументы запроса', () => {
            return client.request('/test', { arg: 'some' }).then(result => {
                assert.deepEqual(result, {
                    'xml': {
                        '$': {
                            'xmlns': 'http://morpher.ru/',
                            'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
                            'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
                        },
                        'arg': ['some'],
                        'port': ['9011']
                    }
                });
            });
        });

        it('должен проводить авторизацию', () => {
            return client.request('/auth').then(result => {
                assert.deepEqual(result, {
                    'xml': {
                        '$': {
                            'xmlns': 'http://morpher.ru/',
                            'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
                            'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
                        },
                        'auth': ['true'],
                        'port': ['9011']
                    }
                });
            });
        });
    });

    describe('должен обрабатывать ошибки', () => {
        let client = new Client({
            hosts: 'localhost:9011',
            login: 'test',
            password: 'passsd'
        });

        it('HTTP', () => {
            return client.request('/err500').then(
                result => assert(result === null, 'Должна вернуться ошибка'),
                error => {
                    assert.equal(error.message, '500: Internal server error');
                }
            );
        });

        it('формата', () => {
            return client.request('/errFormat').then(
                result => assert(result === null, 'Должна вернуться ошибка'),
                error => {
                    assert.equal(error.message, 'Unexpected end');
                }
            );
        });

        it('формата', () => {
            return client.request('/errFormat2').then(
                result => assert(result === null, 'Должна вернуться ошибка'),
                error => {
                    assert.equal(error.message, 'aaa');
                }
            );
        });

        it('сервиса (#1)', () => {
            return client.request('/err', { code: 1 }).then(
                result => assert(result === null, 'Должна вернуться ошибка'),
                error => {
                    assert.equal(error.message, 'Превышен лимит на количество запросов в сутки. Перейдите на следующий тарифный план.');
                }
            );
        });

        it('сервиса (неизвестные)', () => {
            return client.request('/err', { code: 9999 }).then(
                result => assert(result === null, 'Должна вернуться ошибка'),
                error => {
                    assert.equal(error.message, 'Unknown error code: 9999');
                    assert.deepEqual(error.json(), {
                        error: 'Unknown error code: 9999'
                    });
                }
            );
        });

        it('аутентификации', () => {
            return client.request('/errAuth', { code: 1 }).then(
                result => assert(result === null, 'Должна вернуться ошибка'),
                error => {
                    assert.equal(error.message, 'Неправильное имя пользователя или пароль.');
                }
            );
        });
    });
});
