const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
app.listen(3000); // localhost:3000
app.use(bodyParser.json());

//
const DATABASE = {
  CONFIG: {
    host: "localhost",
    user: "root",
    password: "qwer1234",
    database: "attendance",
  },

  QUERY: {
    STUDENTS: {
      FINDALL: "SELECT * FROM STUDENTS",
      FINDBYID: "SELECT * FROM STUDENTS WHERE ID = ?",
      FINDBYADDRESS: "SELECT * FROM STUDENTS WHERE STUDENTS.ADDRESS LIKE ?",
      UPDATEBYID: "UPDATE STUDENTS SET NAME = ? WHERE ID = ?",
    },
  },
};

// try-catch 함수화
const executeQuery = async (query, params = []) => {
  try {
    const connection = await mysql.createConnection(DATABASE.CONFIG);
    const [results] = await connection.execute(query, params);
    await connection.end();

    return results;
  } catch (error) {
    console.log(error);
  }
};

//
const getStudents = async () =>
  await executeQuery(DATABASE.QUERY.STUDENTS.FINDALL);
const getIdStudents = async (id) =>
  await executeQuery(DATABASE.QUERY.STUDENTS.FINDBYID, [id]);
const getAddressStudents = async (address) =>
  await executeQuery(DATABASE.QUERY.STUDENTS.FINDBYADDRESS, [`%${address}%`]);
const updateNameStudent = async (id, name) =>
  await executeQuery(DATABASE.QUERY.STUDENTS.UPDATEBYID, [name, id]);

//
app.get("/api/students", async (req, res) => res.json(await getStudents()));
app.get("/api/students/search", async (req, res) =>
  res.json(await getAddressStudents(req.query.address))
);

//
app.post("/api/students/rename", async (req, res) => {
  const { id, name } = req.body;
  const result = await updateNameStudent(id, name);
  res.json({ result });
});
 