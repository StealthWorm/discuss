class HomePage {
  elements = {
    searchInput: () => cy.get('[data-test-id="search-input"]'),
    createTopicButton: () => cy.get('[data-test-id="create-topic-button"]'),
    createTopicNameInput: () => cy.get('[data-test-id="create-topic-name-input"]'),
    createTopicDescriptionInput: () => cy.get('[data-test-id="create-topic-description-input"]'),
    saveTopicButton: () => cy.get('[data-test-id="create-topic-form-button-save"]')
  }

  typeText(text) {
    if (!text) return;
    this.elements.searchInput().type(`${text}`)
  }

  clickCreateTopic() {
    this.elements.createTopicButton().click()
  }

  clickSaveTopic() {
    this.elements.saveTopicButton().click()
  }
}

const homePage = new HomePage()

describe('Home Page', () => {
  before(() => {
    cy.visit('/')
  })

  after(() => {
    cy.clearAllLocalStorage()
  })

  context('Initial State', () => {
    it('Should display the max of five top posts', () => {
      cy.get('[data-test-id="posts"]').children('div').should('have.length.lte', 5)
    })

    it('Should display top topics', () => {
      cy.get('[data-test-id="topics"]').children('div').should('have.length.gte', 1);
    })
  })

  context('Search Input', () => {
    const input = {
      text: 'next',
    }

    it(`When I enter "${input.text}" in the search input`, () => {
      homePage.typeText(input.text)
    })

    it(`When I click "ENTER" on keyboard`, () => {
      homePage.elements.searchInput().type('{enter}');
    })

    it(`Should filter a post containing the input value`, () => {
      cy.get('[data-test-id="posts"]')
        .children('div')
        .should('have.length.lte', 1)
        .within(() => {
          cy.get('h3').first().should('contain', 'next');
        });
    })
  })

  context('Create Topic Form Invisible', () => {
    const input = {
      text: '',
    }

    it(`When I enter "${input.text}" in the search input`, () => {
      homePage.typeText(input.text)
    })

    it(`When I click "ENTER" on keyboard`, () => {
      homePage.elements.searchInput().type('{enter}');
    })
  })

  context('Create Topic Form only with Name filled', () => {

    before(() => {
      cy.visit('/')
      homePage.elements.searchInput().clear()
      homePage.elements.searchInput().type('{enter}')
    })

    const inputName = {
      text: '',
    }

    it('When I click in the "Create Topic" button', () => {
      homePage.clickCreateTopic()
    })

    it('Should display create topic form', () => {
      cy.get('[data-test-id="create-topic-popover"]').should('be.visible')
    })

    it('When I click in the "Save" button without filling the form', () => {
      homePage.clickSaveTopic()
    })

    it('Then I should see errors in the validation of the form fields', () => {
      homePage.elements.createTopicNameInput().should('have.attr', 'aria-invalid', 'true');
      homePage.elements.createTopicDescriptionInput().should('have.attr', 'aria-invalid', 'true');
    })

    it('When I enter text in the Name field', () => {
      inputName.text = 'test'
      homePage.elements.createTopicNameInput().type(inputName.text);
    })

    it('When I click in the "Save" button filling the Name input field', () => {
      homePage.clickSaveTopic()
    })

    it('Should validate the Form "Name" field', () => {
      homePage.elements.createTopicNameInput()
        .should('have.attr', 'data-filled', 'true')
        .and('have.attr', 'value', `${inputName.text}`)
        .and(($element) => {
          const styles = window.getComputedStyle($element[0])
          const textColor = styles.getPropertyValue('color')
          expect(textColor).not.to.eq('rgb(243, 18, 96)')
        })
    })
  })

  context('Create Topic Form when User is not logged in', () => {
    before(() => {
      cy.reload()
    })

    const inputs = {
      name: { text: 'test name' },
      description: { text: 'This is a test topic' }
    }

    it('When I click in the "Create Topic" button', () => {
      homePage.clickCreateTopic()
    })

    it('Should display create topic form', () => {
      cy.get('[data-test-id="create-topic-popover"]').should('be.visible')
    })

    it('When I enter text in the form fields', () => {
      homePage.elements.createTopicNameInput().focus().type(inputs.name.text);
      cy.wait(1000)
      homePage.elements.createTopicDescriptionInput().focus().type(inputs.description.text);
      cy.wait(1000)
    })

    it('When I click in the "Save" button filling the Name input field', () => {
      homePage.clickSaveTopic()
    })

    it('Should validate the Form fields without errors', () => {
      homePage.elements.createTopicNameInput()
        .should('have.attr', 'data-filled', 'true')
        .should('not.have.attr', 'aria-invalid', 'true')
        .and('have.value', `${inputs.name.text}`)
        .and(($element) => {
          const styles = window.getComputedStyle($element[0])
          const textColor = styles.getPropertyValue('color')
          const text = $element.val();
          expect(textColor).not.to.eq('rgb(243, 18, 96)')
          expect(text.length).to.be.at.least(3);
        })

      homePage.elements.createTopicDescriptionInput()
        .should('have.attr', 'data-filled', 'true')
        .should('not.have.attr', 'aria-invalid', 'true')
        .and('have.value', `${inputs.description.text}`)
        .and(($element) => {
          const styles = window.getComputedStyle($element[0])
          const textColor = styles.getPropertyValue('color')
          const text = $element.val();
          expect(textColor).not.to.eq('rgb(243, 18, 96)')
          expect(text.length).to.be.at.least(10);
        })
    })

    it(`'Should display a box with the error "You must be signed in to do this."`, () => {
      cy.get('[data-test-id="create-topic-form-errors"]')
        .should('be.visible')
        .and('contain', 'You must be signed in to do this.')
    })
  })

  // create valid topic 
  // click post 
})


// describe('GitHub OAuth Authorization', () => {
//   // before(() => {

//   // })

//   it('Visits the login page', () => {
//     cy.reload()
//     cy.visit('/')
//     cy.clearCookies({ log: true });
//     cy.getCookies({ log: true }).should('be.empty');

//     // Clear other storage data
//     cy.clearLocalStorage();
//     cy.clearAllSessionStorage();
//     cy.get('[data-test-id="sign-in-button"]').should('contain', 'Sign In');
//     cy.get('[data-test-id="sign-in-button"]').click();
//     cy.url().should("include", "https://github.com/login?client_id=db0bc738304a50178c29");
//   })

//   // it('should authorize user with GitHub OAuth', () => {
//   //   // Visit the login page
//   //   cy.visit('https://github.com/login/oauth/authorize', {
//   //     qs: {
//   //       client_id: Cypress.env('GITHUB_CLIENT_ID'),
//   //       redirect_uri: 'http://localhost:3000/api/auth/callback/github',
//   //       login: Cypress.env('GITHUB_USERNAME'), // User's email
//   //       scope: 'read:user user:email', // Requested scopes
//   //     }
//   //   });
//   // });

//   // it('should fill the form and submit', () => {
//   //   cy.get('[name="login"]').type('thierrypitela@hotmail.com');
//   //   cy.get('[name="password"]').type('siChiLIoUCLoinE');
//   //   cy.get('[name="commit"]').click();
//   //   cy.wait(2000);
//   // })

//   it('should authorize user with GitHub OAuth', () => {
//     // Visit the login page with client_id
//     // cy.url().should("include", "https://github.com/login/oauth/authorize?client_id=db0bc738304a50178c29");
//     cy.visit(`https://github.com/login/oauth/authorize?client_id=db0bc738304a50178c29`);

//     cy.get('[name="login"]').type('thierrypitela@hotmail.com');
//     cy.get('[name="password"]').type('siChiLIoUCLoinE');
//     cy.get('[name="commit"]').click();
//     cy.wait(2000);
//     // Wait for redirection back to the server with code in the callback URL
//     cy.url().should('include', 'localhost:3000/api/auth/github/callback?code=');

//     // Extract the code from the callback URL
//     cy.location('search').then((params) => {
//       const code = new URLSearchParams(params).get('code');

//       console.log(code);
//       // Make a follow-up request to GitHub to exchange the code for an access token
//       cy.request({
//         method: 'POST',
//         url: 'https://github.com/login/oauth/access_token',
//         form: true,
//         body: {
//           client_id: 'db0bc738304a50178c29',
//           client_secret: '63a3cb84bc9125371e524e1176ed33cc6e993fec',
//           code: code,
//           redirect_uri: 'http://localhost:3000/api/auth/github/callback' // Ensure this matches the redirect URI used in your GitHub app settings
//         }
//       }).then(response => {
//         // Check if the access_token is returned
//         const accessToken = new URLSearchParams(response.body).get('access_token');
//         expect(accessToken).to.exist;

//         cy.request({
//           method: 'GET',
//           url: 'https://api.github.com/user',
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }).then(userResponse => {
//           const userData = userResponse.body;
//           expect(userData).to.have.property('name');
//           expect(userData).to.have.property('avatar_url');
//           expect(userData).to.have.property('email');

//           console.log(userData)
//         })
//       });
//     });
//   });

// });

//! USAR ESSE ESQUEMA DO FLUXO DE AUTORIZAÇÃO PARA TESTAR.
// it('successfully login', () => {
// Request URL: https://github.com/session
// Request Method:POST
// Status Code: 302 Found
// payload:
// commit: Sign in
// authenticity_token: 0hGGZVN6WKRufSO08o0p9tU7ff2g6GjvghmVxPO1a49m0aciES7OqC8QxRHnVY6pWucViglrLvQnzibW239sGA ==
// login: thierrypitela @hotmail.com
// password: siChiLIoUCLoinE
// webauthn - conditional: undefined
// javascript - support: true
// webauthn - support: supported
// webauthn - iuvpaa - support: supported
// return_to: /login/oauth/authorize?client_id=db0bc738304a50178c29&code_challenge=H2S705vZkQkbuPP1cO0mtYk_1BmT2MIfhHJuo9ppNcc & code_challenge_method=S256 & redirect_uri=http % 3A % 2F % 2Flocalhost % 3A3000 % 2Fapi % 2Fauth % 2Fcallback % 2Fgithub & response_type=code & scope=read % 3Auser + user % 3Aemail
// allow_signup:
// client_id: db0bc738304a50178c29
// integration:
// required_field_73b1:
// timestamp: 1713233582878
// timestamp_secret: 1d65a8b04b45df63d1dd22d77191c6fcdce4d62d0f5c5e3adaaff20ac515b783

// Request URL: https://github.com/login/oauth/authorize?client_id=db0bc738304a50178c29&code_challenge=H2S705vZkQkbuPP1cO0mtYk_1BmT2MIfhHJuo9ppNcc&code_challenge_method=S256&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fgithub&response_type=code&scope=read%3Auser+user%3Aemail
// Request Method:GET
// Status Code: 200 OK
// client_id: db0bc738304a50178c29
// code_challenge: H2S705vZkQkbuPP1cO0mtYk_1BmT2MIfhHJuo9ppNcc
// code_challenge_method: S256
// redirect_uri: http://localhost:3000/api/auth/callback/github
// response_type: code
// scope: read:user user: email

// Request URL: http://localhost:3000/api/auth/callback/github?code=9299146b5f87f5d3dbc9
// Request Method: GET
// Status Code: 302 Found
// payload: code: 9299146b5f87f5d3dbc9

// session:
// {
//   "user": {
//     "id": "clrsfu7h90000pczebb83htn0",
//       "name": "thierry",
//         "email": "thierrypitela@hotmail.com",
//           "emailVerified": null,
//             "image": "https://avatars.githubusercontent.com/u/33596726?v=4"
//   },
//   "expires": "2024-05-16T02:13:14.949Z"
// }

// before(() => {
//   cy.reload()
//   Cypress.Cookies.debug(true);
//   cy.visit('/')
//   cy.clearCookies({ log: true });
//   cy.getCookies({ log: true }).should('be.empty');
//   Cypress.Cookies.debug(false);

//   // Clear other storage data
//   cy.clearLocalStorage();
//   cy.clearAllSessionStorage();
// })

// it('Visits the login page', () => {
//   cy.get('[data-test-id="sign-in-button"]').should('contain', 'Sign In');
//   cy.get('[data-test-id="sign-in-button"]').click();
// })

//   it('should authorize user with email and password', () => {
//     // Visit the login page
//     cy.visit('https://github.com/login/oauth/authorize', {
//       qs: {
//         client_id: 'db0bc738304a50178c29',
//         redirect_uri: 'http://localhost:3000/api/auth/callback/github',
//         login: 'thierrypitela@hotmail.com', // User's email
//         scope: 'read:user user:email', // Requested scopes
//         // code_challenge: 'H2S705vZkQkbuPP1cO0mtYk_1BmT2MIfhHJuo9ppNcc',
//         // code_challenge_method: 'S256'
//       }
//     });

//     cy.wait(1000)
//     // Log in with email and password
//     // cy.get('input[name="login"]').type('thierrypitela@hotmail.com');
//     cy.get('input[name="password"]').type('siChiLIoUCLoinE');
//     cy.get('input[name="commit"]').click();

//     cy.wait(4000)

//     cy.get('button[name="authorize"][value="1"]').click();
// // After authorization, GitHub redirects back to your site with a code
// cy.url().then(url => {
//   // http://localhost:3000/api/auth/callback/github?code=9299146b5f87f5d3dbc9
//   const code = new URL(url).searchParams.get('code');

//   console.log('codigo temporario ' + code)

//   // Exchange the code for an access token
//   cy.request({
//     method: 'POST',
//     url: 'https://github.com/login/oauth/access_token',
//     form: true,
//     body: {
//       client_id: 'db0bc738304a50178c29',
//       client_secret: '63a3cb84bc9125371e524e1176ed33cc6e993fec',
//       code: code,
//       redirect_uri: 'http://localhost:3000/api/auth/callback/github'
//     }
//   }).then(response => {
//     // console.log(response);
//     const accessToken = response.body.access_token;

//     // Use the access token to access GitHub API
//     cy.request({
//       method: 'GET',
//       url: 'https://api.github.com/user',
//       headers: {
//         Authorization: `Bearer ${accessToken}`
//       }
//     }).then(apiResponse => {
//       // Assertions or further actions based on API response
//       expect(apiResponse.status).to.eq(200);
//       // expect(apiResponse.body).to.have.property('name', 'thierry');
//       // expect(apiResponse.body).to.have.property('email', 'thierrypitela@hotmail.com');
//       // expect(apiResponse.body).to.have.property('image', 'https://avatars.githubusercontent.com/u/33596726?v=4');

//       cy.get('button[name="authorize"][value="1"]').click();
//     });
//   });
// });
//   });
// });

// describe('Auth0', function () {
//   beforeEach(function () {
//     cy.visit('/')
//   })

//   it('Visits the login page', () => {
//     cy.get('[data-test-id="sign-in-button"]').should('contain', 'Sign In');
//     cy.get('[data-test-id="sign-in-button"]').click();
//   })

//   it('should authorize user with email and password', () => {
//     cy.loginByAuth0Api(
//       Cypress.env('auth0_username'),
//       Cypress.env('auth0_password')
//     )
//   })

//   it('shows onboarding', function () {
//     cy.get('[data-test-id="signed-in-avatar"]').should('be.visible');
//   })
// })
