var officegen = require('officegen');
var fs = require('fs');
var path = require('path');
var docx = officegen ( 'docx' );
var async = require('async');

module.exports = {
    downloadRequestion() {
        console.log('exportWord-------------');
        docx.on ( 'finalize', function ( written ) {
                    console.log ( 'Finish to create Word file.\nTotal bytes created: ' + written + '\n' );
                });


        docx.on ( 'error', function ( err ) {
                    console.log ( err );
                });

        let header = docx.createP()

        header.options.align = 'center'
        header.addText('网络与信息安全技术研究中心出差任务审批单', {
            font_face: '宋体',
            font_size: 14,
            bold: true
        })
        docx.options.align = 'center'

        let table = [
            [{
                val: '申请人',
                opts: {
                    cellColWidth: 1300,
                    sz: '24',
                    align: 'center',
                    vAlign: 'center',
                    fontFamily: "宋体"
                }
            },{
                val: '闫建恩',
                opts: {
                    cellColWidth: 1900,
                    sz: '24',
                    vAlign: 'center',
                    align: 'left',
                },
                fontFamily: "宋体"
            },{
                val: '出差时间',
                opts: {
                    cellColWidth: 1300,
                    sz: '24',
                    align: "center",
                    vAlign: 'center',
                    fontFamily: "宋体"
                }
            },{
                val: '2017.11.21-22',
                opts: {
                    cellColWidth: 1900,
                    align: 'left',
                    sz: '24',
                    vAlign: 'center',
                    fontFamily: "宋体"
                }
            }],
            [{
                val: '计入项目',
                opts: {
                    cellColWidth: 1300,
                    sz: '24',
                    align: 'center',
                    vAlign: 'center',
                    fontFamily: "宋体"
                }
            },{
                val: '重点项目',
                opts: {
                    cellColWidth: 1900,
                    sz: '24',
                    align: 'left',
                    vAlign: 'center',
                    fontFamily: "宋体"
                }
            },{
                val: '交通工具',
                opts: {
                    cellColWidth: 1300,
                    sz: '24',
                    align: "center",
                    vAlign: 'center',
                    fontFamily: "宋体"
                }
            },{
                val: '飞机',
                opts: {
                    cellColWidth: 1900,
                    align: 'left',
                    sz: '24',
                    vAlign: 'center',
                    fontFamily: "宋体"
                }
            }]
        ]

        let tableStyle = {
            borders: true,
            tableAlign: 'center'
        }
        docx.createTable(table, tableStyle)

        let split = docx.createP()
        split.addLineBreak ();

        table = [
            [{
                val: '目的地',
                opts: {
                    cellColWidth: 1300,
                    sz: '24',
                    align: "center",
                    fontFamily: "宋体"
                }
            },{
                val: '北京',
                inline: true,
                opts: {
                    cellColWidth: 5100,
                    sz: '24',
                    align: "left",
                    fontFamily: "宋体"
                }
            }],
            [{
                val: '出差事由',
                opts: {
                    cellColWidth: 1300,
                    sz: '24',
                    align: "center",
                    fontFamily: "宋体"
                }
            },{
                val: 'qweqwewqerqwerwqrwqrew',
                opts: {
                    cellColWidth: 5100,
                    sz: '24',
                    align: "left",
                    fontFamily: "宋体"
                }
            }],
            [{
                val: '课题组长审批意见',
                opts: {
                    cellColWidth: 1300,
                    sz: '24',
                    align: "center",
                    fontFamily: "宋体"
                }
            },{
                val: '',
                opts: {
                    cellColWidth: 5100,
                    sz: '24',
                    align: "left",
                    fontFamily: "宋体"
                }
            }],
            [{
                val: '中心领导审批意见',
                opts: {
                    cellColWidth: 1300,
                    sz: '24',
                    align: "center",
                    fontFamily: "宋体"
                }
            },{
                val: '',
                opts: {
                    cellColWidth: 5100,
                    sz: '24',
                    align: "left",
                    fontFamily: "宋体"
                }
            }]
        ]
        docx.createTable(table, tableStyle)
        var out = fs.createWriteStream ( 'out.docx' );// 文件写入
        out.on ( 'error', function ( err ) {
            console.log ( err );
        });


        var result = docx.generate (out);// 服务端生成word


    //     res.writeHead ( 200, {

    // // 注意这里的type设置，导出不同文件type值不同application/vnd.openxmlformats-officedocument.presentationml.presentation
    //         "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    //  'Content-disposition': 'attachment; filename=out.docx'

    //     });
    //     docx.generate (res);// 客户端导出word
    },
    downloadReimbursement() {

    }
}
