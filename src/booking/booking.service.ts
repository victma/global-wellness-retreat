import { Injectable } from "@nestjs/common";
import { Booking, NewBooking } from "./booking.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  create(booking: NewBooking): Promise<Booking> {
    return this.bookingRepository.save(booking);
  }
}
