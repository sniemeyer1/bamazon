USE bamazon_DB;

CREATE TABLE products(
  id INT(10) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  stock_quantity INT default 0,
  highest_bid INT default 0,
  PRIMARY KEY (id)
);
