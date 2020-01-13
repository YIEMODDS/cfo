// https://docs.cypress.io/api/introduction/api.html

describe('Home Page Now', () => {
  it('Visits the app root url should see homepage and proper title', () => {
    cy.visit('/')
    cy.contains('h1', 'Invoice List')
    cy.contains('202001001')
  })
})
