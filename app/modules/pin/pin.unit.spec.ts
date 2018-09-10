import * as chai from 'chai';
import * as supertest from 'supertest';
import * as sinon from 'sinon';
import { app } from '../../../server';
import Pin from '../../models/pin.model';

const expect = chai.expect;
describe('Unit Testing', () => {
  let sandbox: sinon.SinonSandbox = null;
  beforeEach((done) => {
    sandbox = sinon.createSandbox();
    done();
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('Pin API', () => {
    describe('GET /api/pins', () => {
      const pinObj = {
        '_id': '5b9647d15b6766dd718b4211',
        'code': '1234',
        'phone': '1',
        'created_at': '2018-09-10T10:30:41.063Z',
        'updated_at': '2018-09-10T10:30:41.063Z',
        '__v': 0
      };

      it('should get wallets successfully', (done) => {
        sandbox
          .mock(Pin)
          .expects('findOne')
          .resolves(pinObj);
        supertest(app)
          .get('/api/pins/1')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.deep.equals(pinObj);
              done();
            }
          });
      });
      it('should throw 500 internal server error if wallet id is wrong', (done) => {
        sandbox
          .mock(Pin)
          .expects('findOne')
          .resolves(Error);
        supertest(app)
          .get('/api/pins/asfdf')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(500);
              done();
            }
          });
      });
      it('should throw 404 if wallet id does not exist', (done) => {
        sandbox
          .mock(Pin)
          .expects('findOne')
          .resolves(null);
        supertest(app)
          .get('/api/pins/5')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(404);
              done();
            }
          });
      });
      it('should throw 500 if server error while reading db', (done) => {
        sandbox
          .mock(Pin)
          .expects('findOne')
          .throws(null);
        supertest(app)
          .get('/api/pins/53')
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(500);
              done();
            }
          });
      });
    });
    describe('POST /api/pins/', () => {
      const pinObj = {
        'code': '1234',
        'phone': '1'
      };
      const pinReturn = {
        '_id': '5b964b2753927fddb77f1f0b',
        'code': '1234',
        'phone': '1',
        'created_at': '2018-09-10T10:44:55.218Z',
        'updated_at': '2018-09-10T10:44:55.218Z',
        '__v': 0
      };
      it('should save pin successfully', (done) => {
        sandbox
          .mock(Pin)
          .expects('create')
          .resolves(pinReturn);
        supertest(app)
          .post('/api/pins')
          .send(pinObj)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(200);
              done();
            }
          });
      });
      it('should throw 500 if server error while writing db', (done) => {
        sandbox
          .mock(Pin)
          .expects('create')
          .throws(null);
        supertest(app)
          .post('/api/pins')
          .send(pinObj)
          .end((err: any, res: supertest.Response) => {
            if (err) {
              done(err);
            } else {
              expect(res.status).to.equal(500);
              done();
            }
          });
      });
    });
  });
});