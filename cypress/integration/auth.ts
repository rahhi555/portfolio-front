const registerValue = {
  name: 'cypressUser',
  email: 'cypress@example.com',
  password: 'password',
  passwordConfirm: 'password',
}

describe('認証系', () => {
  context('ユーザー作成', () => {
    afterEach(() => {
      cy.userClear()
    })
    it('メールアドレスによる作成、ログイン及びログアウト', () => {
      cy.visit('/auth/register')
      cy.emailRegister(registerValue)
      cy.logout()
      cy.emailLogin(registerValue.email, registerValue.password)
    })
    it('かんたんログインによる作成及び本ユーザー昇格', () => {
      cy.visit('/auth/register')
      cy.get('button').contains('かんたんログイン').click()
      cy.url().should('include', '/dashboard')
      cy.contains('匿名ユーザーとしてログインしました')
      cy.visit('/dashboard/credential')
      cy.emailRegister(registerValue)
    })
  })

  describe('ページ遷移', () => {
    context('未ログインの場合', () => {
      it('ダッシュボードにアクセスできないこと', () => {
        cy.visit('/dashboard')
        cy.url().should('include', '/')
        cy.contains('ログインしてください')
      })
    })

    context('ログイン済みの場合', () => {
      afterEach(() => {
        cy.userClear()
      })

      it('ログインページ及びユーザー登録ページにアクセスできないこと', () => {
        cy.visit('/auth/register')
        cy.emailRegister(registerValue)
        cy.visit('/auth/login')
        cy.url().should('include', '/dashboard')
        cy.contains('ログイン済みです')
        cy.visit('/auth/register')
        cy.url().should('include', '/dashboard')
        cy.contains('ログイン済みです')
      })
    })
  })
})
