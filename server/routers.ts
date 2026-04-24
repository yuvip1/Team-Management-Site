import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getTeamMembers, getTeamMemberById, createTeamMember } from "./db";
import { storagePut } from "./storage";
import { TRPCError } from "@trpc/server";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  members: router({
    list: publicProcedure.query(async () => {
      return await getTeamMembers();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const member = await getTeamMemberById(input.id);
        if (!member) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Team member with ID ${input.id} not found`,
          });
        }
        return member;
      }),

    create: publicProcedure
      .input(z.object({
        name: z.string().min(1, 'Name is required'),
        rollNumber: z.string().min(1, 'Roll Number is required'),
        year: z.string().min(1, 'Year is required'),
        degree: z.string().min(1, 'Degree is required'),
        aboutProject: z.string().optional(),
        hobbies: z.string().optional(),
        certificate: z.string().optional(),
        internship: z.string().optional(),
        aboutYourAim: z.string().optional(),
        imageBase64: z.string().optional(),
        imageName: z.string().optional(),
        imageMimeType: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        let imageUrl: string | undefined = undefined;

        // Handle image upload if provided
        if (input.imageBase64 && input.imageName) {
          try {
            // Validate MIME type
            const mimeType = input.imageMimeType || 'image/jpeg';
            if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: `Invalid image type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
              });
            }

            // Decode and validate base64
            let buffer: Buffer;
            try {
              buffer = Buffer.from(input.imageBase64, 'base64');
            } catch (error) {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Invalid base64 image data',
              });
            }

            // Validate file size
            if (buffer.length > MAX_IMAGE_SIZE) {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: `Image size exceeds maximum limit of ${MAX_IMAGE_SIZE / 1024 / 1024}MB`,
              });
            }

            // Upload to storage
            const fileKey = `team-members/${Date.now()}-${input.name.replace(/\s+/g, '_')}-${input.imageName}`;
            const { url } = await storagePut(fileKey, buffer, mimeType);
            imageUrl = url;
          } catch (error) {
            if (error instanceof TRPCError) {
              throw error;
            }
            console.error('Failed to upload image:', error);
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Failed to upload image. Please try again.',
            });
          }
        }

        const memberData = {
          name: input.name,
          rollNumber: input.rollNumber,
          year: input.year,
          degree: input.degree,
          aboutProject: input.aboutProject || null,
          hobbies: input.hobbies || null,
          certificate: input.certificate || null,
          internship: input.internship || null,
          aboutYourAim: input.aboutYourAim || null,
          imageUrl: imageUrl || null,
        };

        try {
          const newMember = await createTeamMember(memberData);
          if (!newMember) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Failed to create team member',
            });
          }
          return newMember;
        } catch (error) {
          if (error instanceof TRPCError) {
            throw error;
          }
          console.error('Failed to create team member:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create team member. Please try again.',
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
