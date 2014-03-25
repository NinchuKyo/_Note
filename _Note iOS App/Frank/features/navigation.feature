Feature: Viewing the default notes
    As a user, I would like to be able to view the notes that are currently
    available when I load the application

Scenario: Moving from the 'Home' screen to view the default notes
Given I launch the app
Then I should be on the Home screen

When I navigate to viewing my notes
Then I should see a side panel table with a list of notes
And I should see a "Sync Notes" button
And I should see a single note

When I click on the "Sync Notes" button
Then I should expect nothing to happen

When I click on the single note
Then I should see the note with a specific content
