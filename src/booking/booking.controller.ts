import { Body, Controller, Post } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./booking.dto";

@Controller("booking")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  createBooking(@Body() createBookingDto: CreateBookingDto) {
    this.bookingService.create(createBookingDto);

    return;
  }
}
