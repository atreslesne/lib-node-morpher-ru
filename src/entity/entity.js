'use strict';

function Entity(data, cached) {
    this.baseProperties = {
        'i': 'i', 'nominativus': 'i', 'именительный': 'i', 'кто': 'i', 'что': 'i',
        'r': 'r', 'genitivus': 'r', 'родительный': 'r', 'кого': 'r', 'чего': 'r',
        'd': 'd', 'dativus': 'd', 'дательный': 'd', 'кому': 'd', 'чему': 'd',
        'v': 'v', 'accusativus': 'v', 'винительный': 'v',
        't': 't', 'ablativus': 't', 'творительный': 't', 'кем': 't', 'чем': 't',
        'p': 'p', 'praepositionalis': 'p', 'предложный': 'p'
    };

    this.advancedProperties = {
        'po': 'po', 'о': 'po', 'о ком': 'po', 'о чём': 'po', 'о чем': 'po',
        'gender': 'gender', 'род': 'gender',
        'gde': 'gde', 'где': 'gde',
        'kuda': 'kuda', 'куда': 'kuda',
        'otkuda': 'otkuda', 'откуда': 'otkuda'
    };

    this.cached = cached ? true : false;
    this.data = data;
}

Entity.prototype.containsProperty = function (prop) {
    let key = prop.toLowerCase().replace(/\?/, '');
    return (key in this.baseProperties) || (key in this.advancedProperties && this.advancedProperties[key] in this.data);
};

Entity.prototype.getProperty = function (prop) {
    let key = prop.toLowerCase().replace(/\?/, '');
    if (key in this.baseProperties) {
        return this.data[this.baseProperties[key]];
    }
    return this.data[this.advancedProperties[key]];
};

Entity.prototype.setProperty = function (prop, value) {
    let key = prop.toLowerCase().replace(/\?/, '');
    if (key in this.baseProperties) {
        this.data[this.baseProperties[key]] = value;
    } else {
        this.data[this.advancedProperties[key]] = value;
    }
    return true;
};

module.exports = Entity;
