# Performance Optimization Guide

## Overview
This guide provides best practices and techniques for identifying and improving slow or inefficient code in software projects.

## Table of Contents
1. [Common Performance Anti-Patterns](#common-performance-anti-patterns)
2. [Profiling and Analysis Tools](#profiling-and-analysis-tools)
3. [Language-Specific Optimizations](#language-specific-optimizations)
4. [Database and I/O Optimization](#database-and-io-optimization)
5. [Algorithm and Data Structure Selection](#algorithm-and-data-structure-selection)
6. [Caching Strategies](#caching-strategies)
7. [Concurrency and Parallelism](#concurrency-and-parallelism)

## Common Performance Anti-Patterns

### 1. N+1 Query Problems
**Problem**: Making multiple database queries in a loop instead of one batch query.

**Bad Example**:
```python
# Inefficient - N+1 queries
users = get_all_users()
for user in users:
    posts = get_posts_by_user_id(user.id)  # N queries
    process_posts(posts)
```

**Good Example**:
```python
# Efficient - Single query with JOIN or eager loading
users_with_posts = get_all_users_with_posts()  # 1 query
for user in users_with_posts:
    process_posts(user.posts)
```

### 2. Unnecessary Loops and Iterations
**Problem**: Iterating over data multiple times when it could be done once.

**Bad Example**:
```javascript
// Inefficient - Multiple iterations
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const filtered = doubled.filter(n => n > 5);
const sum = filtered.reduce((a, b) => a + b, 0);
```

**Good Example**:
```javascript
// Efficient - Single iteration
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, n) => {
  const doubled = n * 2;
  return doubled > 5 ? acc + doubled : acc;
}, 0);
```

### 3. String Concatenation in Loops
**Problem**: Repeatedly concatenating strings creates many intermediate objects.

**Bad Example**:
```java
// Inefficient - Creates many String objects
String result = "";
for (int i = 0; i < 1000; i++) {
    result += "Item " + i + "\n";  // Creates new String each time
}
```

**Good Example**:
```java
// Efficient - Uses StringBuilder
StringBuilder result = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    result.append("Item ").append(i).append("\n");
}
String finalResult = result.toString();
```

### 4. Loading Entire Files into Memory
**Problem**: Reading large files completely into memory when processing line-by-line would suffice.

**Bad Example**:
```python
# Inefficient - Loads entire file into memory
with open('large_file.txt', 'r') as f:
    content = f.read()  # Could be GB of data
    for line in content.split('\n'):
        process_line(line)
```

**Good Example**:
```python
# Efficient - Streams file line by line
with open('large_file.txt', 'r') as f:
    for line in f:  # Lazy iteration
        process_line(line)
```

### 5. Inefficient Data Structure Choices
**Problem**: Using wrong data structures for the use case.

**Bad Example**:
```python
# Inefficient - O(n) lookup time
user_list = [user1, user2, user3, ...]
for user in user_list:
    if user.id == target_id:  # Linear search
        return user
```

**Good Example**:
```python
# Efficient - O(1) lookup time
user_dict = {user.id: user for user in users}
return user_dict.get(target_id)  # Hash lookup
```

### 6. Unnecessary Object Creation
**Problem**: Creating objects in loops or hot paths that could be reused.

**Bad Example**:
```javascript
// Inefficient - Creates new RegExp every iteration
function validateEmails(emails) {
  return emails.map(email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Created repeatedly
    return regex.test(email);
  });
}
```

**Good Example**:
```javascript
// Efficient - Reuses single RegExp
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateEmails(emails) {
  return emails.map(email => EMAIL_REGEX.test(email));
}
```

### 7. Synchronous Operations in Async Contexts
**Problem**: Blocking operations preventing concurrent execution.

**Bad Example**:
```javascript
// Inefficient - Sequential execution
async function fetchMultipleResources() {
  const user = await fetchUser();      // Wait
  const posts = await fetchPosts();    // Wait
  const comments = await fetchComments(); // Wait
  return { user, posts, comments };
}
```

**Good Example**:
```javascript
// Efficient - Parallel execution
async function fetchMultipleResources() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ]);
  return { user, posts, comments };
}
```

## Profiling and Analysis Tools

### Python
- **cProfile**: Built-in profiler for function-level analysis
  ```bash
  python -m cProfile -s cumulative script.py
  ```
- **line_profiler**: Line-by-line profiling
- **memory_profiler**: Track memory usage
- **py-spy**: Sampling profiler for production

### JavaScript/Node.js
- **Chrome DevTools**: Built-in profiler for browser JavaScript
- **Node.js --inspect**: Debugging and profiling
- **clinic.js**: Performance analysis toolkit
- **0x**: Flame graph profiling

### Java
- **JProfiler**: Commercial profiler
- **VisualVM**: Free profiling tool
- **Java Flight Recorder**: Low-overhead profiling
- **YourKit**: Commercial profiler

### General Tools
- **Benchmark tools**: ab, wrk, JMeter for load testing
- **APM solutions**: New Relic, DataDog, AppDynamics
- **Time complexity analysis**: Big-O notation analysis

## Language-Specific Optimizations

### Python
- Use list comprehensions instead of loops when appropriate
- Leverage built-in functions (sum, max, min) - they're implemented in C
- Use `__slots__` for classes with many instances
- Consider using `numpy` for numerical operations
- Use generators for large datasets
- Cache expensive computations with `@lru_cache`

### JavaScript/TypeScript
- Use `const` and `let` instead of `var` for better optimization
- Avoid modifying object shapes after creation
- Use typed arrays for numerical data
- Leverage Web Workers for CPU-intensive tasks
- Debounce/throttle frequent event handlers
- Use `requestAnimationFrame` for animations

### Java
- Use primitive types instead of wrapper classes when possible
- Prefer ArrayList over LinkedList for most use cases
- Use StringBuilder/StringBuffer for string manipulation
- Implement proper `equals()` and `hashCode()` for hash-based collections
- Use try-with-resources for automatic resource management
- Consider parallel streams for CPU-intensive operations on large datasets

### C/C++
- Enable compiler optimizations (-O2, -O3)
- Use const correctness
- Prefer stack allocation over heap when possible
- Use move semantics to avoid copies
- Profile before optimizing
- Consider SIMD for parallel operations

## Database and I/O Optimization

### Query Optimization
1. **Use indexes**: Create indexes on frequently queried columns
2. **Avoid SELECT ***: Only fetch needed columns
3. **Use pagination**: Limit result sets with LIMIT/OFFSET
4. **Connection pooling**: Reuse database connections
5. **Prepared statements**: Prevent SQL injection and improve performance
6. **Batch operations**: Group INSERT/UPDATE operations

### I/O Optimization
1. **Buffer I/O operations**: Use buffered streams
2. **Async I/O**: Don't block on I/O operations
3. **Compression**: Compress data for network transfer
4. **CDN usage**: Serve static assets from CDN
5. **HTTP/2**: Use multiplexing for parallel requests

## Algorithm and Data Structure Selection

### Time Complexity Guide
- **O(1)**: Hash table lookup, array access by index
- **O(log n)**: Binary search, balanced tree operations
- **O(n)**: Linear search, single loop
- **O(n log n)**: Efficient sorting (merge sort, quick sort)
- **O(n²)**: Nested loops, bubble sort
- **O(2^n)**: Recursive fibonacci, subset generation
- **O(n!)**: Permutations, traveling salesman (brute force)

### Data Structure Selection Guide
| Use Case | Best Structure | Time Complexity |
|----------|---------------|-----------------|
| Fast lookup by key | Hash Map | O(1) |
| Ordered data with fast insert/delete | Balanced Tree | O(log n) |
| FIFO queue | Queue/Deque | O(1) |
| LIFO stack | Stack | O(1) |
| Priority processing | Heap/Priority Queue | O(log n) |
| Fast membership testing | Set | O(1) |
| Range queries | Segment Tree | O(log n) |

## Caching Strategies

### Types of Caching
1. **Memoization**: Cache function results
2. **HTTP caching**: Use ETags, Cache-Control headers
3. **Database query caching**: Cache expensive query results
4. **Application-level caching**: Redis, Memcached
5. **CDN caching**: Edge caching for static content

### Cache Invalidation Strategies
- **TTL (Time To Live)**: Expire after fixed time
- **LRU (Least Recently Used)**: Evict least recently used items
- **Write-through**: Update cache on every write
- **Write-behind**: Async cache updates
- **Cache aside**: Application manages cache

## Concurrency and Parallelism

### When to Use
- **CPU-bound tasks**: Use parallelism (multiple cores)
- **I/O-bound tasks**: Use concurrency (async/await)
- **Mixed workloads**: Combine both approaches

### Best Practices
1. **Avoid shared mutable state**: Use immutable data or proper synchronization
2. **Use thread-safe data structures**: Concurrent collections
3. **Pool threads**: Don't create threads on-demand
4. **Async I/O**: Use non-blocking I/O for scalability
5. **Backpressure**: Handle slow consumers gracefully

### Common Pitfalls
- **Race conditions**: Improper synchronization
- **Deadlocks**: Circular lock dependencies
- **Thread starvation**: Too many threads competing for resources
- **Context switching overhead**: Too many threads

## Performance Testing Checklist

- [ ] Profile code to identify bottlenecks
- [ ] Analyze algorithm time and space complexity
- [ ] Review database queries and indexes
- [ ] Check for N+1 query problems
- [ ] Validate caching strategy
- [ ] Test under realistic load conditions
- [ ] Monitor memory usage and leaks
- [ ] Review I/O operations
- [ ] Check for unnecessary synchronous operations
- [ ] Verify proper use of data structures
- [ ] Test with production-like data volumes
- [ ] Set up continuous performance monitoring

## Key Principles

1. **Measure first, optimize second**: Don't guess where the bottleneck is
2. **80/20 rule**: Focus on the 20% of code that consumes 80% of resources
3. **Readability vs Performance**: Only sacrifice readability for proven bottlenecks
4. **Premature optimization**: "The root of all evil" - Donald Knuth
5. **Test after optimizing**: Ensure correctness is maintained
6. **Document performance-critical code**: Explain why certain approaches were used

## Additional Resources

- "High Performance Python" by Micha Gorelick and Ian Ozsvald
- "Java Performance: The Definitive Guide" by Scott Oaks
- "Programming Pearls" by Jon Bentley
- "The Art of Computer Programming" by Donald Knuth
- Big-O Cheat Sheet: https://www.bigocheatsheet.com/
