const connectToDatabase = require("../db/oracle");
const oracledb = require("oracledb");
const catchAsync = require("../utils/catchAsync");

exports.sadGeneralSegment = catchAsync(async (req, res, next) => {
    const connection = await connectToDatabase();
    const { start, end, type, COD } = req.query;
    console.log(typeof type);
    try {
        // const sadGeneral = await connection.execute(`select * from AWUNADM.UNCUOTAB where CUO_COD = 'AF212'`, { kbv: 1 },
        //     { fetchInfo: { "C": { type: connection.STRING } } });
        const query = `SELECT DEC_REF_YER
             RefYear,
         ide_typ_sad
             TypeSad,
         tpt_cuo_cod
             TptCuoCod,
         tpt_cuo_nam
             BorderCustoms,
         ide_cuo_cod
             IdeCuoCod,
         ide_cuo_nam
             DestCustoms,
         DECODE (IDE_TYP_TYP,  'I', g.cmp_con_cod,  'E', g.CMP_EXP_COD)
             CompanyTIN,
         DECODE (
             IDE_TYP_TYP,
             'I', SUBSTR (
                      DBMS_LOB.SUBSTR (g.CMP_CON_NAM, 4000, 1),
                      0,
                      INSTR (DBMS_LOB.SUBSTR (g.CMP_CON_NAM, 4000, 1),
                             CHR (10))),
             'E', SUBSTR (
                      DBMS_LOB.SUBSTR (g.CMP_EXP_NAM, 4000, 1),
                      0,
                      INSTR (DBMS_LOB.SUBSTR (g.CMP_EXP_NAM, 4000, 1),
                             CHR (10))))
             CmpName,
         SUBSTR (DBMS_LOB.SUBSTR (g.cmp_fis_nam, 4000, 1),
                 0,
                 INSTR (DBMS_LOB.SUBSTR (g.cmp_fis_nam, 4000, 1), CHR (10)))
             FinName,
         ide_reg_nbr
             RegNo,
         TO_CHAR (ide_reg_dat, 'yyyy/mm/dd', 'nls_calendar=persian')
             RegDate,
         TO_CHAR (ide_rcp_dat, 'yyyy/mm/dd', 'nls_calendar=persian')
             PayDate,
         i.gds_ds3
             Dsc1,
         DBMS_LOB.SUBSTR (GDS_DSC, 4000, 1)
             Dsc2,
         tar_hsc_nb1
             HsCode,
         pck_nbr
             PkgNbr,
         pck_typ_nam
             TypeOfPack,
         vit_wgt_grs
             ItemGrossWeight,
         vit_wgt_net
             ItemNetWeight,
         vit_inv_amt_fcx
             ItemValueCurrency,
         tax_lin_cod
             TaxCode,
         tax_dsc3
             TaxDecription,
         TAX_LIN_RAT
             TaxRate,
         tax_lin_amt
             CodeTaxAmount,
         vit_inv_amt_nmu
             ItemValueAfs,
         tax_amt
             ItemTaxes,
         TPT_LOC
             locGoods,
         GDS_ORG_CTY
             Gds_Org_Cty,
         gen_cty_org
             CountryOrg,
         g.cmp_fis_cod
             CmpFisCod,
         TPT_MOT_DPA_NAM
             Truck1,
         TPT_MOT_BRD_NAM
             Truck2,
         dec_cod
             BrokerTIN,
         SUBSTR (DBMS_LOB.SUBSTR (g.dec_nam, 4000, 1),
                 0,
                 INSTR (DBMS_LOB.SUBSTR (g.dec_nam, 4000, 1), CHR (10)))
             BrokerName,
         vit_inv_cur_cod
             CurrrencyCode,
         vit_inv_cur_rat
             CurrecnyRate,
         tar_prc_ext
             ProcExt,
         tar_prc_nat
             CustomsProc,
         DECODE (IDE_TYP_TYP, 'I', 'Import', 'Export')
             SadFlw,
         i.key_itm_nbr
             ItemNo,
         PTY_NBR_ITM
             ItemTotal,
         pty_sts
             Status
    FROM awunadm.sad_general_segment g
         INNER JOIN awunadm.sad_item i ON G.INSTANCEID = I.INSTANCEID
         INNER JOIN awunadm.sad_tax t ON I.INSTANCEID = T.INSTANCEID
         INNER JOIN awunadm.untaxtab x
             ON     i.KEY_ITM_NBR = t.KEY_ITM_NBR
                AND t.tax_lin_cod = x.tax_cod
                AND x.valid_to IS NULL
   WHERE     TO_CHAR (ide_reg_dat, 'yyyy-mm-dd', 'nls_calendar=persian') BETWEEN '1399-10-01' AND '1400-09-30'
         ${COD ? `AND g.cmp_con_cod LIKE '${COD}'` : ``}
         ${type
                ? `AND IDE_TYP_TYP IN (${typeof type != 'string' ? type.map(i => `'${i}'`): `'${type}'`})`
                : `AND IDE_TYP_TYP IN ('I', 'E')`
            }
ORDER BY DEC_REF_YER,
         ide_reg_nbr,
         i.key_itm_nbr,
         tax_lin_cod`;
        //  console.log(query)
        const sadGeneral = await connection.execute(
        
            query,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        // const columnNames = sadGeneral.metaData.map((col) => col.name);
        // console.log(sadGeneral)
        // console.log(columnNames)

        res.status(200).json({
            status: "success",
            data: sadGeneral.rows,
        });
    } catch (err) {
        return next(res.send({ message: `Error reading records: ${err}` }));
    } finally {
        connection.close();
    }
});
