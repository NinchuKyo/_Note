Feature: Viewing the default notes

Scenario: Moving from the 'Home' screen to view the default notes
Given I launch the app
Then I should be on the Home screen

When I navigate to viewing my notes
Then I should see a side panel table with list of notes
