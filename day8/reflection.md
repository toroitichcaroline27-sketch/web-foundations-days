# Course Reflection

The most difficult concept in this course was mastering distributed concurrency control and preventing race conditions during high-volume database writes. I overcame it by breaking down transactional boundaries, learning how row-level locking works in relational databases, and implementing strategic caching and queueing layers to protect write masters from sudden traffic spikes.

Based on the feedback received throughout the capstone progression, the primary area I would improve is refining the granularity of our caching validation strategies to ensure that cache invalidations happen synchronously on write updates, minimizing stale data presentation windows.

Next, I plan to learn advanced cloud-native microservices orchestration using Kubernetes, containerized service meshes, and event-driven architecture patterns with Apache Kafka to scale real-time distributed applications even further.
