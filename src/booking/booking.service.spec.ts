import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Booking, NewBooking } from "./booking.entity";
import { mockBookingRepository } from "./booking.mock";
import { BookingService } from "./booking.service";

describe("BookingService", () => {
  let service: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
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

      const saveSpy = jest.spyOn(mockBookingRepository, "save");

      await service.create(newBooking);

      expect(saveSpy).toHaveBeenCalled();
    });
  });
});
