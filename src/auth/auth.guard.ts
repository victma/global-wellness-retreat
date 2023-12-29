import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const apiKey = req.headers["x-gwr-key"];
    const partnerId = req.headers["x-gwr-id"];

    if (typeof apiKey !== "string" || typeof partnerId !== "string") {
      throw new UnauthorizedException();
    }

    return this.authService.validate(apiKey, partnerId);
  }
}
