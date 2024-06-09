import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should authenticate user and return access token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'john', email: 'stop@mail.ru', password: 'changeme' })
      .expect(200);
    expect(response.body).toHaveProperty('access_token');
  });

  it('should return 401 when invalid credentials are provided', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'john', email: 'stop@mail.ru', password: 'wrongpassword' })
      .expect(401);
  });

  it('should return 200 when accessing a protected route with a valid token', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'john', email: 'stop@mail.ru', password: 'changeme' })
      .expect(200);

    const token = loginResponse.body.access_token;

    await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('should return 401 when accessing a protected route without a token', async () => {
    await request(app.getHttpServer())
      .get('/profile')
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
