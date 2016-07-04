'use strict';

const util = require('util');

const codes = {
    '1': 'Превышен лимит на количество запросов в сутки. Перейдите на следующий тарифный план.',
    '2': 'Превышен лимит на количество одинаковых запросов в сутки. Реализуйте кеширование.',
    '3': 'IP заблокирован.',
    '4': 'Склонение числительных в GetXml не поддерживается. Используйте метод Propis.',
    '5': 'Не найдено русских слов.',
    '6': 'Не указан обязательный параметр s.',
    '7': 'Необходимо оплатить услугу.',
    '8': 'Пользователь с указанным ID не зарегистрирован.',
    '9': 'Неправильное имя пользователя или пароль.'
};

function MorpherError(message) {
    Error.captureStackTrace(this, MorpherError);
    this.message = message;
}
util.inherits(MorpherError, Error);

MorpherError.prototype.json = function () {
    return {
        error: this.message
    }
};

MorpherError.byCode = function (code) {
    code = code.toString();
    if (code in codes) return new MorpherError(codes[code]);
    return new MorpherError(`Unknown error code: ${code}`);
};

module.exports = MorpherError;
