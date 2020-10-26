const mysql = require('mysql')

// 配置 

const config = {
    host : 'localhost',
    user : 'root',
    password : 'example',
    database : 'ahj'
}

// 创建数据库连接对象
const conn = mysql.createConnection(config)

// 连接
conn.connect(err=>{
    if(err){
        console.log(err)
        return 
    } else {
        console.log('连接成功')
    }
})


// 创建表
const CREATE_SQL = `
      CREATE TABLE IF NOT EXISTS test (
        id INT NOT NULL AUTO_INCREMENT,
        message VARCHAR(45) NULL,
        PRIMARY KEY (id)
      )
`
const INSERT_SQL = `
INSERT INTO test(message) VALUES(?)
`;
const SELECT_SQL =  `
SELECT * FROM test 
`
conn.query(CREATE_SQL , err=>{
    if(err){
        throw err 
    }
    // 插入数据
    conn.query(INSERT_SQL , 'hello mysql' , (err , result)=>{
        if(err){
            throw err 
        }
        console.log(result)
    conn.query(SELECT_SQL , (err , results)=>{
         console.log(JSON.stringify(results))
         conn.end()    // 
    })
    })
    
})