DROP TABLE grad.departments;

CREATE TABLE grad.departments (
	code text PRIMARY KEY,
	name text,
	code_list list<text>
);
