
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
