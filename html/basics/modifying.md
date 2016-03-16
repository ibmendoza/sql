### Statements that Modify Data

Now we're ready to see how to modify data and work with transactions. The
distinction might seem artificial if you're used to programming languages that
use a "statement" object for fetching rows as well as updating data, but in Go,
there's an important reason for the difference.


Use `Exec()`, preferably with a prepared statement, to accomplish an `INSERT`,
`UPDATE`, `DELETE`, or other statement that doesn't return rows. The following
example shows how to insert a row and inspect metadata about the operation:

```go
stmt, err := db.Prepare("INSERT INTO users(name) VALUES(?)")
if err != nil {
	log.Fatal(err)
}
res, err := stmt.Exec("Dolly")
if err != nil {
	log.Fatal(err)
}
lastId, err := res.LastInsertId()
if err != nil {
	log.Fatal(err)
}
rowCnt, err := res.RowsAffected()
if err != nil {
	log.Fatal(err)
}
log.Printf("ID = %d, affected = %d\n", lastId, rowCnt)
```

Executing the statement produces a `sql.Result` that gives access to statement
metadata: the last inserted ID and the number of rows affected.

What if you don't care about the result? What if you just want to execute a
statement and check if there were any errors, but ignore the result? Wouldn't
the following two statements do the same thing?

```go
_, err := db.Exec("DELETE FROM users")  // OK
_, err := db.Query("DELETE FROM users") // BAD
```

The answer is no. They do **not** do the same thing, and **you should never use
`Query()` like this.** The `Query()` will return a `sql.Rows`, which reserves a
database connection until the `sql.Rows` is closed.
Since there might be unread data (e.g. more data rows), the connection can not
be used. In the example above, the connection will *never* be released again.
The garbage collector will eventually close the underlying `net.Conn` for you,
but this might take a long time. Moreover the database/sql package keeps
tracking the connection in its pool, hoping that you release it at some point,
so that the connection can be used again.
This anti-pattern is therefore a good way to run out of resources (too many
connections, for example).