const mysql = require('mysql');
const http = require('http');
const port = 8080;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'huydo',
    password: 'Huydothe1999@',
    database: 'demo2',
    charset: 'utf8_general_ci'
});


connection.connect(function (err) {
    if (err) {
        throw err.stack;
    }
    else {
        console.log("connect success");
        const sql = "CREATE TABLE IF NOT EXISTS newProducts (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT ,name varchar(30) not null, price INT NOT NULL)";
        connection.query(sql, function (err) {
            if (err) {
                console.log(err);
            }
            console.log('Create table success');
        });
    }
});

const server = http.createServer(async (req, res) => {
    try{
        if(req.url === '/product/create' && req.method === 'POST'){
            const buffers = [];
            for await (const chunk of req){
                buffers.push(chunk);
            }
            const data = Buffer.concat(buffers).toString();
            const products = JSON.parse(data);
            const price = parseInt(products.price);
            const sqlCreate = `insert into products(name,price) values('${products.name}','${price}');`;
            connection.query(sqlCreate,(err,results)=>{
                if(err) throw err;
                res.end(JSON.stringify(products))
            });
        }
    }catch (err){
        return res.end(err.message)
    }
})

server.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})