import { Test, TestingModule } from "@nestjs/testing";
import { BookingService } from "./booking.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Booking, NewBooking } from "./booking.entity";
import { Repository } from "typeorm";

describe("BookingService", () => {
  let service: BookingService;
  const bookingRepositoryMock: Partial<Repository<Booking>> = {
    save: (b) => Promise.resolve(b),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(Booking),
          useValue: bookingRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
  });

  describe("create", () => {
    it("should save the new booking in the database", async () => {
      const newBooking: NewBooking = {
        email: "test@mail.com",
        language: "fr",
        countryOfOrigin: "fr",
        countryOfDestination: "es",
        travelDateStart: new Date(),
        travelDateEnd: new Date(),
      };

      const saveSpy = jest.spyOn(bookingRepositoryMock, "save");

      await service.create(newBooking);

      expect(saveSpy).toHaveBeenCalled();
    });
  });
});
