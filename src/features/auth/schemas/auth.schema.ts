import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'El correo es requerido').email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'El usuario debe tener al menos 3 caracteres')
    .max(20, 'El usuario no puede tener más de 20 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guiones bajos'),
  email: z.string().min(1, 'El correo es requerido').email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirm_password: z.string().min(6, 'La confirmación debe tener al menos 6 caracteres'),
  avatar_url: z.string().optional(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirm_password"],
});

export const verifyAccountSchema = z.object({
  otp_code: z.string().length(6, 'El código debe tener 6 dígitos'),
});

export const verifyResetOtpSchema = z.object({
  otp_code: z.string().length(6, 'El código debe tener 6 dígitos'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'El correo es requerido').email('Correo electrónico inválido'),
});

export const resetPasswordSchema = z.object({
  new_password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirm_password: z.string().min(6, 'La confirmación debe tener al menos 6 caracteres'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirm_password"],
});

export const changePasswordSchema = z.object({
  old_password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  new_password: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
  confirm_password: z.string().min(6, 'La confirmación debe tener al menos 6 caracteres'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirm_password"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifyAccountInput = z.infer<typeof verifyAccountSchema>;
export type VerifyResetOtpInput = z.infer<typeof verifyResetOtpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;