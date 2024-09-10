const connectToDatabase = require("../db/oracle");
const catchAsync = require("../utils/catchAsync");

exports.sadGeneralSegment = catchAsync(async (req, res, next) => {
    const connection = await connectToDatabase()

    try {
        const sadGeneral = await connection.execute(`select * from AWUNADM.UNCUOTAB`);
        console.log(sadGeneral)
    
        res.status(200).json({
            status: 'success',
            data: {
                data: sadGeneral,
            },
        });
    } catch (err) {
        return next(res.send({ message: `Error reading records: ${err}` }))
    } finally {
        connection.close()
    }
});
