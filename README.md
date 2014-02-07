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
Currently, _Note has very limited functionality.  To use, first you can visit the site at which located on the Trello board, and it will display a link.  This link will redirect you to a page that will ask you to give access to make an app folder within your Dropbox.  This is how we planto store, create and view notes across devices.

Requirements (to run server):
---
- Flask (http://flask.pocoo.org/) a Python microframework for web development
- Dropbox (https://www.dropbox.com/developers/core) install the Python SDK
- setuptools v2.1.2 (https://pypi.python.org/pypi/setuptools#installing-and-using-setuptools) [if using Windows]
- pyOpenSSL (https://pypi.python.org/pypi/pyOpenSSL) or 'sudo pip install pyOpenSSL'
- A Dropbox account (so you can authorize our system to create and store notes in your Dropbox)
- Python v2.7.5 / v2.7.6

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

