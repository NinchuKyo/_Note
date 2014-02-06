_Note (COMP 4350: Software Development 2 - Group 1)
==============
_Note is a suite of software and services designed for note creation, storage, 
and sharing across desktop browsers and mobile devices.

Users must allow this system to access their Dropbox in order to use this
service.

Group Members:
---
- Mathias Eurich
- Duong Nguyen
- Harrison Mulder
- Graeme Peters
- Lyndon Quigley
- Tony Young

Requirements (to run server):
---
- Flask (http://flask.pocoo.org/) a Python microframework for web development
- Dropbox (https://www.dropbox.com/developers/core) install the Python SDK
- pyOpenSSL (https://pypi.python.org/pypi/pyOpenSSL) or 'sudo pip install pyOpenSSL'
- A Dropbox account (so you can authorize our system to create and store notes in your Dropbox)
- Python v2.7.5 / v2.7.6

How to run server (for now):
---
1. Download this repository from GitHub (via git clone 'url' / git pull)
2. Make sure you have the necessary requirements installed
3. Type in 'python server.py' where server.py is located
4. Now you can visit the web pages that server.py generates by typing in your browser 127.0.0.1:5000 or localhost:5000
5. Use this to test how the server runs and for future changes to the server.

Reminders / Practices:
---
- Make sure to use 'git pull' before 'git push' when pushing to the GitHub repository in the 'master' branch.
- Create a branch when working on a feature by 'git branch feature_name_here' and switching to it with 'git checkout branch_name'.
- When done with your changes in the branch, remember to add, commit and merge it back to you local master.
- Mathias will destroy you when/if you commit broken code.

