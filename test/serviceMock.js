'use strict';

const http = require('http');
const url = require('url');

module.exports = function (port, callback, timeout) {
    let server = http.createServer((req, res) => {
        let parsed = url.parse(req.url, true);

        if (parsed.pathname == '/test') {
            let response = '<?xml version="1.0" encoding="utf-8"?>\n<xml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://morpher.ru/">\n';
            if (Object.keys(parsed.query).length) {
                for (let key in parsed.query) {
                    response += `<${key}>${parsed.query[key]}</${key}>\n`;
                }
            } else {
                response += '<emptyQuery>true</emptyQuery>\n';
            }
            response += `<port>${port}</port>\n</xml>`;

            res.setHeader('Content-Type', 'text/xml; charset=utf-8');
            res.setHeader('Cache-Control', 'private, max-age=0');
            res.end(response);
            return;
        }

        if (parsed.pathname == '/timeout') {
            let response = '<?xml version="1.0" encoding="utf-8"?>\n<xml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://morpher.ru/">\n';
            response += `<port>${port}</port>\n</xml>`;
            if (!timeout) {
                res.setHeader('Content-Type', 'text/xml; charset=utf-8');
                res.setHeader('Cache-Control', 'private, max-age=0');
                res.end(response);
            } else {
                setInterval(() => {
                    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
                    res.setHeader('Cache-Control', 'private, max-age=0');
                    res.end(response);
                }, timeout);
            }
            return;
        }

        if (parsed.pathname == '/auth') {
            let response = '<?xml version="1.0" encoding="utf-8"?>\n<xml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://morpher.ru/">\n';
            if (req.headers['authorization'] !== 'Basic dGVzdDpwYXNz') {
                response += '<error>\n<code>9</code>\n<message>Неправильное имя пользователя или пароль</message></error>\n';
            } else {
                response += '<auth>true</auth>\n';
            }
            response += `<port>${port}</port>\n</xml>`;

            res.setHeader('Content-Type', 'text/xml; charset=utf-8');
            res.setHeader('Cache-Control', 'private, max-age=0');
            res.end(response);
            return;
        }

        if (parsed.pathname == '/err500') {
            res.statusCode = 500;
            res.statusMessage = 'Internal server error';
            res.end('Internal server error');
            return;
        }

        if (parsed.pathname == '/errFormat') {
            let response = '<?xml version="1.0" encoding="utf-8"?>\n<xml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://morpher.ru/"\n';
            res.setHeader('Content-Type', 'text/xml; charset=utf-8');
            res.setHeader('Cache-Control', 'private, max-age=0');
            res.end(response);
            return;
        }

        if (parsed.pathname == '/errFormat2') {
            res.end('aaa');
            return;
        }

        if (parsed.pathname == '/err') {
            let response = '<?xml version="1.0" encoding="utf-8"?>\n<xml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://morpher.ru/">\n';
            response += `<error>\n<code>${parsed.query['code']}</code>\n<message>Error message</message>\n</error>\n</xml>`;
            res.setHeader('Content-Type', 'text/xml; charset=utf-8');
            res.setHeader('Cache-Control', 'private, max-age=0');
            res.end(response);
            return;
        }

        if (parsed.pathname == '/errAuth') {
            res.setHeader('Content-Type', 'text/xml; charset=utf-8');
            res.setHeader('Cache-Control', 'private, max-age=0');
            res.end('<error>\n<code>9</code>\n<message>Неправильное имя пользователя или пароль.</message>\n</error>');
            return;
        }

        if (parsed.pathname == '/WebService.asmx/GetXml' || parsed.pathname == '/WebService.asmx/Propis') {
            res.setHeader('Content-Type', 'text/xml; charset=utf-8');
            res.setHeader('Cache-Control', 'private, max-age=0');
            res.end('<error>\n<code>3</code>\n<message>test</message>\n</error>');
            return;
        }
    });

    server.listen(port, callback);
};
