webpackJsonp([1],{"+/2j":function(e,t){},AexS:function(e,t){},LHnv:function(e,t){},NHnr:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=o("7+uW"),s=o("NYxO"),l=o("1nuA");function a(e){return e.toString().length>1?""+e:"0"+e}function i(e){if(!e)return"";var t=new Date(+e),o=t.getFullYear(),r=t.getMonth()+1,s=t.getDate();return o+"/"+a(r)+"/"+a(s)}function n(e){return l.parse(e)}var c={name:"App",data:function(){return{}},created:function(){var e=this,t=n(location.href.split("?")[1]);t.token&&(localStorage.setItem("token",t.token),this.$store.commit("setToken",t.token.slice(0,-5)));var o=this.$store.state.token||localStorage.getItem("token")&&localStorage.getItem("token").slice(0,-5);o?this.$store.state.user.id?this.user=this.$store.state.user:this.$request.post("/test/getUserInfor").set("Authorization","Bearer "+o).set("accept","json").end(function(t,r){t?401===t.status?location.href=location.origin+"/#/login?type=manager":e.$message({type:"error",message:t.response.text}):(r.body.token&&(localStorage.setItem("token",r.body.token+Math.random().toFixed(3)),o=r.body.token),e.$store.commit("setToken",o),e.$store.commit("setUser",r.body))}):location.href=location.origin+"/#/login?type=manager"}},u={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"app"}},[t("router-view")],1)},staticRenderFns:[]};var d=o("VU/8")(c,u,!1,function(e){o("AexS")},null,null).exports,p=o("zL8q"),m=o.n(p),v=(o("tvR6"),o("GG98")),f=o.n(v),g=o("/ocq"),h={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"index"},[o("el-container",[o("el-aside",[o("el-menu",{staticClass:"el-menu-vertical-demo",attrs:{"default-active":"1","background-color":"#545c64","text-color":"#fff","active-text-color":"#ffd04b",router:!0}},[o("el-menu-item",{attrs:{index:"project",route:"/manage/project"}},[o("span",{attrs:{slot:"title"},slot:"title"},[e._v("项目管理")])]),e._v(" "),o("el-menu-item",{attrs:{index:"policy",route:"/manage/policy"}},[o("span",{attrs:{slot:"title"},slot:"title"},[e._v("制度管理")])]),e._v(" "),o("el-menu-item",{attrs:{index:"person",route:"/manage/person"}},[o("span",{attrs:{slot:"title"},slot:"title"},[e._v("人员管理")])]),e._v(" "),o("el-menu-item",{attrs:{index:"dictionary",route:"/manage/dictionary"}},[o("span",{attrs:{slot:"title"},slot:"title"},[e._v("词典管理")])])],1)],1),e._v(" "),o("el-main",[o("router-view")],1)],1)],1)},staticRenderFns:[]};var _=o("VU/8")({name:"index",data:function(){return{}},created:function(){}},h,!1,function(e){o("gIYk")},null,null).exports,b=o("Dd8w"),y=o.n(b),k={data:function(){return{param:{id:"",title:"",occurTime:""},projects:[],total:0,limit:{limit:20,offset:0},currentProject:{description:"",funding:"",overflow:""},newProject:{title:"",funding:"",description:"",overflow:""},update:!1,dialogVisible:!1}},computed:{hasACC:function(){return 2===this.$store.state.user.level}},methods:{formatDate:i,changePage:function(e){this.limit.offset=20*(e-1),this.getFindProjects()},addProject:function(){var e=this;if(this.newProject.title)if(this.newProject.description)if(this.newProject.funding&&!isNaN(+this.newProject.funding))if(this.newProject.overflow&&!isNaN(+this.newProject.overflow)){var t=this.$store.state.token||localStorage.getItem("token")&&localStorage.getItem("token").slice(0,-5);this.$request.post("/test/addProject").set("Authorization","Bearer "+t).send(y()({},this.newProject,{name:this.$store.state.user.name})).end(function(t,o){t?e.$message({type:"error",message:t.response.text}):(e.$message({type:"success",message:"添加成功"}),e.newProject={title:"",funding:"",description:"",overflow:""}),e.dialogVisible=!1})}else this.$message("请输入正确的超支上限");else this.$message("请输入正确的项目资金");else this.$message("请输入项目描述");else this.$message("请输入项目名称")},updateProject:function(e,t){var o=this,r=this.$store.state.token||localStorage.getItem("token")&&localStorage.getItem("token").slice(0,-5);this.update?this.$request.post("/test/updateProject").set("Authorization","Bearer "+r).send(this.currentProject).end(function(e,r){e?o.$message({type:"error",message:e.response.text}):(o.$message({type:"success",message:"修改成功"}),o.projects[t]=o.currentProject,o.update=!1)}):(this.currentProject=y()({},e),this.update=!0)},getClass:function(e){return+e.alloverhead>=+e.funding*(1+e.overflow/100)-100?"danger":""},getFindProjects:function(){var e=this,t=this.$store.state.token||localStorage.getItem("token")&&localStorage.getItem("token").slice(0,-5);this.$request.post("/test/getFindProjects").set("Authorization","Bearer "+t).send({query:this.param,limit:this.limit}).end(function(t,o){t?e.$message({type:"error",message:t.response.text}):(e.projects=o.body.result,e.total=o.body.total)})}}},$={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"project"},[o("el-form",{attrs:{model:e.param,inline:!0}},[o("el-form-item",{attrs:{label:"项目编号"}},[o("el-input",{attrs:{placeholder:"请输入",clearable:""},model:{value:e.param.id,callback:function(t){e.$set(e.param,"id",t)},expression:"param.id"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"创建日期"}},[o("el-date-picker",{attrs:{"value-format":"timestamp",placeholder:"请输入"},model:{value:e.param.occurTime,callback:function(t){e.$set(e.param,"occurTime",t)},expression:"param.occurTime"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"项目名称"}},[o("el-input",{attrs:{placeholder:"请输入",clearable:""},model:{value:e.param.title,callback:function(t){e.$set(e.param,"title",t)},expression:"param.title"}})],1),e._v(" "),o("el-button",{attrs:{type:"primary"},on:{click:e.getFindProjects}},[e._v("查询")])],1),e._v(" "),o("el-table",{attrs:{data:e.projects}},[o("el-table-column",{attrs:{type:"expand"},scopedSlots:e._u([{key:"default",fn:function(t){return[o("el-form",{staticClass:"demo-table-expand",attrs:{"label-position":"left",inline:"","label-width":".8rem"}},[o("el-form-item",{attrs:{label:"项目编号"}},[o("span",[e._v(e._s(t.row.id))])]),e._v(" "),o("el-form-item",{attrs:{label:"项目名称"}},[o("span",[e._v(e._s(t.row.title))])]),e._v(" "),o("el-form-item",{attrs:{label:"项目描述"}},[e.update?o("el-input",{model:{value:e.currentProject.description,callback:function(t){e.$set(e.currentProject,"description",t)},expression:"currentProject.description"}}):o("span",[e._v(e._s(t.row.description))])],1),e._v(" "),o("el-form-item",{attrs:{label:"资金"}},[e.update?o("el-input",{model:{value:e.currentProject.funding,callback:function(t){e.$set(e.currentProject,"funding",t)},expression:"currentProject.funding"}}):o("span",[e._v(e._s((+t.row.funding).toFixed(2)))])],1),e._v(" "),o("el-form-item",{attrs:{label:"实际开支"}},[o("span",[e._v(e._s((+t.row.overhead>0?+t.row.overhead:0).toFixed(2)))])]),e._v(" "),o("el-form-item",{attrs:{label:"预计开支"}},[o("span",[e._v(e._s((+t.row.alloverhead>0?+t.row.alloverhead:0).toFixed(2)))])]),e._v(" "),o("el-form-item",{attrs:{label:"超支上限"}},[e.update?o("el-input",{model:{value:e.currentProject.overflow,callback:function(t){e.$set(e.currentProject,"overflow",t)},expression:"currentProject.overflow"}},[o("template",{slot:"append"},[e._v("%")])],2):o("span",[e._v(e._s(t.row.overflow)+"%")])],1),e._v(" "),o("el-form-item",{attrs:{label:"创建时间"}},[o("span",[e._v(e._s(e.formatDate(t.row.occurTime)))])]),e._v(" "),o("el-form-item",[!e.update&&e.hasACC?o("el-button",{attrs:{type:"text"},on:{click:function(o){e.updateProject(t.row)}}},[e._v("修改")]):e._e(),e._v(" "),e.update?o("el-button",{attrs:{type:"text"},on:{click:function(o){e.updateProject(t.row,t.$index)}}},[e._v("提交")]):e._e(),e._v(" "),e.update?o("el-button",{attrs:{type:"text"},on:{click:function(t){e.update=!1}}},[e._v("取消")]):e._e()],1)],1)]}}])}),e._v(" "),o("el-table-column",{attrs:{prop:"id",label:"项目编号"}}),e._v(" "),o("el-table-column",{attrs:{prop:"title",label:"项目名称"}}),e._v(" "),o("el-table-column",{attrs:{prop:"funding",label:"资金"}}),e._v(" "),o("el-table-column",{attrs:{prop:"overhead",label:"实际开支"},scopedSlots:e._u([{key:"default",fn:function(t){return[o("span",[e._v(e._s((+t.row.overhead>0?+t.row.overhead:0).toFixed(2)))])]}}])}),e._v(" "),o("el-table-column",{attrs:{label:"预计开支"},scopedSlots:e._u([{key:"default",fn:function(t){return[o("span",{class:e.getClass(t.row)},[e._v(e._s((+t.row.alloverhead>0?+t.row.alloverhead:0).toFixed(2)))])]}}])}),e._v(" "),o("el-table-column",{attrs:{prop:"overflow",label:"超支上限"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                "+e._s(t.row.overflow)+"%\n            ")]}}])}),e._v(" "),o("el-table-column",{attrs:{prop:"occurTime",label:"创建时间"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                "+e._s(e.formatDate(t.row.occurTime))+"\n            ")]}}])})],1),e._v(" "),o("el-button",{staticClass:"addProject",attrs:{type:"primary",size:"mini"},on:{click:function(t){e.dialogVisible=!0}}},[e._v("添加项目")]),e._v(" "),o("el-pagination",{attrs:{layout:"prev, pager, next",total:e.total,"page-size":e.limit.limit},on:{"current-change":e.changePage}}),e._v(" "),o("el-dialog",{staticClass:"new-project",attrs:{title:"添加项目",visible:e.dialogVisible,width:"50%"},on:{"update:visible":function(t){e.dialogVisible=t}}},[o("el-form",{ref:"form",attrs:{model:e.newProject,"label-width":"1rem"}},[o("el-form-item",{attrs:{label:"项目名称："}},[o("el-input",{attrs:{placeholder:"输入项目名称"},model:{value:e.newProject.title,callback:function(t){e.$set(e.newProject,"title",t)},expression:"newProject.title"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"项目描述："}},[o("el-input",{attrs:{placeholder:"输入项目描述"},model:{value:e.newProject.description,callback:function(t){e.$set(e.newProject,"description",t)},expression:"newProject.description"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"项目资金："}},[o("el-input",{attrs:{placeholder:"输入项目资金"},model:{value:e.newProject.funding,callback:function(t){e.$set(e.newProject,"funding",t)},expression:"newProject.funding"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"超支上限："}},[o("el-input",{attrs:{placeholder:"输入超支上限"},model:{value:e.newProject.overflow,callback:function(t){e.$set(e.newProject,"overflow",t)},expression:"newProject.overflow"}},[o("template",{slot:"append"},[e._v("%")])],2)],1)],1),e._v(" "),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:function(t){e.dialogVisible=!1}}},[e._v("取 消")]),e._v(" "),o("el-button",{attrs:{type:"primary"},on:{click:e.addProject}},[e._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var w=o("VU/8")(k,$,!1,function(e){o("uVML")},null,null).exports,P={data:function(){return{persons:[],currentPerson:{level:0},oldLevel:0,userIndex:0,param:{id:"",name:"",jobTitle:"",level:""},limit:{count:20,offset:0},total:0,dialogVisible:!1}},methods:{showDialog:function(e,t){this.oldLevel=e.level,this.userIndex=t,this.currentPerson=y()({},e),this.dialogVisible=!0},updatePersonLevel:function(){var e=this;if(this.currentPerson.level!==this.oldLevel){var t=this.$store.state.token||localStorage.getItem("token")&&localStorage.getItem("token").slice(0,-5);this.$request.post("/test/updatePersonLevel").set("Authorization","Bearer "+t).send({id:this.currentPerson.id,level:this.currentPerson.level}).end(function(t,o){t?e.$message({type:"error",message:t.response.text}):(e.$message({type:"success",message:"修改成功"}),e.persons[e.userIndex].level=e.currentPerson.level,e.dialogVisible=!1)})}else this.dialogVisible=!1},getFindPersons:function(){var e=this;if(""!==this.param.level&&isNaN(+this.param.level))this.$message({type:"error",message:"请输入正确的权限等级"});else{var t=this.$store.state.token||localStorage.getItem("token")&&localStorage.getItem("token").slice(0,-5);this.$request.post("/test/getFindPersons").set("Authorization","Bearer "+t).send({trans:this.param,limit:this.limit}).end(function(t,o){t?e.$message({type:"error",message:t.response.text}):(e.total=o.body.total,e.persons=o.body.result)})}}}},x={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"person"},[o("div",{staticClass:"find"},[o("el-form",{attrs:{model:e.param,"label-width":"1rem",inline:!0}},[o("el-form-item",{attrs:{label:"用户ID"}},[o("el-input",{attrs:{placeholder:"输入用户ID",clearable:""},model:{value:e.param.id,callback:function(t){e.$set(e.param,"id",t)},expression:"param.id"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"姓名"}},[o("el-input",{attrs:{placeholder:"输入用户姓名",clearable:""},model:{value:e.param.name,callback:function(t){e.$set(e.param,"name",t)},expression:"param.name"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"职称"}},[o("el-input",{attrs:{placeholder:"输入用户职称",clearable:""},model:{value:e.param.jobTitle,callback:function(t){e.$set(e.param,"jobTitle",t)},expression:"param.jobTitle"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"权限等级"}},[o("el-input",{attrs:{placeholder:"输入权限等级",clearable:""},model:{value:e.param.level,callback:function(t){e.$set(e.param,"level",t)},expression:"param.level"}})],1),e._v(" "),o("el-button",{attrs:{type:"primary"},on:{click:e.getFindPersons}},[e._v("查询")])],1)],1),e._v(" "),o("el-table",{attrs:{data:e.persons}},[o("el-table-column",{attrs:{type:"index"}}),e._v(" "),o("el-table-column",{attrs:{prop:"id",label:"用户ID"}}),e._v(" "),o("el-table-column",{attrs:{prop:"name",label:"姓名"}}),e._v(" "),o("el-table-column",{attrs:{prop:"jobTitle",label:"职称"}}),e._v(" "),o("el-table-column",{attrs:{prop:"phone",label:"电话"}}),e._v(" "),o("el-table-column",{attrs:{prop:"Email",label:"邮箱"}}),e._v(" "),o("el-table-column",{attrs:{prop:"laboratory",label:"所在研究室"}}),e._v(" "),o("el-table-column",{attrs:{prop:"level",label:"权限等级"}}),e._v(" "),o("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[o("el-button",{attrs:{type:"text"},on:{click:function(o){e.showDialog(t.row,t.$index)}}},[e._v("修改权限")])]}}])})],1),e._v(" "),o("el-dialog",{attrs:{title:"请选择权限",visible:e.dialogVisible,width:"50%"},on:{"update:visible":function(t){e.dialogVisible=t}}},[o("el-radio",{attrs:{label:0},model:{value:e.currentPerson.level,callback:function(t){e.$set(e.currentPerson,"level",t)},expression:"currentPerson.level"}},[e._v("普通用户")]),e._v(" "),o("el-radio",{attrs:{label:1},model:{value:e.currentPerson.level,callback:function(t){e.$set(e.currentPerson,"level",t)},expression:"currentPerson.level"}},[e._v("主任用户")]),e._v(" "),o("el-radio",{attrs:{label:2},model:{value:e.currentPerson.level,callback:function(t){e.$set(e.currentPerson,"level",t)},expression:"currentPerson.level"}},[e._v("财务人员")]),e._v(" "),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:function(t){e.dialogVisible=!1}}},[e._v("取 消")]),e._v(" "),o("el-button",{attrs:{type:"primary"},on:{click:e.updatePersonLevel}},[e._v("确 定")])],1)],1),e._v(" "),o("el-pagination",{attrs:{layout:"prev, pager, next","page-size":20,total:e.total}})],1)},staticRenderFns:[]};var j=o("VU/8")(P,x,!1,function(e){o("+/2j")},null,null).exports,S={data:function(){return{policys:[],editering:!1,limit:20,offset:0,total:0}},created:function(){var e=this,t=this.$store.state.token||localStorage.getItem("token")&&localStorage.getItem("token").slice(0,-5);this.$request.post("/test/getPolicys").set("Authorization","Bearer "+t).send({limit:this.limit,offset:this.offset}).end(function(t,o){t?e.$message({type:"error",message:t.response.text}):(e.total=o.body.total,e.policys=o.body.result)})},methods:{goForDetail:function(e){this.$router.push("/manage/policy/detail?id="+e)},goForAdd:function(){this.$router.push("/manage/policy/detail?isCreate=true")}}},I={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"policy"},[e.editering?o("div",{attrs:{id:"editor"}}):e._e(),e._v(" "),o("el-table",{attrs:{data:e.policys}},[o("el-table-column",{attrs:{type:"index"}}),e._v(" "),o("el-table-column",{attrs:{prop:"id",label:"编号"}}),e._v(" "),o("el-table-column",{attrs:{prop:"title",label:"标题"}}),e._v(" "),o("el-table-column",{attrs:{prop:"occurTime",label:"创建时间"}}),e._v(" "),o("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[o("el-button",{attrs:{type:"text"},on:{click:function(o){e.goForDetail(t.row.id)}}},[e._v("查看详情")])]}}])})],1),e._v(" "),o("el-pagination",{attrs:{layout:"prev, pager, next","page-size":20,total:e.total}}),e._v(" "),o("el-button",{staticClass:"add-policy",attrs:{type:"primary",size:"mini"},on:{click:e.goForAdd}},[e._v("添加")])],1)},staticRenderFns:[]};var C=o("VU/8")(S,I,!1,function(e){o("LHnv")},null,null).exports,F={data:function(){return{fileList:[],policy:{id:"",title:"",data:"",occurTime:""},editoring:!1,editor:null,oldTitle:"",isCreate:!1}},created:function(){var e=this,t=n(location.href.split("?")[1]);if(t.id){var o=this.$store.state.token||localStorage.getItem("token")&&localStorage.getItem("token").slice(0,-5);this.$request.post("/test/getPolicyDetail").set("Authorization","Bearer "+o).send({id:t.id}).end(function(t,o){t?e.$message({type:"error",message:t.response.text}):e.policy=o.body}),this.getPolicyFiles(t.id)}else t.isCreate&&(this.editoring=!0,this.isCreate=!0)},mounted:function(){this.editor=new this.$editor("#editor"),this.editor.create()},computed:{uploadHeaders:function(){return{Authorization:"Bearer "+(this.$store.state.token||localStorage.getItem("token")&&localStorage.getItem("token").slice(0,-5))}}},methods:{formatDate:i,cancel:function(){this.editor.txt.html(this.policy.data),this.editoring=!1,this.policy.title=this.oldTitle},getPolicyFiles:function(e){var t=this,o=this.$store.state.token||localStorage.getItem("token")&&localStorage.getItem("token").slice(0,-5);this.$request.post("/test/getPolicyFiles").set("Authorization","Bearer "+o).send({id:e}).end(function(e,o){e?t.$message({type:"error",message:e.response.text}):o.body.forEach(function(e){t.fileList.push({name:"附件"+(t.fileList.length+1),url:e.url,id:e.id})})})},uploadFinished:function(e,t,o){this.fileList.push({name:"附件"+(this.fileList.length+1),id:e.id,url:e.url})},handleRemove:function(e,t){var o=this,r=this.$store.state.token||localStorage.getItem("token")&&localStorage.getItem("token").slice(0,-5);this.$request.post("/test/deletePolicyFile").set("Authorization","Bearer "+r).send({id:e.id,url:e.url}).end(function(t,r){if(t)o.$message({type:"error",message:t.response.text});else{o.$message({type:"success",message:"删除成功"});var s=o.fileList.indexOf(e);o.fileList.splice(s,1)}})},handlePreview:function(e){window.open(e.url)},beforeRemove:function(e,t){return this.$confirm("确定移除 "+e.name+"？")},goForEditor:function(){this.oldTitle=this.policy.title,this.editor.txt.html(this.policy.data),this.editoring=!0},submit:function(){var e=this,t=this.$store.state.token||localStorage.getItem("token")&&localStorage.getItem("token").slice(0,-5);this.isCreate?this.$request.post("/test/insertPolicy").set("Authorization","Bearer "+t).send({title:this.policy.title,data:this.editor.txt.html()}).end(function(t,o){t?e.$message({type:"error",message:t.response.text}):(e.$message({type:"success",message:"创建成功"}),e.policy=o.body,e.editoring=!1,e.isCreate=!1)}):this.$request.post("/test/updatePolicy").set("Authorization","Bearer "+t).send({id:this.policy.id,title:this.policy.title,data:this.editor.txt.html()}).end(function(t,o){t?e.$message({type:"error",message:t.response.text}):(e.policy.data=e.editor.txt.html(),e.editoring=!1,e.$message({type:"success",message:"修改成功"}))})},deletePolicy:function(){var e=this,t=this.$store.state.token||localStorage.getItem("token")&&localStorage.getItem("token").slice(0,-5);this.$request.post("/test/deletePolicy").set("Authorization","Bearer "+t).send({id:this.policy.id}).end(function(t,o){t?e.$message({type:"error",message:t.response.text}):(e.$message({type:"success",message:"删除成功"}),e.$router.replace("/manage/policy"))})}}},z={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"policy-detail"},[e.editoring?e._e():o("h3",{staticClass:"title"},[e._v(e._s(e.policy.title))]),e._v(" "),e.editoring?o("el-input",{staticClass:"title",attrs:{placeholder:"输入标题"},model:{value:e.policy.title,callback:function(t){e.$set(e.policy,"title",t)},expression:"policy.title"}}):e._e(),e._v(" "),o("p",{staticClass:"time"},[e.isCreate?e._e():o("span",[e._v("创建时间："+e._s(e.formatDate(e.policy.occurTime)))])]),e._v(" "),o("div",{staticClass:"policy-content"},[o("p",{directives:[{name:"show",rawName:"v-show",value:!e.editoring,expression:"!editoring"}],staticClass:"content",domProps:{innerHTML:e._s(e.policy.data)}}),e._v(" "),o("div",{directives:[{name:"show",rawName:"v-show",value:e.editoring,expression:"editoring"}],attrs:{id:"editor"}})]),e._v(" "),e.isCreate?e._e():o("div",{staticClass:"file-wrapper"},[o("el-upload",{staticClass:"upload-demo",attrs:{action:"test/uploadPolicyFile?id="+e.policy.id,headers:e.uploadHeaders,"on-preview":e.handlePreview,"on-remove":e.handleRemove,"before-remove":e.beforeRemove,"file-list":e.fileList,"on-success":e.uploadFinished}},[o("el-button",{attrs:{size:"small",type:"primary"}},[e._v("点击上传")]),e._v(" "),e.fileList.length?e._e():o("div",{staticClass:"el-upload__tip",attrs:{slot:"tip"},slot:"tip"},[e._v("选择上传的附件")])],1)],1),e._v(" "),e.editoring?e._e():o("el-button",{attrs:{type:"primary",size:"mini"},on:{click:e.goForEditor}},[e._v("修改")]),e._v(" "),e.editoring?e._e():o("el-button",{attrs:{type:"danger",size:"mini"},on:{click:e.deletePolicy}},[e._v("删除")]),e._v(" "),e.editoring?o("el-button",{attrs:{type:"primary",size:"mini"},on:{click:e.submit}},[e._v("提交")]):e._e(),e._v(" "),e.editoring?o("el-button",{attrs:{size:"mini"},on:{click:e.cancel}},[e._v("取消")]):e._e()],1)},staticRenderFns:[]};var A=o("VU/8")(F,z,!1,function(e){o("kkH9")},null,null).exports;r.default.use(g.a);var T=new g.a({routes:[{path:"/",name:"Index",component:_},{path:"/manage",component:_,children:[{path:"project",component:w},{path:"person",component:j},{path:"policy",component:C},{path:"policy/detail",component:A}]}]}),L=o("sYY+"),V=o.n(L);r.default.use(m.a),r.default.use(s.a),r.default.config.productionTip=!1,r.default.prototype.$request=f.a,r.default.prototype.$editor=V.a;var q=new s.a.Store({state:{user:{}},mutations:{setUser:function(e,t){e.user=t},setToken:function(e,t){e.token=t},logout:function(e){delete e.token,delete e.user}}});new r.default({el:"#app",router:T,store:q,components:{App:d},template:"<App/>"})},gIYk:function(e,t){},kkH9:function(e,t){},tvR6:function(e,t){},uVML:function(e,t){}},["NHnr"]);
//# sourceMappingURL=app.b94d92b57ace492a8804.js.map