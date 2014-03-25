Feature: Linking and syncing notes with Dropbox
    As a user, I would like to be able to sync this app with the notes that I
    have stored on Dropbox in order for viewing

Scenario: Clicking on "Link to Dropbox" in order to load notes from Dropbox
Given I launch the app
Then I should be on the Home screen
And I should see a "Link to Dropbox" button

When I click on the "Link to Dropbox" button
Then I should see a Dropbox login screen pop-up
And I enter my username and password
And I close the pop-up after logging in
Then I should be on the Home screen

When I navigate to viewing my notes
Then I should see a side panel table with a list of notes
And I should see a "Sync Notes" button

When I click on the "Sync Notes" button
Then I should see all my notes loaded into the side panel table
And I shouldn't see the default note
