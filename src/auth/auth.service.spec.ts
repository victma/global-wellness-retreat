import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { ApiKey } from "./apiKey.entity";
import { mockApiKeyRepository } from "./auth.mock";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(ApiKey),
          useValue: mockApiKeyRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("validate", () => {
    it("should return true if the key is valid", async () => {
      const apiKey = "api_key";
      const hash = "hash";
      const partnerId = "partner";

      const findBySpy = jest
        .spyOn(mockApiKeyRepository, "findBy")
        .mockResolvedValue([{ partnerId, hash }]);
      const compareSpy = jest
        .spyOn(bcrypt, "compare")
        .mockImplementation(() => Promise.resolve(true));

      const result = await service.validate(apiKey, partnerId);
      expect(result).toBe(true);
      expect(findBySpy).toHaveBeenCalled();
      expect(compareSpy).toHaveBeenCalledWith(apiKey, hash);
    });

    it("should return false if the key doesn't exist", async () => {
      const apiKey = "wrong_api_key";
      const hash = "hash";
      const partnerId = "partner";

      const findBySpy = jest
        .spyOn(mockApiKeyRepository, "findBy")
        .mockResolvedValue([{ partnerId, hash }]);
      const compareSpy = jest
        .spyOn(bcrypt, "compare")
        .mockImplementation(() => Promise.resolve(false));

      const result = await service.validate(apiKey, partnerId);
      expect(result).toBe(false);
      expect(findBySpy).toHaveBeenCalled();
      expect(compareSpy).toHaveBeenCalledWith(apiKey, hash);
    });

    it("should return false if the partner doesn't exist", async () => {
      const apiKey = "wrong_api_key";
      const partnerId = "partner";

      const findBySpy = jest
        .spyOn(mockApiKeyRepository, "findBy")
        .mockResolvedValue([]);
      const compareSpy = jest.spyOn(bcrypt, "compare");

      const result = await service.validate(apiKey, partnerId);
      expect(result).toBe(false);
      expect(findBySpy).toHaveBeenCalled();
      expect(compareSpy).not.toHaveBeenCalled();
    });
  });

  describe("generateNewKey", () => {
    it("should save a new hashed key in the database", async () => {
      const partnerId = "partner-id";

      const hashSpy = jest
        .spyOn(bcrypt, "hash")
        .mockImplementation(() => Promise.resolve("key-hash"));
      const existSpy = jest
        .spyOn(mockApiKeyRepository, "exist")
        .mockResolvedValue(false);
      const insertSpy = jest.spyOn(mockApiKeyRepository, "insert");

      const newKey = await service.generateNewKey(partnerId);

      expect(hashSpy).toHaveBeenCalledWith(newKey, expect.any(Number));
      expect(existSpy).toHaveBeenCalledWith({ where: { hash: "key-hash" } });
      expect(insertSpy).toHaveBeenCalledWith({ hash: "key-hash", partnerId });
    });

    it("should retry on hash collision", async () => {
      const partnerId = "partner-id";

      const hashSpy = jest
        .spyOn(bcrypt, "hash")
        .mockImplementationOnce(() => Promise.resolve("key-hash-1"))
        .mockImplementationOnce(() => Promise.resolve("key-hash-2"));
      const existSpy = jest
        .spyOn(mockApiKeyRepository, "exist")
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);
      const insertSpy = jest.spyOn(mockApiKeyRepository, "insert");

      const newKey = await service.generateNewKey(partnerId);

      expect(hashSpy).toHaveBeenCalledTimes(2);
      expect(existSpy).toHaveBeenCalledTimes(2);
      expect(insertSpy).toHaveBeenCalledWith({
        hash: "key-hash-2",
        partnerId,
      });
    });

    it("should throw an error after all retries failed", async () => {
      const partnerId = "partner-id";

      jest
        .spyOn(bcrypt, "hash")
        .mockImplementation(() => Promise.resolve("key-hash"));
      jest.spyOn(mockApiKeyRepository, "exist").mockResolvedValue(true);
      const insertSpy = jest.spyOn(mockApiKeyRepository, "insert");

      await expect(() => service.generateNewKey(partnerId)).rejects.toThrow();
      expect(insertSpy).not.toHaveBeenCalled();
    });
  });

  describe("findByPartnerId", () => {
    it("should return the list of API keys hash", async () => {
      const partnerId = "partner-id";
      jest.spyOn(mockApiKeyRepository, "findBy").mockResolvedValue([
        { partnerId, hash: "key-1-hash" },
        { partnerId, hash: "key-2-hash" },
      ]);

      const expected = ["key-1-hash", "key-2-hash"];
      const actual = await service.findByPartnerId(partnerId);

      expect(actual).toEqual(expected);
    });

    it("should return an empty array if there is no key for this partner", async () => {
      const partnerId = "partner-id";
      jest.spyOn(mockApiKeyRepository, "findBy").mockResolvedValue([]);

      const expected: string[] = [];
      const actual = await service.findByPartnerId(partnerId);

      expect(actual).toEqual(expected);
    });
  });
});
