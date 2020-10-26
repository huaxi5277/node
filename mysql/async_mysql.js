(async ()=>{
    const mysql = require('mysql2/promise')

    const config = {
        host : 'localhost',
        user : 'root',
        password : 'example',
        database : 'ahj'
    }

    const connection = await mysql.createConnection(config)

    let ret = await connection.execute(
        `
         CREATE TABLE IF NOT EXISTS  test (
             id INT NOT NULL AUTO_INCREMENT,
             message VARCHAR(45) NULL,
             PRIMARY KEY (id)
         )
        `
    )
    ret = await connection.execute(
        `
          INSERT INTO test (message)
          VALUES(?)
        `,['ABC']
    )
    ret = await connection.execute(
        `
         SELECT * FROM test 
        `
    )
    connection.end()
})()