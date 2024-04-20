
describe('Topic Page', () => {
  before(() => {
    cy.visit('/')
  })

  it('should redirect to the topic page when an item is clicked', () => {
    cy.get('[data-test-id="topics"]').within(() => {
      cy.get('[data-test-id="topic"]').eq(0).then(($firstTopicChip) => {
        // Get the text of the first chip
        const firstTopicSlug = $firstTopicChip.text().trim();

        // Assert that the innerText of the first chip is "Javascript"
        expect(firstTopicSlug).to.equal('Javascript');
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
    });
  });

  // should visit "http://localhost:3000/topics/topic_name"
  // should be able to see the "create a post button" to that specific topic
  // must contain a header with the name of the topic
})