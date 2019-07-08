$(document).ready(function(){
        //页面加载时触发

       var  tishi = {"分公司":"如：广州分公司","配件名称":"设备分类，如：A9K备件","规格型号":"设备型号","类型":"所属厂家：如思科"
        ,"sn码":"SN码","入库时间":"入库时间","入库地点":"入库地点，如太阳城","数量":"数量","货位号":"所在库房的位置",
        "所属网络":"如承载网","资产标签":"资产标签 可不填","备注":"其他信息"};
       var idset = ["fenggongsi","name","xinghao","leixing","sn","rukushijian","rukudidian",
            "shuliang","huoweihao","suoshuwangluo","zichanbiaoqian","beizhu"];

       //上传后台的iptoS
       var iptoS ={};
       var ajaxret = [];
       var retID ;
       var urlID = 0;
       var lastInfo = "";
       var gotNetID = 0 ;
       //button info save
       var dropDownInfo = "";
       // choose input by ID
       var inputID = 0 ;
       // 0  -index  1-显示页面的
       var inputNum=["search_input0","input1"];
       // 0 - czw ; 1 -- gmk ; 2 --169
       var urlList = ["search-post","gmk/info","169/info"];
       var resTabel = ["myTable","gmk_table","169_table"];
       var resDIV =["#main_3","#info_gmk","#info_169"];
       var searchIsDisplay = 0;
        for(var key in tishi){
                 $("#SEARCH_DIV").append(
          "<div class='row' style='height: 7%;padding-top: 5px;border-width: medium;border-style:solid;border-color: #6c757d;border-radius: 6px;'> " +
               " <div class=\"col-4\"  style=''> "+key+"</div> " +
                " <div class=\"col-6\"style='' >" +
                      "<input class='myinp' type='text'  placeholder='"+tishi[key]+"' style='width: 90%'>"+" </div> " +
               " <div class=\"col-2\" style=''>" +
                      "<input class='checkbox' type='checkbox'  >"+"√"+" </div> " +
               "</div>"
      );
        }
         $("#SEARCH_DIV").append(
          "<div class='row ' style='height: 7%;'> " +
                    "<button type='button' class='btn' id='search_btn0' style='margin-left: 70%;'>搜索</button>" +
               "</div>");
        var test = 1;
        // enter 按键响应
      $('#search_input0').keydown(function(e){
        if(e.keyCode==13){
            postFastQuery("search_input0",urlList[urlID],resTabel[urlID],resDIV[urlID]);

        }
        });

        // 详细搜索页面的搜索按钮
      $("#search_btn0").click(function(){
         var shuruku = document.getElementsByClassName("myinp");
         var checkres = document.getElementsByClassName("checkbox");
         console.log("准备获取输入框的相关参数");
         for(i=0;i<shuruku.length;i++){
              iptoS[idset[i]]=shuruku[i].value;
              var str =idset[i] + "ischecked" ;
              iptoS[str] = checkres[i].checked;
         }
         console.log("已获取输入框的相关参数，准备上传至服务器");
         iptoS["type"]="nor";

         //此处往json 加入用户email 信息
         var email =$.cookie('email');
         iptoS["email"] = email;

         console.log(iptoS);
         $.get("search-post", iptoS,
             function(ret,status){
             console.log("数据: \n" + ret + "\n状态: " + status);
             console.log(typeof(status));
             if(status=="success"){
                    var table = document.getElementById("myTable");
                    var i = 1;
                    var j = 0;
                 ret.forEach(function (item,index,array)
                 {


                     $("#main_1").css("height","auto");
                      $("#SEARCH_DIV").css("display","none");
                      searchIsDisplay = 1;
                      $("#close_search").text("显示搜索框");

                    var row = table.insertRow(i);
                        j=0;
                    for (var key in item) {
                        row.insertCell(j).innerHTML =item[key]  ;
                        j++;
                        }
                            i++;
                    }) //此处ret处理循环结束
                }
                 });
      });

      //显示结果页面的搜索按钮
      $("#query1").click(function () {
          inputID = 1;
          //console.log(urlID);
          postFastQuery("input1",urlList[urlID],resTabel[urlID],resDIV[urlID]);

      })

        //入库的取消按钮
      $("#cancel2").click(function () {
             hideMask();
          $("#out_info").css("display","none");
      })

        //index页面快捷查询控制
      $("#formquery").click(function(){
          // level check
          var data = {};
          var email =$.cookie('email');
          data["email"] = email;
           $.ajax({
         type : "get",
         url : "users/levelCheck",
         data : data,
         async : true,
         success : function(ret){
             // 1 权限仅能出库光模块
                    if(ret["level"]=="1"){
                        alert("权限不足");
                        return ;
                    }
                    else {
                        postFastQuery("search_input0",urlList[urlID],resTabel[urlID],resDIV[urlID]);

                    }
                }
            });

      });
        //详细搜索页面DIV控制
      $("#close_search").click(function () {
          if(searchIsDisplay==0){
               $("#SEARCH_DIV").css("display","none");
               $("#close_search").text("显示搜索框") ;
               searchIsDisplay = 1;
          }
          else if(searchIsDisplay==1){
               $("#SEARCH_DIV").css("display","block");
               $("#close_search").text("隐藏搜索框") ;
               searchIsDisplay = 0;
          }

      })

      // 为CZW - mytable中生成的button 绑定点击事件 ， 使能够弹出确认框
      $("#myTable").on("click","button",function () {
           var itemID = $(this).attr("value")-1;
           retID = itemID;
           item =(ajaxret[itemID]) ;
           var  str="" ;
           gotName = "";
           var  gotID = "";
           cI = 0;
           //console.log(item);
           //console.log(urlID);
            for (var key in item) {
                if(key=="name"){
                    gotName = item[key];

                }
                if(key=="id"){
                    gotID = item[key];
                   // console.log(gotID);
                }
                str =str+"<h4>"+item[key] +"</h4>";
                cI++;
            }
           var gotInfo = gotName +";" +gotID +";"+ gotNetID ;
            console.log(gotInfo);
            //set button value for input bk or gmk or other
           //$("#dropdown-out3").val(gotInfo);
           dropDownInfo = gotInfo ;
           $("#out2_item_info").html(str);
           showMask();
           $("#out2_info").css("display","block");
           var margintop = $(document).scrollTop()+100;
           $("#out2_info").css("margin-top",(margintop));
           console.log("距离顶部位置"+$(document).scrollTop());
      })

      // 为169-169_table中生成的button 绑定点击事件 ， 使能够弹出确认框
      $("#169_table").on("click","button",function () {
           var itemID = $(this).attr("value")-1;
           retID = itemID;
           item =(ajaxret[itemID]) ;
           //console.log("item:",item)
           var  str="" ;
           gotName = "";
           var  gotID = "";
           cI = 0;
           //console.log(item);
           //console.log(urlID);
            for (var key in item) {
                if(key=="mingcheng"){
                    gotName = item[key];

                }
                if(key=="id"){
                    gotID = item[key];
                   // console.log(gotID);
                }
                str =str+"<h4>"+item[key] +"</h4>";
                cI++;
            }
           var gotInfo = gotName +";" +gotID +";"+ gotNetID ;
            //console.log("button info:",gotInfo);
            //set button value for input bk or gmk or other
           //$("#dropdown-out3").val(gotInfo);
           dropDownInfo = gotInfo ;
           $("#out2_item_info").html(str);
           showMask();
           $("#out2_info").css("display","block");
           var margintop = $(document).scrollTop()+100;
           $("#out2_info").css("margin-top",(margintop));
           console.log("距离顶部位置"+$(document).scrollTop());
      })

      // 出库 的确认按钮
      $("#out_yes").click(function () {
           // var itemID = $(this).attr("value")-1;
           // var Oip = {};
           // var email =$.cookie('email');
           // Oip["email"] = email;
           // var outUp =(ajaxret[retID]) ;
           // outUp["email"] =email;
           // console.log(outUp);

           $("#out2_info").css("display","none");
            var margintop = $(document).scrollTop()+50;
           $("#out3_info").css("margin-top",(margintop));
           $("#out3_info").css("display","block");
            $("#inpt_gcck").val("");
            $("#diaodanIp").val("");
             $("#sheBeiIp").val("");
                $("#duanKouIp").val("");
                 $("#gzclPlace").val("");

      })
      // 出库的取消按钮
      $("#out_no").click(function () {
          hideMask();
           $("#out2_info").css("display","none");
      })


      $("#dropdown-gcck").click(function () {
          var gotInfo=dropDownInfo ;
          gotInfo = gotInfo +";" +"gcck";
          $("#dropdown-out3").val(gotInfo);
          $("#dropdown-out3").text("工程出库");
           $("#out3_info").css("height","auto");
           $("#out3_inf_mid").css("display","block");
          $("#out3_inf_mid").empty();
          $("#out3_inf_mid").append(
            "<h4>请输入工程号：</h4>"+
              "<input class='input-medium ' type='text' placeholder='' id='inpt_gcck'>"
          );
      })
     $("#dropdown-ywkt").click(function () {
           var gotInfo=dropDownInfo ;
          gotInfo = gotInfo +";" +"ywkt";
          $("#dropdown-out3").val(gotInfo);
          $("#dropdown-out3").text("业务开通");
          $("#out3_info").css("height","auto");
          $("#out3_inf_mid").css("display","block");
           $("#out3_inf_mid").empty();
          $("#out3_inf_mid").append(
            "<p>请输入调单号：</p>"+ "<input class='input-medium ' type='text' placeholder='' id='diaodanIp'>"
              +
            "<p>请输入设备名称：</p>"+ "<input class='input-medium ' type='text' placeholder='' id='sheBeiIp'>"
              +
            "<p>请输入设备端口号：</p>"+ "<input class='input-medium ' type='text' placeholder='' id='duanKouIp'>"
          );
      })

     $("#dropdown-gzcl").click(function () {
          var gotInfo=dropDownInfo ;

          gotInfo = gotInfo +";" +"gzcl";
          $("#dropdown-out3").val(gotInfo);

          $("#dropdown-out3").text("故障处理");

          $("#out3_inf_mid").css("display","block");
           $("#out3_inf_mid").empty();
           //banka or gmk have different input
         // var xinghao=($("#dropdown-out3").val());
         // xinghao=xinghao.split(";")[0];
         // console.log(xinghao);
         $("#out3_inf_mid").append(
            "<h4>请输入故障处理地点：</h4>"+
              "<input class='input-medium ' type='text' placeholder='' id='gzclPlace'>"
          );


      })

    // out3 - 出库最高DIV弹框确认按钮
     $("#out3_yes").click(function () {
         var gotInfo=($("#dropdown-out3").val());

         var gotInfoNew = gotInfo.split(";");
         var email =$.cookie('email');
         //console.log("按钮所绑定的信息"+gotInfo);
         var gotID =$("#inpt_gcck").val();
           var diaoDanHao = $("#diaodanIp").val();
              var shebeiming = $("#sheBeiIp").val();
               var shebeiduankou = $("#duanKouIp").val();
                 var gotPlace =$("#gzclPlace").val();
                 console.log(gotID,diaoDanHao,shebeiduankou,shebeiming,gotPlace);
         if((gotID==undefined|gotID=="")&&
             (diaoDanHao==undefined|diaoDanHao==""|shebeiming==""|shebeiduankou=="")
             &&(gotPlace==undefined|gotPlace=="")){
             alert("尚未输入信息");
             return ;
         }

         if(gotInfoNew[3]=="gcck"){

              //console.log(email);
                //工程号 id

              //console.log("ID:"+$("#inpt_gcck").val());
              chuKu(gotID,gotInfo,email);
            // alert("已做出库申请"); TIPS SHOWED IN AJAX
         }
         if(gotInfoNew[3]=="ywkt"){
             // get the input value ;

               // console.log("1",diaoDanHao);
               //  console.log("2",shebeiming);
               //   console.log("3",shebeiduankou);
                 toywkt(email,diaoDanHao,shebeiming,shebeiduankou,gotInfoNew[0],gotInfoNew[1],gotInfoNew[2]);
          }
         if(gotInfoNew[3]=="gzcl"){

             togzcl(gotPlace,gotInfoNew[0],gotInfoNew[1],gotInfoNew[2],email);
         }
              $("#out3_info").css("display","none");
             hideMask();
             $("#out3_inf_mid").css("display","none");
              $("#search_input0").val(lastInfo);
              //gotNetID net type :czw 169...

             postFastQuery("search_input0",urlList[gotNetID],resTabel[gotNetID],resDIV[gotNetID]);

     })
      $("#out3_no").click(function () {
         $("#out3_info").css("display","none");
         hideMask();
     })
     $("#out3_back").click(function () {
         $("#out2_info").css("display","block");
         $("#out3_info").css("display","none");

     })
      //光模块 搜索按钮
      // $("#query_gmk").click(function () {
      //     //隐藏遮罩
      //     hideMask();
      //     //隐藏该搜索框
      //     $("#out_gmk").css("display","none");
      //     //input_gmk 输入框ID， gmk_search -AJAX URL， gmk_table 预定义的显示表。
      //     postFastQuery("input_gmk",urlList[urlID],resTabel[urlID],resDIV[urlID]);
      //
      // })
      //光模块显示页面的搜索按钮响应
      // $("#info_gmk_query").click(function () {
      //
      //     //input_gmk 输入框ID， gmk_search -AJAX URL， gmk_table 预定义的显示表。
      //     // "#info_gmk"隐藏的DIV
      //     postFastQuery("info_gmk_inp",urlList[urlID],resTabel[urlID],resDIV[urlID]);
      //
      // })
      //169显示页面的搜索按钮响应
      $("#info_169_query").click(function () {

          //input_gmk 输入框ID， gmk_search -AJAX URL， gmk_table 预定义的显示表。
          // "#info_gmk"隐藏的DIV
          postFastQuery("info_169_inp",urlList[urlID],resTabel[urlID],resDIV[urlID]);

      })
      //下拉菜单 更改URL ID与按钮显示内容 --提升用户体验
      // $("#dropdown-gmk").click(function () {
      //        $("#dropdown-btn").text("光模块");
      //        urlID = 1;
      // })
      $("#dropdown-169").click(function () {
             $("#dropdown-btn").text("169网");
             urlID = 2;
      })
      $("#dropdown-czw").click(function () {
             $("#dropdown-btn").text("承载网");
             urlID = 0;
      })
    //下拉菜单 更改URL ID与按钮显示内容 --提升用户体验
    //   $("#dropdown-1-gmk").click(function () {
    //          $("#dropdown-1-btn").text("光模块");
    //          urlID = 1;
    //   })
      $("#dropdown-1-169").click(function () {
             $("#dropdown-1-btn").text("169网");
             urlID = 2;
      })
      $("#dropdown-1-czw").click(function () {
             $("#dropdown-1-btn").text("承载网");
             urlID = 0;
      })
     //下拉菜单 更改URL ID与按钮显示内容 --提升用户体验
     //  $("#dropdown-2-gmk").click(function () {
     //         $("#dropdown-2-btn").text("光模块");
     //         urlID = 1;
     //  })
      $("#dropdown-2-169").click(function () {
             $("#dropdown-2-btn").text("169网");
             urlID = 2;
      })
      $("#dropdown-2-czw").click(function () {
             $("#dropdown-2-btn").text("承载网");
             urlID = 0;
      })
     //下拉菜单 更改URL ID与按钮显示内容 --提升用户体验
     //  $("#dropdown-3-gmk").click(function () {
     //         $("#dropdown-3-btn").text("光模块");
     //         urlID = 1;
     //  })
      $("#dropdown-3-169").click(function () {
             $("#dropdown-3-btn").text("169网");
             urlID = 2;
      })
      $("#dropdown-3-czw").click(function () {
             $("#dropdown-3-btn").text("承载网");
             urlID = 0;
      })




    //var  timet= 0;
        // ip_name 输入框的值，以FAST方式将输入框的值上传到后台服务器
    function  postFastQuery(ip_name,toUrl,toTabel,showDIV) {
        gotNetID = urlID ;
        urlID = 0 ;
         $("#dropdown-3-btn").text("承载网");
          $("#dropdown-1-btn").text("承载网");
           $("#dropdown-2-btn").text("承载网");

        var data = {};
        var toolsname = $("#"+ip_name).val();
        lastInfo = toolsname ;
        data["toolsname"] = toolsname;
        data["type"] = "fast"   ;
        var email =$.cookie('email');
        data["email"] = email;
        //console.log("此时DIV为",showDIV);
        if(showDIV=="#main_3"){
              $("#info_gmk").css("display","none");
          $("#info_169").css("display","none");
        }
        else if(showDIV=="#info_gmk"){
             $("#info_169").css("display","none");
              $("#main_3").css("display","none");
        }
        else if(showDIV=="#info_169"){
            $("#info_gmk").css("display","none");
             $("#main_3").css("display","none");
        }



        var i = 1;
        var j = 0;
        //console.log(toolsname);
          $.ajax({
         type : "get",
         //url : "search-post",
         url : toUrl,
         data : data,
         async : true,
         success : function(ret){
                    ajaxret =ret;

                 if(ret[0]=="error"){
                     alert("发生异常");
                     return;
                 }
                 if(ret[0]=="null"){
                     alert("无法检索到数据，请核实");
                     return;
                 }
                 $("#index_c1").css("display","none");
                 $("#search_row").css("display","none");
                 //$("#main_3").css("display","inline");
                 $(showDIV).css("display","inline");
                 var table = document.getElementById(toTabel);


                 // console.log("此处时间测试",timet);
                 // console.log("返回集",ret);
                 // timet++;

                 var rowNum=table.rows.length;

                 console.log("rowNUM:",rowNum);

                 //remove the last query
                 for (i=1;i<rowNum;i++)
                    {
                        table.deleteRow(i);
                        rowNum=rowNum-1;
                         i=i-1;
                     }

                 ret.forEach(function (item) {
                        if(i>6){
                        $("#main_1").css("height","auto");
                    }
                    var row = table.insertRow(i);
                    j=0;

                    for (var key in item) {

                        if(j==Object.keys(item).length-1){
                            var  str = i  ;
                            row.insertCell(j).innerHTML= item[key];
                            row.insertCell(j+1).innerHTML = "   "+"<button type=\"button\" class='btn outbut' value="+str+" id='out_bt'>出库</button>" ;
                        }else {
                             row.insertCell(j).innerHTML =item[key]  ;
                        }
                    j++;
                    }
                    i++;
                 })
                }
            });
          //将输入框内容重置
         $("#info_169_inp").val("");
            $("#info_gmk_inp").val("");
             $("#input1").val("");

      }
      function hideMask(){

        $("#mask").hide();
    }
      function showMask(){
        $("#mask").css("height",$(document).height());
        $("#mask").css("width",$(document).width());
        $("#mask").show();
    }










      // TO different cache
      function chuKu(GCid,info,email) {
          //0  - item name ; 1 --item id ; 2--net type ; 3--reasonType
          var gotInfo = info.split(";");
          if(gotInfo[3]=="gcck"){
               togcck(GCid,gotInfo[0],gotInfo[1],gotInfo[2],email);
          }

      }

      function toCache(op_type,op_net,item_ID,op_reason) {
        var data = {};
        var email =$.cookie('email');
        data["email"] = email;
        data["type"] = op_type;
        data["item"] = op_net;
        data["id"] = item_ID;
        data["reason"] = op_reason;
         $.ajax({
         type : "get",
         url : "cache/up",
         data : data,
         async : true,
         success : function(ret){
                    alert(ret["info"])
                }
            });
    }

      // change status in To backEnd
      function togcck(GCid,itemname,itemid,nettype,email) {
            //console.log("test");
            var data ={};
            data["gcid"] =GCid;
            data["itn"] = itemname;
            data["itid"] = itemid;
            data["netT"]=nettype;
            data["email"] = email;

            $.ajax({
         type : "get",
         url : "gcck/add",
         data : data,
         async : false,
         success : function(ret){
             //alert(ret["info"]);
             //console.log(ret["id"]);
             //this function may have a faster way.
             var reasoninfo = "gcck;"+ ret["id"] ;
             if(nettype==0){
                toCache("出库","承载网",itemid,reasoninfo);
            }
             if(nettype==2){
                toCache("出库","169网",itemid,reasoninfo);
            }
                }
            });
      }

      function toywkt(email,diaoDH,sheBeiming,duankouhao,itemname,itemid,nettype) {
            // set nettype by num
          var net = "";
          var data ={};
            data["调单号"] =diaoDH;
            data["设备名"] =sheBeiming;
            data["端口号"] =duankouhao;
            data["itn"] = itemname;
            data["itid"] = itemid;
            data["email"] = email;
            data["netT"]=nettype;

            $.ajax({
         type : "get",
         url : "ywkt/add",
         data : data,
         async : false,
         success : function(ret){
             //alert(ret["info"]);
             //console.log(ret["id"]);
             //this function may have a faster way.
             var reasoninfo = "ywkt;"+ ret["id"] ;
             if(nettype==0){
                toCache("出库","承载网",itemid,reasoninfo);
            }
             if(nettype==2){
                toCache("出库","169网",itemid,reasoninfo);
            }
                }
            });
      }

      function togzcl(place,itemname,itemid,nettype,email) {
            var data ={};
            data["place"] =place;
            data["itn"] = itemname;
            data["itid"] = itemid;
            data["netT"]=nettype;
            data["email"] = email;
               $.ajax({
         type : "get",
         url : "gzcl/add",
         data : data,
         async : false,
         success : function(ret){
             //alert(ret["info"]);
             //console.log(ret["id"]);
             //this function may have a faster way.
             var reasoninfo = "gzcl;"+ ret["id"] ;
             if(nettype==0){
                toCache("出库","承载网",itemid,reasoninfo);
            }
               if(nettype==2){
                toCache("出库","169网",itemid,reasoninfo);
            }
                }
            });
      }
    });
