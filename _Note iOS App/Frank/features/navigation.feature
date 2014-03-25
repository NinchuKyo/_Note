Feature: Viewing the default notes
    As a user, I would like to be able to view the notes that are currently
    available when I load the application

Scenario: Moving from the 'Home' screen to view the default notes
Given I launch the app
Then I should see a navigation bar titled "Welcome to _Note!"

When I touch the button marked "View your notes"
Then I should see an element of class "UITableView"
And I should see a "Sync Notes" button
And I should see an element of class "UITableViewCell"

When I touch the first table cell
Then I should see “Default Notes”
And I should see “Currently, creating notes is disabled until rich-text editing is implemented.”

