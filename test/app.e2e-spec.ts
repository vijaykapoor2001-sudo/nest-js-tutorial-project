import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Prisma } from "generated/prisma";
import * as pactum from 'pactum';
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "src/auth/dto";


describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

      app = moduleRef.createNestApplication();
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,              // strips non-decorated fields
          forbidNonWhitelisted: true,  // throws if extra fields sent
          transform: true,             // converts payloads to DTO instances
        }), 
      );
      await app.init();
      await app.listen(3333);

      prisma = app.get(PrismaService);
      await prisma.cleanDb();
  }); 

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      it('should signup', () => {
        const dto: AuthDto = {
          email: 'tt2@tt.com',
          password: 'tt123',
        };
        return pactum
          .spec()
          .post('http://localhost:3333/auth/signup')
          .withBody(dto)
          .expectStatus(201)
      });
    });

    describe('Signin', () => {
      it.todo('should signin');
    }); 
  });

  describe('User', () => {
    describe('Get me', () => {});

    describe('Edit user', () => {});
  });   

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {});

    describe('Get bookmarks', () => {});

    describe('Get bookmark by id', () => {});

    describe('Edit bookmark by id', () => {});

    describe('Delete bookmark by id', () => {});
  });
       
  
});
