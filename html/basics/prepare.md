### Preparing Queries

You should, in general, always prepare queries to be used multiple times. The
result of preparing the query is a prepared statement, which can have
placeholders (a.k.a. bind values) for parameters that you'll provide when you
execute the statement.  This is much better than concatenating strings, for all
the usual reasons (avoiding SQL injection attacks, for example).

In MySQL, the parameter placeholder is `?`, and in PostgreSQL it is `$N`, where
N is a number. SQLite accepts either of these.  In Oracle placeholders begin with
a colon and are named, like `:param1`. We'll use `?` because we're using MySQL
as our example.

```go
stmt, err := db.Prepare("select id, name from users where id = ?")
if err != nil {
	log.Fatal(err)
}
defer stmt.Close()
rows, err := stmt.Query(1)
if err != nil {
	log.Fatal(err)
}
defer rows.Close()
for rows.Next() {
	// ...
}
if err = rows.Err(); err != nil {
	log.Fatal(err)
}
```

Under the hood, `db.Query()` actually prepares, executes, and closes a prepared
statement. That's three round-trips to the database. If you're not careful, you
can triple the number of database interactions your application makes! Some
drivers can avoid this in specific cases,
but not all drivers do. See [prepared statements](prepared.html) for more.