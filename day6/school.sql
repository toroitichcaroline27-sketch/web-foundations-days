-- Disable foreign key enforcement during setup if re-running, then enable
PRAGMA foreign_keys = ON;

-- 1. CREATE TABLE STATEMENTS

CREATE TABLE students (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE
);

CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    UNIQUE(student_id, course_id)
);

-- 2. INSERT SAMPLE DATA (3 Students, 3 Courses, 5 Enrolments)

INSERT INTO students (name, email) VALUES
('Caroline Toroitich', 'caroline@example.com'),
('Alex Mercer', 'alex@example.com'),
('Sarah Jenkins', 'sarah@example.com'),
('David Kim', 'david@example.com'); -- Added for testing "students with no enrolments"

INSERT INTO courses (title, code) VALUES
('Web Foundations', 'CS101'),
('Database Systems', 'CS102'),
('Data Structures', 'CS103');

INSERT INTO enrolments (student_id, course_id, grade) VALUES
(1, 1, 'A'),  -- Caroline -> Web Foundations
(1, 2, 'A-'), -- Caroline -> Database Systems
(2, 1, 'B+'), -- Alex -> Web Foundations
(2, 3, 'B'),  -- Alex -> Data Structures
(3, 2, 'A');  -- Sarah -> Database Systems

-- 3. FIVE REQUIRED QUERIES

-- Query 1: All courses for one student (by name)
SELECT students.name AS student_name, courses.title AS course_title, enrolments.grade
FROM enrolments
JOIN students ON enrolments.student_id = students.student_id
JOIN courses ON enrolments.course_id = courses.course_id
WHERE students.name = 'Caroline Toroitich';

-- Query 2: All students on one course (by course title)
SELECT courses.title AS course_title, students.name AS student_name, students.email
FROM enrolments
JOIN students ON enrolments.student_id = students.student_id
JOIN courses ON enrolments.course_id = courses.course_id
WHERE courses.title = 'Web Foundations';

-- Query 3: Number of students per course
SELECT courses.title AS course_title, COUNT(enrolments.student_id) AS student_count
FROM courses
LEFT JOIN enrolments ON courses.course_id = enrolments.course_id
GROUP BY courses.course_id, courses.title;

-- Query 4: Students who have no enrolments
SELECT students.name, students.email
FROM students
LEFT JOIN enrolments ON students.student_id = enrolments.student_id
WHERE enrolments.enrolment_id IS NULL;

-- Query 5: Update one enrolment's grade
UPDATE enrolments
SET grade = 'A+'
WHERE student_id = 1 AND course_id = 1;