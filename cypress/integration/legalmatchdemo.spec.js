/// <reference types="cypress" />

context('Find Lawyer', () => {
  
    describe('[Steps 1 - 7] Find Government Lawyer', () => {
        
        it("1 - opens 'https://qa8.legalmatch.com'", () => {
            cy.visit("https://qa8.legalmatch.com")
                .url()
                .should("eq", "https://qa8.legalmatch.com/")
                .get("img.logo__image")
                .should("be.visible")
        })

        it("2 - selects 'Governmment' on 'Choose Category' dropdown", () => {
            cy.get(".case-intake-form__dropdown:contains('Choose a Category')").within(() => {
                cy.get("button:contains('Choose a Category')").click()
                cy.get("div.case-intake-form__dropdown-item:contains('Government')").click()
                cy.get("button").should("contain", "Government")
            })
        })

        it("3 - enters '00001' on Zip Code", () => {
            cy.get("div.case-intake-form__location-checker")
                .find("input[placeholder='ZIP Code or Location']")
                .should("be.visible")
                .type("00001")
                .should("have.value", "Nowheresville, XX 00001", {timeout: 120000})

            cy.get("div.case-intake-form__location-checker").should("have.class", "case-intake-form__location-checker--valid")

        })

        it("4 - clicks 'Find a Great Lawyer'", () => {
            cy.get("button:contains('Search for Attorneys')")
                .should("be.visible")
                .click()
        })  

        it("5 - verifies that you get redirected to 'qa8.legalmatch.com/case-post/subcategory'", () => {
            cy.url().should("include", "https://qa8.legalmatch.com/case-post/subcategory")
        })

        it("6 - verifies that 'Government' string can be found on the 'XXX - Most Common Issues' form group label", () => {
            cy.get(".intake-form")
                .find("legend").should("have.text", "Most Common Government Issues")
                .should("be.visible")
        })

        it("7 - clicks browser's Back button", () => {
            cy.go("back")
                .url().should("not.include", "https://qa8.legalmatch.com/case-post/subcategory")
      
        })
    })

    for(var i=1; i< 6; i++){
        describe(`[Steps 8 - 12] Find a Random Category Lawyer : No. ${i}`, () => {

            beforeEach("wait", () => {
                cy.wait(5000) //because of too many page loads, the random category is not clicked successfully sometimes, so we have to put delay between the tests
            })

            it("8 - clicks 'Click Here' link", () => {
                cy.get("span:contains('Click here')")
                    .should("be.visible")
                    .click()
            })
    
            it("9 - selects a random category and console.log the selected category", () => {
                cy.get('li.other-categories__item')
                    .its("length")
                    .then(len => {
                        let random = Cypress._.random(len - 1)
                        cy.get('li.other-categories__item')
                        .eq(random)
                        .find("span")
                        .invoke("text").then(randomCategory => {
                            cy.get('li.other-categories__item')
                            .eq(random)
                            .find("span")
                            .scrollIntoView()
                            .should("be.visible")
                            .wait(5000)
                            .click({force: true})
                            //cy.get('li.other-categories__item').eq(random).scrollIntoView().wait(5000).click({force: true})
                            
                            cy.log("selected random category is - ", randomCategory)
                            console.log("selected random category is - ", randomCategory)
                            Cypress.env("randomCategory", randomCategory)
                        })
                    })
            })
    
            it("10 - verifies that you get redirected to 'qa8.legalmatch.com/case-post/subcategory'", () => {
                cy.url().should("include", "https://qa8.legalmatch.com/case-post/subcategory")
            })
    
            it(`11 - verifies that Random Category string can be found on the 'XXX - Most Common Issues' form group label`, () => {
                cy.get(".intake-form")
                    .find("legend").should("have.text", `${Cypress.env("randomCategory").trim()} - Most Common Issues`)
                    .should("be.visible")
            })
    
            it("12 - clicks browser's Back button", () => {
                cy.go("back")
                    .url().should("not.include", "https://qa8.legalmatch.com/case-post/subcategory")
                cy.wait(2000)
            })
        })
    }

    describe('[Steps 14 - 18] View What People Are Saying About LegalmMatch', () => {
        
        it("14 - scrolls down to 'What People Are Saying About LegalmMatch'", () => {
            cy.get("h2:contains('What People Are Saying About LegalMatch')")
            .scrollIntoView()
            .should("be.visible")
        })

        it("15 - clicks the right carret button n+1 times", () => {
            cy.get("div.w-testimonials")
            .within(() => {
                cy.get("button.carousel-dots__dot")
                .its("length")
                .then(len => {
                    for(var i=1; i <= len; i++){
                        cy.get("button.carousel-controls__next")
                        .click()
                        .wait(2000)
                        if(i < len)
                            cy.get(`li.w-testimonials__item[data-id=${i+1}]`).should("be.visible", {timeout: 60000})
                    }
                })
            })
        })

        it("16 - verifies first quote is displayed after clicking left carret button n+1 times", () => {
            cy.get(`li.w-testimonials__item[data-id='1']`).should("be.visible", {timeout: 60000})
        })

        it("17 - clicks the left carret button n+1 times", () => {
            cy.get("div.w-testimonials")
            .within(() => {
                cy.get("button.carousel-dots__dot")
                .its("length")
                .then(len => {
                    for(var i=len; i >= 1; i--){
                        cy.get("button.carousel-controls__prev")
                        .click()
                        .wait(2000)
                        //if(i > 1)
                            cy.get(`li.w-testimonials__item[data-id=${i}]`).should("be.visible", {timeout: 60000})
                    }
                })
            })
        })

        it("17 - verifies first quote is displayed after the last quote", () => {
            cy.get(`li.w-testimonials__item[data-id='1']`).should("be.visible", {timeout: 60000})
        })

        it("18 - verifies 'meta' element with expected keywords exists in page source", () => {
            cy.document()
            .get('head meta[name="keywords"]')
            .should("have.attr", "content", "find a lawyer, find an attorney, find lawyers, find attorneys, legal help");
        })
    })
})