import { Body, Controller, Post } from "@nestjs/common";
import { GenerateApiKeyDto } from "./auth.dto";
import { AuthService } from "./auth.service";

/**
 * This controller is only a helper to generate dev API keys
 * It is not intended for production usage as is (and not covered by tests)
 */
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("new-key")
  generateNewKey(@Body() { partnerId }: GenerateApiKeyDto) {
    const newKey = this.authService.generateNewKey(partnerId);

    return newKey;
  }
}
