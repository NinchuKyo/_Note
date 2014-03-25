Feature: Application splash page start
    As a user, when I start the application, I would like to test out
    the basic note viewing / creating capabilities and also see
    if I rotate my iPad, the resolution and functionality will still be
    okay

Scenario: When I start the application I should see some buttons and a splash screen
Given I launch the app
Given the device is in landscape orientation
Then I should be on the Home screen
And I should see a "Link to Dropbox" button
And I should see a "View your notes" button

Given the device is in portrait orientation
And I should see a "Link to Dropbox" button
And I should see a "View your notes" button

