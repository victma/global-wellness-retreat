import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./booking.dto";

@Controller("booking")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  createBooking(@Body() createBookingDto: CreateBookingDto) {
    const startDate = new Date(createBookingDto.travelDateStart);
    const endDate = new Date(createBookingDto.travelDateEnd);

    if (endDate <= startDate) {
      throw new BadRequestException(
        "travelDateEnd must be after travelDateStart",
      );
    }

    this.bookingService.create({
      ...createBookingDto,
      travelDateStart: startDate,
      travelDateEnd: endDate,
    });

    return;
  }

  @Get()
  getAllBookings() {
    return this.bookingService.findAll();
  }
}
