Feature: Linking and syncing notes with Dropbox
    As a user, I would like to be able to sync this app with the notes that I
    have stored on Dropbox in order for viewing

Scenario: Clicking on "Link to Dropbox" in order to load notes from Dropbox
Given I launch the app
Then I should see a navigation bar titled "Welcome to _Note!"
And I should see a "Link to Dropbox" button

When I press the Link to Dropbox button
Then I should see an element of class “UIWebView”

And I enter my username and password
And I close the pop-up after logging in

Then I should see a navigation bar titled “Welcome to _Note!”
And I should see a “Link to Dropbox” button
And I should see a “View your notes” button

When I touch the button marked “View your notes”
Then I should see an element of class “UITableView”
And I should see “Default Notes”
And I should see a "Sync Notes" button

When I click on the "Sync Notes" button
