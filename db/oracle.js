const oracledb = require("oracledb")

const connectToDatabase = async () => {
    try {
        // const connection = await oracledb.getConnection({ user: "asyw", password: "asyw123", connectionString: "jdbc/oracle/thin/@10.10.9.99:1521/asywdb" });    
        await oracledb.initOracleClient({ libDir: "C:/app/ali16/product/11.2.0/client_1" })
        const connection = await oracledb.getConnection({ user: "asyw", password: "asyw123", connectionString: "//10.10.9.99:1521/asywdb" });
        console.log("Successfully connected to Oracle Database");
        return connection
    } catch (err) {
        console.error("Error connecting to Oracle Database:", err)
    }
}
module.exports = connectToDatabase
