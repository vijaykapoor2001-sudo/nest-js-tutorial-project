import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Prisma } from "generated/prisma";
import * as pactum from 'pactum';
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "src/auth/dto";
import { EditUserDto } from "src/user/dto";


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
      pactum.request.setBaseUrl('http://localhost:3333');
  }); 

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
      const dto: AuthDto = {
        email: 'tt1@tt.com',
        password: 'tt123',
      }; 
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          //.inspect();
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(201)
          //.inspect();
          .stores('userAt', 'access_token');
      });
    });
  });
  
  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
              Authorization: 'Bearer $S{userAt}',  // backticks, not bare variable
        })
          .expectStatus(200)
      });
    });
          

    describe('Edit user', () => {
      it('should edit  user', () => {
        const dto : EditUserDto = {
          firstName: "tt1",
          email: 'tt1@tt.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
              Authorization: `Bearer $S{userAt}`,  // backticks, not bare variable
        })
          .withBody(dto)
          .expectStatus(200);
        });
    });
  });   

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {});

    describe('Get bookmarks', () => {});

    describe('Get bookmark by id', () => {});

    describe('Edit bookmark by id', () => {});

    describe('Delete bookmark by id', () => {});
  });
       
  
});
