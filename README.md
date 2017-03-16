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

## Running the Server Locally
### Server Requirements
* Ubuntu 16.04.02 LTS 64 Bit
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
5. Reboot the server
### Install Node.js
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
$ csql
csql> SOURCE 'Cassandra Starter.cql'
csql> exit
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
## Contact Information
* **Chris Crutchfield** - Project Manager and Technical Support
 * **Email** - ccrutchf@ucsd.edu
 * **Cell Phone Number** - (619) 847-1226