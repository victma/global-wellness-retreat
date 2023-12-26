import { Test } from "@nestjs/testing";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./booking.dto";

const createBookingDto: CreateBookingDto = {
  email: "test@mail.com",
  language: "fr",
  countryOfOrigin: "fr",
  countryOfDestination: "es",
  travelDateStart: "2023-12-25",
  travelDateEnd: "2024-01-05",
};

describe("BookingController", () => {
  let bookingController: BookingController;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [BookingService],
    }).compile();

    bookingController = testingModule.get(BookingController);
  });

  describe("createBooking", () => {
    it("should return undefined", () => {
      expect(bookingController.createBooking(createBookingDto)).toBeUndefined();
    });
  });
});
