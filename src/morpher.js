'use strict';

function Morpher(client) {
    this.client = client;
}

Morpher.prototype.declension = function (text) {
    return new Promise((resolve, reject) => {
        this.client.request('/WebService.asmx/GetXml', { s: text }).then(
            result => {
                let r = {
                    i: text,
                    r: result['xml']['Р'][0],
                    d: result['xml']['Д'][0],
                    v: result['xml']['В'][0],
                    t: result['xml']['Т'][0],
                    p: result['xml']['П'][0],
                    gender: result['xml']['род'] ? this.gender(result['xml']['род'][0]) : 'unknown',
                    multiple: {
                        i: result['xml']['множественное'][0]['И'][0],
                        r: result['xml']['множественное'][0]['Р'][0],
                        d: result['xml']['множественное'][0]['Д'][0],
                        v: result['xml']['множественное'][0]['В'][0],
                        t: result['xml']['множественное'][0]['Т'][0],
                        p: result['xml']['множественное'][0]['П'][0]
                    }
                };
                if (result['xml']['П-о']) r['po'] = result['xml']['П-о'][0];
                if (result['xml']['множественное'][0]['П-о']) r['multiple']['po'] = result['xml']['множественное'][0]['П-о'][0];
                if (result['xml']['где']) r['gde'] = result['xml']['где'][0];
                if (result['xml']['куда']) r['kuda'] = result['xml']['куда'][0];
                if (result['xml']['откуда']) r['otkuda'] = result['xml']['откуда'][0];
                resolve(r);
            },
            error => reject(error)
        )
    });
};

Morpher.prototype.declensionName = function (name) {
    return new Promise((resolve, reject) => {
        this.client.request('/WebService.asmx/GetXml', { s: name }).then(
            result => {
                let parts = name.split(' ');
                let lfm = {
                    last: result['xml']['ФИО'][0]['Ф'][0],
                    first: result['xml']['ФИО'][0]['И'][0],
                    middle: result['xml']['ФИО'][0]['О'][0]
                };
                let r = {
                    i: name.split(' '),
                    r: result['xml']['Р'][0].split(' '),
                    d: result['xml']['Д'][0].split(' '),
                    v: result['xml']['В'][0].split(' '),
                    t: result['xml']['Т'][0].split(' '),
                    p: result['xml']['П'][0].split(' '),
                    sex: result['xml']['род'] ? this.sex(result['xml']['род'][0]) : 'unknown',
                    parts: {
                        last: -1,
                        first: -1,
                        middle: -1
                    }
                };
                Object.keys(lfm).forEach(key => r['parts'][key] = parts.indexOf(lfm[key]));

                function part(d, id) {
                    return r['parts'][id] > -1 ? r[d][r['parts'][id]] : '';
                }

                ['i', 'r', 'd', 'v', 't', 'p'].forEach(k => {
                    r[k] = `${part(k, 'last')} ${part(k, 'first')} ${part(k, 'middle')}`.replace(/  /, ' ').trim();
                });
                parts = r['i'].split(' ');
                Object.keys(lfm).forEach(key => r['parts'][key] = parts.indexOf(lfm[key]));

                resolve(r);
            },
            error => reject(error)
        );
    });
};

Morpher.prototype.declensionNumber = function (value) {
    return new Promise((resolve, reject) => {
        this.client.request('/WebService.asmx/Propis', { n: value.number, unit: value.unit }).then(
            result => resolve({
                value: value.number,
                number: {
                    i: result['PropisResult']['n'][0]['И'][0],
                    r: result['PropisResult']['n'][0]['Р'][0],
                    d: result['PropisResult']['n'][0]['Д'][0],
                    v: result['PropisResult']['n'][0]['В'][0],
                    t: result['PropisResult']['n'][0]['Т'][0],
                    p: result['PropisResult']['n'][0]['П'][0]
                },
                unit: {
                    i: result['PropisResult']['unit'][0]['И'][0],
                    r: result['PropisResult']['unit'][0]['Р'][0],
                    d: result['PropisResult']['unit'][0]['Д'][0],
                    v: result['PropisResult']['unit'][0]['В'][0],
                    t: result['PropisResult']['unit'][0]['Т'][0],
                    p: result['PropisResult']['unit'][0]['П'][0]
                }
            }),
            error => reject(error)
        )
    });
};

Morpher.prototype.prepareName = function (value) {
    if (~value.indexOf('-')) {
        return value.split('-').map(v => this.prepareName(v)).join('-');
    }
    return value.trim().toLowerCase().split('')
        .filter(c => ~this.allowedSymbols.indexOf(c))
        .map((c, i) => (i === 0) ? c.toUpperCase() : c)
        .join('');
};

Morpher.prototype.fullName = function (name) {
    return name.split(' ').filter(v => v.length).map(v => this.prepareName(v)).join(' ');
};

Morpher.prototype.prepareNumber = function (number, unit) {
    return {
        number: parseInt(number, 10),
        unit: unit ? unit.trim().toLowerCase() : 'бобр'
    };
};

Morpher.prototype.gender = function (value) {
    switch (value) {
        case 'Мужской':
            return 'masculine';
        case 'Женский':
            return 'feminine';
        case 'Средний':
            return 'neuter';
        default:
            return 'unknown';
    }
};

Morpher.prototype.sex = function (value) {
    switch (value) {
        case 'Мужской':
            return 'male';
        case 'Женский':
            return 'female';
        default:
            return 'unknown';
    }
};

Morpher.prototype.allowedSymbols = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя";

module.exports = Morpher;
