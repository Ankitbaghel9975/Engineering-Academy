// Module 5: Python for Data Engineering
export const module5 = {
  id: 'mod-5',
  title: 'Module 5: Python for Data Engineering',
  description: 'Master enterprise Python, data structures, OOP, Pandas, NumPy, JSON/CSV streams, database connections, logging, and production ETL pipelines.',
  badge: 'Language Core',
  icon: 'Code2',
  lessons: [
    {
      id: 'm5-l1',
      title: 'Python Fundamentals for Data Engineers',
      duration: '45 mins',
      difficulty: 'Beginner',
      concept: {
        en: 'Python is the lingua franca of modern Data Engineering and Data Science. It is an interpreted, high-level, dynamically typed language with an extensive ecosystem of data processing libraries. For data engineers, Python serves three essential roles: writing pipeline transformation logic, authoring Apache Airflow DAGs, and writing PySpark scripts. Core fundamentals include variable types (int, float, str, bool), type casting, string manipulation (f-strings, stripping whitespace), conditionals, and memory-efficient iterators.',
        hi: 'Python aaj ke time me Data Engineering ki sabse popular aur essential language hai. Ye high-level, dynamic language hai jo Apache Spark (PySpark), Apache Airflow DAGs, aur custom ETL scripts likhne ke kaam aati hai. Data Engineer ke roop me aapko basic variables, type conversion, f-strings, conditional logic, aur memory-efficient loops samajhna zaroori hota hai taaki aap gigabytes data ko fast clean kar sakein.'
      },
      why: 'While Java and Scala power low-level Hadoop/Spark internals, 80%+ of real-world data pipelines and orchestration DAGs are written in Python due to its rapid development speed, readability, and rich ecosystem (Pandas, Polars, PySpark, Requests, SQLAlchemy).',
      how: '1. Variables & Dynamic Typing: Python determines types at runtime; in data engineering, explicit type validation is critical.\n2. String Sanitization: Raw ingestion fields require .strip(), .lower(), .replace() to remove dirty whitespace.\n3. List & Dict Comprehensions: Fast, Pythonic, vectorized-style in-memory transformations.\n4. Generators (yield): Yielding one record at a time avoids loading 10 million rows into RAM simultaneously.',
      architecture: {
        type: 'python_etl_role',
        title: 'Python in the Big Data Ecosystem',
        nodes: [
          { name: 'Airflow Orchestration', desc: 'Python DAGs defining task dependencies, retries, and SLA alerts' },
          { name: 'PySpark Ingestion', desc: 'Python API wrapping JVM Spark for distributed parallel processing' },
          { name: 'ETL Microservices', desc: 'FastAPI / Scripts streaming data between APIs, Kafka, and Databases' },
          { name: 'Data Validation', desc: 'Great Expectations & Pydantic verifying data schema contracts' }
        ]
      },
      industryExample: 'At Spotify, over 20,000 daily Airflow tasks and Luigi workflows are written in pure Python to compute daily artist royalty payouts and user playlist recommendations.',
      practicalLab: {
        title: 'Lab 5.1: Writing Clean, Memory-Efficient Python Transformations',
        problemStatement: 'Write a Python script that sanitizes dirty user inputs, extracts domains, and generates typed records.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m5_l1 && cd ~/bigdata_lab/m5_l1',
        instructions: [
          'Step 1: Write a Python data cleaning script.',
          'Step 2: Run the script using python3.',
          'Step 3: Verify the output records.'
        ],
        code: `# python_fundamentals.py
raw_records = [
    "  101, JOHN DOE , john.doe@example.com , 45000 ",
    " 102, ALICE SMITH,alice.smith@corp.org, 62000",
    "103, BOB BROWN , bob@test.net , 51000"
]

def clean_record(row):
    emp_id, name, email, salary = [x.strip() for x in row.split(',')]
    return {
        "emp_id": int(emp_id),
        "name": name.title(),
        "email": email.lower(),
        "domain": email.split('@')[-1].lower(),
        "salary": float(salary)
    }

cleaned = [clean_record(r) for r in raw_records]
for c in cleaned:
    print(f"ID: {c['emp_id']} | Name: {c['name']:<12} | Domain: {c['domain']:<12} | Salary: \${c['salary']:,.2f}")
`,
        commands: [
          'python3 python_fundamentals.py'
        ]
      },
      expectedOutput: `ID: 101 | Name: John Doe     | Domain: example.com | Salary: $45,000.00
ID: 102 | Name: Alice Smith  | Domain: corp.org    | Salary: $62,000.00
ID: 103 | Name: Bob Brown    | Domain: test.net    | Salary: $51,000.00`,
      troubleshooting: [
        {
          error: 'ValueError: invalid literal for int() with base 10: \'\'',
          rootCause: 'Attempting to cast an empty string or null record to an integer.',
          solution: 'Always validate or clean before casting: int(val) if val.strip().isdigit() else None.'
        }
      ],
      bestPractices: [
        'Use f-strings (f"Value: {x}") instead of legacy % formatting or string concatenation (+).',
        'Use type hints (def clean(x: str) -> dict:) to make data transformation code self-documenting.',
        'Use generator expressions instead of massive lists when processing millions of rows sequentially.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the difference between a List and a Generator in Python?',
          answer: 'A List evaluates and stores all elements in memory (RAM) simultaneously. A Generator computes elements on demand (lazily) using the yield keyword, storing only one item in memory at a time. For Big Data processing, generators prevent Out-Of-Memory (OOM) crashes when reading large files.'
        },
        {
          level: 'Intermediate',
          question: 'What is the Global Interpreter Lock (GIL) in CPython and how does it affect Data Engineering?',
          answer: 'The GIL is a mutex in CPython that prevents multiple native OS threads from executing Python bytecodes simultaneously. It limits multi-threaded CPU-bound tasks in pure Python. However, for Data Engineering, high-performance libraries like NumPy, Pandas, and PySpark bypass the GIL by executing heavy computations in optimized C/C++ or offloading to distributed JVM executors.'
        },
        {
          level: 'Advanced',
          question: 'How do you optimize memory consumption when processing a 10 GB file using standard Python?',
          answer: 'Instead of using file.readlines() (which loads all 10 GB into memory), iterate through the file object directly: with open("data.csv") as f: for line in f:. The file object is an iterator yielding one line at a time, keeping RAM consumption under a few megabytes regardless of file size.'
        }
      ],
      assignment: {
        task: 'Execute python3 python_fundamentals.py in terminal and verify the sanitized records.',
        verificationCriteria: 'Run the command and verify 3 formatted output records.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which technique reads a 5 GB text file line by line with minimal memory consumption in Python?',
            options: [
              'lines = f.readlines()',
              'content = f.read()',
              'for line in f: (Streaming iterator)',
              'data = list(f)'
            ],
            correct: 2,
            explanation: 'Iterating directly over the open file object streams one line at a time, keeping RAM footprint near zero.'
          }
        ],
        commandChallenge: {
          prompt: 'Run the Python fundamentals data cleaning script.',
          expectedCommand: 'python3 python_fundamentals.py'
        }
      }
    },
    {
      id: 'm5-l2',
      title: 'Data Structures for Engineering (Lists, Dicts, Sets, Tuples)',
      duration: '45 mins',
      difficulty: 'Beginner',
      concept: {
        en: 'Choosing the correct data structure directly impacts pipeline execution time from milliseconds to hours. In Python:\n- Lists: Ordered, mutable sequences; optimal for appending, but checking item in list is O(N) slow.\n- Sets: Unordered collections of unique elements backed by hash tables; checking item in set is O(1) instantaneous; ideal for deduplication and lookup filters.\n- Dictionaries (Dicts): Key-Value pairs with O(1) lookup, insertion, and deletion; optimal for lookup caches, dimension mapping, and JSON records.\n- Tuples: Ordered, immutable sequences; faster than lists and hashable (can be used as dictionary keys).',
        hi: 'Sahi data structure chunna ek pipeline ko 100 guna fast bana sakta hai:\n- List: Ordered hoti hai, naye items jodna aasan hai, lekin kisi element ko dhoondna O(N) slow hota hai.\n- Set: Sirf unique items rakhta hai, aur isme search O(1) super-fast hota hai — duplicate records hatane aur lookup filter lagane ke liye best hai.\n- Dict: Key-Value pairs hote hain, O(1) speed hoti hai — JSON records aur reference tables ke liye ideal hai.\n- Tuple: Immutable (change na hone wali) list hoti hai jo memory kam leti hai aur safe hoti hai.'
      },
      why: 'Checking whether a customer ID exists in a 1,000,000-element list inside a loop takes 45 minutes (O(N^2) complexity). Converting the list to a set drops execution time to 0.2 seconds (O(N) complexity).',
      how: '1. Fast Deduplication: unique_ids = set(raw_ids)\n2. O(1) Lookup Filter: valid_codes = {"US", "IN", "UK", "CA"}; filtered = [r for r in records if r["country"] in valid_codes]\n3. Grouping: collections.defaultdict(list) for grouping records by key.\n4. Fixed Schemas: collections.namedtuple or typing.NamedTuple for lightweight, type-safe row representations.',
      architecture: {
        type: 'big_o_lookup_comparison',
        title: 'Time Complexity: List vs Set/Dict Lookup',
        nodes: [
          { name: 'List: [item in list]', desc: 'O(N) Linear Scan - 1M items = 1,000,000 comparisons' },
          { name: 'Set / Dict: [item in set]', desc: 'O(1) Hash Table Lookup - 1M items = 1 comparison (~10 nanoseconds)' },
          { name: 'Pipeline Impact', desc: 'Converting lookup tables to Sets/Dicts eliminates 99.9% of CPU time' }
        ]
      },
      industryExample: 'Fraud detection pipelines at PayPal load blacklisted account hashes into Python hash sets (O(1) lookup), evaluating millions of transaction authorization requests in under 2 milliseconds.',
      practicalLab: {
        title: 'Lab 5.2: Optimizing Lookups and Deduplication with Sets and Dicts',
        problemStatement: 'Deduplicate a list of 100,000 simulated transaction IDs and perform O(1) blacklist filtering.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m5_l2 && cd ~/bigdata_lab/m5_l2',
        instructions: [
          'Step 1: Write a benchmark comparing List search vs Set search.',
          'Step 2: Run the script and observe execution timing.'
        ],
        code: `# data_structures_lab.py
import time

blacklist_list = [f"usr_{i}" for i in range(20000)]
blacklist_set = set(blacklist_list)

test_user = "usr_19999"

# Benchmark List O(N)
start = time.perf_counter()
found_in_list = test_user in blacklist_list
t_list = time.perf_counter() - start

# Benchmark Set O(1)
start = time.perf_counter()
found_in_set = test_user in blacklist_set
t_set = time.perf_counter() - start

print(f"List search time: {t_list*1000:.4f} ms")
print(f"Set search time:  {t_set*1000:.4f} ms")
print(f"Speedup factor:   {t_list / t_set:.1f}x faster!")
`,
        commands: [
          'python3 data_structures_lab.py'
        ]
      },
      expectedOutput: `List search time: 0.3200 ms
Set search time:  0.0008 ms
Speedup factor:   400.0x faster!`,
      troubleshooting: [
        {
          error: 'TypeError: unhashable type: \'dict\' when adding to set',
          rootCause: 'Dictionaries and lists are mutable and cannot be placed directly into Python sets or used as dictionary keys.',
          solution: 'Convert dictionaries to json.dumps(d, sort_keys=True) or convert lists to tuples: tuple(my_list).'
        }
      ],
      bestPractices: [
        'Always convert reference lookup tables to a set or dict before filtering large data streams.',
        'Use collections.defaultdict to avoid repetitive if key not in d: d[key] = [] boilerplate.',
        'Use NamedTuples or dataclasses instead of generic dictionaries when data structure fields are fixed.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the time complexity of checking if an element exists in a Python List vs a Python Set?',
          answer: 'In a List, checking "x in list" is O(N) linear time because it performs a sequential scan from the first element to the last. In a Set, checking "x in set" is O(1) constant time on average because it uses a hash table lookup.'
        },
        {
          level: 'Intermediate',
          question: 'What is the difference between a Shallow Copy and a Deep Copy in Python data pipelines?',
          answer: 'A shallow copy (copy.copy() or list.copy()) creates a new outer collection, but populates it with references to the original nested objects. If a nested dictionary is modified in the copied list, the original is modified too. A deep copy (copy.deepcopy()) recursively clones all objects and nested structures, ensuring total isolation.'
        },
        {
          level: 'Advanced',
          question: 'How does Python implement hash collision resolution in dictionaries and sets?',
          answer: 'Python dictionaries and sets use Open Addressing with Perturbation (random probing). When two keys produce the same hash bucket, Python uses a pseudo-random probe sequence: j = ((5*j) + 1 + perturb) & mask. Starting in Python 3.6+, dictionaries are also insertion-ordered by maintaining a compact sparse index array pointing to a dense key-value array.'
        }
      ],
      assignment: {
        task: 'Execute python3 data_structures_lab.py in terminal and verify the 100x+ speedup of Sets over Lists.',
        verificationCriteria: 'Run the command and observe the speedup factor.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which data structure should you use to filter 10 million streaming events against 50,000 blacklisted merchant IDs for fastest performance?',
            options: ['Python List', 'Python Set', 'Array of Strings', 'Linked List'],
            correct: 1,
            explanation: 'Python Set provides O(1) constant-time hash lookups, making it orders of magnitude faster than a linear list scan.'
          }
        ],
        commandChallenge: {
          prompt: 'Run the data structures benchmark script.',
          expectedCommand: 'python3 data_structures_lab.py'
        }
      }
    },
    {
      id: 'm5-l3',
      title: 'Functions & Functional Programming (lambda, map, filter)',
      duration: '40 mins',
      difficulty: 'Beginner',
      concept: {
        en: 'Functions in Python are first-class citizens: they can be passed as arguments, returned from other functions, and assigned to variables. In Data Engineering, functional programming paradigms (stateless functions, immutability, pure functions) form the exact intellectual foundation of distributed frameworks like Apache Spark and MapReduce. Key concepts include def functions, *args and **kwargs for flexible configuration, anonymous lambda functions, map(), filter(), and functools.reduce().',
        hi: 'Python me functions ko first-class citizens mana jaata hai — matlab function ko variable ki tarah pass kiya ja sakta hai. Data Engineering me "Functional Programming" ka bohot bada role hai kyunki yahi principle Apache Spark aur MapReduce me use hota hai (Map aur Reduce functions). Pure functions (jo bina side effects ke hamesha same input par same output dete hain) distributed systems me failover aur parallel computing ko asaan banate hain.'
      },
      why: 'Distributed frameworks like PySpark require you to pass transformation logic as functions into .map(), .filter(), and .reduceByKey(). Writing pure, stateless functions prevents race conditions and makes pipelines trivially testable.',
      how: '1. Pure Function: def add_tax(price: float, rate: float = 0.18) -> float: return round(price * (1 + rate), 2)\n2. Lambda: square = lambda x: x ** 2\n3. Map: mapped = list(map(lambda row: clean_string(row), raw_data))\n4. Filter: high_val = list(filter(lambda x: x["amount"] > 1000, transactions))\n5. Decorators: @retry or @timer to wrap ETL functions with execution monitoring and automated retries.',
      architecture: {
        type: 'map_filter_reduce_flow',
        title: 'Functional Data Pipeline Transformation',
        nodes: [
          { name: 'Raw Input Stream', desc: 'List of raw transaction dictionaries' },
          { name: 'filter(is_valid)', desc: 'Drops null or fraudulent records' },
          { name: 'map(normalize_currency)', desc: 'Converts USD/EUR to INR base rate' },
          { name: 'reduce(aggregate_total)', desc: 'Computes total gross volume' }
        ]
      },
      industryExample: 'Data engineers at Netflix write custom Python decorators (@log_duration, @alert_on_failure) that automatically track job latencies and push metrics to Grafana/Prometheus.',
      practicalLab: {
        title: 'Lab 5.3: Applying Map, Filter, and Custom Decorators',
        problemStatement: 'Build a functional data cleaning pipeline with an execution timing decorator.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m5_l3 && cd ~/bigdata_lab/m5_l3',
        instructions: [
          'Step 1: Write a functional pipeline script with a decorator.',
          'Step 2: Run using python3.',
          'Step 3: Verify filtered and mapped outputs.'
        ],
        code: `# functional_pipeline.py
import time
from functools import reduce

def timeit(func):
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"[{func.__name__}] executed in {elapsed*1000:.3f} ms")
        return result
    return wrapper

orders = [
    {"order_id": 1, "status": "COMPLETED", "amount": 250},
    {"order_id": 2, "status": "CANCELLED", "amount": 100},
    {"order_id": 3, "status": "COMPLETED", "amount": 450},
    {"order_id": 4, "status": "COMPLETED", "amount": 800},
]

@timeit
def process_orders(data):
    # 1. Filter: Keep only COMPLETED
    completed = filter(lambda x: x["status"] == "COMPLETED", data)
    # 2. Map: Extract amounts
    amounts = map(lambda x: x["amount"], completed)
    # 3. Reduce: Sum amounts
    total = reduce(lambda acc, val: acc + val, amounts, 0)
    return total

total_sales = process_orders(orders)
print(f"Total Completed Sales: \${total_sales}")
`,
        commands: [
          'python3 functional_pipeline.py'
        ]
      },
      expectedOutput: `[process_orders] executed in 0.050 ms
Total Completed Sales: $1500`,
      troubleshooting: [
        {
          error: 'TypeError: reduce() of empty iterable with no initial value',
          rootCause: 'All elements were filtered out, leaving an empty iterable without an initializer in functools.reduce.',
          solution: 'Always supply an explicit initializer to reduce: reduce(..., iterable, 0).'
        }
      ],
      bestPractices: [
        'Always make ETL transformation functions "Pure Functions" (no global variable mutations).',
        'Use List Comprehensions instead of map() and filter() in pure Python when readability is preferred.',
        'Use functools.wraps inside decorators to preserve docstrings and function names for logging.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is a Lambda function in Python?',
          answer: 'A lambda function is an anonymous, inline function defined without a name using the lambda keyword. It can take any number of arguments, but can only evaluate a single expression: lambda x, y: x + y.'
        },
        {
          level: 'Intermediate',
          question: 'What is a Pure Function and why is it preferred in Big Data pipelines?',
          answer: 'A pure function has two properties: 1. Given the same inputs, it always returns the exact same output. 2. It has no side effects (does not mutate global variables, modify arguments, or write to external state). Pure functions are preferred in distributed computing (Spark) because tasks can be safely retried or executed in parallel across 100 nodes without concurrency bugs.'
        },
        {
          level: 'Advanced',
          question: 'How does a Python Decorator work under the hood?',
          answer: 'A decorator is a callable (function or class) that takes another function as an argument and extends its behavior without modifying its source code. In Python, @my_decorator above def func(): is syntactic sugar for func = my_decorator(func). It typically returns an inner wrapper function that wraps the original call with pre- and post-processing logic.'
        }
      ],
      assignment: {
        task: 'Execute python3 functional_pipeline.py in terminal and verify the filtered sales aggregation.',
        verificationCriteria: 'Run the command and observe Total Completed Sales: $1500.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which functional programming tool combines all items in an iterable pairwise using an accumulator to produce a single value?',
            options: ['map()', 'filter()', 'functools.reduce()', 'zip()'],
            correct: 2,
            explanation: 'reduce() repeatedly applies a two-argument function to elements of an iterable to reduce it to a single cumulative result.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the functional pipeline script.',
          expectedCommand: 'python3 functional_pipeline.py'
        }
      }
    },
    {
      id: 'm5-l4',
      title: 'Object-Oriented Programming (OOP) for Data Pipelines',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'Object-Oriented Programming (OOP) in Data Engineering provides modularity, code reuse, and encapsulation for complex pipeline architectures. Instead of writing monolithic 2,000-line scripts, senior engineers encapsulate ingestion, validation, and loading into cohesive classes: an abstract BaseConnector class, PostgresConnector, S3Connector, and KafkaConnector. Core OOP principles include Classes, __init__ constructors, Inheritance, Encapsulation, Polymorphism, and Abstract Base Classes (abc.ABC).',
        hi: 'OOP (Object-Oriented Programming) ka use enterprise level data pipelines ko modular aur clean banane ke liye kiya jaata hai. Agar aap 2,000 line ka ek ganda script likhoge toh kal ko database change hone par sab toot jayega. OOP me hum classes banate hain — jaise ek BaseConnector class, aur usse inherit karke PostgresConnector ya S3Connector. Isse code reuse hota hai, testing aasan hoti hai, aur enterprise design patterns follow hote hain.'
      },
      why: 'When an enterprise migrates from on-premise HDFS to AWS S3, a well-architected OOP codebase only requires writing a new S3Writer class implementing the standard BaseWriter interface, leaving upstream business transformation logic 100% untouched.',
      how: '1. Class Definition: class DataExtractor: ...\n2. Constructor: def __init__(self, connection_string: str): self._conn = connection_string\n3. Inheritance: class PostgresExtractor(DataExtractor): ...\n4. Abstract Base Class: from abc import ABC, abstractmethod\n5. Context Managers: __enter__ and __exit__ methods to automatically manage connection pooling and socket closing.',
      architecture: {
        type: 'oop_pipeline_class_diagram',
        title: 'Enterprise Pipeline OOP Hierarchy',
        nodes: [
          { name: 'BasePipeline (Abstract)', desc: 'extract(), transform(), load() abstract contract' },
          { name: 'CustomerETL(BasePipeline)', desc: 'Implements CSV extract, customer hash transform, Postgres load' },
          { name: 'TelemetryETL(BasePipeline)', desc: 'Implements Kafka extract, JSON sanitize, S3 Parquet load' },
          { name: 'PipelineRunner', desc: 'Executes any BasePipeline polymorphically' }
        ]
      },
      industryExample: 'Apache Airflow and dbt (data build tool) internals are designed entirely using Python OOP inheritance, where BaseOperator and DbAdapter provide common hooks for thousands of pluggable plugins.',
      practicalLab: {
        title: 'Lab 5.4: Building an Object-Oriented Pipeline Framework',
        problemStatement: 'Create an abstract BaseETL class and implement a Concrete CSV-to-Metrics ETL class.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m5_l4 && cd ~/bigdata_lab/m5_l4',
        instructions: [
          'Step 1: Write the OOP pipeline script.',
          'Step 2: Run using python3.',
          'Step 3: Verify the extracted and loaded metrics.'
        ],
        code: `# oop_pipeline.py
from abc import ABC, abstractmethod

class BaseETL(ABC):
    def __init__(self, pipeline_name: str):
        self.name = pipeline_name
        self.data = []

    @abstractmethod
    def extract(self):
        pass

    @abstractmethod
    def transform(self):
        pass

    @abstractmethod
    def load(self):
        pass

    def run(self):
        print(f"=== Starting Pipeline: {self.name} ===")
        self.extract()
        self.transform()
        self.load()
        print(f"=== Pipeline {self.name} Finished Successfully ===\\n")

class SalesETL(BaseETL):
    def extract(self):
        print("[Extract] Reading simulated sales records...")
        self.data = [100, 250, 400, 50]

    def transform(self):
        print("[Transform] Applying 10% tax calculation...")
        self.data = [round(x * 1.10, 2) for x in self.data]

    def load(self):
        total = sum(self.data)
        print(f"[Load] Emitting transformed metrics: Total = \${total:,.2f}")

etl = SalesETL("Daily_Sales_Ingestion")
etl.run()
`,
        commands: [
          'python3 oop_pipeline.py'
        ]
      },
      expectedOutput: `=== Starting Pipeline: Daily_Sales_Ingestion ===
[Extract] Reading simulated sales records...
[Transform] Applying 10% tax calculation...
[Load] Emitting transformed metrics: Total = $880.00
=== Pipeline Daily_Sales_Ingestion Finished Successfully ===`,
      troubleshooting: [
        {
          error: 'TypeError: Can\'t instantiate abstract class SalesETL with abstract method load',
          rootCause: 'Subclass failed to implement one of the @abstractmethod methods defined in the parent abstract base class.',
          solution: 'Implement all abstract methods in the child class or remove the @abstractmethod decorator from the parent.'
        }
      ],
      bestPractices: [
        'Use abc.ABC and @abstractmethod to enforce clean interface contracts across engineering teams.',
        'Implement __enter__ and __exit__ on database client classes to guarantee connections are closed safely.',
        'Prefer composition over deep inheritance trees (e.g. inject an Extractor and a Loader into a Pipeline runner).'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the purpose of the __init__ method in a Python class?',
          answer: '__init__ is the constructor method in Python. It is automatically invoked when a new object instance of the class is created, allowing initialization of instance attributes and configurations.'
        },
        {
          level: 'Intermediate',
          question: 'What is an Abstract Base Class (ABC) in Python and why is it used in data engineering?',
          answer: 'An Abstract Base Class (from the abc module) defines an interface or blueprint that subclasses must follow. It prevents direct instantiation of the base class and mandates that subclasses implement all methods decorated with @abstractmethod. In data engineering, it guarantees that any custom database connector implements extract(), transform(), and load().'
        },
        {
          level: 'Advanced',
          question: 'How do Python Context Managers (__enter__ and __exit__) prevent connection leaks in distributed systems?',
          answer: 'When using the "with" statement (e.g. with DatabaseConnection() as db:), Python executes __enter__() to initialize resources and guarantees that __exit__() is called upon exiting the block, even if an unhandled exception or crash occurs. This ensures database sockets, file descriptors, and locks are always released.'
        }
      ],
      assignment: {
        task: 'Execute python3 oop_pipeline.py in terminal and verify the abstract method execution flow.',
        verificationCriteria: 'Run the command and observe the three pipeline phases.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which Python standard library module is used to define Abstract Base Classes and enforce method implementation in subclasses?',
            options: ['dataclasses', 'abc', 'functools', 'typing'],
            correct: 1,
            explanation: 'The abc module (Abstract Base Classes) provides ABC and the @abstractmethod decorator.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the OOP pipeline script.',
          expectedCommand: 'python3 oop_pipeline.py'
        }
      }
    },
    {
      id: 'm5-l5',
      title: 'File Handling & Compression (Text, Gzip, Snappy)',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'Data Engineers spend substantial time reading and writing files across various formats (plain text, CSV, TSV) and compression codecs (gzip, bzip2, snappy, zstd). Uncompressed text files waste disk storage and saturate network bandwidth during cluster transfers. Modern pipelines store data using splittable or high-throughput compression codecs. Python provides native context managers (open()) and compression libraries (gzip, bz2, lzma) to read and stream compressed files transparently.',
        hi: 'Data Engineers roz alag-alag formats (CSV, JSON, Text) aur compression codecs (gzip, bzip2, snappy) ke saath kaam karte hain. Agar aap uncompressed data store karoge toh hard drive turant bhar jayegi aur network par transfer slow ho jayega. Gzip 70-80% space bacha deta hai! Python me built-in open() context manager aur gzip module hota hai jisse aap bina file ko uncompress kiye direct compressed .gz file se data read aur write kar sakte ho.'
      },
      why: 'Storing 100 TB of uncompressed CSV on S3 or HDFS costs thousands of dollars monthly. Compressing to Gzip or Snappy reduces storage to ~25 TB and cuts network transfer times by 75%.',
      how: '1. Safe Context Manager: with open("data.csv", "r", encoding="utf-8") as f:\n2. Streaming Read: for line in f: process(line) (loads 1 line at a time).\n3. Gzip Streaming: import gzip; with gzip.open("data.csv.gz", "rt") as f: for line in f:\n4. Splittability Concept: Gzip is NOT splittable by Hadoop (one Mapper must process the whole file); Bzip2 is splittable; Snappy inside Parquet/ORC is splittable at block boundaries.',
      architecture: {
        type: 'compression_codecs_matrix',
        title: 'Big Data Compression Codec Trade-offs',
        nodes: [
          { name: 'Snappy', desc: 'Moderate compression (50-60%), ultra-fast CPU speed (250 MB/s); industry default for Spark/Parquet' },
          { name: 'Gzip', desc: 'High compression (75-80%), moderate CPU speed; standard for raw cold storage' },
          { name: 'Bzip2', desc: 'Highest compression (85%), slow CPU speed, splittable across Hadoop Mappers' },
          { name: 'ZSTD (Zstandard)', desc: 'Modern high compression + high speed developed by Meta; modern standard' }
        ]
      },
      industryExample: 'AWS Athena and Snowflake recommend storing data in Snappy-compressed Parquet files because Snappy strikes the optimal balance between CPU decompression speed and storage savings.',
      practicalLab: {
        title: 'Lab 5.5: Writing and Reading Gzip-Compressed Streams in Python',
        problemStatement: 'Write 10,000 records to an uncompressed file and a gzip file, compare file sizes, and verify decompression.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m5_l5 && cd ~/bigdata_lab/m5_l5',
        instructions: [
          'Step 1: Write script to generate uncompressed vs gzip data.',
          'Step 2: Run using python3.',
          'Step 3: Compare file sizes using ls -lh.'
        ],
        code: `# compression_lab.py
import gzip, os

# Write uncompressed
with open("dataset.csv", "w") as f:
    f.write("id,transaction_id,amount,timestamp\\n")
    for i in range(10000):
        f.write(f"{i},TXN_{i:08d},499.99,1731315000\\n")

# Write Gzipped
with gzip.open("dataset.csv.gz", "wt") as f:
    f.write("id,transaction_id,amount,timestamp\\n")
    for i in range(10000):
        f.write(f"{i},TXN_{i:08d},499.99,1731315000\\n")

raw_size = os.path.getsize("dataset.csv")
gz_size = os.path.getsize("dataset.csv.gz")

print(f"Uncompressed CSV: {raw_size:,} bytes")
print(f"Gzipped CSV:      {gz_size:,} bytes")
print(f"Storage Saved:    {(1 - gz_size/raw_size)*100:.1f}%")
`,
        commands: [
          'python3 compression_lab.py',
          'ls -lh dataset.csv dataset.csv.gz'
        ]
      },
      expectedOutput: `Uncompressed CSV: 358,890 bytes
Gzipped CSV:      48,120 bytes
Storage Saved:    86.6%
-rw-r--r-- 1 hadoop hadoop 351K Nov 11 15:15 dataset.csv
-rw-r--r-- 1 hadoop hadoop  48K Nov 11 15:15 dataset.csv.gz`,
      troubleshooting: [
        {
          error: 'UnicodeDecodeError: \'utf-8\' codec can\'t decode byte 0x8b in position 1',
          rootCause: 'Attempting to open a binary compressed file (.gz) using standard open() text mode instead of gzip.open().',
          solution: 'Use import gzip and open with gzip.open(filepath, "rt", encoding="utf-8").'
        }
      ],
      bestPractices: [
        'Always use "with" statement context managers when opening files to ensure descriptors are flushed and closed.',
        'Use Snappy compression for intermediate shuffle storage and Parquet columnar formats.',
        'Always specify encoding="utf-8" explicitly to prevent platform-dependent encoding bugs.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'Why should you always open files using a "with open(...) as f:" context manager?',
          answer: 'The "with" statement guarantees that the file descriptor is properly flushed and closed as soon as execution leaves the block, even if an exception or crash occurs. Without it, unclosed files can leak file handles and cause data loss due to unbuffered writes.'
        },
        {
          level: 'Intermediate',
          question: 'What is a "Splittable" compression codec in Hadoop, and is Gzip splittable?',
          answer: 'A splittable codec allows Hadoop to divide a single large compressed file into independent chunks (e.g. 128 MB blocks) and process them in parallel across multiple Mappers. Standard Gzip is NOT splittable because it uses DEFLATE without sync markers; one single Mapper must decompress the entire file from byte 0. Bzip2 and Snappy (inside Parquet/ORC) are splittable.'
        },
        {
          level: 'Advanced',
          question: 'Why is Snappy widely chosen over Gzip for Apache Spark and Parquet despite having lower compression ratio?',
          answer: 'Snappy prioritizes decompression and compression speed (250+ MB/s per core) over maximum compression ratio. In distributed compute (Spark), queries are CPU-bound on deserialization. Decompressing Gzip consumes significant CPU cycles and creates bottlenecks. Snappy allows near-instantaneous decompression, keeping CPUs focused on analytical processing.'
        }
      ],
      assignment: {
        task: 'Execute python3 compression_lab.py in terminal and verify that Gzip saves over 80% storage space.',
        verificationCriteria: 'Run the command and observe the percentage of storage saved.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which compression codec is the industry default for Apache Spark and Apache Parquet due to high CPU decompression speed?',
            options: ['Bzip2', 'Gzip', 'Snappy', 'Zip'],
            correct: 2,
            explanation: 'Snappy offers ultra-fast compression/decompression speeds with low CPU overhead, making it the industry standard for Parquet.'
          }
        ],
        commandChallenge: {
          prompt: 'Run the file compression benchmark script.',
          expectedCommand: 'python3 compression_lab.py'
        }
      }
    },
    {
      id: 'm5-l6',
      title: 'Exception Handling & Resilient Pipelines',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'In production Data Engineering, pipelines must be resilient: network timeouts, malformed JSON rows, missing schema columns, and database locks happen constantly. A pipeline that crashes completely on 1 corrupt row out of 10 million is unacceptable. Robust exception handling uses try, except, else, finally blocks, custom exception classes, and Dead Letter Queues (DLQ). Malformed records are quarantined to an error table while healthy records continue processing without stopping the pipeline.',
        hi: 'Production me roz 1 Crore rows aati hain jisme se 10 rows corrupt ya null ho sakti hain. Agar 1 corrupt row ki wajah se poora 4 ghante ka pipeline crash ho jaye, toh business ka bohot nuksan hota hai. Robust Exception Handling (try, except, finally, aur Dead Letter Queue) ka use karke hum bad records ko alag "quarantine" folder me daal dete hain aur baaki 99.99% healthy records ko bina ruke process hone dete hain.'
      },
      why: 'Enterprise SLAs dictate 99.9% uptime. Automated pipelines must self-heal, retry transient errors (like a 2-second database network blip), and quarantine permanent errors for engineer review.',
      how: '1. Granular Exceptions: Catch specific errors (KeyError, ValueError, requests.exceptions.Timeout) instead of bare except:.\n2. Dead Letter Queue (DLQ): If row parsing fails, route row to dlq_records list with error metadata.\n3. Retry Logic: Use tenacity or exponential backoff loops for external API/database calls.\n4. Custom Exceptions: class SchemaValidationError(Exception): pass\n5. Finally Block: Ensure database cursor and staging connections close regardless of exceptions.',
      architecture: {
        type: 'dlq_quarantine_pattern',
        title: 'Dead Letter Queue (DLQ) Quarantine Flow',
        nodes: [
          { name: 'Raw Inbound Records', desc: 'Continuous stream of mixed valid & corrupted records' },
          { name: 'Validation & Try Block', desc: 'Type cast, schema enforcement, boundary checks' },
          { name: 'Valid Stream -> Warehouse', desc: 'Healthy records committed to production tables' },
          { name: 'Except Block -> DLQ', desc: 'Corrupted records tagged with timestamp & error stack, dumped to /quarantine' }
        ]
      },
      industryExample: 'Stripe\'s payment processing pipelines route failed API webhooks through an exponential backoff retry policy (1s, 2s, 4s, 8s, 16s); if still unpayable, events are deposited in an SQS Dead Letter Queue for analyst inspection.',
      practicalLab: {
        title: 'Lab 5.6: Building an ETL Pipeline with DLQ Quarantine',
        problemStatement: 'Process a dirty batch of transaction rows, isolate corrupt rows into a quarantine list, and calculate clean metrics.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m5_l6 && cd ~/bigdata_lab/m5_l6',
        instructions: [
          'Step 1: Write an ETL script featuring try/except and DLQ quarantine.',
          'Step 2: Run using python3.',
          'Step 3: Verify clean vs quarantined record counts.'
        ],
        code: `# resilient_etl.py
import json

raw_batch = [
    '{"id": 1, "user": "alice", "amount": 250.0}',
    '{"id": 2, "user": "bob", "amount": "INVALID_NUMBER"}',  # Corrupt
    '{"id": 3, "user": "charlie", "amount": 420.5}',
    'MALFORMED_JSON_STRING_HERE',                           # Corrupt
    '{"id": 5, "user": "eve", "amount": 110.0}'
]

clean_records = []
quarantine_dlq = []

for raw in raw_batch:
    try:
        record = json.loads(raw)
        # Validate amount is numeric
        record["amount"] = float(record["amount"])
        clean_records.append(record)
    except (json.JSONDecodeError, ValueError, KeyError) as e:
        quarantine_dlq.append({
            "raw_payload": raw,
            "error_type": type(e).__name__,
            "error_msg": str(e)
        })

print(f"Processed Batch: {len(raw_batch)} records")
print(f"Clean Records Loaded: {len(clean_records)}")
print(f"Quarantined in DLQ:   {len(quarantine_dlq)}")
print("\\n--- Quarantined Records ---")
for bad in quarantine_dlq:
    print(f"Error [{bad['error_type']}]: {bad['raw_payload']}")
`,
        commands: [
          'python3 resilient_etl.py'
        ]
      },
      expectedOutput: `Processed Batch: 5 records
Clean Records Loaded: 3
Quarantined in DLQ:   2

--- Quarantined Records ---
Error [ValueError]: {"id": 2, "user": "bob", "amount": "INVALID_NUMBER"}
Error [JSONDecodeError]: MALFORMED_JSON_STRING_HERE`,
      troubleshooting: [
        {
          error: 'Silent failure: pipeline exits with success 0 but table has 0 rows',
          rootCause: 'Using a bare except: pass which swallowed all fatal exceptions including database connection failures.',
          solution: 'Never use bare except: pass. Always catch specific exceptions, log the stack trace with logging.exception(), and count dropped records.'
        }
      ],
      bestPractices: [
        'Never write a bare "except:" without specifying exception types.',
        'Always route malformed records to a Dead Letter Queue with timestamp and stack trace.',
        'Use exponential backoff retries when calling external REST APIs or database pools.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the purpose of the else and finally blocks in a Python try/except statement?',
          answer: 'The else block runs only if no exception was raised in the try block. The finally block ALWAYS runs regardless of whether an exception occurred, was caught, or was uncaught. It is used to clean up resources like closing database connections or files.'
        },
        {
          level: 'Intermediate',
          question: 'What is a Dead Letter Queue (DLQ) in Big Data engineering?',
          answer: 'A Dead Letter Queue is a dedicated storage destination (Kafka topic, S3 folder, database table) where records that fail validation, serialization, or transformation are routed. Instead of terminating the entire pipeline or dropping the bad data silently, the bad records are saved with error metadata for auditing, bug fixing, and re-processing.'
        },
        {
          level: 'Advanced',
          question: 'Explain Exponential Backoff with Jitter in distributed data pipelines.',
          answer: 'When a downstream service (database, API) is overwhelmed and throwing rate limits (HTTP 429) or timeouts, retrying immediately causes a "thundering herd" problem that crushes the service further. Exponential backoff increases wait times exponentially between retries (2^attempt seconds: 1s, 2s, 4s, 8s). Adding random "Jitter" (random variance) desynchronizes retries across worker nodes, smoothing out traffic spikes.'
        }
      ],
      assignment: {
        task: 'Execute python3 resilient_etl.py in terminal and verify that 3 clean records are loaded and 2 quarantined.',
        verificationCriteria: 'Run the command and observe 3 clean records and 2 quarantined.'
      },
      assessment: {
        quiz: [
          {
            q: 'Why is using a bare "except: pass" considered an anti-pattern in production data engineering?',
            options: [
              'It makes Python run 50% slower',
              'It silently swallows critical system exceptions like KeyboardInterrupt and database disconnections without logging',
              'It violates PEP 8 syntax formatting',
              'It forces the script into an infinite loop'
            ],
            correct: 1,
            explanation: 'Bare except: catches everything, including KeyboardInterrupt and SystemExit, hiding critical bugs and connection drops.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the resilient ETL pipeline script.',
          expectedCommand: 'python3 resilient_etl.py'
        }
      }
    },
    {
      id: 'm5-l7',
      title: 'Modules, Packages & Virtual Environments',
      duration: '40 mins',
      difficulty: 'Beginner',
      concept: {
        en: 'As data engineering codebases grow, code must be organized into modular, reusable packages. A Python module is a single .py file; a Python package is a directory containing modules and an __init__.py file. In production, dependency isolation is mandatory: Apache Airflow might require PySpark 3.4 while another project requires PySpark 3.1. Virtual environments (venv, poetry, conda) isolate library versions per project, preventing catastrophic global package collisions.',
        hi: 'Jab aapka data engineering project bada hota hai, toh saara code ek hi file me nahi rakha ja sakta. Code ko alag-alag modules (files) aur packages (folders with __init__.py) me baanta jaata hai. Sabse zaroori cheez hai "Virtual Environments" (venv). Socho Project A ko Pandas 1.5 chahiye aur Project B ko Pandas 2.0 chahiye. Virtual environment har project ke liye ek alag isolated Python room bana deta hai taaki versions aapas me takrayen nahi.'
      },
      why: 'Upgrading a global Python package on a production edge node can silently break 50 existing production Airflow pipelines. Virtual environments isolate dependencies completely.',
      how: '1. Create Venv: python3 -m venv ~/my_etl_env\n2. Activate: source ~/my_etl_env/bin/activate\n3. Install Dependencies: pip install pandas requests sqlalchemy\n4. Freeze Requirements: pip freeze > requirements.txt\n5. Package Layout:\n   my_package/\n   ├── __init__.py\n   ├── extractors.py\n   └── transformers.py',
      architecture: {
        type: 'virtualenv_isolation',
        title: 'Python Virtual Environment Isolation',
        nodes: [
          { name: 'System Python (/usr/bin/python3)', desc: 'Base OS Python reserved strictly for system utilities' },
          { name: 'Env 1: Airflow Orchestration', desc: 'airflow==2.8.0, pydantic==2.5 (Isolated site-packages)' },
          { name: 'Env 2: PySpark Analytics', desc: 'pyspark==3.5.0, pandas==2.1.0, pyarrow==14.0' },
          { name: 'Isolation Benefit', desc: 'Zero version conflicts, reproducible CI/CD deployments' }
        ]
      },
      industryExample: 'Netflix and Databricks containerize every ETL job inside Docker containers with locked poetry.lock files, ensuring that dev, staging, and production run 100% identical package versions.',
      practicalLab: {
        title: 'Lab 5.7: Creating and Managing a Python Virtual Environment',
        problemStatement: 'Create a virtual environment, inspect active pip packages, and generate a requirements.txt file.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m5_l7 && cd ~/bigdata_lab/m5_l7',
        instructions: [
          'Step 1: Check Python version and pip list.',
          'Step 2: Generate a standard data engineering requirements.txt.',
          'Step 3: Inspect the generated requirements file.'
        ],
        code: `# venv_lab.sh
cat << 'EOF' > requirements.txt
pandas==2.2.0
numpy==1.26.4
requests==2.31.0
sqlalchemy==2.0.25
pyarrow==15.0.0
EOF
cat requirements.txt
pip --version
`,
        commands: [
          'cat requirements.txt',
          'pip --version'
        ]
      },
      expectedOutput: `pandas==2.2.0
numpy==1.26.4
requests==2.31.0
sqlalchemy==2.0.25
pyarrow==15.0.0
pip 24.0 from /usr/lib/python3/dist-packages/pip (python 3.13)`,
      troubleshooting: [
        {
          error: 'ModuleNotFoundError: No module named \'pandas\' after running pip install pandas',
          rootCause: 'pip installed pandas into global system Python, but the script is running inside an activated virtual environment (or vice-versa).',
          solution: 'Always verify which python is executing using which python and invoke pip via python -m pip install pandas.'
        }
      ],
      bestPractices: [
        'Always pin exact dependency versions in requirements.txt (e.g. pandas==2.2.0, not pandas>=2.0).',
        'Never install third-party packages directly into the system OS Python (/usr/bin/python3).',
        'Commit requirements.txt or poetry.lock into Git; never commit the venv folder itself.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is a Python Virtual Environment and why is it essential for data engineers?',
          answer: 'A virtual environment is an isolated directory tree that contains a specific Python installation and a separate set of installed packages. It prevents dependency version conflicts between different projects and ensures that production pipelines run with exact, reproducible library versions.'
        },
        {
          level: 'Intermediate',
          question: 'What is the purpose of the __init__.py file in a Python directory?',
          answer: '__init__.py marks a directory as a Python package, allowing its modules to be imported (e.g. from my_package.extractors import CsvExtractor). It can also be used to expose package-level APIs and execute package initialization code.'
        },
        {
          level: 'Advanced',
          question: 'How do you package Python dependencies for distributed execution on a remote Spark on YARN cluster?',
          answer: 'Because worker nodes may lack installed packages, data engineers package their virtual environment into a zip or tar.gz archive (e.g. using venv-pack or conda-pack) and submit it with the Spark job using the --archives flag: spark-submit --archives my_env.tar.gz#environment --conf spark.yarn.appMasterEnv.PYSPARK_PYTHON=./environment/bin/python.'
        }
      ],
      assignment: {
        task: 'Display the contents of requirements.txt using cat requirements.txt in terminal.',
        verificationCriteria: 'Run cat requirements.txt and verify pinned versions.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which command exports the list of currently installed packages and their exact versions into a file?',
            options: ['pip export', 'pip freeze > requirements.txt', 'python -m packages', 'pip show all'],
            correct: 1,
            explanation: 'pip freeze outputs installed packages in requirements.txt format.'
          }
        ],
        commandChallenge: {
          prompt: 'Display the requirements.txt file.',
          expectedCommand: 'cat requirements.txt'
        }
      }
    },
    {
      id: 'm5-l8',
      title: 'NumPy for Numerical & Vectorized Computing',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'NumPy (Numerical Python) is the foundational scientific computing library underpinning the entire Python data stack (including Pandas, SciPy, and MLlib). Pure Python lists store pointers to individual heap-allocated Python objects (with 28 bytes of metadata per integer), leading to cache misses and slow iteration. NumPy introduces the ndarray: a contiguous block of homogeneous memory stored in raw C data types (int64, float32). Computations execute via SIMD (Single Instruction, Multiple Data) vectorization without Python interpreter overhead, running 50x-100x faster.',
        hi: 'NumPy Python ke har ek data tool (jaise Pandas) ki neev (foundation) hai. Normal Python list me har number ek heavy object hota hai jo RAM me idhar-udhar bikhra hota hai, jisse loop chalane par speed bohot slow ho jaati hai. NumPy "ndarray" provide karta hai jo memory me ek sath contiguous block me raw C numbers store karta hai. Isme bina loop likhe ek sath poore array par math operations (vectorization) chalte hain jo normal Python loop se 50 se 100 guna fast hote hain.'
      },
      why: 'Processing 10 million telemetry sensor measurements using Python for loops takes 12 seconds. Using NumPy vectorized math (arr * 1.5) finishes in 0.08 seconds.',
      how: '1. Array Creation: np.array([1, 2, 3], dtype=np.float64)\\n2. Vectorized Math: arr2 = arr * 1.18 (executes in C without Python loop overhead).\\n3. Boolean Masking: valid_records = arr[arr > 0] (filters in C memory).\\n4. Fast Aggregations: np.mean(), np.sum(), np.percentile() utilizing multi-core CPU SIMD instructions.\\n5. Reshaping: arr.reshape((rows, cols)) without memory copying.',
      architecture: {
        type: 'memory_layout_numpy',
        title: 'Memory Layout: Python List vs NumPy ndarray',
        nodes: [
          { name: 'Python List (Fragmented)', desc: 'Array of pointers -> scattered Python Object headers (28 bytes each) -> cache thrashing' },
          { name: 'NumPy ndarray (Contiguous)', desc: 'Continuous block of raw 8-byte C doubles (CPU L1/L2 cache optimal, SIMD enabled)' },
          { name: 'Vectorization Gain', desc: 'Processes 4 to 8 floating point numbers simultaneously per CPU clock cycle' }
        ]
      },
      industryExample: 'High-frequency trading firms and ad-tech bidding engines use NumPy vectorized matrix computations to evaluate user click-through probabilities in sub-millisecond windows.',
      practicalLab: {
        title: 'Lab 5.8: Benchmarking Vectorized NumPy vs Python Loops',
        problemStatement: 'Benchmark calculating 18% tax across 1,000,000 prices using a standard Python loop versus a NumPy vectorized array.',
        requirements: 'Python 3.x with numpy.',
        setup: 'mkdir -p ~/bigdata_lab/m5_l8 && cd ~/bigdata_lab/m5_l8',
        instructions: [
          'Step 1: Write the benchmark comparison script.',
          'Step 2: Run using python3.',
          'Step 3: Observe the massive speedup factor.'
        ],
        code: `# numpy_bench.py
import time
import numpy as np

N = 1000000
py_prices = [float(i) for i in range(N)]
np_prices = np.array(py_prices, dtype=np.float64)

# 1. Pure Python Loop
start = time.perf_counter()
py_tax = [p * 1.18 for p in py_prices]
t_py = time.perf_counter() - start

# 2. NumPy Vectorized Operation
start = time.perf_counter()
np_tax = np_prices * 1.18
t_np = time.perf_counter() - start

print(f"Python Loop time:     {t_py*1000:.2f} ms")
print(f"NumPy Vectorized time: {t_np*1000:.2f} ms")
print(f"NumPy Speedup:         {t_py / t_np:.1f}x faster!")
`,
        commands: [
          'python3 numpy_bench.py'
        ]
      },
      expectedOutput: `Python Loop time:     85.40 ms
NumPy Vectorized time: 1.85 ms
NumPy Speedup:         46.2x faster!`,
      troubleshooting: [
        {
          error: 'ModuleNotFoundError: No module named \'numpy\'',
          rootCause: 'NumPy is not installed in the active environment.',
          solution: 'Install numpy via pip install numpy.'
        }
      ],
      bestPractices: [
        'Never use Python for loops to iterate over NumPy arrays; always use vectorized operations (arr * 2, np.where()).',
        'Choose appropriate dtypes (np.int32 or np.float32 instead of np.float64) when storing large arrays to cut RAM usage by 50%.',
        'Avoid creating unnecessary intermediate array copies; use in-place operations (arr += 5) when memory is tight.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is Vectorization in NumPy?',
          answer: 'Vectorization is the execution of array operations without explicit Python for loops. The operations are pushed down into compiled C and Fortran code, enabling the CPU to process contiguous memory blocks using hardware SIMD (Single Instruction, Multiple Data) instructions.'
        },
        {
          level: 'Intermediate',
          question: 'What is Broadcasting in NumPy?',
          answer: 'Broadcasting is NumPy\'s mechanism for performing arithmetic operations between arrays of different shapes. Under specific rules (matching trailing dimensions or dimensions of size 1), NumPy stretches or repeats the smaller array across the larger array without making unneeded memory copies.'
        },
        {
          level: 'Advanced',
          question: 'Why does a NumPy array consume significantly less memory than a Python list containing the same numbers?',
          answer: 'A Python list is an array of pointers to full-fledged Python Integer objects. Each integer object has an object header, type pointer, reference count, and value (typically 28 bytes per int on 64-bit systems) plus the 8-byte pointer in the list = 36 bytes. A NumPy ndarray of int64 stores raw contiguous 8-byte integers with a single lightweight array header, consuming over 4x less memory.'
        }
      ],
      assignment: {
        task: 'Execute python3 numpy_bench.py in terminal and verify the 40x+ vectorized calculation speedup.',
        verificationCriteria: 'Run the command and observe the speedup factor.'
      },
      assessment: {
        quiz: [
          {
            q: 'How does NumPy achieve 50x-100x faster performance compared to standard Python loops for numerical math?',
            options: [
              'By running code on remote cloud servers automatically',
              'By storing contiguous C arrays in memory and executing compiled vectorized SIMD operations without Python interpreter overhead',
              'By converting numbers to strings',
              'By disabling OS garbage collection'
            ],
            correct: 1,
            explanation: 'NumPy arrays are contiguous C memory buffers processed via vectorized machine code instructions.'
          }
        ],
        commandChallenge: {
          prompt: 'Run the NumPy benchmarking script.',
          expectedCommand: 'python3 numpy_bench.py'
        }
      }
    },
    {
      id: 'm5-l9',
      title: 'Pandas for Data Manipulation & Cleaning',
      duration: '50 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'Pandas is the premier data manipulation and analysis library in Python. It provides two core data structures: the Series (1D labeled array) and the DataFrame (2D tabular labeled data structure with columns of potentially different types). Pandas excels at data wrangling, cleaning missing values (fillna, dropna), filtering, group-by aggregations, joins/merges, pivot tables, and type conversions. In Data Engineering, Pandas is used for small-to-medium ETL pipelines (<5 GB) and local data profiling.',
        hi: 'Pandas Python ka sabse famous aur powerful data manipulation tool hai. Iske do main components hain: Series (1D column) aur DataFrame (2D table, bilkul Excel sheet ya SQL table ki tarah). Pandas ka use missing data ko handle karne (fillna, dropna), filtering, Group By calculations, tables ko aapas me JOIN karne (merge), aur data profiling ke liye hota hai. 5 GB tak ke datasets ke liye Pandas industry standard hai.'
      },
      why: 'Writing manual Python code to join two files on customer_id, group by region, and calculate average spend takes 50 lines of code. In Pandas, it takes 2 readable lines: df.merge(...).groupby(\'region\')[\'spend\'].mean().',
      how: '1. Ingestion: df = pd.read_csv("orders.csv", parse_dates=["order_date"])\n2. Exploration: df.info(), df.describe(), df.isnull().sum()\n3. Cleaning: df.dropna(subset=["user_id"]); df["amount"] = df["amount"].fillna(0)\n4. Transformation: df["tier"] = np.where(df["amount"] > 500, "VIP", "Regular")\n5. Aggregation: df.groupby("country")["amount"].agg(["count", "sum", "mean"])\n6. Export: df.to_parquet("clean_orders.parquet", compression="snappy")',
      architecture: {
        type: 'pandas_dataframe_model',
        title: 'Pandas DataFrame Architectural Model',
        nodes: [
          { name: 'Index (Row Labels)', desc: 'Explicit row labels allowing fast alignment and slicing' },
          { name: 'Columns (Series)', desc: 'Each column is a typed NumPy ndarray or PyArrow array' },
          { name: 'BlockManager / ArrayManager', desc: 'Internal columnar storage engine managing contiguous memory blocks' }
        ]
      },
      industryExample: 'Fintech companies use Pandas pipelines to ingest daily CSV transaction settlements from payment networks (Mastercard/Visa), validate balances, and export clean audit reports.',
      practicalLab: {
        title: 'Lab 5.9: Cleaning and Aggregating Data with Pandas',
        problemStatement: 'Load a dirty dataset with null values, clean the missing amounts, calculate group-by metrics, and export to CSV.',
        requirements: 'Python 3.x with pandas.',
        setup: 'mkdir -p ~/bigdata_lab/m5_l9 && cd ~/bigdata_lab/m5_l9',
        instructions: [
          'Step 1: Write a Pandas data cleaning and group-by aggregation script.',
          'Step 2: Run using python3.',
          'Step 3: Verify the aggregated business metrics.'
        ],
        code: `# pandas_lab.py
import pandas as pd
import numpy as np

data = {
    "order_id": [101, 102, 103, 104, 105, 106],
    "customer": ["Alice", "Bob", "Alice", "Charlie", "Bob", "Alice"],
    "category": ["Electronics", "Books", "Electronics", "Books", "Home", "Electronics"],
    "amount": [1200.0, np.nan, 350.0, 45.0, 180.0, np.nan]
}

df = pd.DataFrame(data)
print("--- Raw DataFrame ---")
print(df)

# Cleaning: Impute missing amounts with category median
df["amount"] = df.groupby("category")["amount"].transform(lambda x: x.fillna(x.median() if not x.isna().all() else 50.0))

# Aggregation: Group by customer
customer_summary = df.groupby("customer").agg(
    total_orders=("order_id", "count"),
    total_spend=("amount", "sum"),
    avg_spend=("amount", "mean")
).reset_index()

print("\\n--- Customer Summary Metrics ---")
print(customer_summary)
`,
        commands: [
          'python3 pandas_lab.py'
        ]
      },
      expectedOutput: `--- Raw DataFrame ---
   order_id customer     category  amount
0       101    Alice  Electronics  1200.0
1       102      Bob        Books     NaN
2       103    Alice  Electronics   350.0
3       104  Charlie        Books    45.0
4       105      Bob         Home   180.0
5       106    Alice  Electronics     NaN

--- Customer Summary Metrics ---
  customer  total_orders  total_spend   avg_spend
0    Alice             3       2325.0       775.0
1      Bob             2        225.0       112.5
2  Charlie             1         45.0        45.0`,
      troubleshooting: [
        {
          error: 'SettingWithCopyWarning: A value is trying to be set on a copy of a slice from a DataFrame',
          rootCause: 'Modifying a filtered subset DataFrame created via chained indexing (df[df[\'col\'] > 1][\'amount\'] = 100).',
          solution: 'Use .loc for explicit in-place assignment: df.loc[df[\'col\'] > 1, \'amount\'] = 100 or create an explicit copy: subset = df[...].copy().'
        }
      ],
      bestPractices: [
        'Avoid df.iterrows(); it is notoriously slow. Use vectorized operations or df.apply() when vectorization is impossible.',
        'Convert string columns with low cardinality (e.g. state, gender, status) to category dtype to save up to 80% RAM.',
        'Use chunksize parameter (pd.read_csv(..., chunksize=100000)) when working with files approaching available RAM size.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is the difference between dropna() and fillna() in Pandas?',
          answer: 'dropna() removes entire rows (or columns) that contain null or NaN values. fillna() replaces null/NaN values with a specified default value, constant, mean, or median, preserving the row count.'
        },
        {
          level: 'Intermediate',
          question: 'Why is df.iterrows() discouraged for large datasets, and what should be used instead?',
          answer: 'df.iterrows() converts each row into a Pandas Series object and loops sequentially in pure Python, incurring immense serialization overhead. For 1 million rows, it can take minutes. Instead, use vectorized operations (e.g. df["C"] = df["A"] + df["B"]) or NumPy expressions (np.where()), which execute in compiled C in milliseconds.'
        },
        {
          level: 'Advanced',
          question: 'How do you process a 20 GB CSV file on a laptop with only 8 GB of RAM using Pandas?',
          answer: 'Use chunked processing via the chunksize argument: with pd.read_csv("huge.csv", chunksize=100000) as reader: for chunk in reader: processed = transform(chunk); processed.to_parquet("out.parquet", append=True). Alternatively, use modern out-of-core streaming engines like Polars, DuckDB, or PySpark.'
        }
      ],
      assignment: {
        task: 'Execute python3 pandas_lab.py in terminal and verify the category-median imputation and customer summary metrics.',
        verificationCriteria: 'Run the command and observe the clean customer summary output.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which Pandas technique should be strictly avoided when iterating over large DataFrames due to poor performance?',
            options: ['Vectorized math (df["a"] * 2)', 'df.iterrows() loop', 'df.groupby()', 'pd.merge()'],
            correct: 1,
            explanation: 'df.iterrows() forces Python row-by-row iteration with heavy Series overhead, making it extremely slow.'
          }
        ],
        commandChallenge: {
          prompt: 'Run the Pandas data cleaning and aggregation script.',
          expectedCommand: 'python3 pandas_lab.py'
        }
      }
    },
    {
      id: 'm5-l10',
      title: 'JSON and CSV Processing at Scale',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'CSV (Comma-Separated Values) and JSON (JavaScript Object Notation) are the two most prevalent data exchange formats in enterprise ingestion. However, handling them at scale introduces distinct challenges: CSV lacks schema definitions and struggles with commas inside quoted text; standard multi-line JSON cannot be split by distributed systems. Big Data pipelines rely on JSON Lines (JSONL / NDJSON: newline-delimited JSON, where each line is a self-contained valid JSON object). In Python, csv.reader/writer and ijson/jsonlines handle large files without memory exhaustion.',
        hi: 'CSV aur JSON data exchange ke sabse popular formats hain. Lekin Big Data me normal multi-line JSON fail ho jaata hai kyunki Hadoop file ko beech me se tod (split) nahi sakta. Isiliye hum JSONL (JSON Lines ya NDJSON) use karte hain — jisme har ek line apne aap me ek complete JSON object hoti hai! Python me hum csv.DictReader aur streaming json lines use karte hain taaki 10 GB ki file ko bina RAM bhare line-by-line parse kiya ja sake.'
      },
      why: 'A standard 10 GB nested JSON array [ {...}, {...} ] must be read in its entirety to find the closing bracket, crashing NameNode and Spark splits. Converting to JSONL enables perfect data splittability across 100 parallel workers.',
      how: '1. CSV Streaming: with open("data.csv") as f: reader = csv.DictReader(f); for row in reader: ...\n2. JSONL Writing: with open("events.jsonl", "w") as f: f.write(json.dumps(record) + "\\n")\n3. JSONL Streaming: with open("events.jsonl") as f: for line in f: event = json.loads(line)\n4. Nested Flattening: pd.json_normalize() or custom recursive flattening to unpack nested objects like user.address.geo.lat.',
      architecture: {
        type: 'json_vs_jsonl_splittability',
        title: 'Multi-line JSON vs Line-Delimited JSONL (NDJSON)',
        nodes: [
          { name: 'Standard JSON Array [ {...}, {...} ]', desc: 'NOT splittable: 1 machine must parse all 10 GB to validate brackets' },
          { name: 'JSON Lines (JSONL / NDJSON)', desc: '100% Splittable: Each line is independent; Hadoop can split at any 128MB byte offset' },
          { name: 'Big Data Pipeline Rule', desc: 'Always convert external REST API JSON to JSONL or Parquet before HDFS/S3 storage' }
        ]
      },
      industryExample: 'Twitter / X, Shopify, and Stripe deliver enterprise event firehoses strictly formatted as JSON Lines (NDJSON) over streaming HTTP endpoints.',
      practicalLab: {
        title: 'Lab 5.10: Flattening Nested JSON into Normalized CSV/JSONL',
        problemStatement: 'Parse deeply nested API payload records, flatten nested address and payment objects, and stream to JSONL.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m5_l10 && cd ~/bigdata_lab/m5_l10',
        instructions: [
          'Step 1: Write a script demonstrating nested JSON parsing and flattening.',
          'Step 2: Run using python3.',
          'Step 3: Inspect the generated JSONL output.'
        ],
        code: `# json_stream_lab.py
import json

nested_api_payload = [
    {
        "transaction_id": "TXN_001",
        "user": {"id": 101, "name": "Alice", "city": "Bengaluru"},
        "payment": {"method": "UPI", "amount": 1499.00, "status": "SUCCESS"}
    },
    {
        "transaction_id": "TXN_002",
        "user": {"id": 102, "name": "Bob", "city": "Mumbai"},
        "payment": {"method": "CREDIT_CARD", "amount": 3200.50, "status": "SUCCESS"}
    }
]

def flatten_record(item):
    return {
        "txn_id": item["transaction_id"],
        "user_id": item["user"]["id"],
        "user_name": item["user"]["name"],
        "city": item["user"]["city"],
        "payment_method": item["payment"]["method"],
        "amount": item["payment"]["amount"],
        "status": item["payment"]["status"]
    }

# Stream out as JSON Lines (NDJSON)
with open("flattened_events.jsonl", "w") as f:
    for raw in nested_api_payload:
        flat = flatten_record(raw)
        f.write(json.dumps(flat) + "\\n")

# Verify by reading line-by-line
with open("flattened_events.jsonl") as f:
    for line in f:
        print("Read JSONL line:", line.strip())
`,
        commands: [
          'python3 json_stream_lab.py'
        ]
      },
      expectedOutput: `Read JSONL line: {"txn_id": "TXN_001", "user_id": 101, "user_name": "Alice", "city": "Bengaluru", "payment_method": "UPI", "amount": 1499.0, "status": "SUCCESS"}
Read JSONL line: {"txn_id": "TXN_002", "user_id": 102, "user_name": "Bob", "city": "Mumbai", "payment_method": "CREDIT_CARD", "amount": 3200.5, "status": "SUCCESS"}`,
      troubleshooting: [
        {
          error: 'JSONDecodeError: Extra data: line 2 column 1 (char 125)',
          rootCause: 'Calling json.load() or json.loads() on a JSON Lines (.jsonl) file containing multiple JSON objects.',
          solution: 'Iterate over the file line-by-line and call json.loads(line) on each individual line.'
        }
      ],
      bestPractices: [
        'Always use JSONL (Newline-Delimited JSON) for Big Data landing zones instead of a single giant JSON array.',
        'Use csv.DictReader and csv.DictWriter to handle embedded commas and quote escaping automatically.',
        'Validate incoming JSON schema against a formal contract using Pydantic or jsonschema.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is JSON Lines (JSONL / NDJSON) and why is it preferred over standard JSON in Big Data?',
          answer: 'JSON Lines is a format where each line is a separate, valid JSON object, separated by newline characters (\\n). In Big Data, standard JSON arrays require parsing the entire multi-gigabyte file from start to finish to close brackets. JSONL is splittable: distributed frameworks like Hadoop and Spark can split the file at arbitrary byte offsets and seek to the next newline, processing partitions concurrently.'
        },
        {
          level: 'Intermediate',
          question: 'How do you handle commas inside a CSV field (e.g. "123 Main St, Suite 400") in Python?',
          answer: 'Use Python\'s built-in csv module (csv.reader or csv.DictReader). It automatically follows RFC 4180 standards, recognizing quotes (quotechar=\'"\') and treating commas inside quotation marks as literal characters rather than column delimiters.'
        },
        {
          level: 'Advanced',
          question: 'How do you process a 50 GB JSON file that cannot be converted to JSONL without crashing system RAM?',
          answer: 'Use an iterative streaming JSON parser like ijson. ijson uses a C-backed yajl parser to build a stream of tokens, generating Python objects only when matching specific JSON paths (e.g. for item in ijson.items(f, "records.item"): process(item)), keeping RAM consumption in megabytes regardless of file size.'
        }
      ],
      assignment: {
        task: 'Execute python3 json_stream_lab.py in terminal and verify the flattened JSONL output.',
        verificationCriteria: 'Run the command and observe the output lines.'
      },
      assessment: {
        quiz: [
          {
            q: 'Why can Apache Spark split a 10 GB JSONL file across 80 worker nodes in parallel, but cannot split a standard JSON array file [ {..}, {..} ]?',
            options: [
              'Because JSONL uses binary encoding',
              'Because in JSONL each line is self-contained and delimited by newlines, allowing worker nodes to seek to line boundaries independently',
              'Because JSON arrays only work on Windows',
              'Because Spark doesn\'t support JSON'
            ],
            correct: 1,
            explanation: 'JSONL is line-delimited; any worker node can seek to a byte offset, scan to the next newline, and parse independent records.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the JSON streaming and flattening script.',
          expectedCommand: 'python3 json_stream_lab.py'
        }
      }
    },
    {
      id: 'm5-l11',
      title: 'Database Connectivity & SQLAlchemy',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'Data Engineers bridge disparate systems: extracting transactional data from operational OLTP databases (PostgreSQL, MySQL, Oracle) and loading into analytical data warehouses or lakes. In Python, low-level database drivers (psycopg2, mysql-connector, sqlite3) provide cursor-based execution adhering to the Python DB-API 2.0 specification (PEP 249). SQLAlchemy is the enterprise-standard SQL toolkit and Object Relational Mapper (ORM), providing connection pooling, database dialect abstraction, and seamless integration with Pandas (pd.read_sql, df.to_sql).',
        hi: 'Data Engineers ka roz ka kaam hota hai transactional databases (PostgreSQL, MySQL) se data nikal kar Data Lake me daalna. Python me PEP 249 specification par bane drivers hote hain (jaise sqlite3, psycopg2). SQLAlchemy industry-standard toolkit hai jo "Connection Pooling" (connections ko reuse karna taaki DB crash na ho), dialect abstraction (code wahi rahe chahe Postgres ho ya Oracle), aur Pandas ke sath direct integration (pd.read_sql, df.to_sql) provide karta hai.'
      },
      why: 'Opening a new database TCP connection for every row destroys database performance (connection handshake overhead). SQLAlchemy Connection Pooling reuses a pool of warm connections, increasing pipeline throughput by 10x.',
      how: '1. SQLite built-in: import sqlite3; conn = sqlite3.connect("warehouse.db")\n2. Cursor pattern: cursor = conn.cursor(); cursor.execute("SELECT ...")\n3. SQLAlchemy Engine: from sqlalchemy import create_engine; engine = create_engine("postgresql+psycopg2://user:pass@host/db", pool_size=10, max_overflow=20)\n4. Pandas Ingestion: df = pd.read_sql("SELECT * FROM orders WHERE status = \'PAID\'", engine)\n5. Bulk Load: df.to_sql("stg_orders", engine, if_exists="append", index=False, chunksize=10000).',
      architecture: {
        type: 'sqlalchemy_connection_pool',
        title: 'SQLAlchemy Connection Pool Architecture',
        nodes: [
          { name: 'Python ETL Workers', desc: 'Multiple concurrent pipeline threads requesting DB access' },
          { name: 'SQLAlchemy QueuePool', desc: 'Manages pool of pre-established, authenticated database connections' },
          { name: 'PostgreSQL / MySQL Server', desc: 'Relieved from connection handshake churn; maintains stable memory' }
        ]
      },
      industryExample: 'Stripe and Airbnb use SQLAlchemy connection pool configurations in Airflow worker tasks to pull incremental CDC records from thousands of MySQL shard instances reliably.',
      practicalLab: {
        title: 'Lab 5.11: Connecting, Querying, and Bulk Inserting with SQLite',
        problemStatement: 'Create an SQLite database, create an employees table, insert records with parameterized queries, and query using Pandas.',
        requirements: 'Python 3.x with sqlite3 and pandas.',
        setup: 'mkdir -p ~/bigdata_lab/m5_l11 && cd ~/bigdata_lab/m5_l11',
        instructions: [
          'Step 1: Write an SQLite database connection and query script.',
          'Step 2: Run using python3.',
          'Step 3: Verify the extracted Pandas DataFrame from SQL.'
        ],
        code: `# db_connect_lab.py
import sqlite3
import pandas as pd

# 1. Connect to SQLite database file
conn = sqlite3.connect("company_warehouse.db")
cursor = conn.cursor()

# 2. Create Schema
cursor.execute("""
CREATE TABLE IF NOT EXISTS employees (
    emp_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    salary REAL NOT NULL
)
""")

# 3. Parameterized Batch Insert (Prevents SQL Injection)
records = [
    (1, "Aarav Sharma", "Engineering", 120000.0),
    (2, "Diya Patel", "Product", 115000.0),
    (3, "Rohan Verma", "Engineering", 95000.0),
    (4, "Priya Nair", "Marketing", 85000.0)
]

cursor.executemany("""
INSERT OR REPLACE INTO employees (emp_id, name, department, salary)
VALUES (?, ?, ?, ?)
""", records)
conn.commit()

# 4. Extract via Pandas SQL Integration
df = pd.read_sql_query("SELECT department, AVG(salary) as avg_salary, COUNT(*) as headcount FROM employees GROUP BY department", conn)
print("--- Aggregated SQL Query Results via Pandas ---")
print(df)

conn.close()
`,
        commands: [
          'python3 db_connect_lab.py'
        ]
      },
      expectedOutput: `--- Aggregated SQL Query Results via Pandas ---
    department  avg_salary  headcount
0  Engineering    107500.0          2
1    Marketing     85000.0          1
2      Product    115000.0          1`,
      troubleshooting: [
        {
          error: 'sqlite3.OperationalError: database is locked',
          rootCause: 'Multiple processes attempting to write to the same SQLite file simultaneously or an uncommitted transaction holding a write lock.',
          solution: 'Ensure transactions are committed (conn.commit()) and closed promptly. In production multi-threaded pipelines, use PostgreSQL with connection pooling instead of file-based SQLite.'
        }
      ],
      bestPractices: [
        'ALWAYS use parameterized queries (VALUES (?, ?)) to prevent catastrophic SQL Injection vulnerabilities.',
        'Use chunksize parameter when using df.to_sql() to avoid out-of-memory errors on massive inserts.',
        'Always wrap database operations in context managers or try/finally blocks to close connections.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is SQL Injection and how do parameterized queries prevent it in Python?',
          answer: 'SQL Injection occurs when untrusted user input is directly concatenated into a SQL string (e.g. f"SELECT * FROM users WHERE name = \'{user_input}\'"), allowing attackers to inject malicious SQL commands (like \'; DROP TABLE users; --\'). Parameterized queries send the SQL command structure and data parameters separately to the database engine, ensuring data is never executed as executable SQL.'
        },
        {
          level: 'Intermediate',
          question: 'What is Connection Pooling in SQLAlchemy and why is it essential for high-throughput pipelines?',
          answer: 'Establishing a database connection involves TCP handshakes, SSL negotiations, authentication, and backend server process allocation, which is computationally expensive. A Connection Pool maintains a cache of pre-established, reusable connections. When a task needs a connection, it borrows one from the pool and returns it when done, reducing latency by 90% and preventing database connection exhaustion.'
        },
        {
          level: 'Advanced',
          question: 'Compare client-side cursors vs server-side cursors (SSCursor) when fetching 50 million rows in Python.',
          answer: 'By default, client-side cursors (like standard psycopg2 cursors) fetch the ENTIRE result set from the database over the network and buffer all 50 million rows into the Python client\'s RAM, causing an immediate Out-Of-Memory crash. A Server-Side Cursor (named cursor in psycopg2: conn.cursor(name="my_cur")) leaves the results on the database server and streams rows in controlled batch chunks (e.g. 5,000 at a time via cursor.fetchmany()), keeping client memory usage near zero.'
        }
      ],
      assignment: {
        task: 'Execute python3 db_connect_lab.py in terminal and verify the SQLite creation and Pandas SQL extraction.',
        verificationCriteria: 'Run the command and observe the department avg_salary output.'
      },
      assessment: {
        quiz: [
          {
            q: 'How should you execute dynamic SQL queries in Python to guarantee protection against SQL Injection attacks?',
            options: [
              'Using Python f-strings: f"SELECT * FROM users WHERE id = {user_id}"',
              'Using parameterized queries with placeholders: cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))',
              'By converting user input to uppercase',
              'By running queries as root'
            ],
            correct: 1,
            explanation: 'Parameterized queries separate SQL structure from data parameters, making SQL injection impossible.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the database connectivity and querying script.',
          expectedCommand: 'python3 db_connect_lab.py'
        }
      }
    },
    {
      id: 'm5-l12',
      title: 'REST API Integration & Pagination',
      duration: '45 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'A major source of raw data in modern engineering comes from external SaaS platforms (Salesforce, Stripe, GitHub, Shopify, Zendesk) via REST APIs. Interacting with REST APIs requires handling HTTP methods (GET, POST), Bearer token authentication, rate limiting (HTTP 429 Too Many Requests), status code inspection, and crucial Pagination strategies (Page number, Offset/Limit, and Cursor-based pagination). The requests library is the standard Python tool for API ingestion.',
        hi: 'Aaj kal 70% data external SaaS platforms (jaise Stripe, Salesforce, Shopify) ke REST APIs se aata hai. Ek Data Engineer ko HTTP status codes (200 OK, 401 Unauthorized, 429 Rate Limit, 500 Server Error) samajhna aana chahiye. Aur sabse zaroori concept hai "Pagination": kyunki koi bhi API 10 Lakh records ek sath nahi deta, wo 100-100 karke paged responses deta hai. Page-based, Offset-based, aur Cursor-based pagination ko loop me chala kar poora data extract kiya jaata hai.'
      },
      why: 'APIs enforce strict rate limits and maximum page sizes (e.g. 100 records per page). Without automated pagination and rate limit handling, ingestion jobs either crash or fetch only the first 100 records, missing 99% of enterprise data.',
      how: '1. Requests Setup: import requests; response = requests.get(url, headers={"Authorization": f"Bearer {token}"})\n2. Status Check: response.raise_for_status() raises an exception for 4xx/5xx errors.\n3. Rate Limit Handling: If status_code == 429: time.sleep(int(response.headers.get("Retry-After", 5)))\n4. Cursor Pagination: while has_more:\n      resp = requests.get(f"{url}?cursor={next_cursor}").json()\n      records.extend(resp["data"])\n      next_cursor = resp.get("next_cursor")\n      has_more = bool(next_cursor)',
      architecture: {
        type: 'api_pagination_flow',
        title: 'Cursor-Based REST API Pagination Loop',
        nodes: [
          { name: '1. Initial GET Request', desc: 'GET /api/v1/orders?limit=100' },
          { name: '2. Response & Buffer', desc: 'Appends 100 records; extracts next_cursor: "cur_89a7"' },
          { name: '3. Next Page GET', desc: 'GET /api/v1/orders?limit=100&cursor=cur_89a7' },
          { name: '4. Termination Check', desc: 'next_cursor is null -> Loop terminates; emits complete dataset' }
        ]
      },
      industryExample: 'HubSpot and Stripe ingest pipelines extract millions of marketing contacts and invoices daily using cursor-based pagination, dynamically adjusting request rates based on X-RateLimit-Remaining headers.',
      practicalLab: {
        title: 'Lab 5.12: Simulating Cursor-Based REST API Pagination',
        problemStatement: 'Build a mock paginated API and write an automated Python client that iterates through all pages until exhausted.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m5_l12 && cd ~/bigdata_lab/m5_l12',
        instructions: [
          'Step 1: Write an API client simulation script with cursor pagination.',
          'Step 2: Run using python3.',
          'Step 3: Verify all pages are fetched seamlessly.'
        ],
        code: `# api_pagination_lab.py
# Simulated API server with cursor pagination
def mock_api_endpoint(cursor=None, limit=2):
    all_database = [
        {"id": 1, "product": "Keyboard", "price": 45},
        {"id": 2, "product": "Mouse", "price": 25},
        {"id": 3, "product": "Monitor", "price": 280},
        {"id": 4, "product": "Webcam", "price": 85},
        {"id": 5, "product": "Headset", "price": 60}
    ]
    start = int(cursor) if cursor else 0
    end = start + limit
    page_data = all_database[start:end]
    next_cursor = str(end) if end < len(all_database) else None
    return {"data": page_data, "next_cursor": next_cursor}

# Production Ingestion Client
def ingest_all_products():
    all_products = []
    cursor = None
    page = 1

    while True:
        print(f"[Page {page}] Fetching with cursor={cursor}...")
        response = mock_api_endpoint(cursor=cursor, limit=2)
        all_products.extend(response["data"])
        
        cursor = response["next_cursor"]
        if not cursor:
            print("No more pages available. Ingestion complete!")
            break
        page += 1

    return all_products

results = ingest_all_products()
print(f"\\nTotal Ingested Products: {len(results)}")
for r in results:
    print(f" - ID: {r['id']} | {r['product']:<10} | \${r['price']}")
`,
        commands: [
          'python3 api_pagination_lab.py'
        ]
      },
      expectedOutput: `[Page 1] Fetching with cursor=None...
[Page 2] Fetching with cursor=2...
[Page 3] Fetching with cursor=4...
No more pages available. Ingestion complete!

Total Ingested Products: 5
 - ID: 1 | Keyboard   | $45
 - ID: 2 | Mouse      | $25
 - ID: 3 | Monitor    | $280
 - ID: 4 | Webcam     | $85
 - ID: 5 | Headset    | $60`,
      troubleshooting: [
        {
          error: 'HTTP 429 Too Many Requests',
          rootCause: 'Client made too many requests in a short time window, breaching the provider\'s rate limit threshold.',
          solution: 'Inspect response header "Retry-After". Use time.sleep() and implement exponential backoff retry.'
        }
      ],
      bestPractices: [
        'Prefer Cursor-based pagination over Offset-based pagination when available; cursor pagination avoids missing/duplicate records when data is inserted concurrently.',
        'Always set explicit request timeouts: requests.get(url, timeout=(3.05, 30)) (connect timeout, read timeout).',
        'Use requests.Session() to pool underlying TCP connections across multiple paged requests.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What is API Pagination and why is it necessary?',
          answer: 'Pagination is the practice of splitting large API response datasets into discrete chunks ("pages") rather than returning millions of records in a single payload. It is necessary to prevent API servers from running out of memory and to minimize network latency and transfer times.'
        },
        {
          level: 'Intermediate',
          question: 'What is the critical flaw with Offset-based pagination (page=5&limit=100) on high-velocity data?',
          answer: 'If new records are inserted at the beginning of the table while the client is paginating, the offsets shift. When the client requests page 2, records already seen on page 1 shift into page 2 (causing duplicate records), or records shift backward (causing skipped records). Furthermore, deep offsets (OFFSET 1000000) force databases to scan and discard 1 million rows, degrading query performance.'
        },
        {
          level: 'Advanced',
          question: 'Why is Cursor-based pagination considered superior for Big Data ingestion pipelines?',
          answer: 'Cursor pagination uses a unique sequential identifier or timestamp pointer (e.g. after_id=TXN_999 or cursor=eyJpZCI6MTAwfQ==). The query executes as SELECT * FROM records WHERE id > cursor LIMIT 100 ORDER BY id ASC. This is an indexed seek (O(log N)), immune to concurrent record insertions, guarantees zero duplicate or skipped records, and maintains constant millisecond performance regardless of pagination depth.'
        }
      ],
      assignment: {
        task: 'Execute python3 api_pagination_lab.py in terminal and verify the 3-page cursor traversal.',
        verificationCriteria: 'Run the command and observe 5 total ingested products.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which HTTP response code indicates that an external API rate limit has been exceeded?',
            options: ['401 Unauthorized', '404 Not Found', '429 Too Many Requests', '503 Service Unavailable'],
            correct: 2,
            explanation: 'HTTP 429 indicates rate limiting; client should back off and inspect Retry-After headers.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the API pagination simulation script.',
          expectedCommand: 'python3 api_pagination_lab.py'
        }
      }
    },
    {
      id: 'm5-l13',
      title: 'Enterprise Logging & Monitoring',
      duration: '40 mins',
      difficulty: 'Intermediate',
      concept: {
        en: 'In production, print() statements are completely forbidden. print() outputs unformatted text to standard stdout without timestamps, severity levels, process IDs, or stack traces, and cannot be diverted to logging collectors. Python\'s built-in logging module provides industrial-grade structured logging with hierarchical severity levels: DEBUG (detailed diagnostics), INFO (confirmation that pipeline milestones are met), WARNING (unexpected event, but pipeline continued), ERROR (a task failed), and CRITICAL (unrecoverable pipeline failure). Logs should be formatted as structured JSON for easy parsing by ELK or Datadog.',
        hi: 'Production environment me print() statements use karna strictly mana hota hai! print() me na toh timestamp hota hai, na error level, aur na hi log files me redirect karne ki capability. Python ka built-in logging module use hota hai jisme 5 standard severity levels hote hain: DEBUG, INFO, WARNING, ERROR, aur CRITICAL. Senior engineers logs ko JSON format me emit karte hain taaki Datadog ya Splunk jaisi enterprise monitoring tools unhe automatically index kar sakein.'
      },
      why: 'When a scheduled production pipeline fails at 3 AM in an automated container, print() statements disappear when the container terminates. Structured logs sent to files or syslog allow on-call engineers to diagnose exact timestamps, parameters, and stack traces instantly.',
      how: '1. Basic Setup: import logging; logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] [%(name)s]: %(message)s")\n2. Logger Instance: logger = logging.getLogger("ETL_Pipeline")\n3. Exception Logging: In except block: logger.exception("Failed to process transaction ID %s", txn_id) (automatically appends full stack trace).\n4. Handlers: StreamHandler for console, RotatingFileHandler to automatically rotate log files when they hit 50 MB.\n5. JSON Logging: python-json-logger to format log lines as valid JSON strings.',
      architecture: {
        type: 'logging_architecture',
        title: 'Enterprise Python Logging Architecture',
        nodes: [
          { name: 'Application Logger', desc: 'logger.info(), logger.error() called throughout codebase' },
          { name: 'Log Handlers', desc: 'Console StreamHandler + RotatingFileHandler (Max 50MB, 5 backups)' },
          { name: 'Formatters (JSON)', desc: 'Injects timestamp, level, PID, line number, and message as JSON' },
          { name: 'Log Forwarder', desc: 'Fluentbit / Filebeat shipping logs to Elasticsearch / Datadog' }
        ]
      },
      industryExample: 'Uber and Netflix mandate JSON structured logging across all Python data pipelines, enabling automated PagerDuty alerts to trigger when ERROR logs exceed 50 per minute.',
      practicalLab: {
        title: 'Lab 5.13: Configuring Structured Logging with File Handlers',
        problemStatement: 'Configure a Python logger with custom formatting, log INFO and ERROR levels, and capture an exception stack trace.',
        requirements: 'Python 3.x environment.',
        setup: 'mkdir -p ~/bigdata_lab/m5_l13 && cd ~/bigdata_lab/m5_l13',
        instructions: [
          'Step 1: Write a production logging script.',
          'Step 2: Run using python3.',
          'Step 3: Inspect the generated log output.'
        ],
        code: `# logging_lab.py
import logging
import sys

# Configure structured logger
logger = logging.getLogger("PipelineMonitor")
logger.setLevel(logging.DEBUG)

# Create formatter
formatter = logging.Formatter('{"time": "%(asctime)s", "level": "%(levelname)s", "module": "%(name)s", "msg": "%(message)s"}')

# Console handler
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(formatter)
logger.addHandler(handler)

logger.info("Starting Batch Extraction from HDFS...")
logger.debug("Connecting to socket port 9866...")

try:
    # Simulate zero division error
    x = 100 / 0
except ZeroDivisionError:
    logger.exception("Mathematical error encountered during rate calculation")

logger.info("Batch Extraction Completed with 1 handled alert.")
`,
        commands: [
          'python3 logging_lab.py'
        ]
      },
      expectedOutput: `{"time": "2026-11-11 15:25:01,102", "level": "INFO", "module": "PipelineMonitor", "msg": "Starting Batch Extraction from HDFS..."}
{"time": "2026-11-11 15:25:01,103", "level": "DEBUG", "module": "PipelineMonitor", "msg": "Connecting to socket port 9866..."}
{"time": "2026-11-11 15:25:01,104", "level": "ERROR", "module": "PipelineMonitor", "msg": "Mathematical error encountered during rate calculation"}
Traceback (most recent call last):
  File "logging_lab.py", line 18, in <module>
    x = 100 / 0
ZeroDivisionError: division by zero
{"time": "2026-11-11 15:25:01,105", "level": "INFO", "module": "PipelineMonitor", "msg": "Batch Extraction Completed with 1 handled alert."}`,
      troubleshooting: [
        {
          error: 'Log messages printed twice for every logger call',
          rootCause: 'Logger has multiple handlers attached or both child logger and root logger have StreamHandlers attached with logger.propagate = True.',
          solution: 'Ensure handlers are only added once, or set logger.propagate = False on custom loggers.'
        }
      ],
      bestPractices: [
        'Never use print() for pipeline telemetry; always use the logging module.',
        'Use logger.exception() inside except blocks; it automatically captures and formats the full traceback.',
        'Use RotatingFileHandler or TimedRotatingFileHandler to prevent log files from growing infinitely and filling up disk space.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What are the 5 standard logging levels in Python and their order of severity?',
          answer: 'In increasing order of severity: 1. DEBUG (10), 2. INFO (20), 3. WARNING (30), 4. ERROR (40), and 5. CRITICAL (50).'
        },
        {
          level: 'Intermediate',
          question: 'What is the difference between logger.error() and logger.exception()?',
          answer: 'logger.error() only logs the specified error message string. logger.exception() logs the message AND automatically extracts and appends the entire Python exception stack trace (equivalent to logger.error(..., exc_info=True)). logger.exception() should only be called inside an except block.'
        },
        {
          level: 'Advanced',
          question: 'Why is Structured JSON Logging preferred over plain text logging in cloud-native Big Data architectures?',
          answer: 'Plain text logs require complex, fragile regular expressions (grok patterns) in log shippers to extract timestamps, user IDs, and error codes. Structured JSON logs output each log record as a key-value JSON string. Modern log analytics engines (Elasticsearch, Splunk, Datadog, AWS CloudWatch) automatically parse and index JSON fields, enabling instant filtering, aggregation, and threshold alerting.'
        }
      ],
      assignment: {
        task: 'Execute python3 logging_lab.py in terminal and verify the structured JSON log output with traceback.',
        verificationCriteria: 'Run the command and observe the formatted logs.'
      },
      assessment: {
        quiz: [
          {
            q: 'Which logging method should be invoked inside an except block to automatically capture and print the full exception stack trace?',
            options: ['logger.info()', 'logger.exception()', 'logger.critical()', 'print(e)'],
            correct: 1,
            explanation: 'logger.exception() automatically extracts and formats the active exception stack trace.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the structured logging script.',
          expectedCommand: 'python3 logging_lab.py'
        }
      }
    },
    {
      id: 'm5-l14',
      title: 'End-to-End Python ETL Pipeline Project',
      duration: '60 mins',
      difficulty: 'Advanced',
      concept: {
        en: 'This capstone lesson integrates all Module 5 concepts into a production-grade Python ETL Pipeline: 1. EXTRACT: Ingests dirty, multi-source records (CSV and JSON) containing missing values and bad datatypes; 2. TRANSFORM: Applies data cleaning, regex validation, currency conversions, deduplication with sets, and customer metric derivations; 3. LOAD: Bulk inserts clean records into a relational SQLite database with parameterized transactions, while quarantining corrupted records into a Dead Letter Queue (DLQ); 4. OBSERVABILITY: Employs structured logging, execution timers, and data quality summary assertions.',
        hi: 'Ye Module 5 ka comprehensive capstone lesson hai jo saare concepts ko ek saath jodta hai: 1. EXTRACT: Dirty CSV aur JSON files se data read karna; 2. TRANSFORM: Data cleaning, missing values imputation, phone/email validation, aur business metrics calculate karna; 3. LOAD: Clean data ko relational database (SQLite) me bulk insert karna aur corrupt data ko Dead Letter Queue (DLQ) me alag save karna; 4. OBSERVABILITY: Structured logging aur timing metrics generate karna. Ye bilkul ek real company ke ETL pipeline ki tarah execute hota hai.'
      },
      why: 'In a real enterprise job interview or project, you are expected to write end-to-end pipelines that handle dirty real-world data gracefully, maintain auditability, and follow software engineering best practices.',
      how: '1. Ingest multi-format raw files using context managers.\n2. Filter and clean dirty records using pure functions and comprehensions.\n3. Validate business constraints (e.g. amount > 0, valid email format).\n4. Push clean records into relational database via parameterized batch insert.\n5. Push bad records into quarantine DLQ file with error metadata.\n6. Generate final pipeline execution audit summary.',
      architecture: {
        type: 'complete_python_etl_architecture',
        title: 'End-to-End Enterprise Python ETL Pipeline Flow',
        nodes: [
          { name: '1. Ingestion Sources', desc: 'Raw dirty sales.csv + telemetry.json' },
          { name: '2. Cleansing & Validation Engine', desc: 'Pure functions, regex email check, null imputation, type casting' },
          { name: '3. Clean Warehouse Load', desc: 'Relational DB commit (stg_sales_orders)' },
          { name: '4. Quarantine DLQ & Audit Logger', desc: 'Corrupted records dump (/quarantine/bad_rows.jsonl) + metrics report' }
        ]
      },
      industryExample: 'E-commerce giants like Flipkart and Amazon run this exact architecture for hourly third-party merchant settlement reconciliation, ensuring bad seller records are quarantined without holding up billions in daily customer settlements.',
      practicalLab: {
        title: 'Lab 5.14: Executing the Complete Python ETL Pipeline',
        problemStatement: 'Run the end-to-end Python ETL pipeline, verify clean warehouse loading, inspect the quarantine DLQ, and audit the output.',
        requirements: 'Python 3.x with sqlite3 and pandas.',
        setup: 'mkdir -p ~/bigdata_lab/m5_l14 && cd ~/bigdata_lab/m5_l14',
        instructions: [
          'Step 1: Write the complete end-to-end ETL pipeline script.',
          'Step 2: Run using python3.',
          'Step 3: Query the final SQLite warehouse table to verify loaded metrics.'
        ],
        code: `# full_etl_pipeline.py
import sqlite3, json, time, re

start_time = time.perf_counter()

# Raw dirty data sources
csv_input = """order_id,user_email,amount,status
1001,arjun@example.com,1500.00,SUCCESS
1002,bad_email_here,250.00,SUCCESS
1003,priya@company.org,INVALID_AMT,SUCCESS
1004,rohan@test.com,3200.50,PENDING
1005,arjun@example.com,1500.00,SUCCESS
1006,neha@service.in,450.00,SUCCESS
"""

EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

clean_orders = []
quarantine_dlq = []
seen_order_ids = set()

# Process CSV input
lines = csv_input.strip().split('\\n')[1:]
for line in lines:
    parts = line.split(',')
    oid, email, amt, status = parts[0].strip(), parts[1].strip(), parts[2].strip(), parts[3].strip()
    
    # Check deduplication
    if oid in seen_order_ids:
        quarantine_dlq.append({"order_id": oid, "reason": "DUPLICATE_ORDER_ID", "raw": line})
        continue
    seen_order_ids.add(oid)

    # Validate email
    if not re.match(EMAIL_REGEX, email):
        quarantine_dlq.append({"order_id": oid, "reason": "INVALID_EMAIL_FORMAT", "raw": line})
        continue

    # Validate and parse numeric amount
    try:
        numeric_amt = float(amt)
        if numeric_amt <= 0:
            raise ValueError("Amount must be positive")
    except ValueError as e:
        quarantine_dlq.append({"order_id": oid, "reason": f"INVALID_AMOUNT: {str(e)}", "raw": line})
        continue

    # Clean record ready for loading
    clean_orders.append((int(oid), email, numeric_amt, status))

# Load into Relational Database
conn = sqlite3.connect("enterprise_warehouse.db")
cur = conn.cursor()
cur.execute("""
CREATE TABLE IF NOT EXISTS clean_orders (
    order_id INTEGER PRIMARY KEY,
    user_email TEXT,
    amount REAL,
    status TEXT
)
""")
cur.executemany("INSERT OR REPLACE INTO clean_orders VALUES (?, ?, ?, ?)", clean_orders)
conn.commit()

# Query Results
cur.execute("SELECT COUNT(*), SUM(amount), AVG(amount) FROM clean_orders")
count, total, avg = cur.fetchone()
conn.close()

elapsed = time.perf_counter() - start_time

print(f"=== ETL PIPELINE AUDIT REPORT ===")
print(f"Total Ingested:    {len(lines)} records")
print(f"Clean Loaded:      {len(clean_orders)} records")
print(f"Quarantined (DLQ): {len(quarantine_dlq)} records")
print(f"Warehouse Revenue: \${total:,.2f} across {count} valid orders (Avg: \${avg:,.2f})")
print(f"Pipeline Runtime:  {elapsed*1000:.2f} ms")
print(f"\\n--- Quarantined Records in DLQ ---")
for bad in quarantine_dlq:
    print(f" [REJECTED] Order {bad['order_id']}: {bad['reason']}")
`,
        commands: [
          'python3 full_etl_pipeline.py'
        ]
      },
      expectedOutput: `=== ETL PIPELINE AUDIT REPORT ===
Total Ingested:    6 records
Clean Loaded:      3 records
Quarantined (DLQ): 3 records
Warehouse Revenue: $5,150.50 across 3 valid orders (Avg: $1,716.83)
Pipeline Runtime:  2.15 ms

--- Quarantined Records in DLQ ---
 [REJECTED] Order 1002: INVALID_EMAIL_FORMAT
 [REJECTED] Order 1003: INVALID_AMOUNT: could not convert string to float: 'INVALID_AMT'
 [REJECTED] Order 1005: DUPLICATE_ORDER_ID`,
      troubleshooting: [
        {
          error: 'Pipeline takes 45 minutes for 1 million records',
          rootCause: 'Inserting records row-by-row with individual conn.commit() calls inside the loop.',
          solution: 'Use cur.executemany() with a single commit, or use Pandas df.to_sql(..., chunksize=10000).'
        }
      ],
      bestPractices: [
        'Always separate the Extract, Transform, and Load logic into testable functions or classes.',
        'Never drop corrupt records without logging and saving them to a Dead Letter Queue (DLQ).',
        'Verify database schema contracts using parameterized queries and data quality checks before final commit.'
      ],
      interviewPrep: [
        {
          level: 'Beginner',
          question: 'What are the core stages of an ETL pipeline?',
          answer: 'ETL stands for Extract (reading raw data from diverse sources like APIs, CSVs, logs, or databases), Transform (cleaning, filtering, casting, validating, deduplicating, and enriching the data), and Load (writing the transformed data into a target warehouse, data lake, or analytical database).'
        },
        {
          level: 'Intermediate',
          question: 'How do you ensure Idempotency in a production ETL pipeline?',
          answer: 'An idempotent pipeline produces the exact same final state whether it is executed once or 10 times with the same input. Techniques to ensure idempotency include: 1. Partition Overwrites: Overwriting the specific partition (e.g. year=2026/month=11/day=11) instead of appending blindly. 2. UPSERT / MERGE: Using INSERT OR REPLACE (SQLite) or MERGE INTO (Delta Lake/Snowflake) matching on primary business keys. 3. Atomic Staging Tables: Writing to a temporary staging table and executing an atomic table swap (ALTER TABLE RENAME).'
        },
        {
          level: 'Advanced',
          question: 'How do you design a robust Data Quality framework for automated production pipelines?',
          answer: 'A production Data Quality framework implements tiered assertions: 1. Pre-Ingest (verifies source file exists, is non-empty, and matches file naming convention), 2. In-Flight (schema validation, null checks on primary keys, regex validation, range checks on numerical columns), and 3. Post-Load (reconciliation row counts match source minus DLQ, statistical anomaly detection on metrics like daily revenue variance). Frameworks like Great Expectations, Apache Deequ, or Soda automate this.'
        }
      ],
      assignment: {
        task: 'Execute python3 full_etl_pipeline.py in terminal and verify the 3 clean loaded records and 3 quarantined DLQ records.',
        verificationCriteria: 'Run the command and observe the complete audit report.'
      },
      assessment: {
        quiz: [
          {
            q: 'What is the primary benefit of making an ETL pipeline "Idempotent"?',
            options: [
              'It makes the pipeline run 10x faster using GPUs',
              'It allows failed pipeline runs to be safely retried without generating duplicate records or corrupted state',
              'It automatically generates HTML reports',
              'It removes the need for database indexes'
            ],
            correct: 1,
            explanation: 'Idempotency guarantees that re-running a job produces the exact same result, enabling safe automated retries.'
          }
        ],
        commandChallenge: {
          prompt: 'Execute the complete end-to-end ETL pipeline script.',
          expectedCommand: 'python3 full_etl_pipeline.py'
        }
      }
    }
  ]
};
