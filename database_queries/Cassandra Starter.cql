DROP KEYSPACE grad;

CREATE KEYSPACE grad WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}  AND durable_writes = true;

CREATE TABLE grad.courses (
	department text,
	number text,
    title text,
	description text,
    credits list<int>,
	prereqs list<frozen <list<text>>>,
	PRIMARY KEY(department, number)
);
