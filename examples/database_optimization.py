"""
Database Optimization Examples
Demonstrates common database performance issues and their solutions
"""

import time
from typing import List, Dict

# ============================================================================
# EXAMPLE 1: N+1 Query Problem
# ============================================================================

# BEFORE: Inefficient - N+1 queries
def get_users_with_posts_slow(db_connection):
    """
    Performance Issue: Makes 1 query for users + N queries for posts
    If there are 100 users, this makes 101 database queries!
    
    Estimated time for 100 users: ~5-10 seconds (depending on network latency)
    """
    users = db_connection.query("SELECT * FROM users")
    
    result = []
    for user in users:
        # N additional queries - one per user
        posts = db_connection.query(
            f"SELECT * FROM posts WHERE user_id = {user['id']}"
        )
        result.append({
            'user': user,
            'posts': posts
        })
    
    return result


# AFTER: Optimized - Single query with JOIN or eager loading
def get_users_with_posts_fast(db_connection):
    """
    Optimization: Uses a single query with JOIN
    Makes only 1 database query regardless of number of users
    
    Estimated time for 100 users: ~0.1-0.2 seconds
    Performance improvement: 25-100x faster
    """
    query = """
        SELECT 
            u.id as user_id,
            u.name as user_name,
            u.email as user_email,
            p.id as post_id,
            p.title as post_title,
            p.content as post_content
        FROM users u
        LEFT JOIN posts p ON u.id = p.user_id
    """
    
    rows = db_connection.query(query)
    
    # Group results by user
    users_dict = {}
    for row in rows:
        user_id = row['user_id']
        if user_id not in users_dict:
            users_dict[user_id] = {
                'user': {
                    'id': row['user_id'],
                    'name': row['user_name'],
                    'email': row['user_email']
                },
                'posts': []
            }
        
        if row['post_id']:  # If post exists
            users_dict[user_id]['posts'].append({
                'id': row['post_id'],
                'title': row['post_title'],
                'content': row['post_content']
            })
    
    return list(users_dict.values())


# ============================================================================
# EXAMPLE 2: Missing Database Indexes
# ============================================================================

# BEFORE: Query without index
"""
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255),
    name VARCHAR(255),
    created_at TIMESTAMP
);

SELECT * FROM users WHERE email = 'user@example.com';
-- Performance: O(n) - Full table scan
-- Time for 1M rows: ~1-2 seconds
"""

# AFTER: Query with index
"""
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255),
    name VARCHAR(255),
    created_at TIMESTAMP,
    INDEX idx_email (email)  -- Added index
);

SELECT * FROM users WHERE email = 'user@example.com';
-- Performance: O(log n) - Index lookup
-- Time for 1M rows: ~0.001-0.01 seconds
-- Performance improvement: 100-1000x faster
"""


# ============================================================================
# EXAMPLE 3: Fetching All Columns (SELECT *)
# ============================================================================

# BEFORE: Fetching unnecessary data
def get_user_names_slow(db_connection):
    """
    Performance Issue: Transfers all column data over network
    For 1000 users with large profile_data BLOB: ~10MB transferred
    Time: ~1-2 seconds
    """
    users = db_connection.query("SELECT * FROM users")
    return [user['name'] for user in users]


# AFTER: Fetching only needed columns
def get_user_names_fast(db_connection):
    """
    Optimization: Only fetch required columns
    For 1000 users: ~10KB transferred
    Time: ~0.05 seconds
    Performance improvement: 20-40x faster, 1000x less data transfer
    """
    users = db_connection.query("SELECT id, name FROM users")
    return [user['name'] for user in users]


# ============================================================================
# EXAMPLE 4: Inefficient Pagination
# ============================================================================

# BEFORE: Loading all results then slicing in application
def get_paginated_users_slow(db_connection, page: int, page_size: int):
    """
    Performance Issue: Loads ALL users into memory
    For 1M users: ~500MB memory, ~5-10 seconds
    Doesn't scale as data grows
    """
    all_users = db_connection.query("SELECT * FROM users")
    start = page * page_size
    end = start + page_size
    return all_users[start:end]


# AFTER: Database-level pagination
def get_paginated_users_fast(db_connection, page: int, page_size: int):
    """
    Optimization: Let database handle pagination
    Memory: ~1MB, ~0.05 seconds
    Performance improvement: 100-200x faster
    Scales regardless of total data size
    """
    offset = page * page_size
    query = f"""
        SELECT * FROM users 
        ORDER BY id 
        LIMIT {page_size} OFFSET {offset}
    """
    return db_connection.query(query)


# ============================================================================
# EXAMPLE 5: Batch Operations
# ============================================================================

# BEFORE: Individual inserts in a loop
def insert_users_slow(db_connection, users: List[Dict]):
    """
    Performance Issue: Each insert is a separate transaction
    For 1000 users: ~10-30 seconds
    Network overhead: 1000 round trips
    """
    for user in users:
        db_connection.execute(
            "INSERT INTO users (name, email) VALUES (?, ?)",
            (user['name'], user['email'])
        )
        db_connection.commit()  # Commit after each insert


# AFTER: Batch insert
def insert_users_fast(db_connection, users: List[Dict]):
    """
    Optimization: Single transaction with bulk insert
    For 1000 users: ~0.5-1 seconds
    Performance improvement: 10-30x faster
    """
    # Method 1: Multi-row INSERT
    values = ", ".join([
        f"('{user['name']}', '{user['email']}')"
        for user in users
    ])
    db_connection.execute(
        f"INSERT INTO users (name, email) VALUES {values}"
    )
    db_connection.commit()
    
    # Method 2: Prepared statement with executemany (safer)
    db_connection.executemany(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        [(user['name'], user['email']) for user in users]
    )
    db_connection.commit()


# ============================================================================
# EXAMPLE 6: Connection Pooling
# ============================================================================

# BEFORE: Creating new connection for each request
def process_request_slow(request_data):
    """
    Performance Issue: Connection setup overhead for each request
    Connection time: ~50-200ms per request
    For 100 requests: ~5-20 seconds just in connection overhead
    """
    import psycopg2
    
    # Creating new connection every time
    connection = psycopg2.connect(
        host="localhost",
        database="mydb",
        user="user",
        password="password"
    )
    
    result = connection.query(request_data)
    connection.close()
    return result


# AFTER: Using connection pool
"""
Optimization: Reuse existing connections from pool
Connection time: ~1ms per request (reused connection)
For 100 requests: ~0.1 seconds for connections
Performance improvement: 50-200x faster

Setup code:
"""
from psycopg2 import pool

# Create connection pool once at application startup
connection_pool = pool.SimpleConnectionPool(
    minconn=5,
    maxconn=20,
    host="localhost",
    database="mydb",
    user="user",
    password="password"
)

def process_request_fast(request_data):
    """Uses pooled connection"""
    connection = connection_pool.getconn()
    try:
        result = connection.query(request_data)
        return result
    finally:
        connection_pool.putconn(connection)


# ============================================================================
# EXAMPLE 7: Query Result Caching
# ============================================================================

# BEFORE: Querying database for every request
def get_popular_posts_slow(db_connection):
    """
    Performance Issue: Expensive query runs on every request
    Query time: ~0.5-1 seconds (complex aggregation)
    For 100 requests/second: Database overload
    """
    query = """
        SELECT p.*, COUNT(l.id) as like_count
        FROM posts p
        LEFT JOIN likes l ON p.id = l.post_id
        GROUP BY p.id
        ORDER BY like_count DESC
        LIMIT 10
    """
    return db_connection.query(query)


# AFTER: Caching query results
from functools import lru_cache
import time as time_module

# Cache results for 5 minutes
_cache = {}
_cache_expiry = {}

def get_popular_posts_fast(db_connection):
    """
    Optimization: Cache expensive query results
    First request: ~0.5-1 seconds
    Subsequent requests: ~0.001 seconds (from cache)
    Performance improvement: 500-1000x faster for cached results
    Database load: 99.7% reduction
    """
    cache_key = "popular_posts"
    current_time = time_module.time()
    
    # Check if cache is valid
    if (cache_key in _cache and 
        cache_key in _cache_expiry and 
        current_time < _cache_expiry[cache_key]):
        return _cache[cache_key]
    
    # Query database and update cache
    query = """
        SELECT p.*, COUNT(l.id) as like_count
        FROM posts p
        LEFT JOIN likes l ON p.id = l.post_id
        GROUP BY p.id
        ORDER BY like_count DESC
        LIMIT 10
    """
    result = db_connection.query(query)
    
    _cache[cache_key] = result
    _cache_expiry[cache_key] = current_time + 300  # 5 minutes
    
    return result


# ============================================================================
# PERFORMANCE IMPACT SUMMARY
# ============================================================================
"""
| Optimization Technique       | Performance Improvement | When to Use                          |
|------------------------------|------------------------|--------------------------------------|
| Fix N+1 queries              | 25-100x faster         | Always check for this pattern        |
| Add database indexes         | 100-1000x faster       | On columns used in WHERE/JOIN/ORDER  |
| Select specific columns      | 20-40x faster          | When working with large tables       |
| Database-level pagination    | 100-200x faster        | For large result sets                |
| Batch operations             | 10-30x faster          | When inserting/updating many rows    |
| Connection pooling           | 50-200x faster         | For high-traffic applications        |
| Query result caching         | 500-1000x faster       | For frequently accessed, slow queries|

Best Practices:
1. Always use prepared statements (prevents SQL injection)
2. Add indexes on foreign keys and frequently queried columns
3. Use EXPLAIN to analyze query execution plans
4. Monitor slow query logs
5. Use connection pooling in production
6. Cache expensive query results with appropriate TTL
7. Batch operations when possible
8. Only fetch columns you need
9. Use database-level features (pagination, aggregation)
10. Profile before optimizing
"""
