import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  getRepositoryToken,
} from "@nestjs/typeorm";
import { BookingModule } from "../src/booking/booking.module";
import { Booking } from "../src/booking/booking.entity";
import { Repository } from "typeorm";

const typeOrmConfig: TypeOrmModuleOptions = {
  type: "sqlite",
  database: "db-test.sql",
  synchronize: true,
  autoLoadEntities: true,
};

describe("Booking endpoints (e2e)", () => {
  let app: INestApplication;
  let bookingRepository: Repository<Booking>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeOrmConfig), BookingModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    bookingRepository = app.get(getRepositoryToken(Booking));
  });

  beforeEach(() => {
    bookingRepository.delete({});
  });

  describe("/booking (POST)", () => {
    // Valid request
    it("should return 201 if request is valid", () => {
      return request(app.getHttpServer())
        .post("/booking")
        .send({
          email: "test@mail.com",
          language: "fr",
          countryOfOrigin: "fr",
          countryOfDestination: "es",
          travelDateStart: "2023-12-25",
          travelDateEnd: "2024-01-05",
        })
        .expect(201);
    });

    // Missing parameters
    it("should return 400 if parameter is missing - email", async () => {
      const res = await request(app.getHttpServer()).post("/booking").send({
        language: "fr",
        countryOfOrigin: "fr",
        countryOfDestination: "es",
        travelDateStart: "2023-12-25",
        travelDateEnd: "2024-01-05",
      });
      expect(res.status).toEqual(400);
      expect(res.body.message).toContain("email must be an email");
    });

    it("should return 400 if parameter is missing - language", async () => {
      const res = await request(app.getHttpServer()).post("/booking").send({
        email: "test@mail.com",
        countryOfOrigin: "fr",
        countryOfDestination: "es",
        travelDateStart: "2023-12-25",
        travelDateEnd: "2024-01-05",
      });
      expect(res.status).toEqual(400);
      expect(res.body.message).toContain("language must be locale");
    });

    it("should return 400 if parameter is missing - countryOfOrigin", async () => {
      const res = await request(app.getHttpServer()).post("/booking").send({
        email: "test@mail.com",
        language: "fr",
        countryOfDestination: "es",
        travelDateStart: "2023-12-25",
        travelDateEnd: "2024-01-05",
      });
      expect(res.status).toEqual(400);
      expect(res.body.message).toContain(
        "countryOfOrigin must be a valid ISO31661 Alpha2 code",
      );
    });

    it("should return 400 if parameter is missing - countryOfDestination", async () => {
      const res = await request(app.getHttpServer()).post("/booking").send({
        email: "test@mail.com",
        language: "fr",
        countryOfOrigin: "fr",
        travelDateStart: "2023-12-25",
        travelDateEnd: "2024-01-05",
      });
      expect(res.status).toEqual(400);
      expect(res.body.message).toContain(
        "countryOfDestination must be a valid ISO31661 Alpha2 code",
      );
    });

    it("should return 400 if parameter is missing - travelDateStart", async () => {
      const res = await request(app.getHttpServer()).post("/booking").send({
        email: "test@mail.com",
        language: "fr",
        countryOfOrigin: "fr",
        countryOfDestination: "es",
        travelDateEnd: "2024-01-05",
      });
      expect(res.status).toEqual(400);
      expect(res.body.message).toContain(
        "travelDateStart must be a valid ISO 8601 date string",
      );
    });

    it("should return 400 if parameter is missing - travelDateEnd", async () => {
      const res = await request(app.getHttpServer()).post("/booking").send({
        email: "test@mail.com",
        language: "fr",
        countryOfOrigin: "fr",
        countryOfDestination: "es",
        travelDateStart: "2023-12-25",
      });
      expect(res.status).toEqual(400);
      expect(res.body.message).toContain(
        "travelDateEnd must be a valid ISO 8601 date string",
      );
    });

    // Invalid parameters
    it("should return 400 if parameter is invalid - email", async () => {
      const res = await request(app.getHttpServer()).post("/booking").send({
        email: "not.an.email",
        language: "fr",
        countryOfOrigin: "fr",
        countryOfDestination: "es",
        travelDateStart: "2023-12-25",
        travelDateEnd: "2024-01-05",
      });
      expect(res.status).toEqual(400);
      expect(res.body.message).toContain("email must be an email");
    });

    it("should return 400 if parameter is invalid - language", async () => {
      const res = await request(app.getHttpServer()).post("/booking").send({
        email: "test@mail.com",
        language: "not a locale",
        countryOfOrigin: "fr",
        countryOfDestination: "es",
        travelDateStart: "2023-12-25",
        travelDateEnd: "2024-01-05",
      });
      expect(res.status).toEqual(400);
      expect(res.body.message).toContain("language must be locale");
    });

    it("should return 400 if parameter is invalid - countryOfOrigin", async () => {
      const res = await request(app.getHttpServer()).post("/booking").send({
        email: "test@mail.com",
        language: "fr",
        countryOfOrigin: "France",
        countryOfDestination: "es",
        travelDateStart: "2023-12-25",
        travelDateEnd: "2024-01-05",
      });
      expect(res.status).toEqual(400);
      expect(res.body.message).toContain(
        "countryOfOrigin must be a valid ISO31661 Alpha2 code",
      );
    });

    it("should return 400 if parameter is invalid - countryOfDestination", async () => {
      const res = await request(app.getHttpServer()).post("/booking").send({
        email: "test@mail.com",
        language: "fr",
        countryOfOrigin: "fr",
        countryOfDestination: "fra",
        travelDateStart: "2023-12-25",
        travelDateEnd: "2024-01-05",
      });
      expect(res.status).toEqual(400);
      expect(res.body.message).toContain(
        "countryOfDestination must be a valid ISO31661 Alpha2 code",
      );
    });

    it("should return 400 if parameter is invalid - travelDateStart", async () => {
      const res = await request(app.getHttpServer()).post("/booking").send({
        email: "test@mail.com",
        language: "fr",
        countryOfOrigin: "fr",
        countryOfDestination: "es",
        travelDateStart: "2023-25-02",
        travelDateEnd: "2024-01-05",
      });
      expect(res.status).toEqual(400);
      expect(res.body.message).toContain(
        "travelDateStart must be a valid ISO 8601 date string",
      );
    });

    it("should return 400 if parameter is invalid - travelDateEnd", async () => {
      const res = await request(app.getHttpServer()).post("/booking").send({
        email: "test@mail.com",
        language: "fr",
        countryOfOrigin: "fr",
        countryOfDestination: "es",
        travelDateStart: "2023-12-25",
        travelDateEnd: "01/05/2024",
      });
      expect(res.status).toEqual(400);
      expect(res.body.message).toContain(
        "travelDateEnd must be a valid ISO 8601 date string",
      );
    });
  });

  afterAll(async () => await app.close());
});
