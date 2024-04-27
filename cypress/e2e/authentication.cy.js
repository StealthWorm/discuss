class HeaderAuthentication {
  elements = {
    signInButton: () => cy.get('[data-test-id="sign-in-button"]'),
    signUpButton: () => cy.get('[data-test-id="sign-up-button"]'),
    signedInAvatar: () => cy.get('[data-test-id="signed-in-avatar"]'),
    signOutButton: () => cy.get('[data-test-id="sign-out-button"]'),
  };

  clearStorageAndReload() {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
    cy.reload();
  }
}

const headerAuth = new HeaderAuthentication();

describe('Header Authentication', () => {
  beforeEach(() => {
    cy.visit('/')
    headerAuth.clearStorageAndReload();
  })

  it('Should render the buttons "Sign in" and "Sign up" when user is not signed in', () => {
    cy.intercept('GET', '/api/auth/session', {}).as('session')

    cy.wait('@session').then(() => {
      headerAuth.elements.signInButton().should('exist').and('contain', 'Sign In');
      headerAuth.elements.signUpButton().should('exist').and('contain', 'Sign Up');
    })
  })

  it('Should render the user avatar when signed in', () => {
    cy.intercept('GET', '/api/auth/session', {
      user: { image: 'https://picsum.photos/200' },
    }).as('session')

    cy.wait('@session').then(() => {
      headerAuth.elements.signedInAvatar().should('exist')
    })
  })

  it('Should render the "Sign Out" button when signed in, after clicking the Avatar button', () => {
    cy.intercept('GET', '/api/auth/session', {
      user: { image: 'https://picsum.photos/200' },
    }).as('session')

    headerAuth.elements.signedInAvatar().click()

    cy.wait('@session').then(() => {
      headerAuth.elements.signedInAvatar().should('exist')
      headerAuth.elements.signOutButton().should('exist').and('contain', 'Sign Out')
    })
  })

  it('Should signs out when clicks on the "Sign Out" button', () => {
    cy.intercept('GET', '/api/auth/session', {
      user: { image: 'https://picsum.photos/200' },
    }).as('session')

    headerAuth.elements.signedInAvatar().should('exist').click()
    headerAuth.elements.signOutButton().should('exist').click()

    cy.intercept('GET', '/api/auth/session', { user: null }).as('session')

    cy.wait('@session').then(() => {
      headerAuth.elements.signInButton().should('exist');
      headerAuth.elements.signUpButton().should('exist');
    })
  })
})