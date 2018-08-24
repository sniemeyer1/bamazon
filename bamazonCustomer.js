//dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
//make mysql connection
var connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : 'testing123',
    database : 'bamazon_db'
  })
  //initialize connection 
  connection.connect(function(err){
      if (err) throw err;
      console.log("connection successful");
      //table function
      makeTable();
  })
//collects info needed from mysql db and prints to console
  var makeTable = function(){
      connection.query("SELECT * FROM products", function(err, res){
          for(var i=0; i<res.length; i++){
              console.log(res[i].id+" || "+res[i].product_name+" || "+
            res[i].department_name+" || "+res[i].highest_bid+" || "+res[i].stock_quantity+"\n");
          }
          promptCustomer(res);
      })
  }
  //create inquirer prompt lets user select from options and purchase
  var promptCustomer = function(res){
      inquirer.prompt([{
          type: "input",
          name: "choice",
          message: "What would you like to purchase?"
      }]).then(function(answer){
          var correct = false;
          //loops through response from query
          for(var i=0; i<res.length;i++){
              //if product is the same as string
              if(res[i].product_name==answer.choice){
                  correct = true; 
                  var product = answer.choice;
                  var id=i;
                  //inquirer prompt for quantity
                  inquirer.prompt({
                    type: "input",
                    name: "quantity",
                    message: "How many units would you like to purchase?",
                    //check for number
                    validate: function(value){
                        if(isNaN(value)==false){
                            return true;
                        } else {
                            return false;
                        }
                    }
                  }).then(function(answer){
                      //if isn't greater than stock quantity then it will log that it is purchased and update stock in db
                      if((res[id].stock_quantity-answer.quantity)>0){
                          connection.query("UPDATE products SET stock_quantity='"+
                                (res[id].stock_quantity-answer.quantity)+" 'WHERE product_name='"+
                                product+"'", function(err,res2){
                                console.log("Success. Thank you for your purchase!");
                                makeTable();
                            })
                      } else {
                          console.log("Insufficient quantity. Check stock and try a smaller quantity.");
                          promptCustomer(res);
                      }
                  })
              }
          }
          if(i==res.length && correct==false){
            console.log("Not a valid selection.");
            promptCustomer(res);
          }
      })
  }