$(function () {
    if(localStorage.getItem("id")==null&&window.location.href.indexOf("login.html")==-1){
        window.location.href = './login.html';
    }
    var MenuID=[];
    var OrderID=[];
    //对数据进行初始化操作
    var menuObj={
        url:'http://39.105.232.109:3000/food/getInfoByPage',
        menuContent:".menuContent",
        method:menu,
        tbody:".vegetable tbody",
        pageNumber:".pagination .pageNumber",
        pre:".pagination .pre"
    };
    var orderObj={
        url:"http://39.105.232.109:3000/order/getInfoByPage",
        menuContent:".orderContent",
        method:order,
        tbody:".order tbody",
        pageNumber:".order-pagination .pageNumber",
        pre:".order-pagination .order-pre"
    };
    var numMenu = Number(getMenu(1,menuObj));
    var numOrder = Number(getMenu(1,orderObj));
    function menu(obj) {
        var content="";
        var page=$(".pagination .pageActive").text()||1;
        page=(page-1)*6;
        obj.forEach(function (element, index) {
            if(MenuID.indexOf(element._id)<0){
                MenuID.push(element._id);
            }
            content += " <tr class='menuContent'>\n" +
                " <td  class=\"number\">" + (page+index + 1) + "</td>\n" +
                " <td  class=\"ver-name\">" + element.name + "</td>\n" +
                " <td  class=\"price\">" + element.price + "</td>\n" +
                " <td  class=\"desc\">" + element.desc + "</td>\n" +
                " <td  class=\"typename\">" + element.typename + "</td>\n" +
                " <td  class=\"typeid\">" + element.typeid + "</td>\n" +
                " <td  class=\"handle\"><span class='alter'><i class=\"fa fa-pencil-square-o\"></i>编辑</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class='del'><i class=\"fa fa-trash-o\"></i>删除</span></td>\n" +
                "</tr>";
        });
        return content;
    };
    function order(obj) {
        var content="";
        var page=$(".order-pagination .pageActive").text()||1;
        page=(page-1)*6;
        obj.forEach(function (element, index) {
            if(OrderID.indexOf(element._id)<0){
                OrderID.push(element._id);
            }
            content += " <tr class='orderContent'>\n" +
                "<td class=\"number\">"+(page+index + 1) +"</td>\n" +
                "<td class=\"food\">"+element.food+"</td>\n" +
                "<td class=\"receivables\">"+ element.receivables+"</td>\n" +
                "<td class=\"drawee\">"+ element.drawee+"</td>\n" +
                "<td  class=\"handle\"><span class='alter'><i class=\"fa fa-pencil-square-o\"></i>编辑</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class='del'><i class=\"fa fa-trash-o\"></i>删除</span></td>\n" +
                "</tr>";
        });
        return content;
    };
    function getPage(pageNumber,pre,getMenu,page) {
        if ($(pageNumber).length < page) {
            var pages = "";
            for (let i = 1; i <= page; i++) {
                pages += "<li class='pageNumber'>\n" + i + "</li>";
            }
            $(pre).after(pages);
            $(pageNumber).siblings().removeClass("pageActive");
            $(pageNumber).eq(0).addClass("pageActive");
        }else if($(pageNumber).length > page){
            $(pageNumber).eq(-1).remove();
            $(pageNumber).each(function () {
                if(pageNumber===".pagination .pageNumber"){
                    getMenu($(this).text(),menuObj);
                }else{
                    getMenu($(this).text(),orderObj);
                }
            });
            $(pageNumber).siblings().removeClass("pageActive");
            $(pageNumber).eq(-1).addClass("pageActive");
        }
    };
    function getMenu(page,obj) {
        var page = page || 1;
        $.ajax({
            url:obj.url,
            type: "post",
            data: {pageSize: 6, page: page},
            success: function (data) {
                var res = data.info.list;
                //将添加的上个部分删除
                $(obj.menuContent).remove();
                var content = obj.method(res);
                $(obj.tbody).prepend(content);
                getPage(obj.pageNumber,obj.pre,getMenu,data.info.allpage);
            }
        });
        return page;
    };
    $(".pagination").delegate('li', 'click', function (event) {
        var length = $(".pagination .pageNumber").length;
        $(this).siblings().removeClass("pageActive");
        if ($(this).hasClass("pre")) {
            numMenu = numMenu - 1 <= 0 ? length : numMenu - 1;
            getMenu(numMenu,menuObj);
            $(".pagination .pageNumber").eq(numMenu - 1).addClass("pageActive");
        } else if ($(this).hasClass("next")) {
            numMenu = numMenu + 1 > length ? 1 : numMenu + 1;
            getMenu(numMenu,menuObj);
            $(".pagination .pageNumber").eq(numMenu - 1).addClass("pageActive");
        } else {
            $(this).addClass("pageActive");
            getMenu($(this).text(),menuObj);
        }
    });
    $(".order-pagination").delegate('li', 'click', function (event) {
        var length = $(".order-pagination .pageNumber").length;
        $(this).siblings().removeClass("pageActive");
        if ($(this).hasClass("order-pre")) {
            numOrder = numOrder - 1 <= 0 ? length : numOrder - 1;
            getMenu(numOrder,orderObj);
            $(".order-pagination .pageNumber").eq(numOrder - 1).addClass("pageActive");
        } else if ($(this).hasClass("order-next")) {
            numOrder = numOrder + 1 > length ? 1 : numOrder + 1;
            getMenu(numOrder,orderObj);
            $(".order-pagination .pageNumber").eq(numOrder - 1).addClass("pageActive");
        } else {
            $(this).addClass("pageActive");
            getMenu($(this).text(),orderObj);
        }
    });
    //登录
    $(".login-in").on('click', function () {
        var us = $(".us").val();
        var ps = $(".ps").val();
        if (us == "") {
            alert("请将信息输入完整！");
            $(".us").focus();
        } else if (ps == "") {
            alert("请将信息输入完整！");
            $(".ps").focus();
        } else {
            $.ajax({
                url: "http://39.105.232.109:3000/user/login",
                type: "post",
                data: {us: us, ps: ps},
                success: function (data) {
                    if (data.err === 0 && data.msg === "登录成功") {
                            localStorage.setItem("id", data._id);
                        $(".load").css("display", "block");
                        setTimeout(function () {
                            window.location.href = './user.html';
                        }, 1000);
                    } else {
                        alert("账号或密码错误！");
                        $("input").val("");
                        $(".us").focus();
                    }
                }
            })
        }
    });
    //退出
    $(".close").on('click', function () {
        $.ajax({
            url: "http://39.105.232.109:3000/user/logout",
            type: "post",
            success: function (data) {
                localStorage.removeItem("id");
                console.log(data);
                var flag=window.confirm("确定要退出吗？");
                if(flag){
                    window.location.href = 'http://localhost:63342/WEB/food/html/login.html';
                }
            }
        });
    });
    //目录导航
    navigation(".list .open-user",'./user.html');
    navigation(".list .open-menu",'./menu.html');
    navigation(".list .open-order",'./order.html');
    function navigation(obj,url){
        $(obj).on('click', function () {
            window.location.href=url;
        });
    };
    //显示个人资料
    if(window.location.href.indexOf("user.html")!=-1){
        showUser();
    }
    function showUser() {
        $.ajax({
            url: "http://39.105.232.109:3000/user/getInfoById",
            type: "post",
            data:{_id:localStorage.getItem("id")},
            success: function (data) {
                if(data.err=="0"){
                    var $msg = data.list;
                    $(".user-name").text($msg[0].name);
                    $(".user-sex").text($msg[0].sex);
                    $(".user-tel").text($msg[0].tel);
                }else{
                    alert("查询失败！！！");
                }
            }
        });
    };
    $(".change-msg-button").on('click', function () {
        $(".change-msg").css("display", "block");
        $(".change-msg .name").val($(".user-name").text());
        $(".change-msg .sex").val($(".user-sex").text());
        $(".change-msg .tel").val($(".user-tel").text());
    });
    //修改用户信息
    $(".change-msg-submit").on('click', function () {
        var res = [];
        var flag = isTrue(res);
        if (flag) {
            $.ajax({
                url: "http://39.105.232.109:3000/user/updata",
                type: "post",
                data: {_id:localStorage.getItem("id"), name: res[0] + "",sex:Number(res[1]),tel: Number(res[2])},
                success: function (data) {
                    if (data.err == "-1") {
                        alert("修改失败！！！");
                        $(".change-msg-reset").trigger("click");
                        $(".input-msg:first").focus();
                    } else {
                        var flag = confirm("修改成功!!!");
                        if (flag) {
                            $(".change-msg-close").trigger("click");
                            showUser();
                        }
                    }
                }
            });
        } else {
            alert("输入的信息有误,请重新输入！！！");
        }
    });
    function isTrue(res) {
        var flag = true;
        $(".input-msg").each(function () {
            if ($(this).val() === "") {
                $(this).focus();
                return false;
            } else {
                res.push($(this).val());
            }
        });
        var sex = parseInt($(".input .sex").val());
        if (sex != 0 && sex != 1) {
            $(".input-msg .sex").focus();
            return false;
        }
        var regTel = /^1[3456789]\d{9}$/;
        var tel = parseInt($(".input .tel").val());
        if (!(regTel.test(tel))) {
            $(".input-msg .tel").focus();
            return false;
        }
        return flag;
    }
    $(".change-msg-close").on('click', function () {
        $(".change-msg").css({
            "animation": "closeChangeMsg 0.7s ease-in",
        });
        setTimeout(function () {
            $(".change-msg").css({
                "display": "none",
                "animation": "openChangeMsg 0.7s ease-in"
            });
        }, 600);
        $(".change-msg-reset").trigger("click");
    });
    $(".change-msg-reset").on('click', function () {
        $(".input-msg").each(function () {
            $(this).val("");
            $(this).parents(".change-msg").find(".input .name").removeClass("active");
        });
    });
    //菜单的操作
    $(".vegetable").delegate('.menuContent .del', 'click', function () {
        var $this = $(this).parents(".menuContent");
        var num = $this.find(".number").text()-1;
        var flag = confirm("确定不做这道" + $this.find(".desc").text() + "了吗？");
        if (flag) {
            $.ajax({
                url: 'http://39.105.232.109:3000/food/del',
                type: 'post',
                data: {_id:  MenuID[num]},
                success: function (data) {
                    if (data.err == "0") {
                        $this.remove();
                        MenuID.splice(num,1);
                        $(".pagination .pageNumber").each(function () {
                            getMenu($(this).text(),menuObj);
                        });
                        setTimeout(function () {
                            $(".pagination .pageActive").trigger("click");
                        },10);
                    } else {
                        alert("删除失败！！!");
                    }
                }
            });
        }
    });
    $(".add-menu-open").on('click', function () {
        $(".addMenu").css({
            "display": "block"
        });
    });
    $(".addMenu-close").on('click', function () {
        $(".addMenu-msg").css({
            "animation": "closeChangeMsg 0.7s ease-in",
        });
        setTimeout(function () {
            $(".addMenu").css({
                "display": "none",
            });
            $(".addMenu-msg").css({
                "animation": "openChangeMsg 0.7s ease-in"
            });
        }, 600);
        $(".add-menu-reset").trigger("click");
    });
    $(".input-menu").on('focus', function () {
        $(this).parents(".input-menu-msg").find(".menu-sign-active").animate({
                "left": "-13px"
        },300);
    });
    $(".input-menu").on('blur', function () {
        if ($(this).val() === "") {
            $(this).parents(".input-menu-msg").find(".menu-sign-active").animate({
                "left": "-99px"
            }, 300);
        }
    });
    $(".add-menu-submit").on('click', function () {
        var flag=0;
        var res = [];
        $(".input-menu").each(function () {
            if($(this).hasClass(".input-typeid")) {
                if (isNaN(Number($(this).val()))) {
                    if (flag % 2 == 0) {
                        alert("输入数据的类型错误！！！");
                        flag++;
                    }
                    $(this).focus();
                } else {
                    res.push($(this).val());
                }
            }else {
                res.push($(this).val());
            }
        });
        $.ajax({
            url: "http://39.105.232.109:3000/food/add",
            type: "post",
            data: {name: res[0], price: res[1], desc: res[2], typename: res[3], typeid: Number(res[4])},
            success: function (data) {
                if (data.err == "0" && data.msg == "添加成功") {
                    $(".addMenu-close").trigger("click");
                    $(".pagination .pageNumber").each(function () {
                        getMenu($(this).text(),menuObj);
                    });
                    setTimeout(function () {
                        $(".pagination .pageNumber").eq(-1).trigger("click");
                    },10);
                    $(".add-menu-reset").trigger("click");
                }
            }
        });
    });
    $(".add-menu-reset").on('click', function () {
        $(".input-menu").each(function () {
            $(this).val("");
            $(this).trigger("blur");
        });
    });
    $(".vegetable").delegate('.menuContent .alter', 'click', function () {
        $(".changeMenu").fadeIn(600);
        var obj = $(this).parents(".menuContent");
        var num=$(obj).find(".number").text()-1;
        var res = "<ul class=\"changeMenu-Content change-input-menu\">\n" +
            "<li class=\"ver-name\">" + $(obj).find(".ver-name").text() + "</li>\n" +
            "<li class=\"price\">" + $(obj).find(".price").text() + "</li>\n" +
            "<li class=\"desc\">" + $(obj).find(".desc").text() + "</li>\n" +
            "<li class=\"typename\">" + $(obj).find(".typename").text() + "</li>\n" +
            "<li class=\"typeid\">" + $(obj).find(".typeid").text() + "</li>\n" +
            "</ul>";
        $(".changeMenu-back .changeMenu-Content").after(res);
        $(".changeMenu-back").delegate(".change-input-menu li", 'click', function () {
            var num=0;
            var input ="<input class='changeUp' type='text'>";
            input.value = $(this).text();
            $(this).text("");
            $(this).append(input);
            $(".changeUp").focus();
            var obj = $(this);
            var res = [];
            $(".changeUp").on("blur", function () {
                if ($(this).val() === "") {
                    if(num%2==0){
                        alert("请将信息输入完整！！！");
                    }
                    $(this).focus();
                    num++;
                }else if (obj.hasClass("typeid")) {
                    if(isNaN(Number($(this).val()))){
                        alert("输入数据的类型错误！！！");
                    }else{
                        $(obj).text($(this).val());
                        res.push($(this).val());
                        $(this).remove();
                    };
                }else {
                    $(obj).text($(this).val());
                    res.push($(this).val());
                    $(this).remove();
                }
            });
        });
        $(".changeMenu-submit li").on('click',function (){
            var res=[];
            $(".change-input-menu li").each(function () {
                res.push($(this).text());
            });
            $.ajax({
                url:"http://39.105.232.109:3000/food/updata",
                type:"post",
                data:{_id:MenuID[num],name:res[0],price:res[1],desc:res[2],typename:res[3],typeid:Number(res[4])},
                success:function (data) {
                    if (data.err=="0"){
                        $(".changeMenu").fadeOut(600,function () {
                            $(".changeMenu-back .change-input-menu").remove();
                        });
                        getMenu($(".pagination .pageActive").text(),menuObj);
                        $(".pagination .pageActive").trigger("click");
                    }else{
                        alert("修改失败！！！");
                    }
                }
            })
        });
    });
    //订单操作
    $(".order").delegate('.orderContent .del', 'click', function () {
        var $this = $(this).parents(".orderContent");
        var num= $this.find(".number").text()-1;
        var flag = confirm("确定要取消" + $this.find(".food").text() + "订单吗？");
        if (flag) {
            $.ajax({
                url: 'http://39.105.232.109:3000/order/del',
                type: 'post',
                data: {_id:OrderID[num]},
                success: function (data) {
                    if (data.err == "0") {
                        $this.remove();
                        OrderID.splice(num,1);
                        $(".order-pagination .pageNumber").each(function () {
                            getMenu($(this).text(),menuObj);
                        })
                        setTimeout(function () {
                            $(".order-pagination .pageActive").trigger("click");
                        },10);
                    } else {
                        alert("删除失败！！!");
                    }
                }
            });
        };
    });
    $(".add-order-open").on('click', function () {
        $(".addOrder").css({
            "display": "block"
        });
        $(".add-input .input-tel").focus();
        $(".add-input .input-tel").val("15738528775");
    });
    $(".addOrder-close").on('click', function () {
        $(".addOrder-msg").css({
            "animation": "closeChangeMsg 0.7s ease-in",
        });
        setTimeout(function () {
            $(".addOrder").css({
                "display": "none",
            });
            $(".addOrder-msg").css({
                "animation": "openChangeMsg 0.7s ease-in"
            });
        }, 600);
        $(".add-order-reset").trigger("click");
    });
    $(".input-order").on('focus', function () {
        $(this).parents(".input-order-msg").find(".order-sign-active").animate({
            "left":"-15px"
        },300);
    });
    $(".input-order").on('blur', function () {
        if ($(this).val() == "") {
            $(this).parents(".input-order-msg").find(".order-sign-active").animate({
                "left": "-99px"
            }, 300);
        }
    });
    $(".add-order-submit").on('click', function () {
        var f=0,t=0;
        var res = [];
        $(".input-order").each(function () {
            var regTel = /^1[3456789]\d{9}$/;
            if($(this).hasClass(".input-receivables")) {
                if (isNaN(Number($(this).val()))) {
                    if (f % 2 == 0) {
                        alert("输入数据的类型错误！！！");
                        f++;
                    }
                    $(this).focus();
                }else {
                    res.push($(this).val());
                }
            }else if($(this).hasClass(".input-tel")) {
                var tel=$(this).val();
                if(!(regTel.test(tel))){
                    if (t % 2 == 0) {
                        alert("手机号输入错误！！！");
                        t++;
                    }
                    $(this).focus();
                }else{
                    res.push($(this).val());
                }
            }else{
                res.push($(this).val());
            }
        });
        $.ajax({
            url: "http://39.105.232.109:3000/order/add",
            type: "post",
            data: {food:res[0],receivables:Number(res[1]),drawee:res[2]},
            success: function (data) {
                if (data.err == "0" && data.msg == "添加成功") {
                    $(".addOrder-close").trigger("click");
                    $(".order-pagination .pageNumber").each(function () {
                        getMenu($(this).text(),orderObj);
                    })
                    setTimeout(function () {
                        $(".order-pagination .pageNumber").eq(-1).trigger("click");
                    },10);
                    $(".add-order-reset").trigger("click");
                }else{
                    alert(data.msg);
                }
            }
        });
    });
    $(".add-order-reset").on('click', function () {
        $(".input-order").each(function () {
            $(this).val("");
            $(this).trigger("blur");
        });
    });
    $(".order").delegate('.orderContent .alter', 'click', function () {
        $(".changeOrder").fadeIn(600);
        var obj = $(this).parents(".orderContent");
        var num=$(obj).find(".number").text()-1;
        var res = "<ul class=\"changeOrder-Content change-input-order\">\n" +
            "<li class=\"food\">"+$(obj).find(".food").text()+"</li>\n" +
            "<li class=\"receivables\">"+$(obj).find(".receivables").text()+"</li>\n" +
            "<li class=\"drawee input-tel\">"+$(obj).find(".drawee").text()+"</li>\n" +
            "</ul>";
        $(".changeOrder-back .changeOrder-Content").after(res);
        $(".changeOrder-back").delegate(".change-input-order li", 'click', function () {
            var num=0,t=0;
            var input = "<input class='changeOn' type='text'>";
            input.value = $(this).text();
            $(this).text("");
            $(this).append(input);
            $(".changeOn").focus();
            var obj = $(this);
            var res = [];
            var regTel = /^1[3456789]\d{9}$/;
            $(".changeOn").on("blur", function () {
                if ($(this).val() === "") {
                    if(num%2==0){
                        alert("请将信息输入完整！！！");
                    }
                    $(this).focus();
                    num++;
                }else if (obj.hasClass("receivables")) {
                    if(isNaN(Number($(this).val()))){
                        alert("输入数据的类型错误！！！");
                    }else{
                        $(obj).text($(this).val());
                        res.push($(this).val());
                        $(this).remove();
                    };
                }else if(obj.hasClass("drawee")){
                    var tel=parseInt($(this).val());
                    if(!(regTel.test(tel))) {
                        if (t % 2 == 0) {
                            alert("手机号输入错误！！！");
                            t++;
                        }
                        $(".input-tel").focus();
                    }else{
                        $(obj).text($(this).val());
                        res.push($(this).val());
                        $(this).remove();
                    }
                }else{
                    $(obj).text($(this).val());
                    res.push($(this).val());
                    $(this).remove();
                };
            });
        });
        $(".changeOrder-submit li").on('click',function (){
            var res=[];
            $(".change-input-order li").each(function () {
                res.push($(this).text());
            });
            $.ajax({
                url:"http://39.105.232.109:3000/order/updata",
                type:"post",
                data:{_id:OrderID[num],food:res[0],receivables:res[1],drawee:res[2]},
                success:function (data) {
                    if (data.err=="0"){
                        $(".changeOrder").fadeOut(600,function () {
                            $(".changeOrder-back .change-input-order").remove();
                        });
                        getMenu($(".order-pagination .pageActive").text(),orderObj);
                        $(".order-pagination .pageActive").trigger("click");
                    }else{
                        alert("修改失败！！！");
                    }
                }
            });
        });
    });
});