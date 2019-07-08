$(document).ready(function () {
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
                    if(ret["level"]=="1"||ret["level"]=="2"){
                        alert("权限不足");
                        return ;
                    }
                    else {
                        cacheStart();
                    }
                }
            });


      function cacheStart() {
           var data = {};
           var email =$.cookie('email');
           var showDIV = "#info_shenhe";
           var toTable = "shenhe_table";
           data["email"] = email;
           var i = 1;
            var j = 0;
                 $.ajax({
         type : "get",
         url : "cache/info",
         data : data,
         async : true,
         success : function(ret){
                 // $("#index_c1").css("display","none");
                 // $("#search_row").css("display","none");
                 $(showDIV).css("display","inline");
                 var table = document.getElementById(toTable);
                 var rowNum=table.rows.length;
                 for (i=1;i<rowNum;i++)
                    {
                        table.deleteRow(i);
                        rowNum=rowNum-1;
                         i=i-1;
                     }
                 ret.forEach(function (item) {
                        if(i>6){
                        $(showDIV).css("height","auto");
                    }
                    var row = table.insertRow(i);
                     //table x num;
                    j=0;
                    var  str = -1 ;
                    var  des = "";
                    var  caID =0 ;
                    var op_type = "";
                    var op_reason = "";
                    for (var key in item) {

                        // add a button and set info
                        if(j==Object.keys(item).length-1){
                            //合并目标ID和URL标示到 一个STR里面
                            str=str.toString()+","+des+","+caID+","+op_type+","+op_reason;
                            row.insertCell(j-1).innerHTML= item[key];
                            row.insertCell(j).innerHTML = "   "+"<button type=\"button\" class='btn outbut' value="+str+" id='shenhe_yes'>点击查看详情</button>" ;
                        }
                        else {
                            if(key=="item_id"){
                                str =  item[key];
                            }
                            if(key=="item"){
                               des =  item[key];
                            }
                            if(key=="id"){
                               caID =  item[key];
                            }
                            if(key =="type"){
                                op_type = item[key];
                            }
                             if(j==0){
                            op_reason =item[key] ;
                                }
                             else {
                                row.insertCell(j-1).innerHTML =item[key]  ;
                             }

                        }
                    j++;
                    }
                    // table y move
                    i++;
                 })
                }
            });
      }

      function shCacheFix(id) {
          var data ={};
          data['id'] = id;
           $.ajax({
         type : "get",
         url : "cache/fix",
         data : data,
         async : true,
         success : function(ret){

                }
            });
      }

      function cKshYes(id,url) {
            if(url=="169"){
                url = "169/delete";
            }
             if(url=="169网"){
                url = "169/delete";
            }
            if(url=="承载网"){
                url = "czw/delete";
            }
            if(url=="gmk"){
                url = "gmk/save";
            }
            var data={};
            data["id"] = id;
             $.ajax({
         type : "get",
         url : url,
         data : data,
         async : true,
         success : function(ret){
                    $("#shenhe_tk").css("display","none");
                    //设置cache 数据库 该信息为已审核
                    alert("审核已通过");
                }
            });
      }

      function shYes(id,url) {
            if(url=="169"){
                url = "169/save";
            }
            // if(url=="169"){
            //     url = "169/save";
            // }
            if(url=="承载网"){
                url = "czw/save";
            }
            if(url=="gmk"){
                url = "gmk/save";
            }
            var data={};
            data["id"] = id;
             $.ajax({
         type : "get",
         url : url,
         data : data,
         async : true,
         success : function(ret){
                    $("#shenhe_tk").css("display","none");
                    //设置cache 数据库 该信息为已审核
                    alert("审核已通过");
                }
            });
      }

      //审核页面的按钮响应（ not tk)
      $("#shenhe_table").on("click","button",function () {

            var data ={};
            var but_str = $(this).val();

            $("#sh_save").val(but_str);
            var but_info = but_str.split(",");
            var url = "";
            var goType = 0;
            //0 -ID , 1-url标示 2-cacheID 3-Op type 4-op reason and id
            data["id"]=(but_info[0]);
            //sh 为审核的缩写
            data["type"]="sh";
            //console.log(but_info[1]);
            url=setUrl(but_info[1],url);
            if(but_info[3]=="ruku"){
                 // ajax向后台索取 URL的相关ID的所有信息 然后显示到一个DIV面板

                  //0 - set the title div none
                $("#reason_title").css("display","none");
                $("#sh_left_reason").empty();
                $("#sh_right_reason").empty();
              $.ajax({
         type : "get",
         url : url,
         data : data,
         async : true,
         success : function(ret){

                //set div block
             $("#shenhe_tk").css("display","block");

                //add info and button
             var arr = Object.keys(ret);
             var length = arr.length;
             $("#shenhe_tk").css("height","auto");
             var i=0;
             $("#sh_left_169").empty();
             $("#sh_right_169").empty();
             for (var key in ret) {
                 if(i<=(length/2)){
                        $("#sh_left_169").append(
            "<div class='row ' style='width:100%;height: 7%;margin-top: 2%'> " +
                        //label
                       "<div style='width: 40%;height: 60%'> <label class='leftmove5' style='float:right;margin-right: 10%'>"+key+ "</label>" +
                       "</div> "+
                        //info
                        "<div class='leftmovelittle' style='width: 55%;height: 60%'>" +
                       "<div style='width: 40%;height: 60%'> <label class='leftmove5' style='float:right;margin-right: 10%'>"+ret[key]+ "</label>" +
                       "</div> "+
                       " </div>" +
            "</div>"
                   );
                 }
                 else {
                      $("#sh_right_169").append(
            "<div class='row ' style='width:100%;height: 7%;margin-top: 2%'> " +
                        //label
                       "<div style='width: 40%;height: 60%'> <label class='leftmove5' style='float:right;margin-right: 10%'>"+key+ "</label>" +
                       "</div> "+
                        //info
                        "<div class='leftmovelittle' style='width: 55%;height: 60%'>" +
                       "<div style='width: 40%;height: 60%'> <label class='leftmove5' style='float:right;margin-right: 10%'>"+ret[key]+ "</label>" +
                       "</div> "+
                       " </div>" +
            "</div>"
                   );
                 }
                i++;
             }
               // alert(ret["beizhu"]);
                }
            });
            }
            if(but_info[3]=="出库"){
                // get the item info and show in first div
                $.ajax({
         type : "get",
         url : url,
         data : data,
         async : true,
         success : function(ret){
             //to get the item info


                //set div block
             $("#shenhe_tk").css("display","block");

                //add info and button
             var arr = Object.keys(ret);
             var length = arr.length;

             $("#shenhe_tk").css("height","auto");

             var i=0;
             $("#sh_left_169").empty();
             $("#sh_right_169").empty();
             for (var key in ret) {
                 if(i<=(length/2)){
                        $("#sh_left_169").append(
            "<div class='row ' style='width:100%;height: 7%;margin-top: 2%'> " +
                        //label
                       "<div style='width: 40%;height: 60%'> <label class='leftmove5' style='float:right;margin-right: 10%'>"+key+ "</label>" +
                       "</div> "+
                        //info
                        "<div class='leftmovelittle ' style='width: 55%;height: 60%'>" +
                       "<div style='width: 80%;height: 60%'> <label class='leftmove5' style='float:right;margin-right: 10%'>"+ret[key]+ "</label>" +
                       "</div> "+
                       " </div>" +
            "</div>"
                   );
                 }
                 else {
                      $("#sh_right_169").append(
            "<div class='row ' style='width:100%;height: 7%;margin-top: 2%'> " +
                        //label
                       "<div style='width: 40%;height: 60%'> <label class='leftmove5' style='float:right;margin-right: 10%'>"+key+ "</label>" +
                       "</div> "+
                        //info
                        "<div class='leftmovelittle' style='width: 55%;height: 60%'>" +
                       "<div style='width: 40%;height: 60%'> <label class='leftmove5' style='float:right;margin-right: 10%'>"+ret[key]+ "</label>" +
                       "</div> "+
                       " </div>" +
            "</div>"
                   );
                 }
                i++;
             }
               // alert(ret["beizhu"]);
                }
            });
                // get the reason and show in second div
                //1- get the reason url and id
                var reasoninfo = but_info[4].split(";");
                // console.log("url:",reasoninfo[0]);
                //  console.log("id:",reasoninfo[1]);
                 var reasonData= {};
                 if( reasoninfo[0]==""){
                       $("#reason_title").css("display","none");
                $("#sh_left_reason").empty();
                $("#sh_right_reason").empty();
                     return ;
                 }
                 reasoninfo[0] = reasoninfo[0] +"/info" ;
                 reasonData["id"] = reasoninfo[1];

                 $.ajax({
                 type : "get",
                 url : reasoninfo[0],
                 data : reasonData,
                 async : true,
                 success : function(ret){
                      //0 - set the title div block
                        $("#reason_title").css("display","block");
                        $("#shenhe_tk").css("height","auto");
                        //add info and button
                     var arr = Object.keys(ret);
                     var length = arr.length;

                     var i=0;
                     $("#sh_left_reason").empty();
                     $("#sh_right_reason").empty();
                     for (var key in ret) {
                         if(i<=(length/2)){
                                $("#sh_left_reason").append(
                    "<div class='row ' style='width:100%;height: 7%;margin-top: 2%'> " +
                                //label
                               "<div style='width: 40%;height: 60%'> <label class='leftmove5' style='float:right;margin-right: 10%'>"+key+ "</label>" +
                               "</div> "+
                                //info
                                "<div class='leftmovelittle' style='width: 55%;height: 60%'>" +
                               "<div style='width: 40%;height: 60%'> <label class='leftmove5' style='float:right;margin-right: 10%'>"+ret[key]+ "</label>" +
                               "</div> "+
                               " </div>" +
                    "</div>"
                           );
                         }
                         else {
                              $("#sh_right_reason").append(
                    "<div class='row ' style='width:100%;height: 7%;margin-top: 2%'> " +
                                //label
                               "<div style='width: 40%;height: 60%'> <label class='leftmove5' style='float:right;margin-right: 10%'>"+key+ "</label>" +
                               "</div> "+
                                //info
                                "<div class='leftmovelittle' style='width: 55%;height: 60%'>" +
                               "<div style='width: 40%;height: 60%'> <label class='leftmove5' style='float:right;margin-right: 10%'>"+ret[key]+ "</label>" +
                               "</div> "+
                               " </div>" +
                    "</div>"
                           );
                         }
                        i++;
                     }
                       // alert(ret["beizhu"]);
                        }
                    });
            }

      })

      $("#sh_save").click(function () {
        var but_str = $(this).val();
        console.log("info:",but_str);
        //alert(but_str);
        // set the item "未出库" by id
        var but_info = but_str.split(",");
        // console.log("0:",but_info[0]);
        // console.log("1:",but_info[1]);
        // console.log("2:",but_info[2]);
        if(but_info[3]=="ruku"){
             shYes(but_info[0],but_info[1]);
        }
        if(but_info[3]=="出库"){
            cKshYes(but_info[0],but_info[1]);
        }
        shCacheFix(but_info[2]);
        cacheStart();

    })

      $("#sh_close").click(function () {
        $("#shenhe_tk").css("display","none");
      })

      function setUrl(info,url) {
          if(info=="169"){
              url="169/info";
          }
           if(info=="169网"){
              url="169/info";
          }
          if(info=="承载网"){
              url="czw/info";
          }
          if(info=="gmk"){
              url="gmk/shinfo";
          }

           if(info=="gcck"){
              // to gcckCache to get ItemInfo
              url="gcck/getItemInfo";
          }
          if(info=="ywkt"){
              // to gcckCache to get ItemInfo
              url="ywkt/getItemInfo";
          }
          return url

      }
});

