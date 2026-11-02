# SnapShare System Architecture & Scaling Plan

## 1. Assumptions & Calculations

### Core Assumptions
* **Registered Users:** 10,000,000 users
* **Daily Active Users (DAU):** 10% of registered users = **1,000,000 active users/day**
* **User Activity:** Each active user uploads **1 photo per day** and views **50 feed pages per day**
* **File Sizes:** 
  * Average original photo size = **2 MB**
  * Thumbnail size = **50 KB** (0.05 MB)
* **Traffic Distribution:** Peak traffic multiplier = **5×** average traffic

---

### Traffic & Storage Workload Calculations

1. **Daily Uploads (Writes):**
   * 1,000,000 users × 1 photo/day = 1,000,000 photos/day

2. **Uploads Per Second (Average Write RPS):**
   * $\frac{1,000,000 \text{ photos}}{86,400 \text{ seconds}} \approx \mathbf{11.57 \text{ uploads/sec}}$

3. **Uploads Per Second (Peak Write RPS):**
   * $11.57 \times 5 = \mathbf{57.85 \text{ uploads/sec}}$

4. **Daily Feed Views (Reads):**
   * 1,000,000 users × 50 feed views/day = 50,000,000 views/day

5. **Feed Views Per Second (Average Read RPS):**
   * $\frac{50,000,000 \text{ views}}{86,400 \text{ seconds}} \approx \mathbf{578.7 \text{ reads/sec}}$

6. **Feed Views Per Second (Peak Read RPS):**
   * $578.7 \times 5 = \mathbf{2,893.5 \text{ reads/sec}}$

7. **Annual Photo Storage Required:**
   * Total photos per year = $1,000,000 \times 365 = 365,000,000 \text{ photos/year}$
   * Original photos storage = $365,000,000 \times 2 \text{ MB} = \mathbf{730 \text{ TB/year}}$
   * Thumbnails storage = $365,000,000 \times 0.05 \text{ MB} = \mathbf{18.25 \text{ TB/year}}$
   * **Total Storage = ~748.25 TB per year**

---

## 2. Read-Heavy vs. Write-Heavy Bias

SnapShare is heavily **read-heavy**. 
* **Write Workload:** ~11.57 average uploads/sec (scaling to ~57.85 peak).
* **Read Workload:** ~578.7 average reads/sec, scaling up to ~2,893.5 peak reads/sec.

**Design Implications:** Because read traffic dwarfs write traffic by roughly 50 to 1, our architecture must optimize for fast content delivery. We rely heavily on **Caching** for feeds, a **CDN** for image asset delivery, and **Read Replicas** on the database to handle heavy SELECT query loads without slowing down user uploads.

---

## 3. Why Photos Should Not Be Stored in the Database

Binary large objects (BLOBs) like 2 MB photos should never be stored directly inside a relational database (SQL/NoSQL) because:
1. **Performance Bottlenecks:** Relational databases are optimized for structured indexing, ACID transactions, and fast metadata lookups, not streaming massive binary files. Storing files bloats database size, slows down backups, and exhausts memory caches.
2. **Cost & Scalability:** Scaling object storage (like AWS S3) is cheap and built specifically for petabyte-scale file storage, whereas scaling high-performance database storage is extremely expensive.
* **Alternative:** Store only the **file URL string** (e.g., `https://cdn.snapshare.com/photos/xyz.jpg`) in the database, and store the actual binary image files in **Object Storage**.

---

## 4. System Architecture Diagram

```text
       [ Clients / Mobile Apps ]
                  │
                  ▼
            [    CDN    ]  ──> (Caches & delivers static images/thumbnails globally)
                  │
                  ▼
         [  Load Balancer  ]
                  │
         ┌────────┴────────┐
         ▼                 ▼
   [ App Server 1 ]  [ App Server 2 ]  (Stateless API handlers)
         │                 │
         ├─────────────────┼──────────────────┐
         ▼                 ▼                  ▼
   [ Redis Cache ]  [ Primary DB ]    [ Message Queue ]
                           │                  │
                     (Write Master)     (Async Jobs)
                           │                  │
                           ▼                  ▼
                     [ Read Replica ]   [ Thumbnail Worker ]
                           │                  │
                           └────────┬─────────┘
                                    ▼
                         [ Object Storage (S3) ]