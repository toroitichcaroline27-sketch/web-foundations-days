# School Database Architecture & Design

Overview of database structure, table relationships, indexing performance, and database model comparison.

## Table Explanations

- **`students`**: Stores core information about individual students, including `student_id` (Primary Key), `name`, and a unique `email`.
- **`courses`**: Stores details about available courses, including `course_id` (Primary Key), `title`, and a unique course `code`.
- **`enrolments`**: Serves as the junction (join) table linking students to courses. Stores `enrolment_id` (Primary Key), foreign keys (`student_id`, `course_id`), and the student's `grade`.

---

## Entity Relationships & Join Table

- **Relationships:**
  - A single student can enroll in multiple courses (One-to-Many from student to enrolments).
  - A single course can have multiple enrolled students (One-to-Many from course to enrolments).
  - Together, students and courses share a Many-to-Many relationship.

- **Why a Join Table is Needed:**
  Relational databases cannot directly implement a Many-to-Many relationship without data duplication or storing lists in a single column. The `enrolments` join table breaks the Many-to-Many relationship into two clean One-to-Many relationships and provides a place to store attributes specific to that connection, such as `grade`.

---

## Performance Optimization (Indexing)

- **Proposed Index:** `CREATE INDEX idx_enrolments_student_id ON enrolments(student_id);`
- **Reason:** Queries frequently search or join on `student_id` (for example, retrieving all courses for a student). Adding an index on `enrolments(student_id)` speeds up lookups drastically as enrolment records grow.

---

## Database Choice: SQL vs. NoSQL

For a school enrolment system, SQL (Relational Database) is the superior choice over NoSQL. Academic records demand strict transactional integrity (ACID compliance) and data accuracy—for example, preventing duplicate enrolments, ensuring foreign key integrity so grades aren't assigned to non-existent students, and handling concurrent registration updates. NoSQL document stores excel at unstructured or rapidly changing schemas, but the structured, highly relational nature of students, courses, and grades benefits directly from SQL's schema enforcement, joins, and relational integrity constraints.
