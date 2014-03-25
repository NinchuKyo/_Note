When /^I press the Link to Dropbox button$/ do
    touch "view:'UIButton' marked:'Link to Dropbox'"
end

And /^I enter my username and password$/ do
    # simulate login success
    pending
end

And /^I close the pop-up after logging in$/ do
    touch( "navigationItemButtonView" )
    wait_for_nothing_to_be_animating
end

