const xlsx = require('xlsx-style')

let workbook = xlsx.readFile('./excelModel.xlsx', {
    cellStyles: true
})

let sheet = workbook.Sheets[workbook.SheetNames[0]]
console.log(sheet['!rows'])
