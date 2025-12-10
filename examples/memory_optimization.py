"""
Memory Optimization Examples
Demonstrates techniques for reducing memory usage and preventing memory leaks
"""

import sys
from typing import Iterator, List, Generator
import gc

# ============================================================================
# EXAMPLE 1: Loading Entire File vs Streaming
# ============================================================================

# BEFORE: Loading entire file into memory
def process_large_file_slow(filename: str) -> int:
    """
    Memory Issue: Loads entire file into memory
    
    For 1GB file:
    Memory usage: ~1GB+ (entire file in RAM)
    Time: ~10 seconds (includes memory allocation)
    Problem: May cause out-of-memory errors
    """
    with open(filename, 'r') as f:
        content = f.read()  # Loads entire file
        lines = content.split('\n')
        count = sum(1 for line in lines if 'ERROR' in line)
    return count


# AFTER: Streaming file line by line
def process_large_file_fast(filename: str) -> int:
    """
    Optimization: Processes file line by line
    
    For 1GB file:
    Memory usage: ~8KB (one line at a time)
    Time: ~5 seconds
    Performance improvement: 125,000x less memory
    """
    count = 0
    with open(filename, 'r') as f:
        for line in f:  # Lazy iteration
            if 'ERROR' in line:
                count += 1
    return count


# ============================================================================
# EXAMPLE 2: List Comprehension vs Generator
# ============================================================================

# BEFORE: List comprehension (all in memory)
def get_large_dataset_slow(n: int) -> List[int]:
    """
    Memory Issue: Creates entire list in memory
    
    For n=10,000,000:
    Memory usage: ~400MB
    Time: ~2 seconds
    """
    return [i * i for i in range(n)]


# AFTER: Generator (lazy evaluation)
def get_large_dataset_fast(n: int) -> Generator[int, None, None]:
    """
    Optimization: Returns generator that yields values on demand
    
    For n=10,000,000:
    Memory usage: ~100 bytes (generator object)
    Time: Instant (values computed when needed)
    Performance improvement: 4,000,000x less memory
    """
    return (i * i for i in range(n))


# Usage example showing the difference
def compare_memory():
    """
    SLOW:
    squares = get_large_dataset_slow(10_000_000)  # 400MB allocated
    first_ten = list(squares[:10])  # But we only needed 10 values!
    
    FAST:
    squares_gen = get_large_dataset_fast(10_000_000)  # ~100 bytes
    first_ten = [next(squares_gen) for _ in range(10)]  # Only compute 10 values
    """
    pass


# ============================================================================
# EXAMPLE 3: String Accumulation
# ============================================================================

# BEFORE: Repeated string concatenation
def build_html_slow(items: List[str]) -> str:
    """
    Memory Issue: Creates many intermediate string objects
    Each concatenation creates a new string (strings are immutable)
    
    For 10,000 items:
    Memory usage: ~50MB (many intermediate strings)
    Time: ~5 seconds
    Allocations: ~10,000 string objects
    """
    html = "<ul>"
    for item in items:
        html += f"<li>{item}</li>"  # Creates new string each time
    html += "</ul>"
    return html


# AFTER: Using list and join
def build_html_fast(items: List[str]) -> str:
    """
    Optimization: Build list then join once
    
    For 10,000 items:
    Memory usage: ~5MB (single final string + list)
    Time: ~0.1 seconds
    Performance improvement: 50x faster, 10x less memory
    """
    parts = ["<ul>"]
    parts.extend(f"<li>{item}</li>" for item in items)
    parts.append("</ul>")
    return "".join(parts)


# ============================================================================
# EXAMPLE 4: Storing Large Objects vs Indices
# ============================================================================

# BEFORE: Storing full objects
class UserWithDuplicateSlow:
    """
    Memory Issue: Each instance stores full data
    """
    def __init__(self, name: str, email: str, department: str, role: str):
        self.name = name
        self.email = email
        self.department = department  # Often repeated
        self.role = role              # Often repeated


def create_users_slow(n: int) -> List[UserWithDuplicateSlow]:
    """
    For 100,000 users with 10 departments and 5 roles:
    Memory usage: ~50MB
    - Stores "Engineering" string 20,000 times
    - Stores "Developer" string 40,000 times
    """
    users = []
    departments = ["Engineering", "Sales", "Marketing"]
    roles = ["Developer", "Manager", "Designer"]
    
    for i in range(n):
        user = UserWithDuplicateSlow(
            name=f"User{i}",
            email=f"user{i}@example.com",
            department=departments[i % len(departments)],
            role=roles[i % len(roles)]
        )
        users.append(user)
    return users


# AFTER: Using __slots__ and shared references
class UserWithSlotsFast:
    """
    Optimization: Use __slots__ to reduce memory per instance
    Share common strings instead of duplicating
    """
    __slots__ = ['name', 'email', 'department_id', 'role_id']
    
    # Class-level shared data
    DEPARTMENTS = ["Engineering", "Sales", "Marketing"]
    ROLES = ["Developer", "Manager", "Designer"]
    
    def __init__(self, name: str, email: str, department_id: int, role_id: int):
        self.name = name
        self.email = email
        self.department_id = department_id  # Store index instead of string
        self.role_id = role_id
    
    @property
    def department(self) -> str:
        return self.DEPARTMENTS[self.department_id]
    
    @property
    def role(self) -> str:
        return self.ROLES[self.role_id]


def create_users_fast(n: int) -> List[UserWithSlotsFast]:
    """
    For 100,000 users with 10 departments and 5 roles:
    Memory usage: ~20MB
    Performance improvement: 2.5x less memory
    
    Benefits:
    - __slots__ reduces instance memory by ~40%
    - Shared strings reduce duplication
    - Faster attribute access
    """
    users = []
    for i in range(n):
        user = UserWithSlotsFast(
            name=f"User{i}",
            email=f"user{i}@example.com",
            department_id=i % 3,
            role_id=i % 3
        )
        users.append(user)
    return users


# ============================================================================
# EXAMPLE 5: Caching Without Bounds
# ============================================================================

# BEFORE: Unbounded cache
class UnboundedCacheSlow:
    """
    Memory Issue: Cache grows indefinitely
    Can cause out-of-memory errors
    """
    def __init__(self):
        self._cache = {}
    
    def get_data(self, key: str) -> str:
        if key not in self._cache:
            self._cache[key] = expensive_operation(key)
        return self._cache[key]
    
    """
    Problem: If called with 1,000,000 unique keys
    Memory usage: Unlimited growth (could be GBs)
    Risk: Out of memory crash
    """


# AFTER: Bounded cache with LRU eviction
from functools import lru_cache
from collections import OrderedDict

class BoundedCacheFast:
    """
    Optimization: Limit cache size with LRU eviction
    """
    def __init__(self, max_size: int = 1000):
        self._cache = OrderedDict()
        self._max_size = max_size
    
    def get_data(self, key: str) -> str:
        if key in self._cache:
            # Move to end (most recently used)
            self._cache.move_to_end(key)
            return self._cache[key]
        
        # Compute and cache
        value = expensive_operation(key)
        self._cache[key] = value
        
        # Evict oldest if over limit
        if len(self._cache) > self._max_size:
            self._cache.popitem(last=False)  # Remove oldest
        
        return value
    
    """
    With max_size=1000, even with 1,000,000 unique keys:
    Memory usage: Bounded to ~1000 entries
    Performance: Maintains good hit rate with controlled memory
    """


# Even simpler with built-in decorator
@lru_cache(maxsize=1000)
def cached_operation_fast(key: str) -> str:
    """
    Built-in LRU cache with automatic eviction
    Memory: Bounded to maxsize entries
    """
    return expensive_operation(key)


def expensive_operation(key: str) -> str:
    """Placeholder for expensive operation"""
    return f"result_{key}"


# ============================================================================
# EXAMPLE 6: Memory Leaks from Circular References
# ============================================================================

# BEFORE: Circular references causing memory leaks
class NodeSlow:
    """
    Memory Issue: Circular references prevent garbage collection
    """
    def __init__(self, value):
        self.value = value
        self.parent = None
        self.children = []
    
    def add_child(self, child):
        child.parent = self  # Circular reference
        self.children.append(child)


def create_tree_slow(depth: int, breadth: int):
    """
    Problem: Even after deleting tree, memory may not be freed
    because of circular references (parent <-> child)
    
    Memory: May not be reclaimed until garbage collection runs
    """
    root = NodeSlow(0)
    nodes = [root]
    
    for d in range(depth):
        new_nodes = []
        for node in nodes:
            for b in range(breadth):
                child = NodeSlow(f"{d}-{b}")
                node.add_child(child)
                new_nodes.append(child)
        nodes = new_nodes
    
    return root


# AFTER: Weak references to prevent cycles
import weakref

class NodeFast:
    """
    Optimization: Use weak references for parent
    Allows garbage collector to work properly
    """
    def __init__(self, value):
        self.value = value
        self._parent = None  # Weak reference
        self.children = []
    
    @property
    def parent(self):
        return self._parent() if self._parent else None
    
    @parent.setter
    def parent(self, node):
        self._parent = weakref.ref(node) if node else None
    
    def add_child(self, child):
        child.parent = self  # No circular reference!
        self.children.append(child)


def create_tree_fast(depth: int, breadth: int):
    """
    Memory: Properly freed when tree is no longer referenced
    No need to wait for garbage collection
    """
    root = NodeFast(0)
    nodes = [root]
    
    for d in range(depth):
        new_nodes = []
        for node in nodes:
            for b in range(breadth):
                child = NodeFast(f"{d}-{b}")
                node.add_child(child)
                new_nodes.append(child)
        nodes = new_nodes
    
    return root


# ============================================================================
# EXAMPLE 7: Batch Processing Instead of Accumulating
# ============================================================================

# BEFORE: Accumulating all results
def process_records_slow(records: Iterator) -> List[dict]:
    """
    Memory Issue: Accumulates all processed records in memory
    
    For 1,000,000 records:
    Memory usage: ~500MB (all results in memory)
    Can't start using results until all are processed
    """
    results = []
    for record in records:
        processed = process_record(record)
        results.append(processed)
    return results


# AFTER: Processing in batches with yield
def process_records_fast(records: Iterator, batch_size: int = 1000) -> Iterator[List[dict]]:
    """
    Optimization: Yield batches as they're ready
    
    For 1,000,000 records with batch_size=1000:
    Memory usage: ~500KB (one batch at a time)
    Can start using results immediately
    Performance improvement: 1000x less memory
    """
    batch = []
    for record in records:
        processed = process_record(record)
        batch.append(processed)
        
        if len(batch) >= batch_size:
            yield batch
            batch = []  # Clear batch, ready for more
    
    if batch:  # Yield remaining
        yield batch


def process_record(record):
    """Placeholder for record processing"""
    return {'processed': record}


# ============================================================================
# EXAMPLE 8: Proper Resource Cleanup
# ============================================================================

# BEFORE: Not closing resources
def read_files_slow(filenames: List[str]) -> List[str]:
    """
    Memory Issue: File handles may not be closed immediately
    Each open file consumes file descriptors and memory buffers
    
    Problem: Can hit OS limits on open files
    """
    contents = []
    for filename in filenames:
        f = open(filename, 'r')
        contents.append(f.read())
        # Missing f.close() - relies on garbage collector
    return contents


# AFTER: Using context managers
def read_files_fast(filenames: List[str]) -> List[str]:
    """
    Optimization: Explicit resource management
    Files closed immediately after use
    
    Benefits:
    - Immediate resource cleanup
    - No reliance on garbage collector
    - Prevents file descriptor exhaustion
    """
    contents = []
    for filename in filenames:
        with open(filename, 'r') as f:
            contents.append(f.read())
        # File automatically closed here
    return contents


# Even better: Generator to avoid accumulating
def read_files_fastest(filenames: List[str]) -> Iterator[str]:
    """
    Best approach: Yield contents without accumulating
    Memory: Only one file in memory at a time
    """
    for filename in filenames:
        with open(filename, 'r') as f:
            yield f.read()


# ============================================================================
# PERFORMANCE IMPACT SUMMARY
# ============================================================================
"""
| Memory Optimization              | Memory Reduction | When to Apply                        |
|----------------------------------|------------------|--------------------------------------|
| Streaming vs loading file        | 125,000x         | Processing large files               |
| Generator vs list                | 4,000,000x       | Large sequences, lazy evaluation     |
| List+join vs string concat       | 10x              | Building large strings               |
| __slots__ for classes            | 40-50%           | Many instances of same class         |
| Bounded cache (LRU)              | Unlimited → Fixed| Any caching scenario                 |
| Weak references                  | Prevents leaks   | Circular references (parent-child)   |
| Batch processing with yield      | 1000x            | Processing large datasets            |
| Context managers                 | Immediate cleanup| Any resource management              |

Memory Profiling Tools:
- memory_profiler: Line-by-line memory usage
- objgraph: Find memory leaks and circular references
- tracemalloc: Built-in memory allocation tracer
- heapy (guppy3): Heap analysis
- pympler: Comprehensive memory profiling

Best Practices:
1. Use generators for large sequences
2. Stream files instead of loading completely
3. Use __slots__ for classes with many instances
4. Implement bounded caches with LRU eviction
5. Use weak references for circular references
6. Process data in batches, not all at once
7. Always use context managers for resources
8. Profile memory usage before optimizing
9. Watch for unbounded growth in caches
10. Be aware of circular references

Commands to check memory:
- sys.getsizeof(obj) - Size of object
- gc.collect() - Force garbage collection
- gc.get_referrers(obj) - Find what references obj
- tracemalloc.start() - Start memory profiling
"""
