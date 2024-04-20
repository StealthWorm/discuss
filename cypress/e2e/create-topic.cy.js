
describe('Topic Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should redirect to the topic page when an item is clicked', () => {
    cy.get('[data-test-id="topics"]').within(() => {
      cy.get('[data-test-id="topic"]').each(($chip) => {
        // Get the text of the chip
        const topicSlug = $chip.text().trim();
        // const topicSlug = $chip.text().split(' ').join('%20');

        cy.get($chip).then(($topicChip) => {
          const link = $topicChip[0].childNodes[0];
          expect(link).to.have.attr('data-test-id', 'link');
          expect(link).to.have.attr('href', `/topics/${topicSlug}`);
          expect(link.innerText.trim()).to.equal(topicSlug);
        });

        // Click on the chip
        // cy.wrap($chip).find('[data-test-id="link"]').click();

        // Wait for the URL to change to the corresponding topic page URL
        // cy.url().should('include', `/topics/${topicSlug}`);

        // Go back to the original page to test the next chip
        cy.go('back')
      });
    });
  });

  // should visit "http://localhost:3000/topics/topic_name"
  // should be able to see the "create a post button" to that specific topic
  // must contain a header with the name of the topic
})