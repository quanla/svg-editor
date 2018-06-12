const {StringUtil} = require("./string-util");
const {O} = require("./object-util");
const {months} = require("./date-lang-en");

const num = (length, fn) => (str) => {
    if (str.length < length) {
        return null;
    }
    let s = str.substring(0, length);
    if (isNaN(s)) {
        return null;
    }

    return {
        length,
        mutate: fn(+s),
    };
};
const str = (length, fn) => (str) => {
    if (str.length < length) {
        return null;
    }
    let s = str.substring(0, length);
    return {
        length,
        mutate: fn(s),
    };
};

function ist(num) {
    if (num > 10 && num < 20) {
        return "th";
    }

    return {1: "st", 2: "nd", 3: "rd"}[num % 10] || "th";
}

const types = {
    "DD": {
        format: (date) => StringUtil.padding(date.getDate(), 2),
        consume: num(2, (day) => (date) => ({...date, day})),
    },
    "DDDD": {
        format: (date) => {
            let d = date.getDate();
            return StringUtil.padding(d, 2) + ist(d);
        },
    },
    "DDD": {
        format: (date) => {
            let d = date.getDate();
            return d + ist(d);
        },
    },
    "MM": {
        format: (date) => StringUtil.padding(date.getMonth()+1, 2),
        consume: num(2, (month) => (date) => ({...date, month: month - 1})),
    },
    "MMM": {
        format: (date) => months.find((m) => m.value == date.getMonth()+1).abbr,
        consume: str(3, (str) => (date) => ({...date, month: months.find((m) => m.abbr == str).value - 1})),
    },
    "YYYY": {
        format: (date) => date.getFullYear(),
        consume: num(4, (year) => (date) => ({...date, year})),
    },
    "hh": {
        format: (date) => StringUtil.padding(date.getHours() % 12, 2),
        consume: num(2, (hour) => (date) => ({...date, hour})),
    },
    "mm": {
        format: (date) => StringUtil.padding(date.getMinutes(), 2),
        consume: num(2, (minute) => (date) => ({...date, minute})),
    },
    "a": {
        format: (date) => date.getHours() < 12 ? "am" : "pm",
        consume: str(2, (z) => (date) => ({...date, hour: z == "pm" ? date.hour + 12 : date.hour})),
    },
    "A": {
        format: (date) => date.getHours() < 12 ? "AM" : "PM",
        consume: str(2, (z) => (date) => ({...date, hour: z == "PM" ? date.hour + 12 : date.hour})),
    },
};

function plain(str) {
    return {
        format: () => str,
        consume: (text) => {
            if (text.startsWith(str)) {
                return {length: str.length};
            }
            return null;
        },
    };
}

function parseFormat(format) {
    let track = 0;
    let tokens = [];

    for (;;) {
        let min = O.reduce(types, (min, val, key) => {
            let index = format.indexOf(key, track);
            if (index == -1) {
                return min;
            }

            if (min == null || min.index > index || (min.index == index && min.key.length < key.length)) {
                return {key, index};
            }
            return min;
        });

        if (min != null) {
            if (track < min.index) {
                tokens.push(plain(format.substring(track, min.index)));
            }

            tokens.push(types[min.key]);

            track = min.index + min.key.length;

            if (track == format.length) {
                return tokens;
            }
        } else {

            if (track < format.length) {
                tokens.push(plain(format.substring(track)));
            }
            return tokens;
        }
    }
}

function toDate(date) {
    return new Date(date.year,date.month,date.day,date.hour,date.minute,date.second,date.ms);
}

const DateFormat = {
    createDateFormat(format) {

        let tokens = parseFormat(format);

        return {
            format: (date) => {
                return tokens.map((t) => t.format(date)).join("");
            },
            parse: (string) => {
                let date = {year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0, ms: 0};

                for (const t of tokens) {
                    let consume = t.consume(string);
                    if (consume == null) {
                        return null;
                    }
                    if (consume.mutate) {
                        date = consume.mutate(date);
                    }
                    string = string.substring(consume.length);
                }

                if (string.length) {
                    return null;
                }

                return toDate(date);
            },
        };
    }
};

exports.DateFormat = DateFormat;

