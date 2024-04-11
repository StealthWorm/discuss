class RegisterForm {
  elements = {
    searchInput: () => cy.get('[data-test-id="search-input"]'),
  }

  typeText(text) {
    if (!text) return;
    this.elements.searchInput().type(`${text}`)
  }
}

const registerForm = new RegisterForm()

describe('Home Page', () => {
  after(() => {
    cy.clearAllLocalStorage()
  })

  const input = {
    text: '',
  }

  it('Given I am on the Home page', () => {
    cy.visit('/')
  })

  it(`When I enter "${input.text}" in the title field`, () => {
    registerForm.typeText(input.text)
  })

  it(`When I click "ENTER" on keyboard`, () => {
    cy.get('[data-test-id="search-input"]').type('{enter}');
  })

  it('Should display top posts', () => {
    // Verifica se os elementos estão presentes na página
    // debugger
    cy.get('[data-test-id="posts"]').children('div').should('have.length.lte', 5)
  })

  it('Should display top topics', () => {
    cy.get('[data-test-id="topics"]').children('div').should('have.length', 3);
  })
})

describe('Home Page Search Input', () => {
  after(() => {
    cy.clearAllLocalStorage()
  })

  const input = {
    text: 'next',
  }

  it('Given I am on the Home page', () => {
    cy.visit('/')
  })

  it(`When I enter "${input.text}" in the title field`, () => {
    registerForm.typeText(input.text)
  })

  it(`When I click "ENTER" on keyboard`, () => {
    cy.get('[data-test-id="search-input"]').type('{enter}');
  })

  it('Should display top posts', () => {
    // Verifica se os elementos estão presentes na página
    // debugger
    cy.get('[data-test-id="posts"]').children('div').should('have.length.lte', 1)
  })
})  