/// <reference types="cypress" />

import { RegisterValues } from '~/plugins/auth.client'

declare global {
  namespace Cypress {
    interface Chainable {
      emailRegister(value: RegisterValues): void
    }
    interface Chainable {
      userClear(): void
    }
    interface Chainable {
      emailLogin(email: string, password: string): void
    }
    interface Chainable {
      logout(): void
    }
  }
}
