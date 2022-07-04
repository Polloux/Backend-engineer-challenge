const getDate = require("../src/app")
const axios = require("axios")
const Databox = require("databox");
const tokens = require("../util/tokens");

function isDateValid(date) {
    // Does date return correct format
    const dateString = date.toString();
    if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateString)) {
        return false
    }
    let parts = dateString.split(/[\s:-]+/)

    // Parse the date parts to integers
    var day = parseInt(parts[2])
    var month = parseInt(parts[1])
    var year = parseInt(parts[0])

    // Check the ranges of month and year
    if (3000 < year || year < 1000 || month === 0 || month > 12) {
        return false
    }

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    // Leap years adjustment
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
        monthLength[1] = 29
    }

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1]
}


test('Is date format correct', () => {
    const result = getDate()
    expect(isDateValid(result)).toBe(true)
})


describe("Blockchain API Testing", () => {
    it("Should obtain website api status", async () => {
        const res = await axios.get('https://blockchain.info/ticker', { // Calling GET API
            headers: {
                'Content-Type': 'application/json',
            }
        });
        expect(res.status).toBe(200); // Is the response code 200
    })
})


describe("Testing Databox push", () => {
    it('should push key and value and return OK status', () => {
        var client = new Databox({
            push_token: tokens.databoxToken
        });

        client.push({
            key: 'Jest',
            value: 1,
            date: "2022-07-04 02:12:11"
        }, function (result) {
            expect(result.status).toEqual("OK")
        });
    })
})