### How Scan() Works

When you iterate over rows and scan them into destination variables, Go performs data
type conversions work for you, behind the scenes. It is based on the type of the
destination variable. Being aware of this can clean up your code and help avoid
repetitive work.

For example, suppose you select some rows from a table that is defined with
string columns, such as `VARCHAR(45)` or similar. You happen to know, however,
that the table always contains numbers. If you pass a pointer to a string, Go
will copy the bytes into the string. Now you can use `strconv.ParseInt()` or
similar to convert the value to a number. You'll have to check for errors in the
SQL operations, as well as errors parsing the integer. This is messy and
tedious.

Or, you can just pass `Scan()` a pointer to an integer. Go will detect that and
call `strconv.ParseInt()` for you. If there's an error in conversion, the call
to `Scan()` will return it. Your code is neater and smaller now. This is the
recommended way to use `database/sql`.