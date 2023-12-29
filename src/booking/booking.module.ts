import { Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Booking } from "./booking.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), AuthModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
