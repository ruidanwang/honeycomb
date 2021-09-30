import ExcelJS from 'exceljs'

var sheetConfig;
// var exportExcel =  async function (luckysheet) { // 参数为luckysheet.getluckysheetfile()获取的对象
export async function exportExcel(luckysheet) {// 参数为luckysheet.getluckysheetfile()获取的对象
    // 1.创建工作簿，可以为工作簿添加属性
    const workbook = new ExcelJS.Workbook()
    // 2.创建表格，第二个参数可以配置创建什么样的工作表
    luckysheet.every(function (table) {
        console.log(JSON.stringify(table.data))
        if (table.data.length === 0) return true
        sheetConfig = table.config;
        const worksheet = workbook.addWorksheet(table.name)
        // 3.设置单元格合并,设置单元格边框,设置单元格样式,设置值
        setStyleAndValue(table.data, worksheet)
        setMerge(table.config.merge, worksheet)
        setBorder(table.config.borderInfo, worksheet)
        //setwidthcol(table.data, worksheet);
        return true
    })

    // 4.写入 buffer
    const buf = await workbook.xlsx.writeBuffer();
    // 下载 excel
    workbook.xlsx.writeBuffer().then((buf) => {
        let blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
        const downloadElement = document.createElement('a')
        let href = window.URL.createObjectURL(blob)
        downloadElement.href = href
        downloadElement.download = document.getElementById("luckysheet_info_detail_input").value + ".xlsx"; // 文件名字
        document.body.appendChild(downloadElement)
        downloadElement.click()
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
    });

}

var setMerge = function (luckyMerge = {}, worksheet) {
    const mergearr = Object.values(luckyMerge)
    mergearr.forEach(function (elem) { // elem格式：{r: 0, c: 0, rs: 1, cs: 2}
        // 按开始行，开始列，结束行，结束列合并（相当于 K10:M12）
        worksheet.mergeCells(elem.r + 1, elem.c + 1, elem.r + elem.rs, elem.c + elem.cs)
    })
}

var setBorder = function (luckyBorderInfo, worksheet) {
    if (!Array.isArray(luckyBorderInfo)) return
    luckyBorderInfo.forEach(function (elem) {
        var val = elem.value;
        let border = {}
        const luckyToExcel = {
            type: {
                'border-all': 'all',
                'border-top': 'top',
                'border-right': 'right',
                'border-bottom': 'bottom',
                'border-left': 'left'
            },
            style: {
                0: 'none',
                1: 'thin',
                2: 'hair',
                3: 'dotted',
                4: 'dashDot', // 'Dashed',
                5: 'dashDot',
                6: 'dashDotDot',
                7: 'double',
                8: 'medium',
                9: 'mediumDashed',
                10: 'mediumDashDot',
                11: 'mediumDashDotDot',
                12: 'slantDashDot',
                13: 'thick'
            }
        }

        if (val.t !== undefined) {
            border['top'] = { style: luckyToExcel.style[val.t.style], color: val.t.color }
        }
        if (val.r !== undefined) {
            border['right'] = { style: luckyToExcel.style[val.r.style], color: val.r.color }
        }
        if (val.b !== undefined) {
            border['bottom'] = { style: luckyToExcel.style[val.b.style], color: val.b.color }
        }
        if (val.l !== undefined) {
            border['left'] = { style: luckyToExcel.style[val.l.style], color: val.l.color }
        }
        worksheet.getCell(val.row_index + 1, val.col_index + 1).border = border
    })
}
var setStyleAndValue = function (cellArr, worksheet) {
    if (!Array.isArray(cellArr)) return

    cellArr.forEach(function (row, rowid) {
        const dbrow = worksheet.getRow(rowid + 1);
        if(sheetConfig.customHeight!== undefined&&sheetConfig.customHeight[rowid]!== undefined){
            dbrow.height= sheetConfig.rowlen[rowid]/1.5;
        }
        row.every(function (cell, columnid) {
            if (!cell) return true
            if (rowid === 0) {
                const dobCol = worksheet.getColumn(columnid + 1);
                if(sheetConfig.columnlen[columnid] !== undefined){
                    dobCol.width=sheetConfig.columnlen[columnid]/8;
                }
            }
            
            let fill = fillConvert(cell.bg)
            let font = fontConvert(cell.ff, cell.fc, cell.bl, cell.it, cell.fs, cell.cl, cell.ul)
            let alignment = alignmentConvert(cell.vt, cell.ht, cell.tb, cell.tr)
            let value

            console.log(JSON.stringify(cell));
            var v = '';
            if (cell.ct.t === 'inlineStr') {
                var s = cell.ct.s;
                s.forEach(function (val, num) {
                    v += val.v;
                })
            } else {
                v = cell.v;
            }
            if (cell.f) {
                value = { formula: cell.f, result: v }
            } else {
                value = v
            }
            let target = worksheet.getCell(rowid + 1, columnid + 1)
            target.fill = fill
            target.font = font
            target.alignment = alignment
            target.value = value
            return true
        })
    })
}


var fillConvert = function (bg) {
    if (!bg) {
        return {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '#ffffff'.replace('#', '') }
        }
    }
    let fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bg.replace('#', '') }
    }
    return fill
}

var fontConvert = function (ff = 0, fc = '#000000', bl = 0, it = 0, fs = 10, cl = 0, ul = 0) { // luckysheet：ff(样式), fc(颜色), bl(粗体), it(斜体), fs(大小), cl(删除线), ul(下划线)
    const luckyToExcel = {
        0: '微软雅黑',
        1: '宋体（Song）',
        2: '黑体（ST Heiti）',
        3: '楷体（ST Kaiti）',
        4: '仿宋（ST FangSong）',
        5: '新宋体（ST Song）',
        6: '华文新魏',
        7: '华文行楷',
        8: '华文隶书',
        9: 'Arial',
        10: 'Times New Roman ',
        11: 'Tahoma ',
        12: 'Verdana',
        num2bl: function (num) {
            return num === 0 ? false : true
        }
    }

    let font = {
        name: ff,
        family: 1,
        size: fs,
        color: { argb: fc.replace('#', '') },
        bold: luckyToExcel.num2bl(bl),
        italic: luckyToExcel.num2bl(it),
        underline: luckyToExcel.num2bl(ul),
        strike: luckyToExcel.num2bl(cl)
    }

    return font
}

var alignmentConvert = function (vt = 'default', ht = 'default', tb = 'default', tr = 'default') { // luckysheet:vt(垂直), ht(水平), tb(换行), tr(旋转)
    const luckyToExcel = {
        vertical: {
            0: 'middle',
            1: 'top',
            2: 'bottom',
            default: 'top'
        },
        horizontal: {
            0: 'center',
            1: 'left',
            2: 'right',
            default: 'left'
        },
        wrapText: {
            0: false,
            1: false,
            2: true,
            default: false
        },
        textRotation: {
            0: 0,
            1: 45,
            2: -45,
            3: 'vertical',
            4: 90,
            5: -90,
            default: 0
        }
    }

    let alignment = {
        vertical: luckyToExcel.vertical[vt],
        horizontal: luckyToExcel.horizontal[ht],
        wrapText: luckyToExcel.wrapText[tb],
        textRotation: luckyToExcel.textRotation[tr]
    }
    return alignment

}

var borderConvert = function (borderType, style = 1, color = '#000') { // 对应luckysheet的config中borderinfo的的参数
    if (!borderType) {
        return {}
    }
    const luckyToExcel = {
        type: {
            'border-all': 'all',
            'border-top': 'top',
            'border-right': 'right',
            'border-bottom': 'bottom',
            'border-left': 'left'
        },
        style: {
            0: 'none',
            1: 'thin',
            2: 'hair',
            3: 'dotted',
            4: 'dashDot', // 'Dashed',
            5: 'dashDot',
            6: 'dashDotDot',
            7: 'double',
            8: 'medium',
            9: 'mediumDashed',
            10: 'mediumDashDot',
            11: 'mediumDashDotDot',
            12: 'slantDashDot',
            13: 'thick'
        }
    }
    let template = { style: luckyToExcel.style[style], color: { argb: color.replace('#', '') } }
    let border = {}
    if (luckyToExcel.type[borderType] === 'all') {
        border['top'] = template
        border['right'] = template
        border['bottom'] = template
        border['left'] = template
    } else {
        border[luckyToExcel.type[borderType]] = template
    }
    return border
}
