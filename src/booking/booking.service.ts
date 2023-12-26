import { Injectable } from "@nestjs/common";
import { Booking } from "./booking.model";

@Injectable()
export class BookingService {
  create(booking: Booking) {
    console.log(`Create new booking for ${booking.email}`);
  }
}
