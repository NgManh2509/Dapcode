-- V11: Seed test cases for 17 Design problems and fix sort-an-array test cases
BEGIN;

-- Ensure idempotency
DELETE FROM test_cases WHERE problem_id IN (
    SELECT id FROM problems WHERE slug IN (
        'design-hashset', 'design-hashmap', 'min-stack', 'implement-queue-using-stacks',
        'implement-stack-using-queues', 'design-circular-queue', 'online-stock-span',
        'implement-trie-prefix-tree', 'design-add-and-search-words-data-structure',
        'lru-cache', 'time-based-key-value-store', 'design-twitter',
        'find-median-from-data-stream', 'range-sum-query-2d-immutable',
        'maximum-frequency-stack', 'detect-squares', 'lfu-cache'
    )
);

INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '1d46672a-ca68-450b-91bb-0314daaebf89', id, '["MyHashSet", "add", "add", "contains", "contains", "add", "contains", "remove", "contains"]
[[], [1], [2], [1], [3], [2], [2], [2], [2]]', '[null, null, null, true, false, null, true, null, false]', FALSE
FROM problems WHERE slug = 'design-hashset';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '0767d293-217a-420a-bba2-4c5f1ac35da0', id, '["MyHashSet", "add", "contains", "remove", "contains"]
[[], [10], [10], [10], [10]]', '[null, null, true, null, false]', FALSE
FROM problems WHERE slug = 'design-hashset';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '91b67646-1e89-4d97-919e-6da69e578280', id, '["MyHashSet", "contains", "remove", "contains", "add", "add", "contains", "remove", "contains"]
[[], [5], [5], [5], [5], [5], [5], [5], [5]]', '[null, false, null, false, null, null, true, null, false]', TRUE
FROM problems WHERE slug = 'design-hashset';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '9ff52c7a-f082-4225-a3b6-df4901467791', id, '["MyHashSet", "add", "add", "contains", "contains", "contains", "remove", "contains"]
[[], [0], [1000000], [0], [1000000], [500000], [0], [0]]', '[null, null, null, true, true, false, null, false]', TRUE
FROM problems WHERE slug = 'design-hashset';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT 'fb2ef575-752c-4194-bc09-834bf536cb28', id, '["MyHashSet", "add", "add", "add", "contains", "contains", "contains", "remove", "remove", "contains", "contains"]
[[], [1], [2], [3], [1], [2], [4], [2], [5], [2], [3]]', '[null, null, null, null, true, true, false, null, null, false, true]', TRUE
FROM problems WHERE slug = 'design-hashset';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT 'a53bce85-7ece-4cf3-bd73-7ba4d334b46f', id, '["MyHashMap", "put", "put", "get", "get", "put", "get", "remove", "get"]
[[], [1, 1], [2, 2], [1], [3], [2, 1], [2], [2], [2]]', '[null, null, null, 1, -1, null, 1, null, -1]', FALSE
FROM problems WHERE slug = 'design-hashmap';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '79c52e5e-1fb4-410a-a02e-c0701d2fff0a', id, '["MyHashMap", "put", "get", "remove", "get"]
[[], [10, 100], [10], [10], [10]]', '[null, null, 100, null, -1]', FALSE
FROM problems WHERE slug = 'design-hashmap';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '0d8fdbf8-e2fa-4e4e-b9bd-e9dd27aae50f', id, '["MyHashMap", "get", "remove", "get", "put", "put", "get"]
[[], [5], [5], [5], [5, 50], [5, 55], [5]]', '[null, -1, null, -1, null, null, 55]', TRUE
FROM problems WHERE slug = 'design-hashmap';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '310891a4-1a75-4d37-915f-ee59d2fea7c6', id, '["MyHashMap", "put", "put", "get", "get"]
[[], [0, 0], [1000000, 1000000], [0], [1000000]]', '[null, null, null, 0, 1000000]', TRUE
FROM problems WHERE slug = 'design-hashmap';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '7e14b31e-2b75-4cc0-ba96-eff968573931', id, '["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]', '[null, null, null, null, -3, null, 0, -2]', FALSE
FROM problems WHERE slug = 'min-stack';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '6213b602-3f7c-492b-bd09-6583623558f0', id, '["MinStack","push","push","getMin","top"]
[[],[1],[2],[],[]]', '[null, null, null, 1, 2]', FALSE
FROM problems WHERE slug = 'min-stack';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '5fa45926-a9c6-4ac1-8a35-3ee77711a68b', id, '["MinStack","push","push","push","getMin","pop","getMin"]
[[],[2],[0],[3],[],[],[]]', '[null, null, null, null, 0, null, 0]', TRUE
FROM problems WHERE slug = 'min-stack';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '98459ed8-4fa9-4c0d-890e-086463935f5e', id, '["MyQueue", "push", "push", "peek", "pop", "empty"]
[[], [1], [2], [], [], []]', '[null, null, null, 1, 1, false]', FALSE
FROM problems WHERE slug = 'implement-queue-using-stacks';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '7611d9f6-b13a-4c58-859b-89607a31c33b', id, '["MyQueue", "push", "pop", "empty"]
[[], [10], [], []]', '[null, null, 10, true]', FALSE
FROM problems WHERE slug = 'implement-queue-using-stacks';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '1529fad1-9ac8-4be9-b9d1-a52d9014a04c', id, '["MyQueue", "push", "push", "push", "pop", "push", "peek", "pop", "empty"]
[[], [1], [2], [3], [], [4], [], [], []]', '[null, null, null, null, 1, null, 2, 2, false]', TRUE
FROM problems WHERE slug = 'implement-queue-using-stacks';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '13c61e0e-ae1c-48b3-94c0-ef52b9c0400a', id, '["MyStack", "push", "push", "top", "pop", "empty"]
[[], [1], [2], [], [], []]', '[null, null, null, 2, 2, false]', FALSE
FROM problems WHERE slug = 'implement-stack-using-queues';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT 'e49e0027-4eba-4bc0-8265-c8f7a4f79b63', id, '["MyStack", "push", "pop", "empty"]
[[], [10], [], []]', '[null, null, 10, true]', FALSE
FROM problems WHERE slug = 'implement-stack-using-queues';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT 'b811f3d6-a136-47e9-be43-a77334d2c9c6', id, '["MyStack", "push", "push", "push", "pop", "top", "empty"]
[[], [1], [2], [3], [], [], []]', '[null, null, null, null, 3, 2, false]', TRUE
FROM problems WHERE slug = 'implement-stack-using-queues';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '521ab597-7448-4445-a558-f14e768ea0d8', id, '["MyCircularQueue", "enQueue", "enQueue", "enQueue", "enQueue", "Rear", "isFull", "deQueue", "enQueue", "Rear"]
[[3], [1], [2], [3], [4], [], [], [], [4], []]', '[null, true, true, true, false, 3, true, true, true, 4]', FALSE
FROM problems WHERE slug = 'design-circular-queue';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '7d2d91f6-5b27-449e-b5ce-d200b9fcc175', id, '["MyCircularQueue", "isEmpty", "Rear", "Front", "deQueue"]
[[3], [], [], [], []]', '[null, true, -1, -1, false]', FALSE
FROM problems WHERE slug = 'design-circular-queue';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '99e543b2-60ea-4f74-9eb6-4fab68fb4532', id, '["MyCircularQueue", "enQueue", "deQueue", "isEmpty", "enQueue", "Front", "Rear"]
[[2], [10], [], [], [20], [], []]', '[null, true, true, true, true, 20, 20]', TRUE
FROM problems WHERE slug = 'design-circular-queue';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '6523c709-273d-4664-a518-1573e3025648', id, '["StockSpanner", "next", "next", "next", "next", "next", "next", "next"]
[[], [100], [80], [60], [70], [60], [75], [85]]', '[null, 1, 1, 1, 2, 1, 4, 6]', FALSE
FROM problems WHERE slug = 'online-stock-span';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '103a6b58-6356-4101-9a82-4f2c2aa343ab', id, '["StockSpanner", "next", "next", "next"]
[[], [30], [20], [10]]', '[null, 1, 1, 1]', FALSE
FROM problems WHERE slug = 'online-stock-span';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT 'e1359c8b-a077-4c18-9872-efd8f326c514', id, '["StockSpanner", "next", "next", "next", "next"]
[[], [10], [20], [30], [40]]', '[null, 1, 2, 3, 4]', TRUE
FROM problems WHERE slug = 'online-stock-span';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT 'e1b5ae9b-b18b-4d0f-8c37-0e763ccb235e', id, '["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]', '[null, null, true, false, true, null, true]', FALSE
FROM problems WHERE slug = 'implement-trie-prefix-tree';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '7f6fdee9-ab25-4090-935c-d966ba444b5b', id, '["Trie", "startsWith", "search", "insert", "search"]
[[], ["a"], ["a"], ["a"], ["a"]]', '[null, false, false, null, true]', FALSE
FROM problems WHERE slug = 'implement-trie-prefix-tree';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '3227aebf-8bdb-4414-9475-95c384560bae', id, '["Trie", "insert", "insert", "search", "startsWith", "startsWith"]
[[], ["banana"], ["band"], ["ban"], ["ban"], ["banda"]]', '[null, null, null, false, true, false]', TRUE
FROM problems WHERE slug = 'implement-trie-prefix-tree';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '20c11702-c3ad-494e-8242-49e9d22578d3', id, '["WordDictionary","addWord","addWord","addWord","search","search","search","search"]
[[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]', '[null, null, null, null, false, true, true, true]', FALSE
FROM problems WHERE slug = 'design-add-and-search-words-data-structure';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '33091fc5-c7ef-4cf8-8726-e992545a7a91', id, '["WordDictionary", "addWord", "search", "search"]
[[], ["a"], ["a"], ["."]]', '[null, null, true, true]', FALSE
FROM problems WHERE slug = 'design-add-and-search-words-data-structure';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '077df426-9c16-4f75-b4fa-ea50a71d2eef', id, '["WordDictionary", "addWord", "search", "search"]
[[], ["at"], ["a."], [".b"]]', '[null, null, true, false]', TRUE
FROM problems WHERE slug = 'design-add-and-search-words-data-structure';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '02aa3562-a28e-4223-a5a3-631804d14235', id, '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]', '[null, null, null, 1, null, -1, null, -1, 3, 4]', FALSE
FROM problems WHERE slug = 'lru-cache';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT 'd4602c2c-ba88-466a-8bdf-e66c1b81f3d6', id, '["LRUCache", "put", "get", "put", "get"]
[[1], [2, 1], [2], [3, 2], [2]]', '[null, null, 1, null, -1]', FALSE
FROM problems WHERE slug = 'lru-cache';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '1293b945-3233-41ca-bc2f-cccd10a95c86', id, '["LRUCache", "get", "put", "get", "put", "get"]
[[2], [2], [2, 6], [1], [1, 5], [2]]', '[null, -1, null, -1, null, 6]', TRUE
FROM problems WHERE slug = 'lru-cache';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '3933d156-1bce-4363-9d26-834400f13f33', id, '["TimeMap", "set", "get", "get", "set", "get", "get"]
[[], ["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]]', '[null, null, "bar", "bar", null, "bar2", "bar2"]', FALSE
FROM problems WHERE slug = 'time-based-key-value-store';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '1a63a8fa-194c-4ab4-b399-dfb937f8f3d2', id, '["TimeMap", "set", "set", "get", "get", "get"]
[[], ["love", "high", 10], ["love", "low", 20], ["love", 5], ["love", 10], ["love", 15]]', '[null, null, null, "", "high", "high"]', FALSE
FROM problems WHERE slug = 'time-based-key-value-store';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '1b20bb7a-dd3c-49f4-a7ad-4bc7b3c4b57f', id, '["TimeMap", "get", "set", "get"]
[[], ["test", 1], ["test", "val", 2], ["test", 2]]', '[null, "", null, "val"]', TRUE
FROM problems WHERE slug = 'time-based-key-value-store';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '479b9617-331e-444c-a470-044f8725a45f', id, '["Twitter", "postTweet", "getNewsFeed", "follow", "postTweet", "getNewsFeed", "unfollow", "getNewsFeed"]
[[], [1, 5], [1], [1, 2], [2, 6], [1], [1, 2], [1]]', '[null, null, [5], null, null, [6, 5], null, [5]]', FALSE
FROM problems WHERE slug = 'design-twitter';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT 'b27ce184-a30f-4629-873c-eda2bc805623', id, '["Twitter", "getNewsFeed", "postTweet", "getNewsFeed"]
[[], [1], [1, 10], [1]]', '[null, [], null, [10]]', FALSE
FROM problems WHERE slug = 'design-twitter';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '014545c5-3223-4664-846f-021e132bb264', id, '["Twitter", "postTweet", "postTweet", "postTweet", "getNewsFeed"]
[[], [1, 1], [1, 2], [1, 3], [1]]', '[null, null, null, null, [3, 2, 1]]', TRUE
FROM problems WHERE slug = 'design-twitter';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT 'd7703971-2a89-4873-860f-d8fd1d3e8009', id, '["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
[[], [1], [2], [], [3], []]', '[null, null, null, 1.5, null, 2.0]', FALSE
FROM problems WHERE slug = 'find-median-from-data-stream';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT 'b5b27795-0e0b-40c3-a3c6-b46ae637766a', id, '["MedianFinder", "addNum", "findMedian"]
[[], [5], []]', '[null, null, 5.0]', FALSE
FROM problems WHERE slug = 'find-median-from-data-stream';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT 'caa2dc98-3b05-45c1-9685-c637c1632801', id, '["MedianFinder", "addNum", "addNum", "addNum", "findMedian"]
[[], [6], [10], [2], []]', '[null, null, null, null, 6.0]', TRUE
FROM problems WHERE slug = 'find-median-from-data-stream';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT 'c00e284b-7b51-4e03-b4bb-1b1daab86d96', id, '["NumMatrix", "sumRegion", "sumRegion", "sumRegion"]
[[[[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]]], [2, 1, 4, 3], [1, 1, 2, 2], [1, 2, 2, 4]]', '[null, 8, 11, 12]', FALSE
FROM problems WHERE slug = 'range-sum-query-2d-immutable';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '562ee9ea-6969-427c-bff1-843e52214953', id, '["NumMatrix", "sumRegion"]
[[[[1, 2], [3, 4]]], [0, 0, 1, 1]]', '[null, 10]', FALSE
FROM problems WHERE slug = 'range-sum-query-2d-immutable';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '179a0f88-b918-4761-bfdc-b6f662319325', id, '["NumMatrix", "sumRegion", "sumRegion"]
[[[[5]]], [0, 0, 0, 0], [0, 0, 0, 0]]', '[null, 5, 5]', TRUE
FROM problems WHERE slug = 'range-sum-query-2d-immutable';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '64a9bc5a-04a1-4d67-af2e-b89b6388e382', id, '["FreqStack", "push", "push", "push", "push", "push", "push", "pop", "pop", "pop", "pop"]
[[], [5], [7], [5], [7], [4], [5], [], [], [], []]', '[null, null, null, null, null, null, null, 5, 7, 5, 4]', FALSE
FROM problems WHERE slug = 'maximum-frequency-stack';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '706b0099-af11-41f6-8c78-f24f6671032e', id, '["FreqStack", "push", "push", "pop", "pop"]
[[], [1], [2], [], []]', '[null, null, null, 2, 1]', FALSE
FROM problems WHERE slug = 'maximum-frequency-stack';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT 'ca48e8cd-3488-4c9b-a91d-fa133e7225d5', id, '["FreqStack", "push", "push", "push", "pop", "pop", "pop"]
[[], [1], [1], [1], [], [], []]', '[null, null, null, null, 1, 1, 1]', TRUE
FROM problems WHERE slug = 'maximum-frequency-stack';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT 'a1f1ff97-ecd1-4dae-88ca-37d32aa037ac', id, '["DetectSquares", "add", "add", "add", "count", "count", "add", "count"]
[[], [[3, 10]], [[11, 2]], [[3, 2]], [[11, 10]], [[14, 8]], [[11, 2]], [[11, 10]]]', '[null, null, null, null, 1, 0, null, 2]', FALSE
FROM problems WHERE slug = 'detect-squares';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT 'a6ec8a3e-3d57-4a02-b17c-74ee7bd95118', id, '["DetectSquares", "add", "count"]
[[], [[1, 1]], [[1, 1]]]', '[null, null, 0]', FALSE
FROM problems WHERE slug = 'detect-squares';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT 'bf65332d-4bf6-4a95-afa2-a152af258145', id, '["DetectSquares", "add", "add", "add", "add", "count"]
[[], [[0, 0]], [[0, 2]], [[2, 0]], [[2, 2]], [[2, 2]]]', '[null, null, null, null, null, 1]', TRUE
FROM problems WHERE slug = 'detect-squares';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT 'bbd7bd11-78fc-4c75-89c9-821621e0830d', id, '["LFUCache", "put", "put", "get", "put", "get", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [3], [4, 4], [1], [3], [4]]', '[null, null, null, 1, null, -1, 3, null, -1, 3, 4]', FALSE
FROM problems WHERE slug = 'lfu-cache';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT '38bdb339-2ce2-41ee-901b-3ed138bc212b', id, '["LFUCache", "put", "get"]
[[0], [0, 0], [0]]', '[null, null, -1]', FALSE
FROM problems WHERE slug = 'lfu-cache';
INSERT INTO test_cases (id, problem_id, input_data, expected_output, is_hidden)
SELECT 'b1ef280b-cf19-42de-8ed1-3f4dff132b25', id, '["LFUCache", "put", "put", "get", "put", "get"]
[[1], [2, 1], [3, 2], [2], [4, 3], [3]]', '[null, null, null, -1, null, -1]', TRUE
FROM problems WHERE slug = 'lfu-cache';

-- Fix sort-an-array expected outputs

UPDATE test_cases 
SET expected_output = '[-4, -3, -2, -1]'
WHERE input_data LIKE '%[-4,-2,-3,-1]%';

UPDATE test_cases 
SET expected_output = '[-2, -1, 0, 3, 4, 5]'
WHERE input_data LIKE '%[5, -1, 3, -2, 4, 0]%';

UPDATE test_cases 
SET expected_output = '[-8, -3, -2, 0, 1, 2, 4, 5, 6, 7]'
WHERE input_data LIKE '%[5,-3,2,7,1,-8,4,-2,6,0]%';

COMMIT;
