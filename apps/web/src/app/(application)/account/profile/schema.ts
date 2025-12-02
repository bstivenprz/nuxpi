import z from "zod";

export const formSchema = z.object({
  name: z.string().nonempty("No puedes dejar este campo vacío."),
  presentation: z
    .string()
    .max(500, "Tu presentación no debe superar los 500 caracteres.")
    .optional(),
  gender: z.string().optional(),
});
