import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  language: string;

  @Column()
  countryOfOrigin: string;

  @Column()
  countryOfDestination: string;

  @Column()
  travelDateStart: Date;

  @Column()
  travelDateEnd: Date;
}

export type NewBooking = Omit<Booking, "id">;
