import { Test } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./booking.dto";
import { AuthService } from "../auth/auth.service";

const createBookingDto: CreateBookingDto = {
  email: "test@mail.com",
  language: "fr",
  countryOfOrigin: "fr",
  countryOfDestination: "es",
  travelDateStart: "2023-12-25",
  travelDateEnd: "2024-01-05",
};

const bookingServiceMock: Pick<BookingService, "create"> = {
  create: (booking) => {
    return Promise.resolve({ id: 1, ...booking });
  },
};
const authServiceMock: Pick<AuthService, "validate"> = {
  validate: () => Promise.resolve(true),
};

describe("BookingController", () => {
  let bookingController: BookingController;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        {
          provide: BookingService,
          useValue: bookingServiceMock,
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    bookingController = testingModule.get(BookingController);
  });

  describe("createBooking", () => {
    it("should return undefined", () => {
      expect(bookingController.createBooking(createBookingDto)).toBeUndefined();
    });

    it("should throw an error if end date is before start date", () => {
      expect(() =>
        bookingController.createBooking({
          ...createBookingDto,
          travelDateStart: "2023-12-25",
          travelDateEnd: "2022-01-05",
        }),
      ).toThrow(BadRequestException);
    });
  });
});
