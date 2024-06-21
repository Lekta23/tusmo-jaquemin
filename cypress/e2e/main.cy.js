describe('Tusmo Game', () => {
  const baseUrl = 'http://localhost:3000';
  const apiEndpoint = 'https://trouve-mot.fr/api/random/1';
  const wordsFixture = { fixture: 'words.json' };

  beforeEach(() => {
    cy.visit(baseUrl);
    cy.intercept('GET', apiEndpoint, wordsFixture);
    cy.wait(1000);
  });

  it('should initialize the word', () => {
    cy.get('#input_0').should('have.text', '_');
    cy.get('#input_1').should('have.text', '_');
    cy.get('#input_2').should('have.text', '_');
    cy.get('#input_3').should('have.text', '_');
  });

  it('should set letter in span on keypress', () => {
    cy.get('#input_0').should('have.text', '_');
    cy.get('body').type('u');
    cy.get('#input_0').should('have.text', 'U');
  });

  it('should set multiple letters in span on keypress', () => {
    cy.get('#input_0').should('have.text', '_');
    cy.get('body').type('uais');
    cy.get('#input_0').should('have.text', 'U');
    cy.get('#input_1').should('have.text', 'A');
    cy.get('#input_2').should('have.text', 'I');
    cy.get('#input_3').should('have.text', 'S');
  });

  it('should delete letter in span on backspace keypress', () => {
    cy.get('#input_0').should('have.text', '_');
    cy.get('body').type('u');
    cy.get('#input_0').should('have.text', 'U');
    cy.get('body').type('{backspace}');
    cy.get('#input_0').should('have.text', '_');
  });

  it('should show only the first 4 letters if more than 4 are typed', () => {
    cy.get('#input_0').should('have.text', '_');
    cy.get('body').type('usmoouaisEtoile');
    cy.get('#input_0').should('have.text', 'U');
    cy.get('#input_1').should('have.text', 'S');
    cy.get('#input_2').should('have.text', 'M');
    cy.get('#input_3').should('have.text', 'O');
  });

  it('should show the word on validate button click', () => {
    cy.get('#input_0').should('have.text', '_');
    cy.get('body').type('usmo');
    cy.get('#validate_button').click();
    cy.get('#result_word_0 > #result_letter_0').should('have.class', 'bg-red-500');
    cy.get('#result_word_0 > #result_letter_1').should('have.class', 'bg-red-500');
    cy.get('#result_word_0 > #result_letter_2').should('have.class', 'bg-yellow-500');
    cy.get('#result_word_0 > #result_letter_3').should('have.class', 'bg-blue-500');
    cy.get('#result_word_0 > #result_letter_4').should('have.class', 'bg-yellow-500');
  });

  it('should show the word with history on multiple validate button clicks', () => {
    cy.get('#input_0').should('have.text', '_');
    cy.get('body').type('usmo');
    cy.get('#validate_button').click();
    cy.get('body').type('hles');
    cy.get('#validate_button').click();
    cy.get('#result_word_0 > #result_letter_0').should('have.class', 'bg-red-500');
    cy.get('#result_word_0 > #result_letter_1').should('have.class', 'bg-red-500');
    cy.get('#result_word_0 > #result_letter_2').should('have.class', 'bg-yellow-500');
    cy.get('#result_word_0 > #result_letter_3').should('have.class', 'bg-blue-500');
    cy.get('#result_word_0 > #result_letter_4').should('have.class', 'bg-yellow-500');
    cy.get('#result_word_1 > #result_letter_0').should('have.class', 'bg-red-500');
    cy.get('#result_word_1 > #result_letter_1').should('have.class', 'bg-blue-500');
    cy.get('#result_word_1 > #result_letter_2').should('have.class', 'bg-blue-500');
    cy.get('#result_word_1 > #result_letter_3').should('have.class', 'bg-blue-500');
    cy.get('#result_word_1 > #result_letter_4').should('have.class', 'bg-red-500');
  });

  it('should show a success message when the word is found', () => {
    cy.get('#input_0').should('have.text', '_');
    cy.get('body').type('usmo');
    cy.get('#validate_button').click();
    cy.get('body').type('hles');
    cy.get('#validate_button').click();
    cy.get('body').type('uais');
    cy.get('#validate_button').click();
    cy.get('#error_label').should('have.text', 'Vous avez trouvé le mot !');
  });

  it('should show an error message when the word is not found', () => {
    cy.get('#input_0').should('have.text', '_');
    cy.get('body').type('usmo');
    cy.get('#validate_button').click();
    cy.get('body').type('hles');
    cy.get('#validate_button').click();
    cy.get('body').type('hfls');
    cy.get('#validate_button').click();
    cy.get('body').type('popo');
    cy.get('#validate_button').click();
    cy.get('body').type('ytrp');
    cy.get('#validate_button').click();
    cy.get('body').type('jfdl');
    cy.get('#validate_button').click();
    cy.get('#error_label').should('have.text', 'Vous avez épuisé vos essais. Le mot était OUAIS.');
  });
});
