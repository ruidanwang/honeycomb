import React from 'react';
import {exportExcel} from './ExportExcel'
// import ExcelJS from 'exceljs'
import {
    Button,
    Upload
} from 'antd'

class SheetTools extends React.Component {

    
    downAction() {
        // exportExcel(window.luckysheet.getluckysheetfile());
        exportExcel(window.luckysheet.getAllSheets());
    }

    uploadAndShow(e) {
        var file = e.file;
        if (file == null || file.length === 0) {
            alert("No files wait for import");
            return;
        }
        var LuckyExcel = window.LuckyExcel;
        let name = file.name;
        let suffixArr = name.split("."),
            suffix = suffixArr[suffixArr.length - 1];
        if (suffix !== "xlsx") {
            alert("Currently only supports the import of xlsx files");
            return;
        }
       
        LuckyExcel.transformExcelToLucky(file.originFileObj, function (exportJson, luckysheetfile) {
            if (exportJson.sheets == null || exportJson.sheets.length === 0) {
                alert("Failed to read the content of the excel file, currently does not support xls files!");
                return;
            }
            window.luckysheet.destroy();

            window.luckysheet.create({
                container: 'luckysheet', //luckysheet is the container id
                showinfobar: false,
                lang: 'zh',
                data: exportJson.sheets,
                title: exportJson.info.name,
                userInfo: exportJson.info.name.creator,
            });
        });
    }

    render() {

        return (
            <div id="optools" className="toolsRight">
                <Button id="downloadbtn" type="primary" onClick={() => this.downAction()}>下载</Button>
                <Upload onChange={(e) => this.uploadAndShow(e)}>
                    <Button id="uploadInputBtn" >上传</Button>
                </Upload>
            </div>
        )
    }
}
export default SheetTools




