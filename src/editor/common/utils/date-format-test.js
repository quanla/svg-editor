const DateFormat = require("./date-format").DateFormat;

// console.log(DateFormat.createDateFormat("DD-MM-YYYY").format(new Date()));
// => 20/01/2018

// console.log(DateFormat.createDateFormat("DD-MM-YYYY").parse("20-01-2018").toLocaleDateString());
// => 2018-1-20

console.log(DateFormat.createDateFormat("MMM DD, YYYY").parse("Jun 19, 2018").toLocaleDateString());
// => 2018-1-20