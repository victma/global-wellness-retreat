import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./booking.dto";
import { AuthGuard } from "../auth/auth.guard";

@Controller("booking")
@UseGuards(AuthGuard)
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
}
