import { z } from 'zod'

const MIN_NAME_LENGTH = 2

const ERROR_MESSAGES = {
  name: `Category name must be at least ${MIN_NAME_LENGTH} characters`,
}

export const categorySchema = z.object({
  name: z
    .string()
    .min(MIN_NAME_LENGTH, { message: ERROR_MESSAGES.name }),
})
