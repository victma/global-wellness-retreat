import { Test, TestingModule } from "@nestjs/testing";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { mockAuthService } from "./auth.mock";

describe("AuthGuard", () => {
  let guard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  describe("canActivate", () => {
    it("should reject request if partner id is missing", () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { "x-gwr-key": "key" },
          }),
        }),
      } as ExecutionContext;

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it("should reject request if api key is missing", () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { "x-gwr-id": "partner-id" },
          }),
        }),
      } as ExecutionContext;

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it("should return false if api key is invalid", async () => {
      const validateSpy = jest
        .spyOn(mockAuthService, "validate")
        .mockResolvedValue(false);

      const apiKey = "api-key";
      const partnerId = "partner-id";
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { "x-gwr-key": apiKey, "x-gwr-id": partnerId },
          }),
        }),
      } as ExecutionContext;

      const result = await guard.canActivate(context);

      expect(result).toBe(false);
      expect(validateSpy).toHaveBeenCalledWith(apiKey, partnerId);
    });

    it("should return true if api key is valid", async () => {
      const validateSpy = jest
        .spyOn(mockAuthService, "validate")
        .mockResolvedValue(true);

      const apiKey = "api-key";
      const partnerId = "partner-id";
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { "x-gwr-key": apiKey, "x-gwr-id": partnerId },
          }),
        }),
      } as ExecutionContext;

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(validateSpy).toHaveBeenCalledWith(apiKey, partnerId);
    });
  });
});
