# Library Books REST API Design

Documentation for the Library Books resource endpoints, HTTP methods, request parameters, and status codes.

## Endpoints

### 1. List All Books

- **Method:** `GET`
- **Path:** `/api/books`
- **Description:** Retrieves a list of all books in the library catalog.
- **Success Status Code:** `200 OK`

### 2. Get Single Book

- **Method:** `GET`
- **Path:** `/api/books/:id`
- **Description:** Retrieves detailed information for a specific book by ID.
- **Success Status Code:** `200 OK`

### 3. Create a Book

- **Method:** `POST`
- **Path:** `/api/books`
- **Description:** Adds a new book entry to the library.
- **Request Body:**

```json
{
  "title": "The Chebara dam",
  "author": " carolin toronnn.",
  "isbn": "9780743273565",
  "publishedYear": 1925
}
```
