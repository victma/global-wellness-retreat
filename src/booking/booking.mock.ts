import { Repository } from "typeorm";
import { Booking } from "./booking.entity";
import { BookingService } from "./booking.service";

export const mockBookingService: Partial<BookingService> = {
  create: (booking) => {
    return Promise.resolve({ id: 1, ...booking });
  },
};

export const mockBookingRepository: Partial<Repository<Booking>> = {
  save: (b) => Promise.resolve(b),
};
