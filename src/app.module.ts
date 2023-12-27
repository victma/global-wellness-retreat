import { Module } from "@nestjs/common";
import { BookingModule } from "./booking/booking.module";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

const typeOrmConfig: TypeOrmModuleOptions = {
  type: "sqlite",
  database: "db-dev.sql",
  synchronize: true,
  autoLoadEntities: true,
};

@Module({
  imports: [BookingModule, TypeOrmModule.forRoot(typeOrmConfig)],
})
export class AppModule {}
