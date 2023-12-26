import {
  IsDateString,
  IsEmail,
  IsISO31661Alpha2,
  IsLocale,
} from "class-validator";

export class CreateBookingDto {
  @IsEmail()
  email: string;

  @IsLocale()
  language: string;

  @IsISO31661Alpha2()
  countryOfOrigin: string;

  @IsISO31661Alpha2()
  countryOfDestination: string;

  @IsDateString({ strict: true })
  travelDateStart: string;

  @IsDateString({ strict: true })
  travelDateEnd: string;
}
