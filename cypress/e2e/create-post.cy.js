describe('Post Page', () => {
  before(() => {
    cy.visit('/topics/Javascript')
  })

  context('When I click on a post', () => {
    let postId = 0

    it('should redirect to post details page after clicking on the first post', () => {
      // Find the first post element using data-test-id attribute
      cy.get('[data-test-id^="post-"]').eq(0).click();

      // Get the data-test-id attribute value of the clicked post element
      cy.get('[data-test-id^="post-"]').eq(0).invoke('attr', 'data-test-id').then((postIdAttr) => {
        // Extract the post ID from the data-test-id attribute
        postId = postIdAttr.replace('post-', '');

        // Verify if the URL redirects to the correct post details page
        cy.url().should('include', `/posts/${postId}`);
      });
    });

    it('Should display five comments', () => {
      cy.visit(`/topics/Javascript/posts/${postId}`);
      cy.get('[data-test-id="comments"]').children('div').should('have.length.lte', 5)
    })

    it('should display the post elements of Post page', () => {
      cy.visit(`/topics/Javascript/posts/${postId}`);

      cy.get('a[data-test-id="post-back-button"]').should('contain', '< Back to Javascript');
      cy.get('h1[data-test-id="post-title"]').should('contain', 'What do you think about next js');
      cy.get('p[data-test-id="post-content"]').should('contain', 'I think Next is really usefull');
      cy.get('[data-test-id="number-of-comments"]').should('contain', 'All 5 comments');

      // cy.get('div[data-test-id="topic-info"]').within(() => {
      //   cy.get('h1[data-test-id="topic-slug"]').should('contain', 'Javascript');
      //   cy.get('button[data-test-id="create-post-button"]').should('be.visible');
      //   cy.get('div[data-test-id="posts"]').should('be.visible');
      // });
    });
  })


  context('When I validate the Comment Form', () => {
    it('Should display the comment box for Comment Reply', () => {
      cy.get('[data-test-id="post-reply-form"]').should('be.visible')
      cy.get('[data-test-id="post-reply-input"]').should('be.visible')
    })

    it('When I click in the "Create Comment" button', () => {
      cy.get('[data-test-id="form-button-save"]').click()
    })

    it('Then I should see errors in the validation of the form fields', () => {
      cy.get('[data-test-id="post-reply-input"]').should('have.attr', 'aria-invalid', 'true');
    })
  })
})
// check if a comment has a owner avatar, name and message
// check the syles of the validation form and text of the create comment button