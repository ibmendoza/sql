### Fetching Data from the Database


Let's take a look at an example of how to query the database, working with
results. We'll query the `users` table for a user whose `id` is 1, and print out
the user's `id` and `name`.  We will assign results to variables, a row at a
time, with `rows.Scan()`.

```go
var (
	id int
	name string
)
rows, err := db.Query("select id, name from users where id = ?", 1)
if err != nil {
	log.Fatal(err)
}
defer rows.Close()
for rows.Next() {
	err := rows.Scan(&id, &name)
	if err != nil {
		log.Fatal(err)
	}
	log.Println(id, name)
}
err = rows.Err()
if err != nil {
	log.Fatal(err)
}
```

Here's what's happening in the above code:

1. We're using `db.Query()` to send the query to the database. We check the error, as usual.
2. We defer `rows.Close()`. This is very important.
3. We iterate over the rows with `rows.Next()`.
4. We read the columns in each row into variables with `rows.Scan()`.
5. We check for errors after we're done iterating over the rows.

This is pretty much the only way to do it in Go. You can't
get a row as a map, for example. That's because everything is strongly typed.
You need to create variables of the correct type and pass pointers to them, as
shown.

A couple parts of this are easy to get wrong, and can have bad consequences.

* You should always check for an error at the end of the `for rows.Next()`
  loop. If there's an error during the loop, you need to know about it. Don't
  just assume that the loop iterates until you've processed all the rows.
* Second, as long as there's an open result set (represented by `rows`), the
  underlying connection is busy and can't be used for any other query. That
  means it's not available in the connection pool. If you iterate over all of
  the rows with `rows.Next()`, eventually you'll read the last row, and
  `rows.Next()` will encounter an internal EOF error and call `rows.Close()` for
  you. But if for some reason you exit that loop -- an early return, or so on --
  then the `rows` doesn't get closed, and the connection remains open. (It is
  auto-closed if `rows.Next()` returns false due to an error, though). This is
  an easy way to run out of resources.
* `rows.Close()` is a harmless no-op if it's already closed, so you can call
  it multiple times. Notice, however, that we check the error first, and only
  call `rows.Close()` if there isn't an error, in order to avoid a runtime panic.
* You should **always `defer rows.Close()`**, even if you also call `rows.Close()`
  explicitly at the end of the loop, which isn't a bad idea. 
* Don't `defer` within a loop. A deferred statement doesn't get executed until
  the function exits, so a long-running function shouldn't use it. If you do,
  you will slowly accumulate memory. If you are repeatedly querying and
  consuming result sets within a loop, you should explicitly call `rows.Close()`
  when you're done with each result, and not use `defer`.