
# Profiling

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.0.

# USING GIT TO DOWNLOAD THE PROJECT

## Setting up Git

Download git from https://git-scm.com/download/win, press Click here to download. Open the exe file and click `Next` on all. Yes, don't read anything lmao.

## Setup

Create a new folder anywhere in your computer, and run `cmd` to open the Command Prompt. Alternatively, open Command Prompt and use directory commands such as `cd` to go there.

## Cloning

To download the project and save it on your folder or directory, run the following commands:

`git clone https://github.com/WDCAP2-EmployeeProfiling/employee-profiling-hub`

`git add .`

`git commit -m “message”`

`git pull`

`git push`

## Ready

To proceed, open CMD and make sure you are in the profiling folder. Now you can start running the system!

# RUNNING THE PROJECT

## Start MySQL Server

Open XAMPP Control Panel or any SQL server app, and make sure MySQL. You should be able to connect to `http://localhost/phpmyadmin` to view the database.

## Import SQL Database

Download the `profiling.sql` file that I sent in the Thesis group chat in Messenger (check pinned messages or files section) and go to phpmyadmin. At the top of the page, select the `Import` tab. Within File to Import section, click `choose file` and select the aforementioned profiling.sql. The database and tables should be installed!

## Starting the Node.js Server

Navigate to the folder where the server file exists, enter `cd src` on your command prompt or VSC terminal and run `node server.js` to execute the server file. This will make sure the api is connected.

## Starting the Angular Project

Run `ng s` to start the project. Make sure you are in the main folder of the project.

## Test the system

On your browser, enter the following link: `localhost:4200`

## Questions

Feel free to message Chadle Rei Miclat on Messenger or Discord :D
