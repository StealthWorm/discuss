
describe('Topic Page - Topic Click Redirect', () => {
  before(() => {
    cy.visit('/')
  })

  context('Access the Specific "Javascript" topic page', () => {
    it('should redirect to the topic page when an item is clicked', () => {
      cy.get('[data-test-id="topics"]').within(() => {
        cy.get('[data-test-id="topic"]').eq(0).then(($firstTopicChip) => {
          const firstTopicSlug = $firstTopicChip.text().trim();
          expect(firstTopicSlug).to.equal('Javascript');
          cy.get($firstTopicChip).find('[data-test-id="link"]').click();
          cy.url().should('include', `/topics/${encodeURIComponent(firstTopicSlug)}`);
        });
      });
    });
  })

  context('Display elements of Topic Page', () => {
    before(() => {
      cy.visit('http://localhost:3000/topics/Javascript');
    })

    it('should contain the elements related to the topic', () => {
      cy.get('div[data-test-id="topic-info"]').within(() => {
        cy.get('h1[data-test-id="topic-slug"]').should('contain', 'Javascript');
        cy.get('button[data-test-id="create-post-button"]').should('be.visible');
        cy.get('div[data-test-id="posts"]').should('be.visible');
      });
    });
  })

  context('Create Post Form', () => {
    before(() => {
      cy.visit('http://localhost:3000/topics/Javascript');
    })

    const inputName = {
      text: '',
    }

    it('When I click in the "Create Post" button', () => {
      cy.get('[data-test-id="create-post-button"]').click()
    })

    it('Should display create post form', () => {
      cy.get('[data-test-id="create-post-popover"]').should('be.visible')
    })

    it('When I click in the "Save" button without filling the form', () => {
      cy.get('[data-test-id="form-button-save"]').click()
    })

    it('Then I should see errors in the validation of the form fields', () => {
      cy.get('[data-test-id="create-post-title-input"]').should('have.attr', 'aria-invalid', 'true');
      cy.get('[data-test-id="create-post-content-input"]').should('have.attr', 'aria-invalid', 'true');
    })

    inputName.text = 'test'

    it('When I enter text in the Title field', () => {
      cy.get('[data-test-id="create-post-title-input"]').type(inputName.text);
    })

    it('When I click in the "Save" button filling the Name input field', () => {
      cy.get('[data-test-id="form-button-save"]').click()
    })

    it('Should validate the Form "Title" field', () => {
      cy.get('[data-test-id="create-post-title-input"]')
        .should('have.attr', 'data-filled', 'true')
        .and('have.attr', 'value', `${inputName.text}`)
        .and('have.css', 'color')
        .and('eq', 'rgb(243, 18, 96)')
    })
  })
})

// cy.get('[data-test-id="topic"]').each(($chip) => {
//   const topicSlug = $chip.text().trim();
//   // const topicSlug = $chip.text().split(' ').join('%20');
//   cy.get($chip).then(($topicChip) => {
//     const link = $topicChip[0].childNodes[0];
//     expect(link).to.have.attr('data-test-id', 'link');
//     expect(link).to.have.attr('href', `/topics/${topicSlug}`);
//     expect(link.innerText.trim()).to.equal(topicSlug);
//   });
//   // cy.wrap($chip).find('[data-test-id="link"]').click();
//   // cy.url().should('include', `/topics/${topicSlug}`);
//   cy.go('back')
// });
// });
// });
