class TopicsPage {
  elements = {
    topicsList: () => cy.get('[data-test-id="topics"]'),
    topicContainer: () => cy.get('div[data-test-id="topic-info"]'),
    topicTitle: () => cy.get('h1[data-test-id="topic-slug"]'),
    topicRelatedPosts: () => cy.get('div[data-test-id="posts"]'),
    topicCreatePostButton: () => cy.get('button[data-test-id="create-post-button"]'),
    topicCreatePostForm: () => cy.get('[data-test-id="create-post-form"]'),
    topicCreatePostTitleInput: () => cy.get('[data-test-id="create-post-title-input"]'),
    topicCreatePostContentInput: () => cy.get('[data-test-id="create-post-content-input"]'),
    topicCreatePostFormButtonCreate: () => cy.get('[data-test-id="form-button-save"]'),
    topicCreatePostBoxErrors: () => cy.get('[data-test-id="create-post-form-errors"]'),
  }
}

const topicPage = new TopicsPage()

describe('Topic Page', () => {
  before(() => {
    cy.visit('/')
  })

  context('Enter the "Javascript" topic Posts page', () => {
    it('Should redirect to the Post page when clicked', () => {
      topicPage.elements.topicsList().within(() => {
        cy.get('[data-test-id="topic"]').eq(0).then(($firstTopicChip) => {
          const firstTopicSlug = $firstTopicChip.text().trim();

          expect(firstTopicSlug).to.equal('Javascript');
          cy.get($firstTopicChip).find('[data-test-id="link"]').click();
          cy.url().should('include', `/topics/${encodeURIComponent(firstTopicSlug)}`);
        });

        // cy.get('[data-test-id="topic"]').each(($item) => {
        //   cy.wrap($item).find('[data-test-id="link"]').click();
        //   cy.url().should('include', `/topics/${encodeURIComponent($item.text().trim())}`);
        // });
      });
    });
  })

  context('Display elements of Topic Page', () => {
    before(() => {
      cy.visit('/topics/Javascript');
    })

    const context = {
      title: 'Javascript',
    }

    it('Should display the elements related to the Topic Page', () => {
      topicPage.elements.topicContainer().within(() => {
        topicPage.elements.topicTitle()
          .should('contain', context.title);
        topicPage.elements.topicCreatePostButton()
          .should('be.visible')
          .and('have.text', 'Create a Post')
          .and(($element) => {
            const styles = window.getComputedStyle($element[0])
            const bgColor = styles.getPropertyValue('background-color')
            expect(bgColor).to.eq('rgb(0, 111, 238)')
          })
        topicPage.elements.topicRelatedPosts()
          .should('be.visible')
          .find('div[data-test-id="topic"]')
          .should('have.length.lte', 4);
      });
    });
  })

  context('Post Creation Form', () => {
    before(() => {
      cy.visit('/topics/Javascript');
    })

    it('When I click in the "Create Post" button', () => {
      topicPage.elements.topicCreatePostButton().click()
    })

    it('Should display create post form', () => {
      topicPage.elements.topicCreatePostForm().should('be.visible')
    })

    it('When I click in the "Save" button without filling the form', () => {
      topicPage.elements.topicCreatePostFormButtonCreate().click()
    })

    it('Should display errors in the validation of the form', () => {
      topicPage.elements.topicCreatePostTitleInput()
        .should('have.attr', 'aria-invalid', 'true')
        .and(($element) => {
          const styles = window.getComputedStyle($element[0])
          const textColor = styles.getPropertyValue('color')
          expect(textColor).to.eq('rgb(243, 18, 96)')
        })

      topicPage.elements.topicCreatePostContentInput().should('have.attr', 'aria-invalid', 'true');
    })
  })

  context('Create Post Form - Validation', () => {
    before(() => {
      cy.visit('/topics/Javascript');
      topicPage.elements.topicCreatePostButton().click()
    })

    const inputName = 'post title'

    it('When I enter text in the "Title" field', () => {
      topicPage.elements.topicCreatePostTitleInput().type(inputName);
    })

    it('When I click on the "Save" button', () => {
      topicPage.elements.topicCreatePostFormButtonCreate().click()
    })

    it('Should validate the Form "Title" field without errors', () => {
      topicPage.elements.topicCreatePostTitleInput()
        .should('have.attr', 'data-filled', 'true')
        .and('have.attr', 'value', `${inputName}`)
        .and('have.css', 'color')
        .and('not.eq', 'rgb(243, 18, 96)')
    })
  })

  context('Create Topic Form - User not logged in', () => {
    before(() => {
      cy.visit('/topics/Javascript');
      topicPage.elements.topicCreatePostButton().click()
    })

    const context = {
      title: 'title name',
      content: 'This is a test post'
    }

    it('When I enter text in the form fields', () => {
      topicPage.elements.topicCreatePostTitleInput().type(context.title);
      cy.wait(1000)
      topicPage.elements.topicCreatePostContentInput().type(context.content);
      cy.wait(1000)
    })

    it('When I click in the "Save" button', () => {
      topicPage.elements.topicCreatePostFormButtonCreate().click()
    })

    it('Should validate the Form fields without errors', () => {
      topicPage.elements.topicCreatePostTitleInput()
        .should('have.attr', 'data-filled', 'true')
        .should('not.have.attr', 'aria-invalid', 'true')
        .and('have.value', `${context.title}`)
        .and(($element) => {
          const styles = window.getComputedStyle($element[0])
          const textColor = styles.getPropertyValue('color')
          const text = $element.val();
          expect(textColor).not.to.eq('rgb(243, 18, 96)')
          expect(text.length).to.be.at.least(3);
        })

      topicPage.elements.topicCreatePostContentInput()
        .should('have.attr', 'data-filled', 'true')
        .should('not.have.attr', 'aria-invalid', 'true')
        .and('have.value', `${context.content}`)
        .and(($element) => {
          const styles = window.getComputedStyle($element[0])
          const textColor = styles.getPropertyValue('color')
          const text = $element.val();
          expect(textColor).not.to.eq('rgb(243, 18, 96)')
          expect(text.length).to.be.at.least(10);
        })
    })

    it(`'Should display a box with the error "You must be signed in to do this."`, () => {
      topicPage.elements.topicCreatePostBoxErrors()
        .should('be.visible')
        .and('contain', 'You must be signed in to do this.')
        .and(($element) => {
          const styles = window.getComputedStyle($element[0])
          const textColor = styles.getPropertyValue('color')
          const backgroundColor = styles.getPropertyValue('background-color')
          const borderColor = styles.getPropertyValue('border-color')
          assert.strictEqual(backgroundColor, 'rgb(254, 202, 202)');
          assert.strictEqual(borderColor, 'rgb(248, 113, 113)');
          assert.strictEqual(textColor, 'rgb(248, 113, 113)');
        })
    })
  })
})

// describe('Create a Post', () => {
//   before(() => {
//     cy.visit('http://localhost:3000/topics/Javascript');// Assuming the post creation form is on the homepage
//     cy.get('[data-test-id="create-post-button"]').click()
//     cy.intercept('GET', '/api/auth/session',
//       {
//         "id": "clvbj6mwk000114fwu6oc91eu",
//         "sessionToken": "252ffb2e-1d1c-44cd-8cbb-d96ec9da1239",
//         "userId": "clrsfu7h90000pczebb83htn0",
//         "expires": "2024-05-22T22:30:48.685Z",
//         "user": {
//           "id": "clrsfu7h90000pczebb83htn0",
//           "name": "thierry",
//           "email": "thierrypitela@hotmail.com",
//           "emailVerified": null,
//           "image": "https://avatars.githubusercontent.com/u/33596726?v=4"
//         }
//       }).as('session');
//   })
// });
