import z from "zod";
import { t, authedProcedure } from "../utils";
const NoteIDDTO = z.object({ id: z.string() });
export type NoteDeleteDTO = z.infer<typeof NoteIDDTO>;
const NoteDTO = z
  .object({
    title: z.string(),
    body: z.string(),
    top: z.number(),
    left: z.number(),
    width: z.number(),
    height: z.number(),
    userId: z.string(),
    order: z.number(),
    color: z.string(),
  })
  .merge(NoteIDDTO);
export type NoteDTO = z.infer<typeof NoteDTO>;
const NoteUpdateDTO = NoteDTO.deepPartial().merge(NoteIDDTO);
export type NoteUpdateDTO = z.infer<typeof NoteUpdateDTO>;
export const notesRouter = t.router({
  getNotes: authedProcedure.query(({ ctx }) => {
    return ctx.prisma.note.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  updateNote: authedProcedure
    .input(NoteUpdateDTO)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.note.updateMany({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: input,
      });
    }),
  createNote: authedProcedure.input(NoteDTO).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.prisma.note.create({ data });
  }),
  deleteNote: authedProcedure.input(NoteIDDTO).mutation(({ ctx, input }) => {
    return ctx.prisma.note.deleteMany({
      where: {
        id: input.id,
        userId: ctx.session.user.id,
      },
    });
  }),
});
