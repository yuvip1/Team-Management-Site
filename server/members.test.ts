import { describe, it, expect, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock context
function createMockContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Members Router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const ctx = createMockContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("members.list", () => {
    it("should return an array of members", async () => {
      const result = await caller.members.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return members with required fields", async () => {
      const result = await caller.members.list();
      if (result.length > 0) {
        const member = result[0];
        expect(member).toHaveProperty("id");
        expect(member).toHaveProperty("name");
        expect(member).toHaveProperty("rollNumber");
        expect(member).toHaveProperty("year");
        expect(member).toHaveProperty("degree");
      }
    });
  });

  describe("members.getById", () => {
    it("should throw NOT_FOUND error for non-existent member", async () => {
      try {
        await caller.members.getById({ id: 99999 });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("NOT_FOUND");
      }
    });

    it("should validate input is a number", async () => {
      try {
        await caller.members.getById({ id: NaN });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });
  });

  describe("members.create", () => {
    it("should validate required fields", async () => {
      try {
        await caller.members.create({
          name: "",
          rollNumber: "",
          year: "",
          degree: "",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });

    it("should reject invalid image MIME type", async () => {
      try {
        await caller.members.create({
          name: "Test Member",
          rollNumber: "001",
          year: "2024",
          degree: "B.Tech",
          imageBase64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          imageName: "test.png",
          imageMimeType: "application/pdf", // Invalid MIME type
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("Invalid image type");
      }
    });

    it("should create a member with valid base64 image", async () => {
      // Valid PNG base64 (1x1 transparent pixel)
      const validBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
      const result = await caller.members.create({
        name: "Test Member With Image",
        rollNumber: "001",
        year: "2024",
        degree: "B.Tech",
        imageBase64: validBase64,
        imageName: "test.png",
        imageMimeType: "image/png",
      });
      expect(result).toBeDefined();
      expect(result?.name).toBe("Test Member With Image");
      // Image URL should be set if upload succeeded
      expect(result?.imageUrl).toBeDefined();
    });

    it("should create a member without optional fields", async () => {
      const result = await caller.members.create({
        name: "Test Member",
        rollNumber: "001",
        year: "2024",
        degree: "B.Tech",
      });

      expect(result).toBeDefined();
      expect(result?.name).toBe("Test Member");
      expect(result?.rollNumber).toBe("001");
      expect(result?.year).toBe("2024");
      expect(result?.degree).toBe("B.Tech");
      // Optional fields are stored as null
      expect(result?.aboutProject).toBeNull();
      expect(result?.hobbies).toBeNull();
    });

    it("should create a member with all optional fields", async () => {
      const result = await caller.members.create({
        name: "Complete Member",
        rollNumber: "002",
        year: "2024",
        degree: "B.Tech",
        aboutProject: "Working on AI project",
        hobbies: "Coding, Gaming",
        certificate: "AWS Certified",
        internship: "Interned at Google",
        aboutYourAim: "Become a software engineer",
      });

      expect(result).toBeDefined();
      expect(result?.name).toBe("Complete Member");
      expect(result?.certificate).toBe("AWS Certified");
      expect(result?.internship).toBe("Interned at Google");
      expect(result?.aboutYourAim).toBe("Become a software engineer");
    });

    it("should handle null values for optional fields", async () => {
      const result = await caller.members.create({
        name: "Minimal Member",
        rollNumber: "003",
        year: "2024",
        degree: "B.Tech",
        aboutProject: undefined,
        hobbies: undefined,
        certificate: undefined,
        internship: undefined,
        aboutYourAim: undefined,
      });

      expect(result).toBeDefined();
      expect(result?.aboutProject).toBeNull();
      expect(result?.hobbies).toBeNull();
      expect(result?.certificate).toBeNull();
    });
  });

  describe("Integration: Create and Retrieve", () => {
    it("should create a member and retrieve it by ID", async () => {
      // Create a member
      const created = await caller.members.create({
        name: "Integration Test Member",
        rollNumber: "004",
        year: "2024",
        degree: "B.Tech",
      });

      expect(created).toBeDefined();
      expect(created?.id).toBeDefined();

      // Retrieve the member
      if (created?.id) {
        const retrieved = await caller.members.getById({ id: created.id });
        expect(retrieved).toBeDefined();
        expect(retrieved?.name).toBe("Integration Test Member");
        expect(retrieved?.rollNumber).toBe("004");
      }
    });

    it("should list members including newly created ones", async () => {
      // Create a member
      const created = await caller.members.create({
        name: "List Test Member",
        rollNumber: "005",
        year: "2024",
        degree: "B.Tech",
      });

      // List all members
      const members = await caller.members.list();
      expect(Array.isArray(members)).toBe(true);

      // Check if created member is in the list
      if (created?.id) {
        const found = members.find((m) => m.id === created.id);
        expect(found).toBeDefined();
        expect(found?.name).toBe("List Test Member");
      }
    });
  });
});
