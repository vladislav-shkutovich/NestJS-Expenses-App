export class NotFoundError extends Error {
  constructor(...args: ConstructorParameters<typeof Error>) {
    super(...args)
    this.name = this.constructor.name
  }
}

export class ConflictError extends Error {
  constructor(...args: ConstructorParameters<typeof Error>) {
    super(...args)
    this.name = this.constructor.name
  }
}

export class ValidationError extends Error {
  constructor(...args: ConstructorParameters<typeof Error>) {
    super(...args)
    this.name = this.constructor.name
  }
}

export class DatabaseError extends Error {
  constructor(...args: ConstructorParameters<typeof Error>) {
    super(...args)
    this.name = this.constructor.name
  }
}

export class UnprocessableError extends Error {
  constructor(...args: ConstructorParameters<typeof Error>) {
    super(...args)
    this.name = this.constructor.name
  }
}

export class ServiceUnavailableError extends Error {
  constructor(...args: ConstructorParameters<typeof Error>) {
    super(...args)
    this.name = this.constructor.name
  }
}
