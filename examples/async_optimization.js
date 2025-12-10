/**
 * Asynchronous Programming Optimization Examples
 * Demonstrates performance improvements using async/await and parallel execution
 */

// ============================================================================
// EXAMPLE 1: Sequential vs Parallel API Calls
// ============================================================================

// BEFORE: Sequential execution (waiting for each call)
async function fetchUserDataSlow(userId) {
    /**
     * Performance Issue: Sequential execution blocks each call
     * Each API call waits for the previous one to complete
     * 
     * If each call takes 200ms:
     * Total time: 600ms (200ms × 3 calls)
     */
    const user = await fetch(`/api/users/${userId}`).then(r => r.json());
    const posts = await fetch(`/api/posts?userId=${userId}`).then(r => r.json());
    const comments = await fetch(`/api/comments?userId=${userId}`).then(r => r.json());
    
    return { user, posts, comments };
}

// AFTER: Parallel execution using Promise.all
async function fetchUserDataFast(userId) {
    /**
     * Optimization: Parallel execution of independent calls
     * All API calls start simultaneously
     * 
     * If each call takes 200ms:
     * Total time: ~200ms (limited by slowest call)
     * Performance improvement: 3x faster
     */
    const [user, posts, comments] = await Promise.all([
        fetch(`/api/users/${userId}`).then(r => r.json()),
        fetch(`/api/posts?userId=${userId}`).then(r => r.json()),
        fetch(`/api/comments?userId=${userId}`).then(r => r.json())
    ]);
    
    return { user, posts, comments };
}


// ============================================================================
// EXAMPLE 2: Processing Arrays Sequentially vs Concurrently
// ============================================================================

// BEFORE: Sequential processing with async operations
async function processUsersSlow(userIds) {
    /**
     * Performance Issue: Processes one user at a time
     * 
     * For 100 users, each taking 100ms:
     * Total time: 10 seconds
     */
    const results = [];
    for (const userId of userIds) {
        const userData = await fetch(`/api/users/${userId}`).then(r => r.json());
        const processed = await processUser(userData);
        results.push(processed);
    }
    return results;
}

// AFTER: Concurrent processing
async function processUsersFast(userIds) {
    /**
     * Optimization: Process all users concurrently
     * 
     * For 100 users, each taking 100ms:
     * Total time: ~100ms (all parallel)
     * Performance improvement: 100x faster
     */
    const promises = userIds.map(async (userId) => {
        const userData = await fetch(`/api/users/${userId}`).then(r => r.json());
        return processUser(userData);
    });
    
    return Promise.all(promises);
}

// AFTER with rate limiting: Batch concurrent processing
async function processUsersFastWithLimit(userIds, batchSize = 10) {
    /**
     * Optimization: Process in controlled batches
     * Prevents overwhelming the server with too many concurrent requests
     * 
     * For 100 users in batches of 10:
     * Total time: ~1 second (10 batches × 100ms each)
     * Performance improvement: 10x faster than sequential
     * Server-friendly: Limits concurrent connections
     */
    const results = [];
    
    for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize);
        const batchResults = await Promise.all(
            batch.map(async (userId) => {
                const userData = await fetch(`/api/users/${userId}`).then(r => r.json());
                return processUser(userData);
            })
        );
        results.push(...batchResults);
    }
    
    return results;
}


// ============================================================================
// EXAMPLE 3: Callback Hell vs Async/Await
// ============================================================================

// BEFORE: Callback hell (hard to read and maintain)
function getUserPostsSlow(userId, callback) {
    /**
     * Performance Issue: Not necessarily slower, but error-prone
     * Hard to maintain and handle errors
     * Difficult to coordinate multiple async operations
     */
    fetch(`/api/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            fetch(`/api/posts?userId=${user.id}`)
                .then(response => response.json())
                .then(posts => {
                    fetch(`/api/comments?postId=${posts[0].id}`)
                        .then(response => response.json())
                        .then(comments => {
                            callback(null, { user, posts, comments });
                        })
                        .catch(error => callback(error));
                })
                .catch(error => callback(error));
        })
        .catch(error => callback(error));
}

// AFTER: Clean async/await
async function getUserPostsFast(userId) {
    /**
     * Optimization: Cleaner, easier to maintain
     * Better error handling
     * Can optimize with Promise.all where applicable
     */
    try {
        const userResponse = await fetch(`/api/users/${userId}`);
        const user = await userResponse.json();
        
        const postsResponse = await fetch(`/api/posts?userId=${user.id}`);
        const posts = await postsResponse.json();
        
        const commentsResponse = await fetch(`/api/comments?postId=${posts[0].id}`);
        const comments = await commentsResponse.json();
        
        return { user, posts, comments };
    } catch (error) {
        throw new Error(`Failed to fetch user data: ${error.message}`);
    }
}


// ============================================================================
// EXAMPLE 4: Blocking Event Loop with Synchronous Operations
// ============================================================================

// BEFORE: Synchronous file operations blocking event loop
const fs = require('fs');

function readFilesSlow(filePaths) {
    /**
     * Performance Issue: Blocks event loop
     * No other operations can execute while reading
     * 
     * For 10 files of 1MB each:
     * Time: ~1 second (blocks entire thread)
     * Other requests: Blocked during this time
     */
    const contents = [];
    for (const path of filePaths) {
        const content = fs.readFileSync(path, 'utf8'); // Blocking!
        contents.push(content);
    }
    return contents;
}

// AFTER: Asynchronous file operations
const fsPromises = require('fs').promises;

async function readFilesFast(filePaths) {
    /**
     * Optimization: Non-blocking I/O
     * Event loop can handle other requests
     * 
     * For 10 files of 1MB each:
     * Time: ~200ms (parallel reading)
     * Other requests: Can be processed concurrently
     * Performance improvement: 5x faster + non-blocking
     */
    const promises = filePaths.map(path => fsPromises.readFile(path, 'utf8'));
    return Promise.all(promises);
}


// ============================================================================
// EXAMPLE 5: Inefficient Error Handling
// ============================================================================

// BEFORE: Try-catch in loop (stops on first error)
async function processItemsSlow(items) {
    /**
     * Performance Issue: Stops on first error
     * Doesn't process remaining items
     * Can't distinguish partial success
     */
    const results = [];
    try {
        for (const item of items) {
            const result = await processItem(item);
            results.push(result);
        }
    } catch (error) {
        console.error('Processing failed:', error);
        return []; // Lost all successful results!
    }
    return results;
}

// AFTER: Promise.allSettled for graceful error handling
async function processItemsFast(items) {
    /**
     * Optimization: Handles all promises regardless of errors
     * Returns both successful and failed results
     * All items processed in parallel
     * 
     * For 100 items with 5 failures:
     * Returns 95 successful results + 5 error details
     */
    const promises = items.map(item => processItem(item));
    const results = await Promise.allSettled(promises);
    
    const successful = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);
    
    const failed = results
        .filter(r => r.status === 'rejected')
        .map(r => ({ error: r.reason }));
    
    return { successful, failed };
}


// ============================================================================
// EXAMPLE 6: Unnecessary Awaits
// ============================================================================

// BEFORE: Unnecessary await when value is returned immediately
async function calculateTotalSlow(price, quantity) {
    /**
     * Performance Issue: Unnecessary async overhead
     * Creates promise wrapper for synchronous operation
     */
    const subtotal = await (price * quantity); // Unnecessary await!
    const tax = await (subtotal * 0.1);        // Unnecessary await!
    return await (subtotal + tax);             // Unnecessary await!
}

// AFTER: Only await actual async operations
function calculateTotalFast(price, quantity) {
    /**
     * Optimization: Synchronous when no I/O involved
     * No promise overhead
     * Faster execution, less memory
     */
    const subtotal = price * quantity;
    const tax = subtotal * 0.1;
    return subtotal + tax;
}

// AFTER: Proper async when mixing sync and async
async function calculateTotalWithDiscount(price, quantity, userId) {
    /**
     * Optimization: Only await the actual async operation
     * Synchronous calculations remain synchronous
     */
    const subtotal = price * quantity;
    const discount = await fetchUserDiscount(userId); // Only this needs await
    const tax = subtotal * 0.1;
    return subtotal - discount + tax;
}


// ============================================================================
// EXAMPLE 7: Debouncing and Throttling for Frequent Events
// ============================================================================

// BEFORE: Handling every event (overwhelming)
function handleSearchSlow(event) {
    /**
     * Performance Issue: API call on every keystroke
     * 
     * If user types "javascript" (10 characters):
     * API calls: 10 (one per character)
     * Wasted calls: 9 (only last result matters)
     * Server load: High
     * Time: ~2 seconds total
     */
    const query = event.target.value;
    fetch(`/api/search?q=${query}`)
        .then(response => response.json())
        .then(results => updateUI(results));
}

// Add listener
document.querySelector('#search').addEventListener('input', handleSearchSlow);


// AFTER: Debouncing (wait for pause in events)
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

const handleSearchFast = debounce(function(event) {
    /**
     * Optimization: Only search after user stops typing
     * 
     * If user types "javascript" (10 characters):
     * API calls: 1 (after 300ms pause)
     * Wasted calls: 0
     * Server load: 90% reduction
     * Time: ~200ms (single call)
     * Performance improvement: 10x fewer API calls
     */
    const query = event.target.value;
    fetch(`/api/search?q=${query}`)
        .then(response => response.json())
        .then(results => updateUI(results));
}, 300);

document.querySelector('#search').addEventListener('input', handleSearchFast);


// AFTER: Throttling (limit rate of execution)
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

const handleScrollFast = throttle(function() {
    /**
     * Optimization: Limit scroll handler execution
     * 
     * For scroll event firing 100 times/second:
     * Without throttle: 100 executions/second
     * With throttle: 5 executions/second (200ms limit)
     * Performance improvement: 20x fewer executions
     */
    updateScrollPosition();
}, 200);

window.addEventListener('scroll', handleScrollFast);


// ============================================================================
// EXAMPLE 8: Caching Expensive Async Operations
// ============================================================================

// BEFORE: Fetching same data repeatedly
async function getUserInfoSlow(userId) {
    /**
     * Performance Issue: Refetches data on every call
     * 
     * If called 10 times for same user:
     * API calls: 10
     * Time: ~2 seconds total (10 × 200ms)
     */
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
}

// AFTER: Memoization with cache
const userCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getUserInfoFast(userId) {
    /**
     * Optimization: Cache results with TTL
     * 
     * If called 10 times for same user:
     * API calls: 1 (first call only)
     * Time: ~200ms for first call, <1ms for subsequent
     * Performance improvement: 10x fewer API calls, 200x faster for cached
     */
    const now = Date.now();
    const cached = userCache.get(userId);
    
    if (cached && (now - cached.timestamp) < CACHE_TTL) {
        return cached.data; // Return cached data
    }
    
    // Fetch and cache
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    
    userCache.set(userId, {
        data,
        timestamp: now
    });
    
    return data;
}


// ============================================================================
// EXAMPLE 9: Race Conditions and Stale Data
// ============================================================================

// BEFORE: Not handling race conditions
let currentRequestId = 0;

async function searchSlow(query) {
    /**
     * Performance Issue: Displays results from slower requests
     * 
     * User types: "test" then quickly "testing"
     * If "test" responds slower than "testing":
     * Shows wrong results (from "test" after "testing")
     */
    const results = await fetch(`/api/search?q=${query}`).then(r => r.json());
    updateUI(results); // May show stale results!
}

// AFTER: Request cancellation and race condition handling
let currentController = null;

async function searchFast(query) {
    /**
     * Optimization: Cancel previous requests
     * Only show results from latest query
     * 
     * User types: "test" then quickly "testing"
     * Cancels "test" request
     * Only shows "testing" results
     * Performance improvement: No wasted work, correct results
     */
    // Cancel previous request
    if (currentController) {
        currentController.abort();
    }
    
    currentController = new AbortController();
    
    try {
        const results = await fetch(`/api/search?q=${query}`, {
            signal: currentController.signal
        }).then(r => r.json());
        
        updateUI(results); // Always shows latest results
    } catch (error) {
        if (error.name === 'AbortError') {
            // Request was cancelled, ignore
            return;
        }
        throw error;
    }
}


// ============================================================================
// PERFORMANCE IMPACT SUMMARY
// ============================================================================
/**
 * | Optimization Technique          | Performance Improvement | When to Use                          |
 * |---------------------------------|------------------------|--------------------------------------|
 * | Promise.all (parallel)          | 3-100x faster          | Independent async operations         |
 * | Batch processing                | 10-50x faster          | Many similar operations              |
 * | Async/await over callbacks      | Same speed, cleaner    | All modern async code                |
 * | Non-blocking I/O                | 5-10x + non-blocking   | File/network operations              |
 * | Promise.allSettled              | Better reliability     | When partial success is acceptable   |
 * | Remove unnecessary awaits       | 10-20% faster          | Synchronous operations               |
 * | Debouncing                      | 10-100x fewer calls    | Search, autocomplete                 |
 * | Throttling                      | 10-100x fewer calls    | Scroll, resize events                |
 * | Caching async results           | 100-1000x faster       | Repeated expensive operations        |
 * | Request cancellation            | Prevents wasted work   | User-initiated searches/requests     |
 * 
 * Best Practices:
 * 1. Use Promise.all for independent operations
 * 2. Implement proper error handling (try-catch, .catch())
 * 3. Use Promise.allSettled when you want all results
 * 4. Debounce user input events
 * 5. Throttle high-frequency events (scroll, resize)
 * 6. Cache expensive async operations with appropriate TTL
 * 7. Cancel stale requests to prevent race conditions
 * 8. Use async/await for cleaner code
 * 9. Don't block the event loop with synchronous operations
 * 10. Process in batches when dealing with many items
 */
