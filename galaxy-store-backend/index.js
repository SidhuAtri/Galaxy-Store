const express = require("express");
const Sequelize = require("sequelize");
const nodemailer = require("nodemailer");
const dbConfig = require("./db.config");
const productsData = require("./data");
const cors = require("cors");

var app = express();
app.use(express.json());
app.use(cors());

// Sequelize object with db parameters
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

// Connect to database
sequelize
  .authenticate()
  .then(() => {
    console.log("Successfull connected with database");
  })
  .catch((err) => {
    console.log("Unable to connect to db, reason : " + err);
  });

// Create a table productDetails
let productsSequelize = sequelize.define(
  "productDetails",
  {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    title: Sequelize.STRING,
    price: Sequelize.FLOAT,
    description: Sequelize.STRING(800),
    category: Sequelize.STRING,
    image: Sequelize.STRING,
    rate: Sequelize.FLOAT,
    count: Sequelize.INTEGER,
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// Drops the old table and recreates new with force:true as the flag
productsSequelize
  .sync()
  .then(() => {
    console.log("Table connected Successfully");
  })
  .catch((err) => {
    console.log("Error in connecting table : " + err);
  });

// // Inserting Data into Products table
// productsSequelize
//   .bulkCreate(productsData)
//   .then(() => {
//     console.log("Data Inserted Successfully");
//   })
//   .catch((err) => {
//     console.log("Error in inserting : " + err);
//   });

app.get("/products", (req, res) => {
  productsSequelize
    .findAll({ raw: true })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log("Error fetching data : " + err);
    });
});

// productbyID
app.get("/product/:Id", (req, res) => {
  var Id = req.params.Id;
  productsSequelize
    .findAll({ where: { id: Id }, raw: true })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log("Error fetching data : " + err);
    });
});

// Create table userDetails
let usersSequelize = sequelize.define(
  "userDetails",
  {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    phone: Sequelize.BIGINT,
    password: Sequelize.STRING,
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// Drops the old table and recreates new with force:true as the flag
usersSequelize
  .sync()
  .then(() => {
    console.log("Table connected Successfully");
  })
  .catch((err) => {
    console.log("Error in connecting table : " + err);
  });

// Insert data in user Details table
app.post("/register", (req, res) => {
  userName = req.body.name;
  userEmail = req.body.email;
  userPhone = req.body.phone;
  userPassword = req.body.password;

  usersSequelize.findAndCountAll({ raw: true }).then((data) => {
    let user = usersSequelize.build({
      name: userName,
      email: userEmail,
      phone: userPhone,
      password: userPassword,
      id: data.count + 1,
    });

    user
      .save()
      .then((data) => {
        res.status(201).send({ response: "Record Inserted." });
      })
      .catch((err) => {
        res.status(400).send("Error inserting record : " + err);
      });
  });
});

// GET users
app.get("/users", (req, res) => {
  usersSequelize
    .findAll({ raw: true })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log("Error fetching data : " + err);
    });
});

// Orders Table
// Create table userDetails
let orderSequelize = sequelize.define(
  "orderDetails",
  {
    title: Sequelize.STRING,
    price: Sequelize.FLOAT,
    quantity: Sequelize.INTEGER,
    image: Sequelize.STRING,
    userID: Sequelize.INTEGER,
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// Drops the old table and recreates new with force:true as the flag
orderSequelize
  .sync()
  .then(() => {
    console.log("Table connected Successfully");
  })
  .catch((err) => {
    console.log("Error in connecting table : " + err);
  });

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Sidharth12atri@gmail.com",
    pass: "password",
  },
});

var mailOptions = {
  from: "Sidharth12atri@gmail.com",
  to: "sidharthatri@gmail.com",
  subject: "Congratulations! Order Placed",
  text: "Your Order has been placed successfully.",
};

// POST Order
app.post("/addOrders", (req, res) => {
  orderSequelize
    .bulkCreate(req.body)
    .then(() => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.status(201).send({ response: "Record Inserted." });
    })
    .catch((err) => {
      res.status(400).send("Error inserting record : " + err);
    });
});

// GET Orders
app.get("/orders/:Id", (req, res) => {
  var id = req.params.Id;
  orderSequelize
    .findAll({ where: { userID: id }, raw: true })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log("Error fetching data : " + err);
    });
});

// GET Customers
app.get("/usersDetails", (req, res) => {
  sequelize
    .query(
      "select name, email, phone, title, price from userDetails inner join orderDetails where userDetails.id = orderDetails.userID",
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    )
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log("Error fetching data : " + err);
    });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
