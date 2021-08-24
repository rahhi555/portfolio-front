import { emailAndPasswordCredential, unRegister, RegisterValues  } from '~/utils/auth'

const registerValue: RegisterValues = {
  name: 'cypressUser',
  email: 'cypress@example.com',
  password: 'password',
  passwordConfirm: 'password'  
}

describe('認証系', () => {
  describe('ページ遷移', () => {
    context('未ログインの場合', () => {
      it('/dashboardにアクセスできない', () => {
        cy.visit('/dashboard')
        cy.url().should('include', '/')
        cy.contains('ログインしてください')
      })
    })
    
    context('ログイン済みの場合', () => {
      beforeEach(() => {
        emailAndPasswordCredential(registerValue)
      })

      afterEach(() => {
        unRegister()
      })

      it('/auth/loginにアクセスできない', () => {
        cy.visit('/auth/login')
        cy.url().should('include', '/dashboard')
        cy.contains('ログイン済みです')
      })
    })
  })
})