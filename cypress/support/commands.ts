import { RegisterValues } from '~/plugins/auth.client'
import { auth } from '~/plugins/firebase'

Cypress.Commands.add('emailRegister', (registerValue: RegisterValues) => {
  cy.get('input[placeholder="Nick Name..."]').type(registerValue.email)
  cy.get('input[placeholder="Email..."]').type(registerValue.email)
  cy.get('input[placeholder="Password..."]').type(registerValue.password)
  cy.get('input[placeholder="Password Confirm..."]').type(registerValue.passwordConfirm)
  cy.get('.v-input--selection-controls__ripple').trigger('click')
  cy.get('button').contains('Get Started').trigger('click')
  cy.url().should('include', '/dashboard')
  cy.contains('ユーザー登録に成功しました')
  // チュートリアルはキャンセル
  cy.get('.v-card__actions > :nth-child(2)').click()
})

Cypress.Commands.add('userClear', () => {
  cy.wait(1000)
  const user = auth.currentUser
  cy.log('currentUser', user)
  if(!user) {
    cy.log('currentUserを取得できませんでした')
    return
  }
  user.getIdToken().then((token) => {
    cy.request({
      url: 'http://localhost:3000/api/v1/me',
      method: 'DELETE',
      auth: {
        bearer: token,
      },
    })
  }).catch((e) => {
    cy.log(e)
  })
  user?.delete()  
})

Cypress.Commands.add('emailLogin', (email: string, password: string) => {
  cy.visit('/auth/login')
  cy.get('input[placeholder="Email..."]').type(email)
  cy.get('input[placeholder="Password..."]').type(password)
  cy.get('button').contains("Let's Go").trigger('click')
  cy.url().should('include', '/dashboard')
  cy.contains('ログインに成功しました')
  cy.get('.v-card__actions > :nth-child(2)').click()
})

Cypress.Commands.add('logout', () => {
  cy.get('[data-cypress=logout]').click()
  cy.get('[data-cypress=logout-submit]').click()
  cy.url().should('include', '/')
  cy.contains('ログアウトしました')
})