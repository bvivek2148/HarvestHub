import { createServerFn } from '@tanstack/react-start'

export const getBaseUrl = createServerFn({ method: 'GET' }).handler(async () => 'http://localhost:3000')
