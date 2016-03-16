### Working with Transactions


In Go, a transaction is essentially an object that reserves a connection to the
datastore. It lets you do all of the operations we've seen thus far, but
guarantees that they'll be executed on the same connection.

You begin a transaction with a call to `db.Begin()`, and close it with a
`Commit()` or `Rollback()` method on the resulting `Tx` variable. Under the
covers, the `Tx` gets a connection from the pool, and reserves it for use only
with that transaction. The methods on the `Tx` map one-for-one to methods you
can call on the database itself, such as `Query()` and so forth.

Prepared statements that are created in a transaction are bound exclusively to
that transaction. See [prepared statements](prepared.html) for more.

You should not mingle the use of transaction-related functions such as `Begin()`
and `Commit()` with SQL statements such as `BEGIN` and `COMMIT` in your SQL
code. Bad things might result:

* The `Tx` objects could remain open, reserving a connection from the pool and not returning it.
* The state of the database could get out of sync with the state of the Go variables representing it.
* You could believe you're executing queries on a single connection, inside of a transaction, when in reality Go has created several connections for you invisibly and some statements aren't part of the transaction.

While you are working inside a transaction you should be careful not to make
calls to the `Db` variable. Make all of your calls to the `Tx` variable that you
created with `db.Begin()`. The `Db` is not in a transaction, only the `Tx` is.
If you make further calls to `db.Exec()` or similar, those will happen outside
the scope of your transaction, on other connections.

If you need to work with multiple statements that modify connection state, you
need a `Tx` even if you don't want a transaction per se. For example:

* Creating temporary tables, which are only visible to one connection.
* Setting variables, such as MySQL's `SET @var := somevalue` syntax.
* Changing connection options, such as character sets or timeouts.

If you need to do any of these things, you need to bind your activity to a
single connection, and the only way to do that in Go is to use a `Tx`.