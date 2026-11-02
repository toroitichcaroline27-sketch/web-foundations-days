# TicketHub System Design & Architecture

## 1. Requirements

### Functional Requirements

- **Browse & Search:** Users can search and view upcoming concerts, events, and venue details.
- **Seat Selection:** Users can view an interactive seating chart and check real-time seat availability.
- **Seat Reservation (Hold):** Users can temporarily lock/hold specific seats during checkout to prevent concurrent purchases.
- **Payment & Ticketing:** Users can securely process payments and retrieve their purchased ticket orders.

### Non-Functional Requirements

- **Speed (Low Latency):** P95 read response times under 100ms globally for event catalog browsing.
- **Correctness & Consistency:** Strict ACID guarantees during seat reservation and checkout to ensure absolute data integrity.
- **Fairness:** First-come, first-served queueing or locking mechanism during high-demand surges to prevent bot exploitation and race conditions.
- **High Availability & Scalability:** 99.99% uptime capable of handling massive traffic spikes without service degradation.

---

## 2. Traffic Estimates

### Baseline (Normal Day)

- **Active Base:** 2,000,000 registered users.
- **Daily Visitors:** 50,000 unique users visit the platform.
- **Page Views:** $50,000 \text{ users} \times 10 \text{ pages/user} = 500,000 \text{ page views/day}$.
- **Normal Ticket Sales:** 5,000 tickets sold per day.
- **Normal Writes (Average):** $\frac{5,000 \text{ sales}}{86,400 \text{ seconds}} \approx 0.058 \text{ sales/sec}$.
- **Normal Reads (Average):** $\frac{500,000 \text{ views}}{86,400 \text{ seconds}} \approx 5.79 \text{ reads/sec}$.

### Peak Surge (Popular Concert On-Sale)

- **Surge Traffic:** 200,000 people try to buy tickets within the first 10 minutes (600 seconds).
- **Inventory:** 20,000 total seats available for the concert.
- **Peak Requests Per Second (RPS):** $\frac{200,000 \text{ users}}{600 \text{ seconds}} \approx \mathbf{333.33 \text{ requests/sec}}$ average burst load (with peak spikes reaching over 1,000 RPS).
- **Comparison:** Normal traffic is modest (~5.79 reads/sec), whereas a popular concert on-sale event generates a massive traffic multiplier surge of over 50× standard volume, heavily straining write locks and payment gateways concurrently.

---

## 3. REST API Design

| Method   | Path                         | Description                                                     | Success Status |
| :------- | :--------------------------- | :-------------------------------------------------------------- | :------------- |
| **GET**  | `/api/v1/events`             | Retrieve paginated list of upcoming events/concerts             | `200 OK`       |
| **GET**  | `/api/v1/events/{id}/seats`  | Retrieve real-time seat availability map for an event           | `200 OK`       |
| **POST** | `/api/v1/seats/hold`         | Temporarily hold/lock specific seats for a user during checkout | `201 Created`  |
| **POST** | `/api/v1/orders`             | Process payment, finalize purchase, and issue tickets           | `201 Created`  |
| **GET**  | `/api/v1/users/{id}/tickets` | Retrieve all purchased ticket orders for a user                 | `200 OK`       |

---

## 4. Data Model

### Core Entities & Relationships

- **`users` (1:N with orders):** Stores account credentials and profile info.
- **`events` (1:N with seats & orders):** Stores concert details, venue names, and dates.
- **`seats` (1:N with events):** Stores specific seat numbers, tiers, and status (`available`, `held`, `booked`).
- **`orders` (N:1 with users & events):** Stores transaction status, total pricing, and ticket mapping.

### SQL DDL Schema

```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    venue VARCHAR(100) NOT NULL,
    event_date TIMESTAMP NOT NULL
);

CREATE TABLE seats (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    seat_number VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'available',
    CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    event_id VARCHAR(36) NOT NULL,
    seat_id VARCHAR(36) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_order_seat FOREIGN KEY (seat_id) REFERENCES seats(id)
);
```
