'use strict';

const parser = require('xml2js').parseString;
const Pool = require('http-hosts-pool').FirstAvailableHost;
const MorpherError = require('./error');

function Client(params) {
    if (typeof params !== 'object') params = {};

    this.pool = new Pool(params['hosts'] || ['api.morpher.ru', 'morpher.ru'], {
        timeout: params['timeout'] || 10000,
        headers: (params['login'] && params['password']) ? {
            'Authorization': 'Basic ' + new Buffer(params['login'] + ':' + params['password']).toString('base64')
        } : {}
    });
}

Client.prototype.request = function (path, params) {
    return new Promise((resolve, reject) => {
        this.pool.get(path, params).then(
            message => {
                parser(message, (err, result) => {
                    if (err) {
                        if (err.message.substring(0, 31) === 'Non-whitespace before first tag') {
                            reject(new MorpherError(message.split('\r\n')[0]));
                        } else {
                            reject(new MorpherError(err.message.split('\n')[0]));
                        }
                    } else {
                        if (result['xml'] && result['xml'].error) {
                            reject(MorpherError.byCode(result['xml']['error'][0]['code'][0]));
                        } else if (result['error']) {
                            reject(MorpherError.byCode(result['error']['code'][0]));
                        } else {
                            resolve(result);
                        }
                    }
                });
            },
            error => reject(error)
        );
    });
};

module.exports = Client;
