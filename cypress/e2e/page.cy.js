// class RegisterForm {
//   elements = {
//     searchInput: () => cy.get('[data-test-id="search-input"]'),
//     createTopicButton: () => cy.get('[data-test-id="create-topic-button"]'),
//     createTopicNameInput: () => cy.get('[data-test-id="create-topic-name-input"]'),
//     createTopicDescriptionInput: () => cy.get('[data-test-id="create-topic-description-input"]'),
//     saveTopicButton: () => cy.get('[data-test-id="create-topic-form-button-save"]')
//   }

//   typeText(text) {
//     if (!text) return;
//     this.elements.searchInput().type(`${text}`)
//   }

//   clickCreateTopic() {
//     this.elements.createTopicButton().click()
//   }

//   clickSaveTopic() {
//     this.elements.saveTopicButton().click()
//   }
// }

// const registerForm = new RegisterForm()

// //test cases
// describe('Home Page', () => {
//   after(() => {
//     cy.clearAllLocalStorage()
//   })

//   const input = {
//     text: '',
//   }

//   it('Given I am on the Home page', () => {
//     cy.visit('/')
//   })

//   it(`When I enter "${input.text}" in the title field`, () => {
//     registerForm.typeText(input.text)
//   })

//   it(`When I click "ENTER" on keyboard`, () => {
//     cy.get('[data-test-id="search-input"]').type('{enter}');
//   })

//   it('Should display the max of five top posts', () => {
//     cy.get('[data-test-id="posts"]').children('div').should('have.length.lte', 5)
//   })

//   it('Should display top topics', () => {
//     cy.get('[data-test-id="topics"]').children('div').should('have.length', 3);
//   })
// })

// describe('Home Page - Search Input', () => {
//   after(() => {
//     cy.clearAllLocalStorage()
//   })

//   const input = {
//     text: 'next',
//   }

//   it('Given I am on the Home page', () => {
//     cy.visit('/')
//   })

//   it(`When I enter "${input.text}" in the title field`, () => {
//     registerForm.typeText(input.text)
//   })

//   it(`When I click "ENTER" on keyboard`, () => {
//     cy.get('[data-test-id="search-input"]')
//       .type('{enter}');
//   })

//   it('Should filter a post containing the input value', () => {
//     cy.get('[data-test-id="posts"]')
//       .children('div')
//       .should('have.length.lte', 1)
//       .within(() => {
//         cy.get('h3').first().should('contain', 'next');
//       });
//   })
// })

// describe('Home Page - Create Topic Form', () => {
//   const input = {
//     text: '',
//   }

//   after(() => {
//     cy.clearAllLocalStorage()
//   })

//   it('Given I am on the Home page', () => {
//     cy.visit('/')
//   })

//   it(`When I click in the "Create Topic" button`, () => {
//     registerForm.clickCreateTopic()
//   })

//   it('Should display create topic form', () => {
//     cy.get('[data-test-id="create-topic-popover"]')
//       .should('be.visible')
//   })

//   it(`When I click in the "Save" button without filling the form`, () => {
//     registerForm.clickSaveTopic()
//   })

//   it(`Then I should see errors in the validation of the form fields`, () => {
//     cy.get('[data-test-id="create-topic-name-input"]').clear()
//     cy.get('[data-test-id="create-topic-description-input"]').clear()

//     cy.wait(500);

//     cy.get('[data-test-id="create-topic-name-input"]')
//       .should('have.attr', 'aria-invalid', 'true');
//     cy.get('[data-test-id="create-topic-description-input"]')
//       .should('have.attr', 'aria-invalid', 'true');
//   })

//   //////////////////////////////////////////////////////////////// validate fields
//   input.text = 'next';

//   it(`When I enter "${input.text}" in the title field`, () => {
//     cy.get('[data-test-id="create-topic-name-input"]')
//       .type(input.text);
//   })

//   it(`When I click in the "Save" button filling the Name input field`, () => {
//     registerForm.clickSaveTopic()
//   })

//   it(`Should validate the Form Fields field`, () => {
//     cy.get('[data-test-id="create-topic-name-input"]')
//       .should('have.attr', 'data-filled', 'true');
//     cy.get('[data-test-id="create-topic-name-input"]')
//       .should('have.attr', 'value', `${input.text}`);
//     // color hsl(339 90% 51%)
//     cy.get('[data-test-id="create-topic-name-input"]')
//       .should(([element]) => {
//         const styles = window.getComputedStyle(element)
//         const textColor = styles.getPropertyValue('color')
//         assert.notStrictEqual(textColor, 'rgb(243, 18, 96)')
//       })
//   })
// })

///////////////////////////////////////////////////////////////////
class RegisterForm {
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

const registerForm = new RegisterForm()

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
      registerForm.typeText(input.text)
    })

    it(`When I click "ENTER" on keyboard`, () => {
      cy.get('[data-test-id="search-input"]').type('{enter}');
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
      registerForm.typeText(input.text)
    })

    it(`When I click "ENTER" on keyboard`, () => {
      cy.get('[data-test-id="search-input"]').type('{enter}');
    })
  })

  context('Create Topic Form', () => {
    before(() => {
      cy.get('[data-test-id="search-input"]').clear()
      cy.get('[data-test-id="search-input"]').type('{enter}')
    })

    const input = {
      text: '',
    }

    it('When I click in the "Create Topic" button', () => {
      registerForm.clickCreateTopic()
    })

    it('Should display create topic form', () => {
      cy.get('[data-test-id="create-topic-popover"]').should('be.visible')
    })

    it('When I click in the "Save" button without filling the form', () => {
      registerForm.clickSaveTopic()
    })

    it('Then I should see errors in the validation of the form fields', () => {
      cy.get('[data-test-id="create-topic-name-input"]').should('have.attr', 'aria-invalid', 'true');
      cy.get('[data-test-id="create-topic-description-input"]').should('have.attr', 'aria-invalid', 'true');
    })

    it('When I enter text in the Name field', () => {
      input.text = 'next';
      cy.get('[data-test-id="create-topic-name-input"]').type(input.text);
    })

    it('When I click in the "Save" button filling the Name input field', () => {
      registerForm.clickSaveTopic()
    })

    it('Should validate the Form "Name" field', () => {
      cy.get('[data-test-id="create-topic-name-input"]')
        .should('have.attr', 'data-filled', 'true')
        .and('have.attr', 'value', `${input.text}`)
        .and(($element) => {
          const styles = window.getComputedStyle($element[0])
          const textColor = styles.getPropertyValue('color')
          expect(textColor).not.to.eq('rgb(243, 18, 96)')
        })
    })
  })

  // sign in 
  // sign out
  // sign up 
  // create valid topic 
  // click post 
})


// Verifica se o input está marcado como inválido (aria-invalid="true") e não preenchido (data-filled-within="true")
// cy.get('[data-test-id="create-topic-name-input"]').should('not.have.attr', 'data-filled-within');
// ver como extrair o texto do input error e as cores
// registerForm.elements.createTopicNameInput().should(([element]) => {
//   const styles = window.getComputedStyle(element)
//   const bgColor = styles.getPropertyValue('background-color')
//   assert.strictEqual(bgColor, 'rgba(0, 0, 0, 0)')
// })
// registerForm.elements.createTopicNameInput()
// Aguarda um pequeno intervalo para que a validação seja aplicada

// Verifica se o input está marcado como inválido após a entrada inválida
// .should('contains.text', 'Please type a title for the image')
//   .next('.ui-error-message')
//   .should('be.visible')
//   .and('have.text', 'String must contain at least 3 character(s), Must be lowercase letters or dashes without spaces')
// cy.get('[data-slot="input-wrapper"] .text-danger#react-aria6428066275-\\:r6\\: span')
//   .invoke('text')
//   .should('contain', 'String must contain at least 3 character(s), Must be lowercase letters or dashes without spaces');

