const tedious = require('tedious');

const config = {
    server: 'localhost',
    options: {
        database: 'pacl'
    },
    authentication: {
        type: 'default',
        options: {
            userName: 'sa',
            password: 'password'
        }
    }
};

const executeSql = (query, params, queryType) => new Promise((resolve, reject) => {
    let result = null;
    const connection = new tedious.Connection(config);
    connection.connect();
    const request = new tedious.Request(query, (err) => {
        if (err) reject(err);
        else resolve(result);
        connection.close();
    });
    for (let param of params) request.addParameter(param.name, param.type, param.value);

    connection.on('connect', (err) => {
        if (err) reject(err);
        else connection.execSql(request);
    });

    request.on('row', (columns) => {
        if (!result) result = [];
        const row = {};
        for (let column of columns) row[column.metadata.colName] = column.value;
        result.push(row);
    });

    request.on('doneProc', () => {
        if (!result) {
            if (queryType === 'INSERT' || queryType === 'UPDATE') result = { status: 'success' };
            else if (queryType === 'SELECT') result = [];
        }
    });
});

module.exports = { executeSql };