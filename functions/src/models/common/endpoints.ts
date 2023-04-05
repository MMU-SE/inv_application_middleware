const EndpointValues = ['/products', '/products/:id', '/categories', '/categories/:id'] as const

export type Endpoints = typeof EndpointValues[number] | undefined

