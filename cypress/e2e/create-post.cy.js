class PostPage {
  elements = {
    commentsList: () => cy.get('[data-test-id="comments"]'),
    commentItem: () => cy.get('[data-test-id="comment"]'),
    returnToTopicListButton: () => cy.get('a[data-test-id="post-back-button"]'),
    postTitle: () => cy.get('h1[data-test-id="post-title"]'),
    postContent: () => cy.get('p[data-test-id="post-content"]'),
    postNumberOfComments: () => cy.get('[data-test-id="number-of-comments"]'),
    postReplyForm: () => cy.get('[data-test-id="post-reply-form"]'),
    postReplyInput: () => cy.get('[data-test-id="post-reply-input"]'),
    postReplyButtonsSave: () => cy.get('[data-test-id="form-button-save"]')
  }
}

const postPage = new PostPage()

describe('Post Page', () => {
  before(() => {
    cy.visit('/topics/Javascript')
  })

  let postId = 0
  let topicName = 'Javascript'

  context('When I click on a post in the Topic Page', () => {
    it('Should redirect to post details page after clicking on the first post', () => {
      // Find the first post element using data-test-id attribute
      cy.get('[data-test-id^="post-"]').eq(0).click();
      // Get the data-test-id attribute value of the clicked post element
      cy.get('[data-test-id^="post-"]')
        .eq(0)
        .invoke('attr', 'data-test-id')
        .then((postIdAttr) => {
          // Extract the post ID from the data-test-id attribute
          postId = postIdAttr.replace('post-', '');
          // Verify if the URL redirects to the correct post details page
          cy.url().should('include', `/posts/${postId}`);
        });
    });

    it('Should display five comments', () => {
      postPage.elements.commentsList().children('div').should('have.length.lte', 5)
    })

    it('Should display Avatar, User and Content for all comments', () => {
      postPage.elements.commentItem().each(($item) => {
        cy.wrap($item).find('[data-test-id="comment-user-image"]').should('exist')
        cy.wrap($item).find('[data-test-id="comment-user-name"]').should('exist').and('have.text', 'thierry');
        cy.wrap($item).find('[data-test-id="comment-content"]').should('exist');
      })
    })
  })

  context('Post elements', function () {
    before(() => {
      cy.visit(`/topics/${topicName}/posts/${postId}`)
    })

    it('Should display the post elements of Post page', () => {
      postPage.elements.returnToTopicListButton().should('contain', `< Back to ${topicName}`);
      postPage.elements.postTitle().should('contain', 'What do you think about next js');
      postPage.elements.postContent().should('contain', 'I think Next is really usefull');
      postPage.elements.postNumberOfComments().should('contain', 'All 5 comments');
    });
  })

  context('Comment Form Validation', () => {
    before(() => {
      cy.visit(`/topics/${topicName}/posts/${postId}`)
    })

    it('Should display the comment box for Comment Reply', () => {
      postPage.elements.postReplyForm().should('be.visible')
      postPage.elements.postReplyInput().should('be.visible')
    })

    it('When I click in the "Create Comment" button', () => {
      postPage.elements.postReplyButtonsSave().click()
    })

    it('Then I should see errors in the validation of the form fields', () => {
      postPage.elements.postReplyInput()
        .should('have.attr', 'aria-invalid', 'true')
        .and(($element) => {
          const styles = window.getComputedStyle($element[0])
          const textColor = styles.getPropertyValue('color')
          expect(textColor).to.eq('rgb(243, 18, 96)')
        })
    })
  })
})