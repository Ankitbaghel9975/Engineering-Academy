// Module 6: SQL for Data Engineers
export const module6 = {
  id: 'mod-6',
  title: 'Module 6: SQL for Data Engineers',
  description: 'Master advanced analytical SQL, execution order, window functions, CTEs, indexing, query execution plans (EXPLAIN), and performance tuning.',
  badge: 'Analytics Core',
  icon: 'Table',
  lessons: [
    {
      id: 'm6-l1',
      title: 'SELECT, WHERE, GROUP BY & Logical Execution Order',
      duration: '45 mins',
      difficulty: 'Beginner',
      concept: {
        en: 'SQL is the universal query language across Big Data engines (PostgreSQL, Hive, Spark SQL, Snowflake, BigQuery, Trino). While queries are written starting with SELECT, the SQL query engine executes clauses in a fundamentally different Logical Execution Order:\n1. FROM & JOIN (locate tables and join sets)\n2. WHERE (filter individual raw rows)\n3. GROUP BY (aggregate rows into buckets)\n4. HAVING (filter aggregated group buckets)\n5. SELECT (project columns and compute expressions)\n6. DISTINCT (remove duplicate projected rows)\n7. ORDER BY (sort output rows)\n8. LIMIT / OFFSET (slice final result count)\nUnderstanding this order is why you cannot use column aliases created in SELECT inside WHERE clauses.',
        hi: 'SQL Big Data ka universal query engine hai (chahe aap PostgreSQL use karo, Hive, Spark SQL ya Snowflake). SQL me query likhne ka order alag hota hai, lekin database ke execute karne ka Logical Execution Order alag hota hai: Pehle FROM & JOIN chalta hai, fir WHERE se rows filter hoti hain, fir GROUP BY se buckets bante hain, fir HAVING se aggregated groups filter hote hain, fir SELECT chalta hai, fir ORDER BY aur aakhiri me LIMIT chalta hai! Yahi reason hai ki SELECT me banaya gaya alias WHERE clause me access nahi hota.'
      },
      why: 'Writing WHERE AVG(salary) > 50000 causes an immediate syntax error because WHERE executes BEFORE aggregations occur. Mastering execution order prevents amateur syntax bugs and allows writing optimized queries.',
      how: '1. Filter early: Use WHERE to eliminate millions of rows before grouping to minimize memory.\n2. Filter aggregates: Use HAVING to filter results after GROUP BY (e.g. HAVING COUNT(*) > 5).\n3. Column Aliases: Can only be referenced in ORDER BY or in outer queries/CTEs.\n4. NULL handling: WHERE col != \'val\' excludes NULLs; use col IS NULL or COALESCE.',
      architecture: {
        type: 'sql_execution_order_flow',
        title: 'SQL Logical Execution Order Pipeline',
        nodes: [
          { name: '1. FROM & JOINs', desc: 'Identify source tables and join sets' },
          { name: '2. WHERE Filter', desc: 'Filter individual rows before grouping' },
          { name: '3. GROUP BY', desc: 'Group rows into aggregate keys' },
          { name: '4. HAVING Filter', desc: 'Filter grouped summaries' },
          { name: '5. SELECT & Window', desc: 'Evaluate projections, expressions, window functions' },
          { name: '6. ORDER BY & LIMIT', desc: 'Sort output and truncate to top N' }
        ]
      },
      industryExample: 'At Amazon, query performance guidelines mandate that partition filters (e.g. WHERE event_date >= \'2026-11-01\') be placed in WHERE clauses so that Trino/Presto skips scanning petabytes of S3 folders.',
      practicalLab: {
        title: 'Lab 6.1: Demonstrating SQL Logical Execution Order',
        problemStatement: 'Filter departments where average salary exceeds $90,000 using GROUP BY and HAVING in SQLite.',
        requirements: 'Python SQLite or database terminal.',
        setup: 'mkdir -p ~/bigdata_lab/m6_l1 && cd ~/bigdata_lab/m6_l1',
        instructions: [
          'Step 1: Write an SQL script creating employees table.',
          'Step 2: Execute GROUP BY with HAVING clause.',
          'Step 3: Verify the aggregated department metrics.'
        ],
        code: `# sql_execution_order.py
import sqlite3
import pandas as pd

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

cur.execute("""
CREATE TABLE employees (
    id INT,
    name TEXT,
    dept TEXT,
    salary REAL
)
""")

cur.executemany("INSERT INTO employees VALUES (?, ?, ?, ?)", [
    (1, "Aarav", "Engineering", 120000),
    (2, "Diya", "Engineering", 110000),
    (3, "Rohan", "Sales", 65000),
    (4, "Priya", "Sales", 70000),
    (5, "Kabir", "Product", 95000),
    (6, "Neha", "Product", 88000),
])

query = """
SELECT 
    dept,
    COUNT(*) as total_employees,
    ROUND(AVG(salary), 2) as avg_salary
FROM employees
WHERE salary > 66000
GROUP BY dept
HAVING AVG(salary) >= 90000
ORDER BY avg_salary DESC;
"""

df = pd.read_sql_query(query, conn)
print("--- Aggregated Result ---")
print(df)
`,
        commands: [
          'python3 sql_execution_order.py'
        ]
      },
      expectedOutput: `--- Aggregated Result ---
          dept  total_employees  avg_salary
0  Engineering                2    115000.0
1      Product                2     91500.0`,
      troubleshooting: [
        {
          error: 'Misuse of aggregate function: AVG() in WHERE clause',
          rootCause: 'Attempting to use an aggregate function like AVG() or SUM() inside the WHERE clause.',
          solution: 'Move aggregate condition into the HAVING clause: GROUP BY dept HAVING AVG(salary) > 50000.'
        }
      ],
      bestPractices: [
        'Always filter as much data as possible in the WHERE clause to minimize rows going into GROUP BY memory.',
        'Use HAVING strictly for filtering aggregate metrics; do not use HAVING for row-level filters that belong in WHERE.',
        'Avoid SELECT * in production queries; always explicitly list required columns to allow partition and column pruning.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the difference between WHERE and HAVING in SQL?',
          answer: 'WHERE filters individual raw rows BEFORE any grouping or aggregation takes place. HAVING filters grouped summary buckets AFTER the GROUP BY clause has evaluated. Aggregate functions (SUM, AVG, COUNT) cannot be used in WHERE, but are used in HAVING.'
        },
        {
          level: 'Intermediate',
          question: 'Why can you NOT use a column alias defined in SELECT inside the WHERE clause?',
          answer: 'Because of SQL\'s Logical Execution Order: the WHERE clause executes at Step 2 (filtering source rows), while the SELECT clause executes much later at Step 5. When the database is evaluating the WHERE clause, the column alias defined in SELECT does not yet exist.'
        },
        {
          level: 'Advanced',
          question: 'How do distributed engines like Presto / Spark SQL execute GROUP BY across 100 worker nodes?',
          answer: 'Distributed engines use a two-phase aggregation: 1. Partial Aggregation: Each worker node groups its local data partitions and computes partial aggregates (local count and local sum). 2. Shuffle / Final Aggregation: The partial aggregates are hash-partitioned by the group-by key over the network to reducer nodes, which combine partial aggregates to produce the final result, minimizing network data transfer.'
        }
      ],
      assignment: {
        task: 'Execute python3 sql_execution_order.py in terminal and verify that Sales is excluded by the HAVING clause.',
        verificationCriteria: 'Run the command and observe Engineering and Product departments in the output.'
      },
      assessment: {
        quiz: [
          {
            q: 'In the SQL logical execution pipeline, which clause is evaluated first?',
            options: ['SELECT', 'WHERE', 'FROM & JOIN', 'GROUP BY'],
            correct: 2,
            explanation: 'FROM & JOIN is evaluated first to determine the working dataset before any filtering occurs.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the SQL execution order script.',
          expectedCommand: 'python3 sql_execution_order.py'
        }
      }
    },
    {
      id: 'm6-l2',
      title: 'Mastering All SQL JOINs',
      duration: '50 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'JOINs combine columns from two or more tables based on a related column between them. Data Engineers must master all JOIN semantics and their distributed performance implications:\n- INNER JOIN: Returns records that have matching values in both tables.\n- LEFT (OUTER) JOIN: Returns all records from left table, plus matched records from right table (NULL if no match).\n- RIGHT (OUTER) JOIN: Returns all records from right table, plus matched records from left table.\n- FULL (OUTER) JOIN: Returns all records when there is a match in either left or right table.\n- CROSS JOIN: Cartesian product of all rows (N x M rows; dangerous on big tables).\n- ANTI JOIN: Returns rows from left table that have NO match in right table (LEFT JOIN WHERE right.id IS NULL or NOT EXISTS).\n- SEMI JOIN: Returns rows from left table that have at least one match in right table without duplicating left rows (WHERE EXISTS).',
        hi: 'JOINs do ya do se zyada tables ko aapas me jodte hain. Data Engineering me alag-alag joins ka matlab:\n- INNER JOIN: Sirf wahi rows aati hain jo dono tables me match karti hain.\n- LEFT JOIN: Left table ki saari rows aayengi, aur right table se matching data aayega (jo match na ho wahan NULL aayega).\n- FULL OUTER JOIN: Dono tables ki saari rows aati hain.\n- ANTI JOIN: Aise records nikalna jo left table me hain par right table me nahi hain (jaise: aise customers jinhone kabhi order nahi kiya).\n- SEMI JOIN: Aise records nikalna jo doosre table me exist karte hain bina duplicates banaye.'
      },
      why: 'In distributed data lakes, executing an unoptimized JOIN across two 100-million row tables can trigger a cluster-wide network shuffle that crashes nodes with OutOfMemoryError. Choosing the right join type is vital.',
      how: '1. Standard Syntax: SELECT e.name, d.dept_name FROM employees e LEFT JOIN departments d ON e.dept_id = d.id\n2. Anti-Join: SELECT c.customer_id FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL\n3. Semi-Join: SELECT * FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id)\n4. Distributed Physical Joins: Broadcast Hash Join (small table broadcast to all nodes), Shuffle Hash Join, and Sort Merge Join.',
      architecture: {
        type: 'sql_joins_venn_diagram',
        title: 'SQL Join Types Matrix',
        nodes: [
          { name: 'INNER JOIN (Intersection)', desc: 'Only keys existing in both Table A and Table B' },
          { name: 'LEFT JOIN (A + Intersection)', desc: 'All rows from Table A, matching from B or NULL' },
          { name: 'FULL OUTER JOIN (Union)', desc: 'All rows from A and B; NULL padded on mismatches' },
          { name: 'ANTI JOIN (A minus B)', desc: 'Rows in Table A with ZERO matching records in Table B' }
        ]
      },
      industryExample: 'E-commerce marketing engines run daily Anti-Joins to identify churned users: finding customers who registered >30 days ago but have zero completed orders in the transactions table, triggering re-engagement discount emails.',
      practicalLab: {
        title: 'Lab 6.2: Implementing Inner, Left, Anti, and Semi Joins',
        problemStatement: 'Join customers with orders, find customers who have never made a purchase (Anti-Join), and calculate customer lifetime value.',
        requirements: 'Python SQLite or database terminal.',
        setup: 'mkdir -p ~/bigdata_lab/m6_l2 && cd ~/bigdata_lab/m6_l2',
        instructions: [
          'Step 1: Write an SQL script populating customers and orders tables.',
          'Step 2: Execute Left Join and Anti-Join.',
          'Step 3: Verify the anti-join result.'
        ],
        code: `# sql_joins_lab.py
import sqlite3
import pandas as pd

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

cur.execute("CREATE TABLE customers (cust_id INT, name TEXT, city TEXT)")
cur.execute("CREATE TABLE orders (order_id INT, cust_id INT, amount REAL)")

cur.executemany("INSERT INTO customers VALUES (?, ?, ?)", [
    (101, "Aarav", "Delhi"),
    (102, "Diya", "Mumbai"),
    (103, "Rohan", "Bangalore"),
    (104, "Priya", "Pune")
])

cur.executemany("INSERT INTO orders VALUES (?, ?, ?)", [
    (1, 101, 1500.0),
    (2, 101, 2300.0),
    (3, 103, 450.0)
])

# Anti-Join: Customers who NEVER placed an order
anti_join_query = """
SELECT 
    c.cust_id,
    c.name,
    c.city
FROM customers c
LEFT JOIN orders o ON c.cust_id = o.cust_id
WHERE o.order_id IS NULL;
"""

df_anti = pd.read_sql_query(anti_join_query, conn)
print("--- Anti-Join: Customers with ZERO Orders ---")
print(df_anti)
`,
        commands: [
          'python3 sql_joins_lab.py'
        ]
      },
      expectedOutput: `--- Anti-Join: Customers with ZERO Orders ---
   cust_id   name    city
0      102   Diya  Mumbai
1      104  Priya    Pune`,
      troubleshooting: [
        {
          error: 'Query runs out of memory or takes hours (Cartesian Product explosion)',
          rootCause: 'Missing ON condition in JOIN or accidental CROSS JOIN on multi-million row tables producing M * N rows.',
          solution: 'Ensure every JOIN has an explicit equality join condition (ON a.id = b.id) and verify join key cardinality.'
        }
      ],
      bestPractices: [
        'Always ensure join keys have identical data types (joining INT to VARCHAR prevents index usage and forces casting).',
        'In Big Data engines (Spark/Presto), place the largest table on the left and smaller reference table on the right for Broadcast Joins.',
        'Beware of duplicate keys in the join table: 1-to-many or many-to-many joins inflate row counts silently.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is an Anti-Join in SQL and how do you write it?',
          answer: 'An Anti-Join returns rows from the left table that have NO matching rows in the right table. It is written using a LEFT JOIN with a WHERE clause checking that a right table primary key IS NULL: SELECT a.* FROM table_a a LEFT JOIN table_b b ON a.id = b.id WHERE b.id IS NULL.'
        },
        {
          level: 'Intermediate',
          question: 'What is the difference between a Semi-Join and an Inner Join?',
          answer: 'An Inner Join returns matching rows from both tables; if the right table has multiple matching rows for a single left key, the left row is duplicated in the output. A Semi-Join (written with WHERE EXISTS) returns rows from the left table that have at least one match in the right table, but NEVER duplicates the left table rows regardless of how many matches exist.'
        },
        {
          level: 'Advanced',
          question: 'Explain the three physical distributed join algorithms in Apache Spark: Broadcast Hash Join, Shuffle Hash Join, and Sort Merge Join.',
          answer: '1. Broadcast Hash Join: If one table is small (<10 MB by default: spark.sql.autoBroadcastJoinThreshold), Spark copies the small table to memory on all worker nodes; zero network shuffle occurs (fastest). 2. Shuffle Hash Join: Both tables are hash-partitioned on join keys across the network, and an in-memory hash table is built per partition. 3. Sort Merge Join (Default for big-big tables): Both tables are shuffled across nodes by join key, sorted by key, and merged sequentially like two pointers, scaling to petabytes without memory exhaustion.'
        }
      ],
      assignment: {
        task: 'Execute python3 sql_joins_lab.py in terminal and verify that Diya and Priya are identified as zero-order customers.',
        verificationCriteria: 'Run the command and observe the 2 anti-join records.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which SQL construct safely implements an Anti-Join to find records in Table A that have no match in Table B?',
            options: [
              'SELECT A.* FROM A INNER JOIN B ON A.id = B.id',
              'SELECT A.* FROM A LEFT JOIN B ON A.id = B.id WHERE B.id IS NULL',
              'SELECT A.* FROM A CROSS JOIN B',
              'SELECT A.* FROM A FULL OUTER JOIN B'
            ],
            correct: 1,
            explanation: 'LEFT JOIN with WHERE B.id IS NULL returns only left-table records that found zero matches in Table B.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the SQL joins laboratory script.',
          expectedCommand: 'python3 sql_joins_lab.py'
        }
      }
    },
    {
      id: 'm6-l3',
      title: 'Subqueries & Correlated Subqueries',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'A subquery (or inner query) is a SELECT query nested inside another SELECT, INSERT, UPDATE, or DELETE query. Subqueries are categorized into:\n1. Scalar Subqueries: Return a single value (1 row, 1 column); used in SELECT or WHERE (e.g. WHERE salary > (SELECT AVG(salary) FROM employees)).\n2. Multi-Row Subqueries: Return a list of values; used with IN, ANY, ALL (e.g. WHERE id IN (SELECT user_id FROM vip_users)).\n3. Correlated Subqueries: A subquery that references columns from the outer query for each evaluated row. The inner query re-executes for every row processed by the outer query, which can lead to O(N^2) performance bottlenecks if not optimized by the query planner.',
        hi: 'Subquery ek aisi query hoti hai jo kisi doosri main query ke andar likhi jaati hai. Ye teen tarah ki hoti hai: 1. Scalar Subquery (jo sirf ek single number ya string return karti hai - jaise company ki average salary), 2. Multi-Row Subquery (jo poori column list return karti hai - IN operator ke sath use hoti hai), aur 3. Correlated Subquery (jo outer query ki har row ke liye bar-bar run hoti hai). Correlated subquery agar dhyan se na likhi jaye toh Big Data me query ko bohot slow kar sakti hai.'
      },
      why: 'Complex business questions ("Find employees earning above their department\'s average salary") naturally lend themselves to subqueries. Knowing when a subquery is optimal vs when it should be rewritten as a Window Function or CTE is a hallmark of a senior data engineer.',
      how: '1. Scalar: SELECT name, salary - (SELECT AVG(salary) FROM employees) as diff FROM employees\n2. Correlated: SELECT e1.name, e1.salary FROM employees e1 WHERE e1.salary > (SELECT AVG(e2.salary) FROM employees e2 WHERE e2.dept = e1.dept)\n3. EXISTS vs IN: Use EXISTS for correlated subqueries on large datasets because EXISTS short-circuits as soon as a match is found.',
      architecture: {
        type: 'correlated_subquery_loop',
        title: 'Correlated Subquery vs Window Function Performance',
        nodes: [
          { name: 'Correlated Subquery: O(N^2)', desc: 'Outer Query scans row -> Inner Query re-executes aggregate across entire table for every row' },
          { name: 'Window Function Alternative: O(N log N)', desc: 'Computes AVG(salary) OVER (PARTITION BY dept) in a single pass' },
          { name: 'Optimization Rule', desc: 'Always prefer Window Functions or CTE Joins over Correlated Subqueries in Big Data' }
        ]
      },
      industryExample: 'Financial fraud detection queries use EXISTS subqueries to verify whether a cardholder has completed a 3D Secure verification record within 10 minutes prior to payment authorization.',
      practicalLab: {
        title: 'Lab 6.3: Benchmarking Subqueries vs Modern Rewrites',
        problemStatement: 'Find all employees who earn more than their department\'s average salary using a subquery and verify results.',
        requirements: 'Python SQLite or database terminal.',
        setup: 'mkdir -p ~/bigdata_lab/m6_l3 && cd ~/bigdata_lab/m6_l3',
        instructions: [
          'Step 1: Write an SQL script with a correlated subquery.',
          'Step 2: Run using python3.',
          'Step 3: Verify the above-average earners.'
        ],
        code: `# subquery_lab.py
import sqlite3
import pandas as pd

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

cur.execute("""
CREATE TABLE staff (
    id INT,
    name TEXT,
    department TEXT,
    salary REAL
)
""")

cur.executemany("INSERT INTO staff VALUES (?, ?, ?, ?)", [
    (1, "Aarav", "Tech", 120000),
    (2, "Diya", "Tech", 95000),
    (3, "Rohan", "Tech", 100000),
    (4, "Priya", "HR", 65000),
    (5, "Kabir", "HR", 80000),
    (6, "Neha", "HR", 60000)
])

# Correlated Subquery: Staff earning > department average
query = """
SELECT 
    s1.name,
    s1.department,
    s1.salary
FROM staff s1
WHERE s1.salary > (
    SELECT AVG(s2.salary)
    FROM staff s2
    WHERE s2.department = s1.department
);
"""

df = pd.read_sql_query(query, conn)
print("--- Employees Earning Above Department Average ---")
print(df)
`,
        commands: [
          'python3 subquery_lab.py'
        ]
      },
      expectedOutput: `--- Employees Earning Above Department Average ---
    name department    salary
0  Aarav       Tech  120000.0
1  Kabir         HR   80000.0`,
      troubleshooting: [
        {
          error: 'Subquery returns more than 1 row (Scalar subquery error)',
          rootCause: 'Using a multi-row subquery in a comparison operator (=, >, <) instead of using IN, ANY, or ALL.',
          solution: 'Ensure scalar subqueries aggregate to a single value using AVG(), MAX(), or MIN(), or switch operator to IN.'
        }
      ],
      bestPractices: [
        'Avoid correlated subqueries in Big Data query engines (Hive/Spark) because they can prevent vectorized batch execution.',
        'Use WHERE EXISTS instead of WHERE id IN (SELECT ...) when the subquery table has millions of rows.',
        'Rewrite correlated subqueries using Window Functions (e.g. AVG(salary) OVER (PARTITION BY dept)) for 10x-50x faster execution.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is a Correlated Subquery in SQL?',
          answer: 'A correlated subquery is an inner subquery that references a column from the outer query. Because the inner query depends on the outer row values, it cannot be executed independently once; it conceptually executes repeatedly for each row evaluated by the outer query.'
        },
        {
          level: 'Intermediate',
          question: 'Why is WHERE EXISTS generally faster than WHERE IN with subqueries on large datasets?',
          answer: 'WHERE IN evaluates the entire subquery result set into memory and compares against it. If the subquery returns nulls, IN has tricky three-valued logic issues. WHERE EXISTS is a boolean check that short-circuits: as soon as the database engine finds the first matching row, it immediately returns TRUE without scanning the remainder of the table.'
        },
        {
          level: 'Advanced',
          question: 'How do modern Cost-Based Optimizers (CBO) like Spark Catalyst or PostgreSQL handle subquery unnesting (decorrelation)?',
          answer: 'Modern optimizers analyze correlated subqueries during logical optimization and automatically "decorrelate" (unnest) them into standard SEMI-JOINs or LEFT OUTER JOINs with aggregation. This transforms an O(N^2) nested loop execution into an O(N log N) Sort Merge Join or Hash Join.'
        }
      ],
      assignment: {
        task: 'Execute python3 subquery_lab.py in terminal and verify that Aarav and Kabir are correctly identified.',
        verificationCriteria: 'Run the command and observe the output DataFrame.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which operator short-circuits and returns true as soon as the first matching record in a subquery is found?',
            options: ['IN', 'EXISTS', 'LIKE', 'ALL'],
            correct: 1,
            explanation: 'EXISTS returns TRUE immediately upon finding the first match without scanning further.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the subquery laboratory script.',
          expectedCommand: 'python3 subquery_lab.py'
        }
      }
    },
    {
      id: 'm6-l4',
      title: 'Common Table Expressions (CTEs) & Recursive CTEs',
      duration: '50 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'A Common Table Expression (CTE) is a temporary named result set defined within the execution scope of a single SQL statement using the WITH clause. CTEs vastly improve readability, modularity, and maintainability over deeply nested subqueries. They break complex 500-line analytical pipelines into clean, step-by-step sequential building blocks. Furthermore, RECURSIVE CTEs allow SQL to solve graph problems, traverse organizational hierarchies (manager -> employee), and generate continuous date/number sequences without external scripts.',
        hi: 'CTE (Common Table Expression) SQL me WITH keyword se banaya gaya ek temporary named dataset hota hai jo query chalne tak zinda rehta hai. Gande nested subqueries likhne ke bajaye hum CTEs use karke step-by-step query ko todte hain (jaise: WITH CleanOrders AS (...), CustomerTotals AS (...)). Iske alawa RECURSIVE CTEs bohot powerful hote hain — ye SQL me loops ki tarah kaam karte hain aur organizational charts (Manager -> Employees) ya date ranges generate karne ke kaam aate hain.'
      },
      why: 'Enterprise SQL queries can span hundreds of lines with multiple aggregations. Without CTEs, nested subqueries become unreadable, untestable "SQL spaghetti" that breaks during production maintenance.',
      how: '1. Standard CTE:\n   WITH HighSpenders AS (\n       SELECT user_id, SUM(amount) as total FROM orders GROUP BY user_id HAVING total > 1000\n   )\n   SELECT u.name, h.total FROM users u JOIN HighSpenders h ON u.id = h.user_id;\n2. Recursive CTE Syntax:\n   WITH RECURSIVE date_series AS (\n       SELECT DATE(\'2026-11-01\') as dt  -- Anchor Member\n       UNION ALL\n       SELECT DATE(dt, \'+1 day\') FROM date_series WHERE dt < \'2026-11-05\' -- Recursive Member\n   )\n   SELECT * FROM date_series;',
      architecture: {
        type: 'cte_pipeline_flow',
        title: 'Modular CTE Analytical Pipeline',
        nodes: [
          { name: '1. WITH raw_filtered AS (...)', desc: 'Step 1: Clean raw logs, filter active tenants' },
          { name: '2. user_metrics AS (...)', desc: 'Step 2: Aggregate orders per user, compute totals' },
          { name: '3. ranked_cohorts AS (...)', desc: 'Step 3: Apply window ranking per region' },
          { name: '4. Final SELECT', desc: 'Step 4: Clean, formatted presentation join' }
        ]
      },
      industryExample: 'Spotify and Netflix use CTEs in dbt (data build tool) transformation models to structure clean Silver and Gold data warehouse layers.',
      practicalLab: {
        title: 'Lab 6.4: Building Multi-Step Analytics and Recursive Date Generators',
        problemStatement: 'Use a Recursive CTE to generate a calendar date series and join with orders to detect zero-sales days.',
        requirements: 'Python SQLite or database terminal.',
        setup: 'mkdir -p ~/bigdata_lab/m6_l4 && cd ~/bigdata_lab/m6_l4',
        instructions: [
          'Step 1: Write an SQL script using Recursive CTE to generate date series.',
          'Step 2: Left join with orders to identify missing date gaps.',
          'Step 3: Run using python3.'
        ],
        code: `# cte_lab.py
import sqlite3
import pandas as pd

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

cur.execute("CREATE TABLE daily_sales (sale_date TEXT, revenue REAL)")
cur.executemany("INSERT INTO daily_sales VALUES (?, ?)", [
    ("2026-11-01", 1200.0),
    ("2026-11-02", 1550.0),
    # 2026-11-03 has 0 sales (missing)
    ("2026-11-04", 890.0)
])

# Recursive CTE to generate continuous calendar
query = """
WITH RECURSIVE calendar(dt) AS (
    SELECT '2026-11-01'
    UNION ALL
    SELECT DATE(dt, '+1 day')
    FROM calendar
    WHERE dt < '2026-11-05'
),
sales_report AS (
    SELECT 
        c.dt as calendar_date,
        COALESCE(s.revenue, 0.0) as revenue
    FROM calendar c
    LEFT JOIN daily_sales s ON c.dt = s.sale_date
)
SELECT * FROM sales_report ORDER BY calendar_date;
"""

df = pd.read_sql_query(query, conn)
print("--- Daily Sales with Filled Missing Dates via Recursive CTE ---")
print(df)
`,
        commands: [
          'python3 cte_lab.py'
        ]
      },
      expectedOutput: `--- Daily Sales with Filled Missing Dates via Recursive CTE ---
  calendar_date  revenue
0    2026-11-01   1200.0
1    2026-11-02   1550.0
2    2026-11-03      0.0
3    2026-11-04    890.0
4    2026-11-05      0.0`,
      troubleshooting: [
        {
          error: 'Recursive query aborted: recursion limit exceeded (infinite loop)',
          rootCause: 'The recursive member WHERE termination condition was omitted or never evaluated to false.',
          solution: 'Always verify the termination condition: WHERE dt < \'target_date\' and ensure recursion counter increments.'
        }
      ],
      bestPractices: [
        'Use CTEs to structure complex analytical models instead of nesting subqueries 4 levels deep.',
        'Name CTEs clearly using snake_case nouns describing their content (e.g. active_users, daily_order_totals).',
        'In PostgreSQL/Snowflake, be aware of whether the engine "inlines" or "materializes" CTEs.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is a Common Table Expression (CTE) in SQL?',
          answer: 'A CTE is a temporary, named result set defined at the beginning of an SQL query using the WITH clause. It exists only for the duration of that specific query and can be referenced in the main query or subsequent CTEs, making complex queries modular and easy to read.'
        },
        {
          level: 'Intermediate',
          question: 'What are the two components required in a Recursive CTE?',
          answer: 'A Recursive CTE requires: 1. Anchor Member: A base query that returns the initial seed row(s) without referencing the CTE itself, and 2. Recursive Member: A query that references the CTE name, joins with the previous iteration\'s results, and contains a WHERE termination condition to prevent infinite loops, joined by UNION ALL.'
        },
        {
          level: 'Advanced',
          question: 'What is CTE Inlining vs CTE Materialization in query optimization engines?',
          answer: 'CTE Inlining means the query planner treats the CTE like a subquery or view, merging its logic directly into the main query tree for joint filter pushdown and index scans. CTE Materialization means the query engine evaluates the CTE once, caches the result in temporary memory/disk, and reads from that cache multiple times if referenced repeatedly. Engines like PostgreSQL 12+ allow controlling this via WITH my_cte AS MATERIALIZED (...).'
        }
      ],
      assignment: {
        task: 'Execute python3 cte_lab.py in terminal and verify that missing dates (2026-11-03) are filled with 0.0 revenue.',
        verificationCriteria: 'Run the command and observe the complete calendar series with 0.0 sales.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which keyword initiates a Common Table Expression in standard SQL?',
            options: ['CREATE TEMP TABLE', 'WITH', 'BEGIN CTE', 'DECLARE'],
            correct: 1,
            explanation: 'The WITH keyword introduces one or more Common Table Expressions in SQL.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the CTE laboratory script.',
          expectedCommand: 'python3 cte_lab.py'
        }
      }
    },
    {
      id: 'm6-l5',
      title: 'Window Functions (ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD)',
      duration: '55 mins',
      difficulty: 'Advanced',
      concept: {
        en: 'Window Functions are the most critical SQL capability tested in Data Engineering interviews and used in analytical production pipelines. Unlike GROUP BY (which collapses multiple rows into a single aggregated row), Window Functions perform calculations across a set of table rows ("window") that are related to the current row, WHILE PRESERVING THE INDIVIDUAL IDENTITY OF EVERY ROW. Key functions:\n- Ranking: ROW_NUMBER() (unique 1,2,3..), RANK() (skips numbers on ties: 1,2,2,4), DENSE_RANK() (does not skip: 1,2,2,3).\n- Offsets: LAG(col, 1) (fetches previous row value), LEAD(col, 1) (fetches next row value).\n- Running Totals: SUM(amount) OVER (PARTITION BY user_id ORDER BY txn_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW).\n- Framing: ROWS vs RANGE frame specifications.',
        hi: 'Window Functions Data Engineering interviews aur real jobs ka #1 sabse important topic hai! GROUP BY saari rows ko sikod kar ek row bana deta hai, lekin Window Functions har ek row ko zinda rakhte hue calculation karte hain. Main functions:\n- ROW_NUMBER(): Har row ko unique serial number deta hai (1, 2, 3, 4).\n- RANK(): Agar tie ho toh same rank dega par agla number skip kar dega (1, 2, 2, 4).\n- DENSE_RANK(): Tie hone par same rank dega aur number skip nahi karega (1, 2, 2, 3).\n- LAG(): Pichli row ka data current row me laata hai (jaise pichle mahine ki sale se compare karna).\n- LEAD(): Agli row ka data current row me laata hai.\n- Running Total: Har row par pichli saari sales ko jodte hue chalna.'
      },
      why: 'Calculating Day-over-Day growth, finding the 2nd highest salary per department, or deduplicating clickstream events in raw SQL without window functions requires slow, unmaintainable self-joins. Window functions calculate these in a single linear pass.',
      how: '1. Deduplication Pattern: WITH Ranked AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY id ORDER BY updated_at DESC) as rn FROM tbl) SELECT * FROM Ranked WHERE rn = 1\n2. Previous Period Comparison: LAG(revenue, 1) OVER (ORDER BY sale_date)\n3. Top-N per Category: DENSE_RANK() OVER (PARTITION BY category ORDER BY sales DESC) <= 3\n4. Cumulative Sum: SUM(val) OVER (PARTITION BY dept ORDER BY dt ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW).',
      architecture: {
        type: 'window_function_framing',
        title: 'Window Function Execution: Partition & Window Frame',
        nodes: [
          { name: 'PARTITION BY (Sub-groups)', desc: 'Splits dataset into independent logical groups (e.g. Department, Region)' },
          { name: 'ORDER BY (Sorting inside group)', desc: 'Defines ordering of rows inside each partition' },
          { name: 'Frame: ROWS BETWEEN...', desc: 'Sliding window frame (UNBOUNDED PRECEDING TO CURRENT ROW)' },
          { name: 'Calculated Window Column', desc: 'Appends calculated scalar value onto the original intact row' }
        ]
      },
      industryExample: 'Netflix and Uber use Window Functions in Spark SQL to compute sessionization (detecting when user inactivity exceeds 30 minutes via LAG(timestamp)) and calculating lifetime customer spend percentiles.',
      practicalLab: {
        title: 'Lab 6.5: Mastering Window Functions for Deduplication and Metrics',
        problemStatement: 'Deduplicate orders keeping the latest update, find the 2nd highest salary per department, and compute running revenue.',
        requirements: 'Python SQLite or database terminal.',
        setup: 'mkdir -p ~/bigdata_lab/m6_l5 && cd ~/bigdata_lab/m6_l5',
        instructions: [
          'Step 1: Write an SQL script implementing ROW_NUMBER, DENSE_RANK, and LAG.',
          'Step 2: Run using python3.',
          'Step 3: Verify the ranked and running output metrics.'
        ],
        code: `# window_functions_lab.py
import sqlite3
import pandas as pd

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

cur.execute("""
CREATE TABLE salaries (
    emp_id INT,
    name TEXT,
    dept TEXT,
    salary REAL
)
""")

cur.executemany("INSERT INTO salaries VALUES (?, ?, ?, ?)", [
    (1, "Aarav", "Tech", 150000),
    (2, "Diya", "Tech", 140000),
    (3, "Rohan", "Tech", 140000),  # Tie
    (4, "Vikram", "Tech", 110000),
    (5, "Priya", "HR", 80000),
    (6, "Kabir", "HR", 75000),
    (7, "Neha", "HR", 65000)
])

# Query 1: Difference between ROW_NUMBER, RANK, and DENSE_RANK
ranking_query = """
SELECT 
    name,
    dept,
    salary,
    ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) as row_num,
    RANK() OVER (PARTITION BY dept ORDER BY salary DESC) as rnk,
    DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) as dense_rnk
FROM salaries;
"""

df_ranks = pd.read_sql_query(ranking_query, conn)
print("--- Ranking Window Functions Comparison ---")
print(df_ranks)

# Query 2: Find the 2nd highest salary in each department using DENSE_RANK
second_highest_query = """
WITH RankedSalaries AS (
    SELECT 
        name,
        dept,
        salary,
        DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) as dr
    FROM salaries
)
SELECT name, dept, salary 
FROM RankedSalaries 
WHERE dr = 2;
"""

df_second = pd.read_sql_query(second_highest_query, conn)
print("\\n--- 2nd Highest Salary in Each Department ---")
print(df_second)
`,
        commands: [
          'python3 window_functions_lab.py'
        ]
      },
      expectedOutput: `--- Ranking Window Functions Comparison ---
     name  dept    salary  row_num  rnk  dense_rnk
0   Priya    HR   80000.0        1    1          1
1   Kabir    HR   75000.0        2    2          2
2    Neha    HR   65000.0        3    3          3
3   Aarav  Tech  150000.0        1    1          1
4    Diya  Tech  140000.0        2    2          2
5   Rohan  Tech  140000.0        3    2          2
6  Vikram  Tech  110000.0        4    4          3

--- 2nd Highest Salary in Each Department ---
    name  dept    salary
0  Kabir    HR   75000.0
1   Diya  Tech  140000.0
2  Rohan  Tech  140000.0`,
      troubleshooting: [
        {
          error: 'Misuse of window function: cannot use window function in WHERE clause',
          rootCause: 'Placing ROW_NUMBER() directly in WHERE (e.g. WHERE ROW_NUMBER() OVER (...) = 1).',
          solution: 'Window functions evaluate at Step 5 (SELECT), while WHERE evaluates at Step 2. You must wrap the query in a CTE or subquery, and filter on the alias in the outer query.'
        }
      ],
      bestPractices: [
        'Always use DENSE_RANK() instead of RANK() when looking for the Nth highest value to handle ties gracefully.',
        'Use ROW_NUMBER() OVER (PARTITION BY business_key ORDER BY updated_at DESC) as the gold standard for data lake deduplication.',
        'Specify ROWS BETWEEN explicitly when computing running aggregations to avoid unexpected ties behavior with default RANGE.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the difference between ROW_NUMBER(), RANK(), and DENSE_RANK()?',
          answer: 'ROW_NUMBER() assigns a strictly sequential integer (1, 2, 3, 4) to every row regardless of ties. RANK() assigns the same rank to ties, but skips subsequent numbers (e.g. two rows tie for 2nd: 1, 2, 2, 4). DENSE_RANK() assigns the same rank to ties without skipping subsequent numbers (1, 2, 2, 3).'
        },
        {
          level: 'Intermediate',
          question: 'How do you write a deduplication query in SQL to keep only the latest record for each customer ID?',
          answer: 'WITH Deduplicated AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY updated_at DESC) as rn FROM customer_events) SELECT * FROM Deduplicated WHERE rn = 1.'
        },
        {
          level: 'Advanced',
          question: 'Explain the difference between ROWS BETWEEN and RANGE BETWEEN in SQL window frames.',
          answer: 'ROWS calculates the frame based on physical row counts (e.g. ROWS BETWEEN 2 PRECEDING AND CURRENT ROW always includes exactly 3 physical rows). RANGE calculates the frame based on the logical values of the ORDER BY column (e.g. RANGE BETWEEN INTERVAL \'7\' DAY PRECEDING AND CURRENT ROW includes all rows with timestamps within the last 7 days). If ORDER BY has duplicate values, default RANGE treats all identical values as a single combined frame.'
        }
      ],
      assignment: {
        task: 'Execute python3 window_functions_lab.py in terminal and verify how DENSE_RANK handles the tie between Diya and Rohan.',
        verificationCriteria: 'Run the command and observe the ranking comparison table.'
      },
      assessment: {
        quiz: [
          {
            q: 'If two employees have the exact same highest salary, which window function ensures the 2nd distinct highest salary is ranked as 2 (not 3)?',
            options: ['ROW_NUMBER()', 'RANK()', 'DENSE_RANK()', 'LEAD()'],
            correct: 2,
            explanation: 'DENSE_RANK() handles ties without skipping subsequent rank numbers (1, 1, 2).'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the window functions laboratory script.',
          expectedCommand: 'python3 window_functions_lab.py'
        }
      }
    },
    {
      id: 'm6-l6',
      title: 'Stored Procedures, Functions & Dynamic SQL',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'Stored Procedures and User-Defined Functions (UDFs) are precompiled database routines stored directly in the database management system. Stored procedures can perform complex procedural operations (loops, IF/ELSE logic, transaction commits/rollbacks, error handling) and can modify database state without returning a value. Functions (UDFs) must return a scalar value or table and cannot perform transactional commits. In Big Data architectures, stored procedures automate warehouse partition maintenance and metadata logging.',
        hi: 'Stored Procedures aur Functions database ke andar save kiye gaye precompiled code blocks hote hain. Stored Procedures me poora procedural logic hota hai (loops, IF/ELSE, transaction COMMIT/ROLLBACK, tables create/delete karna). Functions (UDFs) hamesha koi value return karte hain aur SELECT query ke andar call ho sakte hain. Big Data data warehouses (jaise Snowflake, Redshift, BigQuery) me stored procedures ka use daily partitions create karne aur ETL batch runs ko log karne ke liye hota hai.'
      },
      why: 'Executing 50 separate SQL statements over network roundtrips incurs high network latency. Stored procedures execute directly on the database engine server in compiled memory, eliminating network latency.',
      how: '1. User Defined Function (UDF): In SQLite/Python: conn.create_function("calc_tax", 1, lambda p: p * 1.18)\n2. Procedure logic: BEGIN TRANSACTION ... COMMIT / ROLLBACK\n3. Exception handling: BEGIN ... EXCEPTION WHEN OTHERS THEN ROLLBACK; RAISE; END;\n4. Dynamic SQL: Constructing query strings at runtime via EXECUTE IMMEDIATE or cursor.execute().',
      architecture: {
        type: 'stored_proc_workflow',
        title: 'Stored Procedure Automated Partition Maintenance',
        nodes: [
          { name: 'Airflow Trigger', desc: 'CALL sp_maintain_partitions(\'2026-11-11\')' },
          { name: 'Procedure Execution', desc: 'Executes within database server memory: verifies tables, alters partitions' },
          { name: 'Atomic Transaction', desc: 'Commits metadata; rolls back on failure' },
          { name: 'Audit Log Insertion', desc: 'Appends execution metrics to pipeline_audit_log table' }
        ]
      },
      industryExample: 'Snowflake and Google BigQuery data warehouses utilize stored procedures written in SQL or JavaScript/Python to automate daily historical partition expiration and data masking policies.',
      practicalLab: {
        title: 'Lab 6.6: Creating Custom SQL Functions (UDFs) and Procedural Logic',
        problemStatement: 'Register a custom Python UDF inside SQLite to perform regex email domain extraction inside SQL queries.',
        requirements: 'Python SQLite.',
        setup: 'mkdir -p ~/bigdata_lab/m6_l6 && cd ~/bigdata_lab/m6_l6',
        instructions: [
          'Step 1: Write an SQLite script that registers a custom Python UDF.',
          'Step 2: Run using python3.',
          'Step 3: Verify that SQL queries invoke the custom function seamlessly.'
        ],
        code: `# udf_procedure_lab.py
import sqlite3
import pandas as pd

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

# 1. Register custom Python function as an SQL UDF
def extract_email_domain(email):
    if email and "@" in email:
        return email.split("@")[-1].lower()
    return "UNKNOWN"

conn.create_function("EXTRACT_DOMAIN", 1, extract_email_domain)

cur.execute("CREATE TABLE users (id INT, name TEXT, email TEXT)")
cur.executemany("INSERT INTO users VALUES (?, ?, ?)", [
    (1, "Aarav", "aarav@enterprise.com"),
    (2, "Diya", "diya@startup.io"),
    (3, "Rohan", "rohan@enterprise.com"),
    (4, "Priya", "invalid_email_string")
])

# 2. Invoke the custom UDF directly inside standard SQL
query = """
SELECT 
    EXTRACT_DOMAIN(email) as domain,
    COUNT(*) as user_count
FROM users
GROUP BY EXTRACT_DOMAIN(email)
ORDER BY user_count DESC;
"""

df = pd.read_sql_query(query, conn)
print("--- Aggregation using Custom SQL UDF ---")
print(df)
`,
        commands: [
          'python3 udf_procedure_lab.py'
        ]
      },
      expectedOutput: `--- Aggregation using Custom SQL UDF ---
           domain  user_count
0  enterprise.com           2
1      startup.io           1
2         UNKNOWN           1`,
      troubleshooting: [
        {
          error: 'no such function: EXTRACT_DOMAIN',
          rootCause: 'Attempting to call a custom UDF without registering it on the specific database connection object.',
          solution: 'Ensure conn.create_function("NAME", num_args, python_callable) is invoked before running queries.'
        }
      ],
      bestPractices: [
        'Use built-in SQL functions wherever possible; custom UDFs (especially in PySpark) disable Catalyst Optimizer vectorization.',
        'Always wrap stored procedure batch logic inside explicit transactions (BEGIN TRANSACTION ... COMMIT) to prevent partial data writes.',
        'Log execution start time, end time, row counts, and errors into a dedicated database audit table.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the difference between a Stored Procedure and a User-Defined Function (UDF)?',
          answer: 'A User-Defined Function (UDF) must return a value (scalar or table), cannot modify database state, cannot manage transactions (no COMMIT/ROLLBACK), and can be used directly inside SELECT and WHERE clauses. A Stored Procedure is executed via CALL/EXEC, can modify database tables, can manage transactions, does not require a return value, and cannot be invoked inside a SELECT clause.'
        },
        {
          level: 'Intermediate',
          question: 'What are the performance disadvantages of Python UDFs in distributed engines like Apache Spark?',
          answer: 'In Spark, native SQL functions run directly in optimized JVM bytecode with Tungsten memory management. When a Python UDF is called, Spark must serialize data from the JVM heap, transfer it over a socket to a Python worker process via Py4J, execute the Python function, and serialize the result back to the JVM. This causes severe serialization overhead and disables Catalyst optimizations. Pandas UDFs (Vectorized UDFs via Apache Arrow) mitigate this by transferring entire record batches.'
        },
        {
          level: 'Advanced',
          question: 'How do you handle error recovery and rollbacks inside enterprise stored procedures?',
          answer: 'Wrap the execution block inside a transaction and exception handler (e.g. in PostgreSQL: BEGIN ... EXCEPTION WHEN OTHERS THEN ROLLBACK; INSERT INTO error_log ...; RAISE; END;). This ensures that if any table update fails halfway through, all preceding operations are automatically rolled back to their original state, preserving database ACID consistency.'
        }
      ],
      assignment: {
        task: 'Execute python3 udf_procedure_lab.py in terminal and verify that the custom domain extraction UDF groups the emails correctly.',
        verificationCriteria: 'Run the command and observe the domain aggregation output.'
      },
      assessment: {
        quiz: [
          {
            q: 'Can a User-Defined Function (UDF) execute transactional COMMIT or ROLLBACK statements in standard relational databases?',
            options: [
              'Yes, anytime',
              'No, functions are read-only regarding transactions; transaction control is exclusive to Stored Procedures',
              'Only during safe mode',
              'Only in MySQL'
            ],
            correct: 1,
            explanation: 'Functions cannot control transactions; transaction commits and rollbacks can only be managed inside Stored Procedures.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the custom UDF and procedure laboratory script.',
          expectedCommand: 'python3 udf_procedure_lab.py'
        }
      }
    },
    {
      id: 'm6-l7',
      title: 'Indexes & Physical Storage Optimization',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'Indexes are specialized data structures that databases maintain to speed up data retrieval without scanning every row in a table. In traditional databases, the default index structure is the B+ Tree (Balanced Tree), which provides logarithmic O(log N) lookup time compared to an O(N) full table scan. In Big Data systems, indexing evolves into Clustered Indexes, Non-Clustered Indexes, Hash Indexes, Bitmap Indexes, and Parquet/ORC Zone Maps (Min/Max statistics and Bloom Filters). However, indexes are not free: they consume disk space and slow down INSERT, UPDATE, and DELETE operations.',
        hi: 'Indexes bilkul kisi kitaab ke aakhiri panno par diye gaye "Index" ki tarah hote hain. Agar aapko kitaab me "Hadoop" dhoondna hai, toh aap 1,000 panne ek-ek karke nahi padhte — aap index dekh kar seedha page 245 par chale jaate ho! Database me index B+ Tree structure use karta hai jo O(log N) speed deta hai. Lekin index free nahi hota: ye disk space leta hai aur har naye INSERT/UPDATE par index ko update karna padta hai, jisse writes slow ho jaate hain.'
      },
      why: 'On a 50-million row table, running SELECT * FROM orders WHERE customer_id = 9812 without an index requires scanning all 50 million rows from disk (takes 45 seconds). With a B+ Tree index on customer_id, the database seeks the record in 3 disk hops (takes 0.002 seconds).',
      how: '1. Create Index: CREATE INDEX idx_orders_cust ON orders(customer_id);\n2. Composite Index: CREATE INDEX idx_orders_comp ON orders(customer_id, order_date);\n3. Leftmost Prefix Rule: A composite index on (A, B) accelerates queries on (A) and (A, B), but CANNOT accelerate queries on (B) alone.\n4. Covering Index: An index containing all columns requested by the SELECT query, allowing the database to satisfy the query entirely from the index without reading the table heap.\n5. Big Data Zone Maps: Columnar Parquet files store min/max statistics per 128 MB row group, allowing Spark to skip reading entire chunks of disk.',
      architecture: {
        type: 'btree_index_structure',
        title: 'B+ Tree Index vs Full Table Scan',
        nodes: [
          { name: 'Root Node', desc: 'Binary/multivariate branch routing keys' },
          { name: 'Intermediate Nodes', desc: 'Directs search pointer down tree levels' },
          { name: 'Leaf Nodes (Linked List)', desc: 'Contains sorted keys + row pointers (RowIDs); doubly-linked for fast range scans' },
          { name: 'Search Complexity', desc: 'O(log N) lookup - 100M rows resolved in ~4-5 node comparisons' }
        ]
      },
      industryExample: 'Stripe maintains composite B+ Tree indexes on (account_id, created_at DESC) across PostgreSQL shards to power real-time merchant dashboard queries in under 10 milliseconds.',
      practicalLab: {
        title: 'Lab 6.7: Creating Indexes and Observing Query Acceleration',
        problemStatement: 'Populate 50,000 records, benchmark search time without an index vs with a B-Tree index, and inspect index metadata.',
        requirements: 'Python SQLite.',
        setup: 'mkdir -p ~/bigdata_lab/m6_l7 && cd ~/bigdata_lab/m6_l7',
        instructions: [
          'Step 1: Write an indexing benchmark script.',
          'Step 2: Run using python3.',
          'Step 3: Observe the search time comparison before and after indexing.'
        ],
        code: `# indexing_bench_lab.py
import sqlite3, time

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

cur.execute("CREATE TABLE transactions (id INT, txn_code TEXT, amount REAL)")
data = [(i, f"TXN_{i:08d}", float(i * 10)) for i in range(50000)]
cur.executemany("INSERT INTO transactions VALUES (?, ?, ?)", data)
conn.commit()

target_code = "TXN_00049999"

# 1. Query WITHOUT Index (Full Table Scan)
start = time.perf_counter()
cur.execute("SELECT * FROM transactions WHERE txn_code = ?", (target_code,))
res_scan = cur.fetchall()
t_scan = time.perf_counter() - start

# 2. Create B-Tree Index
cur.execute("CREATE INDEX idx_txn_code ON transactions(txn_code)")
conn.commit()

# 3. Query WITH Index (B-Tree Seek)
start = time.perf_counter()
cur.execute("SELECT * FROM transactions WHERE txn_code = ?", (target_code,))
res_idx = cur.fetchall()
t_idx = time.perf_counter() - start

print(f"Full Table Scan Time: {t_scan*1000:.4f} ms")
print(f"Indexed Seek Time:    {t_idx*1000:.4f} ms")
print(f"Index Speedup:        {t_scan / t_idx:.1f}x faster!")
`,
        commands: [
          'python3 indexing_bench_lab.py'
        ]
      },
      expectedOutput: `Full Table Scan Time: 4.8200 ms
Indexed Seek Time:    0.0450 ms
Index Speedup:        107.1x faster!`,
      troubleshooting: [
        {
          error: 'Index is ignored by database optimizer (Query still performs Full Table Scan)',
          rootCause: 'Applying a function to the indexed column in WHERE (e.g. WHERE UPPER(name) = \'JOHN\' or WHERE YEAR(order_date) = 2026), which prevents B-Tree index traversal.',
          solution: 'Never wrap indexed columns in functions. Rewrite to range scans (WHERE order_date >= \'2026-01-01\' AND order_date < \'2027-01-01\') or create a Functional Index.'
        }
      ],
      bestPractices: [
        'Index foreign keys and columns frequently used in WHERE, JOIN, and ORDER BY clauses.',
        'Never index low-cardinality columns (e.g. gender, boolean flags) with B-Trees; the engine will ignore the index and scan the table.',
        'Keep the Leftmost Prefix rule in mind when designing composite multi-column indexes.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the difference between a Clustered Index and a Non-Clustered Index?',
          answer: 'A Clustered Index defines the physical ordering of the actual data rows on disk; a table can have only ONE clustered index (typically the Primary Key). A Non-Clustered Index is a separate secondary data structure (B+ Tree) that stores index keys and row pointers (RowIDs/primary keys) pointing to the physical table location; a table can have multiple non-clustered indexes.'
        },
        {
          level: 'Intermediate',
          question: 'What is a "Covering Index" and why is it extremely fast?',
          answer: 'A Covering Index is an index that includes all the columns referenced in a query (both the WHERE filter columns and the SELECT projection columns). When a query is "covered", the database engine reads all required data directly from the leaf nodes of the B+ Tree index in memory and never touches the physical table heap on disk, eliminating table lookups entirely.'
        },
        {
          level: 'Advanced',
          question: 'What is the "Leftmost Prefix" rule for composite indexes?',
          answer: 'When a composite index is created on columns (A, B, C), the B+ Tree is sorted first by A, then by B, then by C. The index can be used by the optimizer for queries filtering on (A), (A, B), or (A, B, C). It CANNOT be used efficiently for queries filtering on (B) alone or (C) alone because the index is not sorted by B or C at the root level.'
        }
      ],
      assignment: {
        task: 'Execute python3 indexing_bench_lab.py in terminal and verify the 100x+ speedup of indexed seeks over full table scans.',
        verificationCriteria: 'Run the command and observe the speedup ratio.'
      },
      assessment: {
        quiz: [
          {
            q: 'If a composite index is created on (country, state, city), which WHERE clause CANNOT effectively use the index?',
            options: [
              'WHERE country = \'IN\'',
              'WHERE country = \'IN\' AND state = \'DL\'',
              'WHERE state = \'DL\' AND city = \'New Delhi\' (Violates Leftmost Prefix)',
              'WHERE country = \'IN\' AND state = \'DL\' AND city = \'New Delhi\''
            ],
            correct: 2,
            explanation: 'Violating the Leftmost Prefix rule (omitting the first column "country") prevents the B+ Tree from navigating root nodes.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the indexing benchmark script.',
          expectedCommand: 'python3 indexing_bench_lab.py'
        }
      }
    },
    {
      id: 'm6-l8',
      title: 'Query Optimization & EXPLAIN Execution Plans',
      duration: '50 mins',
      difficulty: 'Advanced',
      concept: {
        en: 'Query optimization is the process of analyzing, diagnosing, and rewriting slow SQL queries to minimize CPU cycles, disk I/O, and network shuffles. The primary diagnostic tool is the EXPLAIN (or EXPLAIN ANALYZE) command. EXPLAIN reveals the database engine\'s Query Execution Plan: the exact sequence of physical operations the Cost-Based Optimizer (CBO) chose to execute your logical query. An execution plan exposes whether the engine is performing an index seek vs full table scan, nested loop join vs hash join, temporary disk sorts, and estimated vs actual row counts.',
        hi: 'Query Optimization ka matlab hota hai slow queries ko pakadna aur unhe fast banana. Iska sabse bada hathiyar hota hai EXPLAIN (ya EXPLAIN ANALYZE) command. Jab aap kisi query ke aage EXPLAIN lagate ho, toh database aapko apna "Execution Plan" dikhata hai — matlab database internal level par query ko kaise execute karne wala hai. Ye aapko batata hai ki kya database index use kar raha hai ya poori table scan kar raha hai (Full Table Scan), kitni memory use ho rahi hai, aur kahan query atak rahi hai.'
      },
      why: 'In enterprise production, guessing why a query takes 2 hours is unprofessional. Reading the EXPLAIN plan pinpoints the exact physical operator (e.g. an accidental Cartesian cross-product or unindexed string join) in 30 seconds.',
      how: '1. Syntax: EXPLAIN QUERY PLAN SELECT ...\n2. Key Operators in Plans:\n   - SCAN TABLE: Full table scan (reads every block from disk; red flag on large tables).\n   - SEARCH TABLE USING INDEX: Fast B-Tree index lookup.\n   - USE TEMP B-TREE FOR ORDER BY: Engine had to allocate temporary memory/disk to sort rows.\n   - HASH JOIN / MERGE JOIN: Distributed join mechanisms.\n3. Optimization Strategy: Add missing index, rewrite correlated subqueries to CTEs, push down filters, eliminate SELECT *.',
      architecture: {
        type: 'query_optimizer_stages',
        title: 'Database Query Optimization Engine Stages',
        nodes: [
          { name: '1. Parser & Lexer', desc: 'Validates syntax, verifies table/column names in catalog' },
          { name: '2. Logical Optimizer', desc: 'Applies heuristic rules (filter pushdown, projection pruning, decorrelation)' },
          { name: '3. Cost-Based Optimizer (CBO)', desc: 'Calculates physical plan costs using table statistics (histograms)' },
          { name: '4. Physical Execution Engine', desc: 'Executes chosen optimal plan via vectorized engine' }
        ]
      },
      industryExample: 'At Meta and LinkedIn, automated query linters run EXPLAIN ANALYZE on developer PRs, blocking any SQL query containing a unindexed SCAN on tables with >10 million rows from deploying to production.',
      practicalLab: {
        title: 'Lab 6.8: Reading and Interpreting EXPLAIN QUERY PLAN in SQLite',
        problemStatement: 'Inspect the execution plan of an unindexed query vs an indexed query using EXPLAIN QUERY PLAN.',
        requirements: 'Python SQLite.',
        setup: 'mkdir -p ~/bigdata_lab/m6_l8 && cd ~/bigdata_lab/m6_l8',
        instructions: [
          'Step 1: Write an SQL script comparing EXPLAIN QUERY PLAN outputs.',
          'Step 2: Run using python3.',
          'Step 3: Analyze the physical plan difference between SCAN and SEARCH.'
        ],
        code: `# explain_plan_lab.py
import sqlite3
import pandas as pd

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

cur.execute("CREATE TABLE orders (order_id INT, customer_id INT, amount REAL)")

# 1. Inspect Plan WITHOUT Index
cur.execute("EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 101")
plan_before = cur.fetchall()
print("--- Execution Plan BEFORE Index (Full Table Scan) ---")
for p in plan_before:
    print(p)

# 2. Add Index
cur.execute("CREATE INDEX idx_orders_customer ON orders(customer_id)")

# 3. Inspect Plan WITH Index
cur.execute("EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 101")
plan_after = cur.fetchall()
print("\\n--- Execution Plan AFTER Index (Indexed Search) ---")
for p in plan_after:
    print(p)
`,
        commands: [
          'python3 explain_plan_lab.py'
        ]
      },
      expectedOutput: `--- Execution Plan BEFORE Index (Full Table Scan) ---
(2, 0, 0, 'SCAN orders')

--- Execution Plan AFTER Index (Indexed Search) ---
(3, 0, 0, 'SEARCH orders USING INDEX idx_orders_customer (customer_id=?)')`,
      troubleshooting: [
        {
          error: 'Cost-Based Optimizer chooses Full Table Scan even when a valid index exists',
          rootCause: 'Outdated table statistics (histograms). The optimizer assumes the table has only 10 rows or that the indexed value matches 90% of rows.',
          solution: 'Run ANALYZE table_name; to update the optimizer\'s internal statistics.'
        }
      ],
      bestPractices: [
        'Always run EXPLAIN before deploying any new analytical query to production.',
        'Watch out for "SCAN TABLE" operators on tables with >100,000 rows.',
        'Beware of "USE TEMP B-TREE FOR ORDER BY"; adding an index on the ORDER BY column eliminates sorting overhead.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the difference between EXPLAIN and EXPLAIN ANALYZE?',
          answer: 'EXPLAIN displays the database engine\'s estimated execution plan and estimated costs based on table statistics WITHOUT actually executing the query. EXPLAIN ANALYZE actually executes the query, displaying both the estimated costs AND the real-world execution times, actual memory consumed, and exact row counts returned by each operator.'
        },
        {
          level: 'Intermediate',
          question: 'What is Filter Pushdown (Predicate Pushdown) in query optimization?',
          answer: 'Filter Pushdown is an optimization where the query engine pushes WHERE filter conditions as close as possible to the physical storage layer. For example, instead of reading a 100 GB Parquet table into memory and then filtering for status = \'PAID\', the filter is pushed down to the storage scan, skipping non-matching Parquet row groups and reducing I/O by 90%.'
        },
        {
          level: 'Advanced',
          question: 'How do you detect and fix Data Skew when running distributed joins in Apache Spark or Hive?',
          answer: 'In Spark UI / explain plans, look for stages where 199 tasks finish in 5 seconds, but 1 straggler task hangs for 45 minutes (processing millions of rows associated with a null or popular skewed key). Fixes: 1. Broadcast Join: If one table is small, broadcast it to avoid shuffle entirely. 2. Salting: Add a random integer prefix (e.g. 0 to 9) to the skewed key on both tables, distributing the skewed records across 10 separate parallel reducer partitions.'
        }
      ],
      assignment: {
        task: 'Execute python3 explain_plan_lab.py in terminal and verify the plan transition from SCAN orders to SEARCH orders USING INDEX.',
        verificationCriteria: 'Run the command and observe both execution plans.'
      },
      assessment: {
        quiz: [
          {
            q: 'In a query execution plan, which operator indicates that the database was forced to read every single physical block of a table from disk?',
            options: ['INDEX SEEK', 'SCAN TABLE (Full Table Scan)', 'INDEX RANGE SCAN', 'HASH JOIN'],
            correct: 1,
            explanation: 'SCAN TABLE indicates a full sequential scan of the entire table heap.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the query execution plan laboratory script.',
          expectedCommand: 'python3 explain_plan_lab.py'
        }
      }
    },
    {
      id: 'm6-l9',
      title: 'Complex Analytical Queries (Cohort, Funnel, Churn)',
      duration: '55 mins',
      difficulty: 'Advanced',
      concept: {
        en: 'In high-growth tech companies, Data Engineers are tasked with building analytical queries that compute critical business metrics: Cohort Retention Analysis (tracking how user groups retain over consecutive months), Funnel Conversion Analysis (measuring drop-off rates through a checkout sequence: View -> Add to Cart -> Checkout -> Pay), and Churn Analysis (detecting users with no activity over 30/60/90 days). These complex metrics combine CTEs, window functions (LAG, FIRST_VALUE), conditional aggregation, and date math.',
        hi: 'Real IT companies me data engineers se basic queries nahi, balki complex business analytics banwayi jaati hai: 1. Cohort Analysis (ye track karna ki January me aane wale users me se kitne percent February aur March me wapas aaye), 2. Funnel Analysis (ye dekhna ki user website par aakar product dekhne se lekar payment karne tak kis step par sabse zyada drop ho rahe hain), aur 3. Churn Analysis (inactive users ko track karna). Ye queries CTEs aur Window Functions ka advanced combination hoti hain.'
      },
      why: 'Product and executive leadership make multi-million dollar marketing and pricing decisions based on cohort retention and funnel queries. A data engineer must write these queries accurately and efficiently.',
      how: '1. Funnel Modeling: Using CASE WHEN inside SUM() for conditional counts across pipeline stages.\n2. Cohort Grouping: DATE_TRUNC(\'month\', signup_date) to assign users to cohort buckets.\n3. Activity Offset: Date difference between activity_month and cohort_month.\n4. Retention Rate: COUNT(DISTINCT active_users) * 100.0 / cohort_size.',
      architecture: {
        type: 'funnel_conversion_chart',
        title: 'E-Commerce Funnel Conversion Architecture',
        nodes: [
          { name: 'Stage 1: Product View', desc: '100,000 users (100% baseline)' },
          { name: 'Stage 2: Add to Cart', desc: '35,000 users (35% conversion / 65% drop-off)' },
          { name: 'Stage 3: Initiate Checkout', desc: '18,000 users (18% conversion / 48% drop-off)' },
          { name: 'Stage 4: Purchase Completed', desc: '12,500 users (12.5% overall conversion)' }
        ]
      },
      industryExample: 'Flipkart and Swiggy run real-time funnel conversion queries across festive sale events (Big Billion Days) to pinpoint checkout payment gateway latency spikes.',
      practicalLab: {
        title: 'Lab 6.9: Building an E-Commerce Funnel Conversion Pipeline in SQL',
        problemStatement: 'Write an SQL query to analyze user conversion drop-offs across a 4-step e-commerce funnel.',
        requirements: 'Python SQLite.',
        setup: 'mkdir -p ~/bigdata_lab/m6_l9 && cd ~/bigdata_lab/m6_l9',
        instructions: [
          'Step 1: Write an SQL script populating user events.',
          'Step 2: Compute conditional funnel metrics using CASE WHEN.',
          'Step 3: Run using python3.'
        ],
        code: `# funnel_analytics_lab.py
import sqlite3
import pandas as pd

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

cur.execute("""
CREATE TABLE user_events (
    user_id INT,
    event_type TEXT,
    event_time TEXT
)
""")

cur.executemany("INSERT INTO user_events VALUES (?, ?, ?)", [
    (1, "VIEW_PRODUCT", "2026-11-11 10:00:00"),
    (1, "ADD_TO_CART", "2026-11-11 10:02:00"),
    (1, "START_CHECKOUT", "2026-11-11 10:05:00"),
    (1, "PURCHASE", "2026-11-11 10:07:00"),
    
    (2, "VIEW_PRODUCT", "2026-11-11 10:10:00"),
    (2, "ADD_TO_CART", "2026-11-11 10:12:00"),
    
    (3, "VIEW_PRODUCT", "2026-11-11 10:15:00"),
    
    (4, "VIEW_PRODUCT", "2026-11-11 10:20:00"),
    (4, "ADD_TO_CART", "2026-11-11 10:22:00"),
    (4, "START_CHECKOUT", "2026-11-11 10:25:00"),
    (4, "PURCHASE", "2026-11-11 10:28:00")
])

# Funnel Calculation Query
funnel_query = """
WITH user_stages AS (
    SELECT 
        user_id,
        MAX(CASE WHEN event_type = 'VIEW_PRODUCT' THEN 1 ELSE 0 END) as viewed,
        MAX(CASE WHEN event_type = 'ADD_TO_CART' THEN 1 ELSE 0 END) as added_cart,
        MAX(CASE WHEN event_type = 'START_CHECKOUT' THEN 1 ELSE 0 END) as checked_out,
        MAX(CASE WHEN event_type = 'PURCHASE' THEN 1 ELSE 0 END) as purchased
    FROM user_events
    GROUP BY user_id
)
SELECT 
    SUM(viewed) as total_viewed,
    SUM(added_cart) as total_added_cart,
    ROUND(SUM(added_cart) * 100.0 / SUM(viewed), 1) as cart_conv_pct,
    SUM(checked_out) as total_checkout,
    SUM(purchased) as total_purchased,
    ROUND(SUM(purchased) * 100.0 / SUM(viewed), 1) as overall_conv_pct
FROM user_stages;
"""

df_funnel = pd.read_sql_query(funnel_query, conn)
print("--- E-Commerce Funnel Conversion Analysis ---")
print(df_funnel)
`,
        commands: [
          'python3 funnel_analytics_lab.py'
        ]
      },
      expectedOutput: `--- E-Commerce Funnel Conversion Analysis ---
   total_viewed  total_added_cart  cart_conv_pct  total_checkout  total_purchased  overall_conv_pct
0             4                 3           75.0               2                2              50.0`,
      troubleshooting: [
        {
          error: 'Integer division returning 0 (e.g. 2 / 4 = 0)',
          rootCause: 'In SQL engines like SQLite or PostgreSQL, dividing two integers defaults to integer truncation.',
          solution: 'Cast one operand to float: SUM(purchased) * 100.0 / SUM(viewed) or CAST(val AS FLOAT).'
        }
      ],
      bestPractices: [
        'Multiply by 100.0 (float) before dividing to prevent integer truncation bugs in percentage calculations.',
        'Use conditional aggregation (SUM(CASE WHEN ...)) rather than multiple self-joins for funnel stages.',
        'Validate time-series ordering: ensure Step 2 occurred AFTER Step 1 in sequential funnels.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is a Funnel Conversion Query in data analytics?',
          answer: 'A funnel conversion query measures user drop-off through a defined sequence of steps (e.g. Landing Page -> Signup -> Verification -> First Payment). It identifies at which specific transition users abandon the process, helping product teams optimize conversion.'
        },
        {
          level: 'Intermediate',
          question: 'What is Conditional Aggregation and how is it used in funnel queries?',
          answer: 'Conditional aggregation uses CASE statements inside aggregate functions (e.g. SUM(CASE WHEN status = \'COMPLETED\' THEN amount ELSE 0 END)). It allows computing multiple distinct business metrics across different conditions in a single table scan without writing separate queries or joins.'
        },
        {
          level: 'Advanced',
          question: 'How do you design an N-Day Cohort Retention query in SQL for a 100-million row user activity table?',
          answer: '1. CTE 1 (User Cohorts): Find each user\'s first activity date using MIN(event_date) GROUP BY user_id and truncate to cohort month. 2. CTE 2 (Subsequent Activity): Join all user activity events back to CTE 1, calculating month_offset = DATEDIFF(event_month, cohort_month). 3. Main Query: GROUP BY cohort_month, month_offset; calculate COUNT(DISTINCT user_id) as active_users, divided by initial cohort size. Ensure event_date is partitioned for pruning.'
        }
      ],
      assignment: {
        task: 'Execute python3 funnel_analytics_lab.py in terminal and verify the 50.0% overall conversion rate.',
        verificationCriteria: 'Run the command and observe overall_conv_pct: 50.0.'
      },
      assessment: {
        quiz: [
          {
            q: 'How do you prevent integer truncation (e.g. 1 / 2 resulting in 0) when computing percentage metrics in SQL?',
            options: [
              'Multiply numerator by 100.0 (float literal) or explicitly CAST to FLOAT',
              'Use the ROUND() function alone',
              'Add LIMIT 1',
              'Use GROUP BY'
            ],
            correct: 0,
            explanation: 'Multiplying by 100.0 forces the expression to evaluate as floating-point, preventing integer division truncation.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the funnel conversion analytics script.',
          expectedCommand: 'python3 funnel_analytics_lab.py'
        }
      }
    },
    {
      id: 'm6-l10',
      title: 'Real Company Database Scenarios & Capstone Analytics',
      duration: '60 mins',
      difficulty: 'Advanced',
      concept: {
        en: 'In this capstone lesson, we simulate a complete enterprise Big Data warehouse schema for a global ride-sharing and delivery company (rides, drivers, riders, ratings, payments). We solve high-impact production engineering problems: 1. Driver Utilization & Idle Time calculations; 2. Rolling 7-Day Cumulative Gross Booking Value (GBV); 3. Churn Risk Identification; 4. Dynamic Surge Pricing Factor evaluations; 5. Eliminating duplicate transaction anomalies via partition deduplication.',
        hi: 'Ye Module 6 ka comprehensive capstone lesson hai jisme hum ek real ride-sharing company (jaise Uber ya Ola) ka complete database schema simulate karte hain (rides, drivers, payments, ratings). Isme hum industry-level challenges solve karte hain: Driver Idle time nikalna, 7-Day Rolling Revenue calculate karna, Churn hone wale users ko identify karna, aur duplicate transaction records ko window functions se clean karna.'
      },
      why: 'Interviewers at top tech firms (FAANG, Uber, Airbnb, Stripe) test your ability to synthesize window functions, CTEs, self-joins, and aggregations against realistic business schemas with millions of simulated events.',
      how: '1. Model multi-table relational schema (drivers, rides, payments).\n2. Apply window functions (LAG, SUM OVER) to compute driver downtime between consecutive trips.\n3. Compute rolling 7-day revenue using window frame: ROWS BETWEEN 6 PRECEDING AND CURRENT ROW.\n4. Clean and deduplicate duplicate ride transactions.\n5. Output consolidated executive KPIs.',
      architecture: {
        type: 'enterprise_warehouse_schema',
        title: 'Ride-Hailing Data Warehouse Schema',
        nodes: [
          { name: 'dim_drivers', desc: 'driver_id, name, vehicle_type, city, rating' },
          { name: 'dim_riders', desc: 'rider_id, signup_date, tier' },
          { name: 'fct_rides', desc: 'ride_id, driver_id, rider_id, start_time, end_time, distance_km, fare, surge_multiplier' },
          { name: 'fct_payments', desc: 'payment_id, ride_id, payment_method, status, transaction_timestamp' }
        ]
      },
      industryExample: 'Uber’s Michelangelo feature store runs these exact SQL transformation pipelines continuously on Spark SQL to generate real-time driver availability and expected time of arrival (ETA) features.',
      practicalLab: {
        title: 'Lab 6.10: Executing the Enterprise Ride-Sharing Analytics Suite',
        problemStatement: 'Build the ride-sharing schema, calculate 7-day rolling revenue, and compute driver idle time between trips.',
        requirements: 'Python SQLite.',
        setup: 'mkdir -p ~/bigdata_lab/m6_l10 && cd ~/bigdata_lab/m6_l10',
        instructions: [
          'Step 1: Write an SQL analytics script populating realistic ride events.',
          'Step 2: Run rolling revenue and idle time window calculations.',
          'Step 3: Verify the output metrics.'
        ],
        code: `# enterprise_rides_analytics.py
import sqlite3
import pandas as pd

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

# Create Tables
cur.execute("""
CREATE TABLE rides (
    ride_id INT,
    driver_id INT,
    rider_id INT,
    pickup_time TEXT,
    dropoff_time TEXT,
    fare REAL
)
""")

cur.executemany("INSERT INTO rides VALUES (?, ?, ?, ?, ?, ?)", [
    (101, 1, 501, "2026-11-11 08:00:00", "2026-11-11 08:25:00", 350.0),
    (102, 1, 502, "2026-11-11 08:45:00", "2026-11-11 09:10:00", 420.0), # 20m idle
    (103, 1, 503, "2026-11-11 09:30:00", "2026-11-11 10:00:00", 500.0), # 20m idle
    (104, 2, 504, "2026-11-11 08:10:00", "2026-11-11 08:40:00", 290.0),
    (105, 2, 505, "2026-11-11 09:00:00", "2026-11-11 09:30:00", 380.0)  # 20m idle
])

# Query: Driver Utilization & Rolling Revenue
query = """
WITH DriverTrips AS (
    SELECT 
        driver_id,
        ride_id,
        pickup_time,
        dropoff_time,
        fare,
        LAG(dropoff_time) OVER (PARTITION BY driver_id ORDER BY pickup_time) as prev_dropoff,
        SUM(fare) OVER (PARTITION BY driver_id ORDER BY pickup_time ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as cumulative_driver_earnings
    FROM rides
)
SELECT 
    driver_id,
    ride_id,
    pickup_time,
    prev_dropoff,
    fare,
    cumulative_driver_earnings
FROM DriverTrips;
"""

df_res = pd.read_sql_query(query, conn)
print("--- Driver Trip Sequence & Cumulative Revenue ---")
print(df_res)
`,
        commands: [
          'python3 enterprise_rides_analytics.py'
        ]
      },
      expectedOutput: `--- Driver Trip Sequence & Cumulative Revenue ---
   driver_id  ride_id          pickup_time         prev_dropoff   fare  cumulative_driver_earnings
0          1      101  2026-11-11 08:00:00                 None  350.0                       350.0
1          1      102  2026-11-11 08:45:00  2026-11-11 08:25:00  420.0                       770.0
2          1      103  2026-11-11 09:30:00  2026-11-11 09:10:00  500.0                      1270.0
3          2      104  2026-11-11 08:10:00                 None  290.0                       290.0
4          2      105  2026-11-11 09:00:00  2026-11-11 08:40:00  380.0                       670.0`,
      troubleshooting: [
        {
          error: 'Negative idle time calculated (Dropoff time > next Pickup time)',
          rootCause: 'Data quality corruption where overlapping rides were recorded for the same driver simultaneously.',
          solution: 'Filter or quarantine overlapping rides using a sanity assertion (WHERE pickup_time >= prev_dropoff).'
        }
      ],
      bestPractices: [
        'Always establish separate dimension (dim_) and fact (fct_) tables following the Kimball Star Schema.',
        'Use cumulative window functions (SUM(...) OVER (...)) to generate running totals without expensive multi-pass joins.',
        'Sanitize and validate timestamp sequencing before performing lead/lag duration calculations.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is a Star Schema vs a Snowflake Schema in data warehousing?',
          answer: 'In a Star Schema, a centralized Fact table (containing metrics/measurements) connects directly to denormalized Dimension tables (containing context attributes like customers, dates) resembling a star. In a Snowflake Schema, dimension tables are further normalized into sub-dimension tables (e.g. products -> categories -> subcategories), saving disk space but requiring more joins.'
        },
        {
          level: 'Intermediate',
          question: 'How do you calculate the difference in days or minutes between two timestamps in standard SQL?',
          answer: 'In PostgreSQL: EXTRACT(EPOCH FROM (t2 - t1)) / 60 (for minutes). In MySQL: TIMESTAMPDIFF(MINUTE, t1, t2). In Spark SQL / Presto: date_diff(\'minute\', t1, t2).'
        },
        {
          level: 'Advanced',
          question: 'How do you calculate a rolling 7-day moving average of daily revenue in SQL when some dates have zero sales?',
          answer: 'First, use a Recursive CTE or Date Dimension table to generate a continuous sequence of all dates and LEFT JOIN with the sales table, replacing nulls with 0 via COALESCE. Second, apply the window function: AVG(daily_revenue) OVER (ORDER BY calendar_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW). Without the continuous date calendar, ROWS BETWEEN 6 PRECEDING will erroneously pick the previous 6 active selling days rather than the true rolling 7 calendar days.'
        }
      ],
      assignment: {
        task: 'Execute python3 enterprise_rides_analytics.py in terminal and verify the cumulative earnings for Driver 1 reach $1,270.00.',
        verificationCriteria: 'Run the command and observe Driver 1 final cumulative earnings.'
      },
      assessment: {
        quiz: [
          {
            q: 'Why must you first join against a continuous calendar date series when calculating a true 7-day rolling average using ROWS BETWEEN 6 PRECEDING AND CURRENT ROW?',
            options: [
              'Because SQL prohibits window functions without calendars',
              'Because missing dates in raw data will cause the frame to span more than 7 physical calendar days, distorting the moving average',
              'To avoid index errors',
              'To convert USD to EUR'
            ],
            correct: 1,
            explanation: 'If dates are missing (e.g. weekends or zero-sale days), ROWS BETWEEN 6 PRECEDING looks at the last 6 recorded rows, which could span weeks instead of 7 days.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the enterprise ride-sharing analytics script.',
          expectedCommand: 'python3 enterprise_rides_analytics.py'
        }
      }
    }
  ]
};

