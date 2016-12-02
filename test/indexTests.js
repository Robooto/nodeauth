const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET /index', () => {

    it('response with a view', () => {
        return chai.request(app).get('/')
            .then((res) => {
                expect(res).to.be.html;
                expect(res).to.have.status(200);
            });
    });
});