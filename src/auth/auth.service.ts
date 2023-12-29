import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ApiKey } from "./apiKey.entity";
import { Repository } from "typeorm";
import { randomBytes } from "crypto";
import * as bcrypt from "bcrypt";

const HASH_SALT_ROUNDS = 10;
const NEW_KEY_COLLISION_RETRIES = 3;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {}

  async validate(apiKey: string, partnerId: string) {
    const partnerKeysHash = await this.findByPartnerId(partnerId);

    for (const hash of partnerKeysHash) {
      const valid = await bcrypt.compare(apiKey, hash);
      if (valid) {
        return true;
      }
    }

    return false;
  }

  async generateNewKey(partnerId: string) {
    let apiKey: string | null = null;
    let hash = "";

    for (let i = 0; i < NEW_KEY_COLLISION_RETRIES; i++) {
      const generatedKey = randomBytes(48).toString("base64");
      hash = await this.hash(generatedKey);

      const hashExists = await this.apiKeyRepository.exist({ where: { hash } });
      if (!hashExists) {
        apiKey = generatedKey;
        break;
      }
    }

    if (!apiKey) throw new Error("Could not generate a new API key");

    await this.apiKeyRepository.insert({ hash, partnerId });

    return apiKey;
  }

  hash(key: string) {
    return bcrypt.hash(key, HASH_SALT_ROUNDS);
  }

  async findByPartnerId(partnerId: string) {
    const keys = await this.apiKeyRepository.findBy({ partnerId });

    return keys.map((k) => k.hash);
  }
}
