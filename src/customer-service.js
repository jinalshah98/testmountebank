const mbHelper = require('./mountebank-helper');
const settings = require('./settings');

function addService() {
    const stubs = [
        {
            predicates: [{
                and: [
                    { equals: { method: "GET" } },
                    { startsWith: { "path": "/card-account-updater-reporting/api/customers/" } }
                ]
            }],
            responses: [
                {
                    is: {
                        statusCode: 200,
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: '${row}[json]'
                    },
                    _behaviors: {
                        lookup: [
                            {
                                "key": {
                                  "from": "path",
                                  "using": { "method": "regex", "selector": "/card-account-updater-reporting/api/customers/(.*)$" },
                                  "index": 1
                                },
                                "fromDataSource": {
                                  "csv": {
                                    "path": "data/customers.csv",
                                    "keyColumn": "id"
                                  }
                                },
                                "into": "${row}"
                              }
                        ]
                    }
                }
            ]
        }
    ];

    const imposter = {
        port: settings.customer_service_port,
        protocol: 'http',
        stubs: stubs
    };

    return mbHelper.postImposter(imposter);
}

module.exports = { addService };