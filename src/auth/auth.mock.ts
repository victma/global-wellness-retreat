import { InsertResult, Repository } from "typeorm";
import { ApiKey } from "./apiKey.entity";
import { AuthService } from "./auth.service";

export const mockAuthService: Partial<AuthService> = {
  validate: () => Promise.resolve(false),
};

export const mockApiKeyRepository: Partial<Repository<ApiKey>> = {
  findBy: () => Promise.resolve([]),
  insert: () => Promise.resolve({} as InsertResult),
  exist: () => Promise.resolve(true),
};
