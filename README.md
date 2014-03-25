_Note (COMP 4350: Software Development 2 - Group 1)
==============
_Note is a suite of software and services designed for note creation, storage, 
and sharing across desktop browsers and mobile devices.

Users must allow this system to access their Dropbox in order to use this
service.

Link to Production Server: Provided in the Trello Board (card: AWS Production Instance)

Group Members:
---
- Mathias Eurich
- Harrison Mulder
- Duong Nguyen 
- Graeme Peters
- Lyndon Quigley
- Tony Young

How to use _Note:
---
Currently, _Note has very limited functionality.  To use, first you can visit the site at which located on the Trello board, and it will display a link.  This link will redirect you to a page that will ask you to give access to make an app folder within your Dropbox.  This is how we plan to store, create and view notes across devices.

Using _Note for iOS:
---
In order to use our app, open the _Note.xcworkspace file and run the simulator for our iOS app.  The iOS no longer uses the Dropbox SDK, it communicates with the server via NSURLConnection in order to get the notes.

To run the iOS simulator, just click on the "play" button to the top-left hand corner.
- In order for you to load your notes into our app, you must first authorize to Dropbox at the initial starting screen by clicking on the "Load from Dropbox"
- After you have done that, you can either click "Your notes" or swipe to the right in the left area.  This will show a list of notes you currently have.
- Click on "sync notes" once you have authorized to Dropbox in order to load the notes that you have from _Note, from using our desktop browser version.

How to run tests for server code:
---
Run server/server_tests.py on the command line

How to run QUnit tests for web client:
---
On our production instance visit the url: /static/qunit.html

How to run Selenium tests for web client:
---


How to run tests for iOS:
---
To run the QUnit.m tests, you can open up the workspace file and in the panel to the left, click on the diamond with a line icon.  Here is where all the tests are held, and you can run them by clicking the mini-play button that appears when you hover over the test name.

To run the Frank tests, you need to go into the Frank directory of our iOS folder via a command-line interface and then type in 'cucumber'.  This will run all of the all of the acceptance tests for our iOS application. (Make sure you have frank-cucumber installed on your computer in order to run the frank tests which you can install by using 'sudo gem install frank-cucumber')

Requirements (to run server):
---
- Python v2.7.5 / v2.7.6
- setuptools v2.1.2 (https://pypi.python.org/pypi/setuptools#installing-and-using-setuptools) [if using Windows]
- pyOpenSSL (https://pypi.python.org/pypi/pyOpenSSL) or 'sudo pip install pyOpenSSL'
- Flask (http://flask.pocoo.org/) a Python microframework for web development
- Dropbox (https://www.dropbox.com/developers/core) install the Python SDK
- A Dropbox account (so you can authorize our system to create and store notes in your Dropbox)

Requirements (to run iOS/iPad app):
---
- An iPad/iPod device with a developer's certificate to put the _Note app on (if you want to try the app on a device)
- XCode 5.0 or higher, in order to run the simulator and code
- Internet connection (in order to retrieve notes from our server)

Optional:
---
- Installing pip (Python Installer Package - http://www.pip-installer.org/en/latest/installing.html) usually makes it easier to download and install Python modules

How to run server (for running on a local machine):
---
1. Download this repository from GitHub (via git clone 'url' / git pull)
2. Make sure you have the necessary requirements installed
3. Type in 'python server.py' where server.py is located
4. Now you can visit the web pages that server.py generates by typing in your browser https://127.0.0.1:5000 or https://localhost:5000
5. Use this to test how the server runs and for future changes to the server.

Reminders / Practices:
---
- Make sure to use 'git pull' before 'git push' when pushing to the GitHub repository in the 'master' branch.
- Create a branch when working on a feature by 'git branch feature_name_here' and switching to it with 'git checkout branch_name'.
- When done with your changes in the branch, remember to add, commit and merge it back to you local master.
- Mathias will destroy you when/if you commit broken code.

