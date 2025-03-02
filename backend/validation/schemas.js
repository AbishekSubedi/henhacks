const { z } = require('zod');

const userSchema = z.object({
  uid: z.string().min(1, 'User ID is required'),
  email: z.string().email('Invalid email format'),
  businessName: z.string().min(1, 'Business name is required'),
});

const businessSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  userId: z.string().min(1, 'User ID is required'),
});

const businessUpdateSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

const insightRequestSchema = z.object({
  businessData: z
    .object({
      name: z.string().min(1, 'Business name is required'),
      description: z.string().min(1, 'Business description is required'),
    })
    .strict(),
});

const validateSchema = schema => {
  return data => {
    try {
      return { success: true, data: schema.parse(data) };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        return { success: false, errors };
      }
      return { success: false, errors: [{ message: 'Validation failed' }] };
    }
  };
};

module.exports = {
  validateUser: validateSchema(userSchema),
  validateBusiness: validateSchema(businessSchema),
  validateBusinessUpdate: validateSchema(businessUpdateSchema),
  validateInsightRequest: validateSchema(insightRequestSchema),
};
