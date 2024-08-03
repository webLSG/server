const mysql = require("mysql2/promise");

const getStudents = async () => {
  try {
    // db연결
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "qwer1234",
      database: "attendance",
    });
    const [results] = await connection.query("select * from students");
    console.log(results);
    await connection.end();
  } catch (err) {
    console.log(err);
  }
};

getStudents();
