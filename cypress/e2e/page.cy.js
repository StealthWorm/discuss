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
      // .within(() => {
      //   cy.get('h3').first().should('contain', 'next');
      // });
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

    inputName.text = 'test'

    it('When I enter text in the Name field', () => {
      homePage.elements.createTopicNameInput().type(inputName.text);
    })

    it('When I click in the "Save" button filling the Name input field', () => {
      homePage.clickSaveTopic()
    })

    it('Should validate the Form "Name" field', () => {
      homePage.elements.createTopicNameInput()
        .should('have.attr', 'data-filled', 'true')
        .and('have.attr', 'value', `${inputName.text}`)
        .and('have.css', 'color')
        .and('eq', 'rgb(243, 18, 96)')
      // .and(($element) => {
      //   const styles = window.getComputedStyle($element[0])
      //   const textColor = styles.getPropertyValue('color')
      //   expect(textColor).not.to.eq('rgb(243, 18, 96)')
      // })
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
})