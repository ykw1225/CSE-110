# GRAD

## Team
* Madel Asistio - Software Development Lead
* Robert Chen - Quality Assurance Lead
* Chris Crutchfield - Project Manager
* Raghav Kansal - Database Specialist
* Vivian Pham - Business Analyst
* Gina Ratto - Senior System Analyst
* Summer Wang - User Interface Specialist
* Kit Wong - Algorithm Specialist
* Jon Lee - Software Architect

## Definitions
* **Course Map** - A graph representing the selected course and all of the prerequisites in tree form.  The selected course is at the root with the prerequisites being children and decedents.
* **Course Card** - A [material design card](https://material.io/guidelines/components/cards.html "material design card") which contains the department code, course number, number of credits, course title, and course description.
* **Course Graph** - See course map
* **Multinode** - A graph node which represents a requriement or elective.  Allows a user to select the option they wish to use to fullfill it.
* **Requirement** - The requirement to take a class.  Can have different classes which can fulfill.

## Angular2 and MVC
Angular2 is a framework which has its roots in MVC.  Unfortunately its view and controller go by different names.  The updated names are:
* **View** - Template
* **Controller** - Component

## User Requirements

## Running the Server Locally

### Server Requirements
* Ubuntu 16.04.02 LTS 64 Bit
* 
### Install the Prerequisites
~~~~
$ sudo apt-get install -y git curl
~~~~

### Install Cassandra
Loosely based off of this [DataStax]( http://docs.datastax.com/en/cassandra/3.0/cassandra/install/installDeb.html
 "DataStax") tutorial.
1. Install the prerequisites
~~~~
$ sudo apt-get install -y openjdk-8-jre
~~~~
2. Add the DataStax repository
~~~~
$ echo "deb http://debian.datastax.com/community stable main" | sudo tee -a /etc/apt/sources.list.d/cassandra.sources.list
~~~~
3. Add the DataStax trusted key
~~~~
$ curl -L https://debian.datastax.com/debian/repo_key | sudo apt-key add -
~~~~
4. Install Cassandra
~~~~
$ sudo apt-get update
$ sudo apt-get install -y cassandra
~~~~
5. Reboot your computer

### Install Node.js
Adapted from https://nodejs.org/en/download/package-manager/
1. Add the Node.js repository
~~~~
$ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
~~~~
2. Install Node.js
~~~~
$ sudo apt-get install -y nodejs
~~~~
3. Install Gulp
~~~~
$ sudo npm install -g gulp
~~~~

### Download the Source Code Repository
1. Change to your home directory
~~~~
$ cd ~
~~~~
2. Clone the repository using your UCSD Email address and password
~~~~
$ git clone https://git.ucsd.edu/ccrutchf/team34-cse110.git
~~~~
3. Change into the Repository Directory
~~~~
$ cd ~/team34-cse110
~~~~

### Setup the Database
1. Add the tables to cassandra
~~~
$ cd ~/team34-cse110/database_queries
$ cqlsh
cqlsh> SOURCE 'Cassandra Starter.cql'
cqlsh> exit
~~~

### Scrape the Courses, Departments, and Degrees
The following will be done in two terminals `1>` will be used to denote the first while `2>` will be used to denote the second.
1. Change to the sraper-main directory
~~~~
1> cd ~/team34-cse110/scraper-main
~~~~
2. Install the dependencies for scraper-main
~~~~
1> npm install
~~~~
3. Start the server
~~~~
1> npm start
~~~~

4. Scrape the courses.  Wait for `DONE` to be displayed in the first console.  This will be a longer running process.  Expect it to take between five and ten minutes.
~~~~
2> curl http://localhost:3001/scrape/courses
~~~~
5. Scrape the degrees.  Wait for `inserted` to be displayed in the first console.  This process will be very quick.
~~~~
2> curl http://localhost:3001/scrape/departments
~~~~
6. Scrape the degrees.  Wait for `inserted` between each `curl` call.  Each `curl` call should be very quick.
~~~~
2> curl http://localhost:3001/scrape/degree/bio
2> curl http://localhost:3001/scrape/degree/cse
2> curl http://localhost:3001/scrape/degree/ece
2> curl http://localhost:3001/scrape/degree/math
2> curl http://localhost:3001/scrape/degree/mus
~~~~

### Start the Main Website
1. Open the main website's source directory
~~~~
$ cd ~/team34-cse110/server-main
~~~~
2. Install the dependencies
~~~~
$ npm install
~~~~
3. Build the frontend bundles.  This process can take up to a minute and a half.
~~~~
$ gulp
~~~~
4. Open `http://localhost:3000` in Chrome.

## Known Issues

## Contact Information

### Primary
* **Chris Crutchfield** - Project Manager and Technical Support
* **Email** - ccrutchf@ucsd.edu
* **Cell Phone Number** - (619) 847-1226
### Secondary
* **Raghav Kansal** - Database Specialist and Technical Support
* **Email** - rkansal@ucsd.edu
* **Cell Phone Number** - (858) 699-1480