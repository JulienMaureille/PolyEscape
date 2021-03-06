/**
 * Created by Julien on 17/01/2018.
 */

var chai = require('chai');
var expect = chai.expect;
const apiAdress= 'http://localhost:8080';

var assert = require('assert'),
    http = require('http');

describe('getAllScenarios', function () {

    it('should return 200', function (done) {
        http.get(apiAdress+'/getAllScenarios', function (res) {
            assert.equal(200, res.statusCode);
            done();
        });
    });

    it('should return an array of scenarios', function (done) {
        http.get(apiAdress+'/getAllScenarios', function (res) {
            var data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {

                obj = JSON.parse(data);
                expect(obj).to.have.property('scenarios');

                for(let i=0;i<obj["scenarios"].length;i++)
                    expect(obj["scenarios"][i]).to.have.all.keys('id', 'name', 'nbPlayers', 'timeInMinuts', 'summary', 'missions', 'skills', 'image');

                done();
            });

        });
    });
});

describe('addGame', function () {

    var gameName;
    var playerName;

    before(function() {
        gameName = randomName();
        playerName = randomName();

    });

    it('should return 404 if there is no game name', function (done) {
        http.get(apiAdress+'/addGame', function (res) {
            assert.equal(404, res.statusCode);
            done();
        });
    });

    it('should return 404 if there is no user name', function (done) {
        http.get(apiAdress+'/addGame/'+gameName, function (res) {
            assert.equal(404, res.statusCode);
            done();
        });
    });

    it('should return the game if it has been created', function (done) {
        http.get(apiAdress+'/addGame/'+gameName+'/'+playerName, function (res) {
            var data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {

                obj = JSON.parse(data);

                assert.equal(200, res.statusCode);

                expect(obj).to.have.property('game');
                expect(obj["game"]).to.have.all.keys('id', 'name', 'players', 'inventory', 'missions', 'indications', 'chief', 'helpRequest', 'skills', 'users');

                done();
            });

        });
    });


    it('should return a 403 error if an existing game has the same name', function (done) {
        http.get(apiAdress+'/addGame/'+gameName+'/'+playerName, function (res) {
            assert.equal(403, res.statusCode);
            done();
        });
    });
});


describe('getGame', function () {

    var gameName;
    var gameNameThatNotExists;
    var playerName;

    before(function() {
        gameName = randomName();
        gameNameThatNotExists = randomName();
        playerName = randomName();

        http.get(apiAdress+'/addGame/'+gameName+'/'+playerName, function (res) {
        });
    });

    it('should return 200 if the game exists', function (done) {
        http.get(apiAdress+'/getGame/'+gameName, function (res) {
            assert.equal(200, res.statusCode);
            done();
        });
    });

    it('should return the game if exists', function (done) {
        http.get(apiAdress+'/getGame/'+gameName, function (res) {
            var data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {

                obj = JSON.parse(data);

                expect(obj).to.have.property('game');
                expect(obj["game"]).to.have.all.keys('id', 'name', 'players', 'inventory', 'missions', 'indications', 'chief', 'helpRequest', 'skills', 'users');

                done();
            });

        });
    });

    it('should return a 404 error if not exists', function (done) {
        http.get(apiAdress+'/getGame/'+gameNameThatNotExists, function (res) {
            var data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {

                assert.equal(404, res.statusCode);

                done();
            });

        });
    });
});

describe('getInventory', function () {

    var gameName;
    var gameNameThatNotExists;
    var playerName;

    before(function() {
        gameName = randomName();
        gameNameThatNotExists = randomName();
        playerName = randomName();

        http.get(apiAdress+'/addGame/'+gameName+'/'+playerName, function (res) {
        });
    });

    it('should return 200 if the game exists', function (done) {
        http.get(apiAdress+'/getInventory/'+gameName, function (res) {
            assert.equal(200, res.statusCode);
            done();
        });
    });

    it('should return the inventory if exists', function (done) {
        http.get(apiAdress+'/getInventory/'+gameName, function (res) {
            var data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {

                obj = JSON.parse(data);
                expect(obj).to.have.property('inventory');

                done();
            });

        });
    });

    it('should return a 404 error if the game does not exists', function (done) {
        http.get(apiAdress+'/getInventory/'+gameNameThatNotExists, function (res) {
            var data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {

                assert.equal(404, res.statusCode);

                done();
            });

        });
    });
});


// describe('addItem', function () {
//
//     var gameName;
//     var gameNameThatNotExists;
//     var playerName;
//     var item;
//
//
//     before(function() {
//         gameName = randomName();
//         gameNameThatNotExists = randomName();
//         playerName = randomName();
//         item = randomName();
//
//         http.get(apiAdress+'/addGame/'+gameName+'/'+playerName, function (res) {
//         });
//     });
//
//
//     it('should return a 404 error if the game does not exists', function (done) {
//         http.get(apiAdress+'/addItem/'+gameNameThatNotExists+'/'+item, function (res) {
//             var data = '';
//
//             res.on('data', function (chunk) {
//                 data += chunk;
//             });
//
//             res.on('end', function () {
//
//                 assert.equal(404, res.statusCode);
//
//                 done();
//             });
//
//         });
//     });
//
//     it('should return 200 if the game exists', function (done) {
//         http.get(apiAdress+'/addItem/'+gameName+'/'+item, function (res) {
//             assert.equal(200, res.statusCode);
//             done();
//         });
//     });
//
//     it('should return the game if the item has been added', function (done) {
//         http.get(apiAdress+'/addItem/'+gameName+'/'+item, function (res) {
//             var data = '';
//             res.on('data', function (chunk) {
//                 data += chunk;
//             });
//
//             res.on('end', function () {
//
//                 obj = JSON.parse(data);
//
//                 assert.equal(200, res.statusCode);
//
//                 expect(obj).to.have.property('game');
//                 expect(obj["game"]).to.have.all.keys('id', 'name', 'players', 'inventory', 'missions', 'indications', 'chief');
//
//                 done();
//             });
//
//         });
//     });
//     it('should return the inventory if the item has been added', function (done) {
//         http.get(apiAdress+'/addItem/'+gameName+'/'+item, function (res) {
//             var data = '';
//             res.on('data', function (chunk) {
//                 data += chunk;
//             });
//
//             res.on('end', function () {
//
//                 obj = JSON.parse(data);
//
//                 assert.equal(200, res.statusCode);
//
//
//                 // expect(obj).to.have.property('inventory');
//                 // for(let i=0;i<obj["inventory"].length;i++)
//                 //     expect(obj["inventory"]).to.have.all.keys('name', 'pathImg');
//
//                 done();
//             });
//
//         });
//     });
// });

describe('addIndication', function () {

    var gameName;
    var gameNameThatNotExists;
    var playerName;
    var indication;


    before(function() {
        gameName = randomName();
        gameNameThatNotExists = randomName();
        playerName = randomName();
        indication = randomName();

        http.get(apiAdress+'/addGame/'+gameName+'/'+playerName, function (res) {
        });
    });


    it('should return a 404 error if the game does not exists', function (done) {
        http.get(apiAdress+'/addIndication/'+gameNameThatNotExists+'/'+indication, function (res) {
            var data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {

                assert.equal(404, res.statusCode);

                done();
            });

        });
    });

    it('should return 200 if the game exists', function (done) {
        http.get(apiAdress+'/addIndication/'+gameName+'/'+indication, function (res) {
            assert.equal(200, res.statusCode);
            done();
        });
    });

    it('should return the game and the inventory if it has been added', function (done) {
        http.get(apiAdress+'/addIndication/'+gameName+'/'+indication, function (res) {
            var data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {

                obj = JSON.parse(data);

                assert.equal(200, res.statusCode);

                expect(obj).to.have.property('game');
                expect(obj["game"]).to.have.all.keys('id', 'name', 'players', 'inventory', 'missions', 'indications', 'chief', 'helpRequest', 'skills', 'users');

                done();
            });

        });
    });
});



describe('getIndications', function () {

    var gameName;
    var gameNameThatNotExists;
    var playerName;

    before(function() {
        gameName = randomName();
        gameNameThatNotExists = randomName();
        playerName = randomName();

        http.get(apiAdress+'/addGame/'+gameName+'/'+playerName, function (res) {
        });
    });

    it('should return 200 if the game exists', function (done) {
        http.get(apiAdress+'/getIndications/'+gameName, function (res) {
            assert.equal(200, res.statusCode);
            done();
        });
    });

    it('should return the inventory if exists', function (done) {
        http.get(apiAdress+'/getIndications/'+gameName, function (res) {
            var data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {

                obj = JSON.parse(data);
                expect(obj).to.have.property('indications');

                done();
            });

        });
    });

    it('should return a 404 error if the game does not exists', function (done) {
        http.get(apiAdress+'/getIndications/'+gameNameThatNotExists, function (res) {
            var data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {

                assert.equal(404, res.statusCode);

                done();
            });

        });
    });
});


/**
 * Generate a random name
 * @returns {string}
 */
function randomName(){
    return Math.random().toString(36).substr(2);
};