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