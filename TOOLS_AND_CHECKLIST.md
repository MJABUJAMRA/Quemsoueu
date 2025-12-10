# Performance Analysis Tools and Checklist

## Quick Performance Checklist

Use this checklist when reviewing code for performance issues:

### Algorithm & Data Structures
- [ ] Are the right data structures being used? (hash map vs list, set vs list)
- [ ] Are there nested loops that could be avoided?
- [ ] Is the algorithm's time complexity acceptable? (avoid O(n²) when possible)
- [ ] Are operations on sorted data using binary search?
- [ ] Are there unnecessary iterations over the same data?
- [ ] Are built-in functions being used instead of manual implementations?

### Database Queries
- [ ] Are there N+1 query problems?
- [ ] Do frequently queried columns have indexes?
- [ ] Are only necessary columns being selected (avoid SELECT *)?
- [ ] Is pagination handled at database level, not application level?
- [ ] Are batch operations used instead of individual inserts/updates?
- [ ] Is connection pooling implemented?
- [ ] Are expensive queries cached appropriately?

### Memory Management
- [ ] Are large files being streamed instead of loaded entirely?
- [ ] Are generators used for large sequences?
- [ ] Is string concatenation in loops avoided?
- [ ] Are there memory leaks from circular references?
- [ ] Are caches bounded with appropriate eviction policies?
- [ ] Are resources (files, connections) properly closed?
- [ ] Is __slots__ used for classes with many instances?

### Asynchronous Operations
- [ ] Are independent async operations executed in parallel?
- [ ] Are Promise.all/asyncio.gather used where appropriate?
- [ ] Are there unnecessary await statements on synchronous operations?
- [ ] Is debouncing/throttling used for frequent events?
- [ ] Are expensive async operations cached?
- [ ] Is request cancellation implemented to prevent race conditions?
- [ ] Are error handling strategies appropriate (allSettled vs all)?

### I/O Operations
- [ ] Are file operations asynchronous where possible?
- [ ] Is buffering used for I/O operations?
- [ ] Are static assets served from CDN?
- [ ] Is data compressed for network transfer?
- [ ] Are HTTP/2 features utilized?

### Caching
- [ ] Are frequently accessed expensive operations cached?
- [ ] Is cache invalidation strategy appropriate?
- [ ] Are cache sizes bounded?
- [ ] Is TTL set appropriately for cached data?
- [ ] Are multiple cache layers considered (memory, Redis, CDN)?

### Code Quality
- [ ] Have you profiled to identify actual bottlenecks?
- [ ] Are performance-critical sections documented?
- [ ] Is the code still readable after optimization?
- [ ] Are there tests to verify correctness after optimization?
- [ ] Is premature optimization being avoided?

## Profiling Tools by Language

### Python

#### cProfile (Built-in)
```bash
# Profile a script
python -m cProfile -s cumulative script.py

# Profile with output to file
python -m cProfile -o output.prof script.py

# Analyze profile data
python -m pstats output.prof
```

#### line_profiler
```bash
# Install
pip install line-profiler

# Add @profile decorator to functions
@profile
def slow_function():
    # code here

# Run
kernprof -l -v script.py
```

#### memory_profiler
```bash
# Install
pip install memory-profiler

# Add @profile decorator
@profile
def memory_intensive():
    # code here

# Run
python -m memory_profiler script.py
```

#### py-spy (Sampling Profiler)
```bash
# Install
pip install py-spy

# Profile running process
py-spy top --pid <PID>

# Generate flame graph
py-spy record -o profile.svg -- python script.py
```

#### timeit (Built-in)
```python
import timeit

# Quick timing
time = timeit.timeit('sum(range(100))', number=10000)
print(f"Time: {time} seconds")

# Compare multiple approaches
setup = "from math import sqrt"
stmt1 = "[sqrt(i) for i in range(1000)]"
stmt2 = "list(map(sqrt, range(1000)))"

print(timeit.timeit(stmt1, setup, number=1000))
print(timeit.timeit(stmt2, setup, number=1000))
```

### JavaScript/Node.js

#### Chrome DevTools
```javascript
// In browser console
console.time('myOperation');
// ... code to measure
console.timeEnd('myOperation');

// Profile with Performance tab
// Record → Perform action → Stop → Analyze
```

#### Node.js Built-in Profiler
```bash
# Start with --inspect
node --inspect script.js

# Or with --prof for V8 profiler
node --prof script.js

# Process profile
node --prof-process isolate-0x*.log > processed.txt
```

#### clinic.js
```bash
# Install
npm install -g clinic

# Doctor (overall analysis)
clinic doctor -- node script.js

# Flame (CPU profiling)
clinic flame -- node script.js

# Bubbleprof (async operations)
clinic bubbleprof -- node script.js
```

#### 0x (Flame Graphs)
```bash
# Install
npm install -g 0x

# Generate flame graph
0x script.js
```

### Java

#### JProfiler
```bash
# Start with JProfiler agent
java -agentpath:/path/to/jprofiler/bin/libjprofilerti.so -jar app.jar
```

#### VisualVM
```bash
# Start VisualVM
jvisualvm

# Attach to running Java process
# Use sampling or profiling mode
```

#### Java Flight Recorder
```bash
# Start with JFR enabled
java -XX:StartFlightRecording=duration=60s,filename=recording.jfr -jar app.jar

# Analyze with Mission Control
jmc
```

### SQL/Database

#### EXPLAIN ANALYZE (PostgreSQL)
```sql
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'test@example.com';
```

#### MySQL EXPLAIN
```sql
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
```

#### Slow Query Log
```sql
-- MySQL
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

### General Tools

#### Apache Bench (HTTP Load Testing)
```bash
# 1000 requests, 10 concurrent
ab -n 1000 -c 10 http://localhost:8080/api/endpoint
```

#### wrk (HTTP Benchmarking)
```bash
# 12 threads, 400 connections, 30 seconds
wrk -t12 -c400 -d30s http://localhost:8080/api/endpoint
```

#### Artillery (Load Testing)
```bash
# Install
npm install -g artillery

# Quick test
artillery quick --count 10 --num 100 http://localhost:8080

# With config file
artillery run load-test.yml
```

## Monitoring and APM Tools

### Application Performance Monitoring
- **New Relic**: Full-stack monitoring with transaction tracing
- **DataDog**: Infrastructure and application monitoring
- **AppDynamics**: Business-focused APM
- **Dynatrace**: AI-powered observability
- **Prometheus + Grafana**: Open-source monitoring stack

### Log Analysis
- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **Splunk**: Enterprise log analysis
- **Graylog**: Open-source log management

### Real User Monitoring (RUM)
- **Google Analytics**: Page load times, user behavior
- **Sentry Performance**: Error tracking with performance monitoring
- **Raygun**: Crash reporting and RUM

## Performance Testing Strategies

### 1. Baseline Measurement
```python
# Establish baseline before optimization
import time

start = time.time()
result = slow_function()
baseline_time = time.time() - start

print(f"Baseline: {baseline_time:.4f} seconds")
```

### 2. A/B Testing
```python
import timeit

# Test old implementation
old_time = timeit.timeit(
    'old_function(data)',
    setup='from __main__ import old_function, data',
    number=1000
)

# Test new implementation
new_time = timeit.timeit(
    'new_function(data)',
    setup='from __main__ import new_function, data',
    number=1000
)

improvement = (old_time - new_time) / old_time * 100
print(f"Improvement: {improvement:.1f}%")
```

### 3. Load Testing
```javascript
// Artillery config (load-test.yml)
config:
  target: 'http://localhost:8080'
  phases:
    - duration: 60
      arrivalRate: 5
      name: "Warm up"
    - duration: 120
      arrivalRate: 10
      rampTo: 50
      name: "Ramp up load"
    - duration: 60
      arrivalRate: 50
      name: "Sustained load"

scenarios:
  - name: "API test"
    flow:
      - get:
          url: "/api/users"
      - think: 1
      - post:
          url: "/api/users"
          json:
            name: "Test User"
```

### 4. Stress Testing
```bash
# Find breaking point
# Gradually increase load until system fails
for concurrent in 10 50 100 200 500 1000; do
    echo "Testing with $concurrent concurrent requests"
    ab -n 10000 -c $concurrent http://localhost:8080/api/endpoint
    sleep 10
done
```

## Performance Budgets

Set and monitor performance budgets:

### Web Applications
- **Initial page load**: < 3 seconds
- **Time to Interactive (TTI)**: < 5 seconds
- **First Contentful Paint (FCP)**: < 2 seconds
- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **JavaScript bundle size**: < 200KB (gzipped)

### API Endpoints
- **P50 response time**: < 100ms
- **P95 response time**: < 500ms
- **P99 response time**: < 1000ms
- **Throughput**: > 1000 requests/second

### Database
- **Query execution time (P95)**: < 100ms
- **Connection pool utilization**: < 80%
- **Cache hit rate**: > 90%

## Continuous Performance Monitoring

### Set up alerts for:
- Response time degradation
- Error rate increases
- Memory usage spikes
- CPU utilization > 80%
- Database slow query count
- Cache hit rate drops

### Regular performance audits:
- Weekly: Review slow query logs
- Monthly: Profile top endpoints
- Quarterly: Load testing
- After each release: Performance regression testing

## Performance Optimization Workflow

1. **Measure**: Use profiling tools to identify bottlenecks
2. **Analyze**: Understand why the bottleneck exists
3. **Optimize**: Make targeted improvements
4. **Test**: Verify the optimization works
5. **Measure Again**: Confirm the improvement
6. **Document**: Explain the optimization for future maintainers
7. **Monitor**: Watch for regressions

## Common Performance Anti-Patterns to Watch For

### Code Smells
- Nested loops with large datasets
- String concatenation in loops
- Repeated database queries in loops (N+1 problem)
- Loading entire files when streaming would work
- Not using indexes on database columns
- Synchronous operations in async contexts
- Unbounded caches
- Missing connection pooling
- Blocking the event loop

### Architecture Smells
- No caching layer
- Single point of failure
- No load balancing
- Synchronous microservice communication
- Chatty APIs (many small requests)
- No CDN for static assets
- Missing database read replicas
- Lack of horizontal scaling

## Resources

### Books
- "High Performance Python" by Micha Gorelick and Ian Ozsvald
- "Java Performance: The Definitive Guide" by Scott Oaks
- "JavaScript Performance" by Nicholas C. Zakas
- "Systems Performance" by Brendan Gregg
- "The Art of Computer Programming" by Donald Knuth

### Websites
- https://www.bigocheatsheet.com/ - Algorithm complexity reference
- https://web.dev/performance/ - Web performance best practices
- https://brendangregg.com/ - Performance analysis resources
- https://perfplanet.com/ - Web performance calendar

### Tools
- https://www.webpagetest.org/ - Web page performance testing
- https://lighthouse-ci.com/ - Continuous performance monitoring
- https://github.com/brendangregg/FlameGraph - Flame graph visualization
