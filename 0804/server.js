const express = require("express");
const app = express();
// localhost:3000
app.listen(3000);
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

/**
app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/icecream", (req, res) => {
  res.send("연우는 메로나를 좋아한다");
});

app.get("/rap", (req, res) => {
  res.send("연우는 랩을 좋아한다");
});

app.get("/movie", (req, res) => {
  const movie = [
    { name: "인사이드아웃2", running: 90 },
    { name: "파일럿", running: 100 },
    { name: "사랑의 하츄핑", running: 70 },
  ];
  res.json(movie);
});
*/

const updateNameStudent = async (id, name) => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "qwer1234",
      database: "attendance",
    });

    const results = await connection.query(
      `UPDATE STUDENTS SET name = "${name}" where id = ${id}`
    );
    await connection.end();
    return results;
  } catch (error) {
    console.log(error);
  }
};

// /students
const getStudents = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "qwer1234",
      database: "attendance",
    });

    const [results] = await connection.query("SELECT * FROM STUDENTS");
    await connection.end();

    return results;
  } catch (error) {
    console.log(error);
  }
};
app.get("/students", async (req, res) => {
  const data = await getStudents();
  res.send(`
    <section style="display: flex; flex-direction: column; gap: 10px">
      ${data
        .map(({ name, phone, address }) => {
          return `
        <div style=" display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 20px;
          width: 500px;
          padding: 20px;">
          <div style="width: 50px; height: 50px; object-fit: contain">
            <img style="width: 100%; height: 100%; border-radius: 100px" src="kakao.png" />
          </div>

          <div>${name}</div>
          <div>${phone}</div>
          <div>${address}</div>
        </div>
        `;
        })
        .join("")}
    </section>  
  `);
});
app.get("/api/students", async (req, res) => {
  res.json(await getStudents());
});
app.get("/cars/:id", (req, res) => {
  res.send(`Cars ID: ${req.params.id}`);
});

// app.get("/students/:id", async (req, res) => {
//   const data = await getStudents();
//   data.map(({ id, name }) => (req.params.id == id ? res.send(name) : ""));
// });

const getAddressStudents = async (address) => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "qwer1234",
      database: "attendance",
    });

    const [results] = await connection.query(
      `SELECT * FROM STUDENTS WHERE students.address like "%${address}%"`
    );
    await connection.end();

    return results;
  } catch (error) {
    console.log(error);
  }
};
app.get("/api/students/search", async (req, res) => {
  const data = await getAddressStudents(req.query.address);
  res.json(data);
});

//
app.post("/api/students/test", (req, res) => {
  // post 받는 값은 body에 다 저장되어 있음
  const { name, age, desc } = req.body;
  console.log({ name, age, desc });
  res.json({ results: "성공" });
});

//

app.post("/api/students/rename", async (req, res) => {
  const { id, name } = req.body;
  const result = await updateNameStudent(id, name);
  res.json({ result });
});
