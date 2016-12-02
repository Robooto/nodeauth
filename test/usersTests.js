const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET /users/register', () => {

    it('responses with a registration view', () => {
        return chai.request(app).get('/users/register')
            .then((res) => {
                expect(res).to.be.html;
                expect(res).to.have.status(200);
            });
    });

    it('Creates new registration', () => {
        return chai.request(app).post('/users/register')
            .send({name: 'Paul', username: 'Paul', email: 'paul@paul.com', password: '123', password2: '123'})
            .then((res) => {
                expect(res).to.redirect;
            });
    });
});