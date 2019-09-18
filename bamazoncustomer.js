var mysql = require('mysql');

// Load the NPM Package inquirer
var inquirer = require("inquirer");

// mysql -u root -p
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysqlpassword',
    database: 'bamazon',
    port: 3306
});

connection.connect();

function allProducts() {
    connection.query('SELECT item_id AS "Item #", product_name AS "Product", price AS Price FROM bamazon.products LIMIT 11;', function (error, results, fields) { //Had to LIMIT 11 because it would only show 3 results otherwise.
        if (error) throw error;
        console.log("\n \n Here are the products we've chosen for you! \n ")
        console.table(results)
        console.log('\n ')
        whatProducts();
    });
}

function whatProducts() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What product would you like to buy?(Please type the 'item #')",
                name: "item_id"
            },
            {
                type: "input",
                message: "How many would you like to buy?",
                name: "quantity"
            }
        ])
        .then(function (resp) {
            console.log('You chose item #: ' + resp.item_id);
            // setTimeout(function () {
            addToCart(resp.item_id, resp.quantity);
            // }, 2000)
        });
}

function addToCart(cid, quantity) {
    connection.query('SELECT * FROM products', function (error, results, fields) {
        // console.log(results);
        // console.log(error, 'line 54')
        // if (error) throw error;
        var cid1 = parseInt(cid) - 1
        console.log('\n \n \nThis item costs: \n$' + parseInt(results[cid1].price))
        stockCheck(quantity, cid1, results[cid1].price)
    });
}

function stockCheck(itemCount, itemNum, itemPrice) {
    connection.query('SELECT * FROM bamazon.products LIMIT 11;', function (error, results, fields) {
        if (error) throw error;
        if (itemCount <= results[itemNum].stock_quantity) {
            console.log('You want to buy ' + itemCount + ' ' + results[itemNum].product_name + '\nYour total is: $' + (parseInt(itemCount) * parseInt(itemPrice)) + '.');
            success(itemCount, itemNum, itemPrice)
        }
        else {
            console.log(" We do not have enough items in stock for your order. \n Please try again later!")
        }
    });

}

function success(itemCount, itemNum, itemPrice) {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Please confirm your purchase",
                choices: ["Confirm", "Cancel"],
                name: "confirm"
            },
        ])
        .then(function (resp) {
            if (resp.confirm == "Confirm") {
                console.log('Your order has processed. \n Thank you for shopping at Bamazon!')
            }
            whatDoYouWantToDo()
        });

}

whatDoYouWantToDo();


function whatDoYouWantToDo() {
    inquirer
        .prompt([{
            type: "list",
            message: "Welcome to Bamazon! \n What do you want to do?",
            choices: ["Let's go shopping!", "I'm ready to leave now."],
            name: "what_to_do"
        }
        ])
        .then(function (resp) {
            if (resp.what_to_do == "Let's go shopping!") {
                allProducts();
            }
            else if ("I'm ready to leave now.") {
                console.log('Thanks for helping us take over the world! -Sincerly former Mrs. Bezos');
                connection.end();
            }
            else {
                allProducts();
            }
        }

        );
}



// connection.end();