### Retrieving Results

There are several idiomatic operations to retrieve results from the datastore.

1. Execute a query that returns rows.
1. Prepare a statement for repeated use, execute it multiple times, and destroy it.
1. Execute a statement in a once-off fashion, without preparing it for repeated use.
1. Execute a query that returns a single row. There is a shortcut for this special case.

Go's `database/sql` function names are significant. **If a function name
includes `Query`, it is designed to ask a question of the database, and will
return a set of rows**, even if it's empty. Statements that don't return rows
should not use `Query` functions; they should use `Exec()`.

- [Fetching Data from the Database](#fetch)
- [How Scan() Works](#scan)
- [Preparing Queries](#prepare)
- [Single-Row Queries](#singlerow)