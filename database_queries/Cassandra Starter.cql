DROP KEYSPACE grad;

CREATE KEYSPACE grad WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}  AND durable_writes = true;

CREATE TABLE grad.courses (
	department text,
	number text,
    title text,
	description text,
    credits list<int>,
	prereqs list<frozen <list<text>>>,
	coreqs list<text>,
    quarter list<int>,
	PRIMARY KEY(department, number)
);

CREATE TYPE grad.requirement (
	type text,
	courses list<text>,
	courses_needed int,
	credits_needed int
);

CREATE TABLE grad.degrees (
	department text,
	number text,
    title text,
	description text,
    requirements list<frozen<requirement>>,
	PRIMARY KEY(department, number)
);

CREATE TABLE grad.departments (
	code text PRIMARY KEY,
	name text,
	code_list list<text>
);

CREATE TABLE grad.colleges (
	college text,
    requirements list<frozen<requirement>>,
	PRIMARY KEY(college)
);

CREATE TABLE grad.users(
	uid int,
	college text,
	major text,
	second_major text,
	minor text,
	courses_taken list<text>,
	PRIMARY KEY(uid)
);
