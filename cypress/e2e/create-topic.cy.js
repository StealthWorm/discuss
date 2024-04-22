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

    it('When I click in the "Create Post" button', () => {
      cy.get('[data-test-id="create-post-button"]').click()
    })

    it('Should display create post form', () => {
      cy.get('[data-test-id="create-post-form"]').should('be.visible')
    })

    it('When I click in the "Save" button without filling the form', () => {
      cy.get('[data-test-id="form-button-save"]').click()
    })

    it('Then I should see errors in the validation of the form fields', () => {
      cy.get('[data-test-id="create-post-title-input"]').should('have.attr', 'aria-invalid', 'true');
      cy.get('[data-test-id="create-post-content-input"]').should('have.attr', 'aria-invalid', 'true');
    })
  })

  context('Create Post Form - Validation', () => {
    before(() => {
      cy.visit('http://localhost:3000/topics/Javascript');
      cy.get('[data-test-id="create-post-button"]').click()
    })

    const inputName = 'post title'

    it('When I enter text in the Title field', () => {
      cy.get('[data-test-id="create-post-title-input"]').type(inputName);
    })

    it('When I click in the "Save" button filling the Name input field', () => {
      cy.get('[data-test-id="form-button-save"]').click()
    })

    it('Should validate the Form "Title" field', () => {
      cy.get('[data-test-id="create-post-title-input"]')
        .should('have.attr', 'data-filled', 'true')
        .and('have.attr', 'value', `${inputName}`)
        .and('have.css', 'color')
        .and('not.eq', 'rgb(243, 18, 96)')
    })
  })

  context('Create Topic Form - User not logged in', () => {
    before(() => {
      cy.visit('http://localhost:3000/topics/Javascript');
      cy.get('[data-test-id="create-post-button"]').click()
    })

    const inputs = {
      title: { text: 'title name' },
      content: { text: 'This is a test post' }
    }

    it('When I enter text in the form fields', () => {
      cy.get('[data-test-id="create-post-title-input"]').type(inputs.title.text);
      cy.wait(1000)
      cy.get('[data-test-id="create-post-content-input"]').type(inputs.content.text);
      cy.wait(1000)
    })

    it('When I click in the "Save" button filling the Name input field', () => {
      cy.get('[data-test-id="form-button-save"]').click()
    })

    it('Should validate the Form fields without errors', () => {
      cy.get('[data-test-id="create-post-title-input"]')
        .should('have.attr', 'data-filled', 'true')
        .should('not.have.attr', 'aria-invalid', 'true')
        .and('have.value', `${inputs.title.text}`)
        .and(($element) => {
          const styles = window.getComputedStyle($element[0])
          const textColor = styles.getPropertyValue('color')
          const text = $element.val();
          expect(textColor).not.to.eq('rgb(243, 18, 96)')
          expect(text.length).to.be.at.least(3);
        })

      cy.get('[data-test-id="create-post-content-input"]')
        .should('have.attr', 'data-filled', 'true')
        .should('not.have.attr', 'aria-invalid', 'true')
        .and('have.value', `${inputs.content.text}`)
        .and(($element) => {
          const styles = window.getComputedStyle($element[0])
          const textColor = styles.getPropertyValue('color')
          const text = $element.val();
          expect(textColor).not.to.eq('rgb(243, 18, 96)')
          expect(text.length).to.be.at.least(10);
        })
    })

    it(`'Should display a box with the error "You must be signed in to do this."`, () => {
      cy.get('[data-test-id="create-post-form-errors"]')
        .should('be.visible')
        .and('contain', 'You must be signed in to do this.')
    })
  })
})

describe('Create a Post', () => {
  before(() => {
    cy.visit('http://localhost:3000/topics/Javascript');// Assuming the post creation form is on the homepage
    cy.get('[data-test-id="create-post-button"]').click()
    cy.intercept('GET', '/api/auth/session',
      {
        "id": "clvbj6mwk000114fwu6oc91eu",
        "sessionToken": "252ffb2e-1d1c-44cd-8cbb-d96ec9da1239",
        "userId": "clrsfu7h90000pczebb83htn0",
        "expires": "2024-05-22T22:30:48.685Z",
        "user": {
          "id": "clrsfu7h90000pczebb83htn0",
          "name": "thierry",
          "email": "thierrypitela@hotmail.com",
          "emailVerified": null,
          "image": "https://avatars.githubusercontent.com/u/33596726?v=4"
        }
      }).as('session');
  })

  // it('Successfully creates a post using the createPost action', () => {
  //   cy.wait('@session').then((response) => {
  //     console.log(response);
  //     cy.get('[data-test-id="create-post-title-input"]').type('Test Post Title');
  //     cy.get('[data-test-id="create-post-content-input"]').type('Test Post Content');

  //     cy.get('[data-test-id="create-post-form"]').submit();
  //     // expect(response).to.have.property('success', true);
  //     // // expect(interception.response.statusCode).to.equal(200); // Assuming a successful response status code
  //     // // Add more assertions here based on the response if needed
  //     // cy.url().should('include', '/posts/');
  //     // cy.get('[data-test-id="post-title"]').should('contain', 'Test Post Title');
  //     // cy.get('[data-test-id="post-content"]').should('contain', 'Test Post Content');
  //   })
  // });
});

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
