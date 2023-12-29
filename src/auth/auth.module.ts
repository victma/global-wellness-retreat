import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApiKey } from "./apiKey.entity";
import { AuthController } from "./auth.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ApiKey])],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
