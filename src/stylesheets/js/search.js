var all_content;
window.onload = function () {
    $.getJSON("./resource/bookmarks.json", function (content, status) {
        var hide = 0;
        for (var i in content) {
            init(content[i]["id"], content[i]["title"], content[i]["address"]);
            var del_id = "#" + "del" + content[i]["id"];
            del_add(del_id);
        }
        all_content = $(".list_content");

        $(".holder").jPages({
            containerID: "itemContainer",
            first: '首页',
            last: '尾页',
            previous: '上页',
            next: '下页',
            perPage: 6,
            startPage: 1,
            keyBrowse: true,
            animation: "none",
            jqueryanimation: "none",
            callback: function (pages, items) {
                items.showing.find(".per").trigger("turnPage");
            }
        });
    });

    new jBox('Modal', {
        width: 500,
        height: 280,
        attach: $('#add_button'),
        title: '添加书签',
        content: "<div class='add_template'>"
        + "<div class='input'><span class='sp'>书签名称</span><input type='text' class='input_text' id='mark_name'></div>"
        + "<div class='input'><span class='sp'>书签地址</span><input type='text' class='input_text' id='mark_address'></div>"
        + "<div class='input_button'><Button id='add_ok' onclick='addok(this)' class='button button-pill button-tiny demo-button demo-button-click noselect'>确定</Button></div>"
        + "<div class='input_hidden'><span hidden='hidden' id='hide'>请输入正确的书签名称/书签链接</span></div>"
        + "</div>"
    });

    $(".search")
        .bind('focus', function (event) {
            if (this.value == 'Key Words')
                $(this).val("");
        })
        .bind('blur', function (event) {
            if (this.value == '') {
                $(this).val("Key Words");
            }
        })
        .bind('keyup', function (event) {
            var temp = all_content;
            temp.map(function (index, val) {
                this.innerHTML = this.innerHTML.replace(/<.*?>/ig, "");
            });
            var keywords = this.value;

            $(".list").children('li').remove();
            if (keywords != "") {
                var count = 0;
                var keywordRE = new RegExp("(" + keywords + ")", "ig");
                temp.each(function () {
                    var text = this.innerHTML.toLocaleString();
                    if (text.match(keywordRE)) {
                        var highlight = text.replace(keywordRE, "<span class='highlight'>$1</span>");
                        this.innerHTML = highlight;
                        $(".list").append($(this).parent("li"));
                        //$(this).parent("li").show();
                        count++;
                        var del_id = "#" + $(this).parent("li").children().last().attr("id");
                        del_add(del_id);
                    }
                    else {
                        //$(this).parent("li").remove();
                    }
                });
            }
            else {
                temp.each(function () {
                    $(".list").append($(this).parent("li"));
                    var del_id = "#" + $(this).parent("li").children().last().attr("id");
                    del_add(del_id);
                });
                count = 0;
            }
            divider_again();
            var num = document.getElementById("number");
            num.innerHTML = count;
        });
};

function formatDate(d) {
    var regS = new RegExp("\\/", "g");
    var regD = new RegExp("[0-9]+-[0-9]+-[0-9]+", "g");
    return new Date(parseInt(d) * 1000).toLocaleString()
        .replace(regS, "-")
        .match(regD);
}

function addok(d) {
    var name = $("#mark_name").val();
    var addr = $("#mark_address").val();
    if (name == "" || addr == "") {
        $("#hide").fadeIn("slow");
        $("#hide").fadeOut("slow");
        return false;
    }
    doajax_add(name, addr);
    $("#jBox-overlay").click();
}

function del(id) {       //删除书签
    var li_id = "li" + id;
    var i = 0;
    all_content.each(function () {
        if (li_id == $(this).parent("li").attr("id")) {
            doajax_del(li_id, this, i);
            return false;
        }
        i++;
    });
}

function del_add(item) {
    new jBox('Confirm', {
        attach: $(item),
        title: '删除记录',
        content: '确认要删除吗？',
        confirmButton: '是',
        cancelButton: '否'
    });
}

function divider_again() {
    $(".holder").jPages("destroy").jPages({
        containerID: "itemContainer",
        first: '首页',
        last: '尾页',
        previous: '上页',
        next: '下页',
        perPage: 6,
        startPage: 1,
        animation: "none",
        jqueryanimation: "none"
    });
}

function doajax_del(id, item, i) {
    $.ajax({
        url: "stylesheets/server/delete.php",
        type: "POST",
        data: {trans_data: id},
        error: function () {
            alert('Error!');
        },
        success: function (data, status) {
            $(item).parent("li").remove();
            divider_again();
            all_content.splice(i, 1);
            var num = document.getElementById("number");
            var count = $("#number").text();
            if (count > 0)
                num.innerHTML = count - 1;
        }
    });
}

function doajax_add(m_name, m_addr) {
    $.ajax({
        url: "stylesheets/server/add.php",
        type: "POST",
        data: {name: m_name, addr: m_addr},
        error: function () {
            alert('Error!');
        },
        success: function (data, status) {
            $(".list").children('li').remove();
            all_content.each(function () {
                $(".list").append($(this).parent("li"));
                var del_id = "#" + $(this).parent("li").children().last().attr("id");
                del_add(del_id);
            });
            init(data, m_name, m_addr);
            var del_id = "#" + "del" + data;
            del_add(del_id);
            all_content = $(".list_content");
            divider_again();
            $(".search").val("");
            var num = document.getElementById("number");
            num.innerHTML = 0;
        }
    });
}

function init(id, content, addr) {
    if (addr.indexOf('http') == 0) {
        $(".list").append("<li class='per' id='li" + id + "'>"
            + "<a class='list_content' href='" + addr + "'>" + content + "</a>"
            + "<Button id='del" + id + "' type='button' class='button button-pill button-tiny'"
            + "onclick='del(" + id + ")'>"
            + "删除"
            + "</Button>" +
            "</li>");
    }
    else {
        $(".list").append("<li class='per' id='li" + id + "'>"
            + "<span class='list_content'>" + content + "</span>"
            + "<Button id='del" + id + "' type='button' class='button button-pill button-tiny'"
            + "onclick='del(" + id + ")'>"
            + "删除"
            + "</Button>" +
            "</li>");
    }
}
