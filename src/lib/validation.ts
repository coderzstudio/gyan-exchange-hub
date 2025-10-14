import { z } from 'zod';

// Upload form validation
export const uploadSchema = z.object({
  semester: z.number().int().min(1, "Semester must be at least 1").max(8, "Semester cannot exceed 8"),
  subject: z.string()
    .trim()
    .min(1, "Subject is required")
    .max(100, "Subject must be less than 100 characters"),
  topic: z.string()
    .trim()
    .min(1, "Topic is required")
    .max(200, "Topic must be less than 200 characters"),
  tags: z.string()
    .max(500, "Tags must be less than 500 characters")
    .transform(s => 
      s.split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)
        .slice(0, 10)
    ),
  file: z.instanceof(File)
    .refine(file => file.size <= 10 * 1024 * 1024, "File size must be less than 10MB")
    .refine(
      file => ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type),
      "File must be a PDF or image (JPG, PNG, GIF, WEBP)"
    )
});

// Auth form validation
export const authSchema = z.object({
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password must be less than 72 characters"),
  fullName: z.string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Full name must be less than 100 characters")
    .optional(),
  university: z.string()
    .trim()
    .max(200, "University name must be less than 200 characters")
    .optional(),
  course: z.string()
    .trim()
    .max(100, "Course name must be less than 100 characters")
    .optional()
});

// Report form validation
export const reportSchema = z.object({
  reason: z.string()
    .trim()
    .min(10, "Reason must be at least 10 characters")
    .max(1000, "Reason must be less than 1000 characters")
});

// Types for validated data
export type UploadFormData = z.infer<typeof uploadSchema>;
export type AuthFormData = z.infer<typeof authSchema>;
export type ReportFormData = z.infer<typeof reportSchema>;
