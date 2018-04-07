/**
  项目JS主入口
  以依赖layui的layer和form模块为例
**/
// 展示数据
var data_leftMenu = {
    menuParent: [{
        name: '首页',
        dataUrl: '/data/index.json'
    },
    {
        name: '审核管理',
        menuChilds: [{
            name: '待审核',
            dataUrl: '/data/audit.json'
        },{
            name: '用户信息',
            dataUrl: '/data/userInfo.json'
        }]
    },
    {
        name: '内容管理',
        menuChilds: [{
            name: '赛事管理',
            dataUrl: '/data/gameManage.json'
        },{
            name: '课程管理',
            dataUrl: '/data/coursesManage.json'
        }, {
            name: '短视频管理',
            dataUrl: '/data/smallVideoManage.json'
        },
        {
            name: 'RTMP地址管理',
            dataUrl: '/data/rtmpAddressManage.json'
        }]
    }]
};

// 数据展示模板
var tpl_leftMenu = '<ul class="layui-nav layui-nav-tree"  lay-filter="leftMenu">\
                        {{#  layui.each(d.menuParent, function(index, item){ }}\
                        <li class="layui-nav-item {{item.selected == true?\'layui-this\':\'\'}}">\
                            {{# if(item.dataUrl){ }}\
                                <a class="" href="javascript:;" data-url="{{item.dataUrl}}">{{item.name}}</a>\
                            {{# }else{ }}\
                                <a class="" href="javascript:;">{{item.name}}</a>\
                            {{# } }}\
                            {{# if(item.menuChilds){ }}\
                                <dl class="layui-nav-child">\
                                    {{#  layui.each(item.menuChilds, function(indexChild, itemChild){ }}\
                                    <dd><a href="javascript:;" data-url="{{itemChild.dataUrl}}">{{itemChild.name}}</a></dd>\
                                    {{#  }); }}\
                                </dl>\
                            {{# } }}\
                        </li>\
                        {{#  }); }}\
                    </ul>';

// main tab
var tpl_mainTab = '<div class="layui-tab" lay-allowClose="true" lay-filter="mainTab">\
                        <ul class="layui-tab-title">\
                        </ul>\
                        <div class="layui-tab-content">\
                        </div>\
                    </div>';
/*
<div class="layui-tab" lay-allowClose="true" lay-filter="mainTab">
    <ul class="layui-tab-title">
    <li class="layui-this">首页</li>
    </ul>
    <div class="layui-tab-content">
    <div class="layui-tab-item layui-show">
        首页
    </div>
    </div>
</div>
*/

layui.define(['layer', 'form','element','laytpl'], function(exports){

    var layer = layui.layer,
        form = layui.form,
        element = layui.element,
        $ = layui.jquery;
    
    var laytpl = layui.laytpl,
        leftMenu = document.getElementById('leftMenu'),
        mainTab = document.getElementById('mainContent');
    
    // 加载左侧菜单
    laytpl(tpl_leftMenu).render(data_leftMenu, function(html){
        leftMenu.innerHTML = html;
    });    

    laytpl(tpl_mainTab).render({}, function(html){ 
        mainTab.innerHTML = html;
    })

    // 动态页面渲染完执行 element.init ，加载layui事件
    element.init();

    // 主tab
    element.on('tab(mainTab)', function (othis) {
        //console.log(othis);
    });

    // 左侧菜单监听事件
    element.on('nav(leftMenu)', function (othis) {

        var dataUrl = othis.attr('data-url'),
            thisLayid = othis.attr('lay-id');
        
        if (thisLayid && tabExistId(thisLayid,'mainTab')) { 
            element.tabChange('mainTab', thisLayid);
            return;
        }

        if (dataUrl == '') { 
            return;
        }

        var baseUrl = 'http://127.0.0.1:8080';
        var view = document.getElementById('view');

        $.getJSON(baseUrl + dataUrl, function (data) {

            var id = data.id,
                title = data.title,
                content = data.content;
            
            //mainTabHandler
            element.tabAdd('mainTab', {
                title: title,
                content: content,
                id: id
            });
            othis.attr({ 'lay-id':id});
            element.tabChange('mainTab', id); //切换到：用户管理
            //element.init();
        });

        function tabExistId(id,filter) { 
            var $tab = $('.layui-tab[lay-filter="' + filter + '"]'),
                $tabTile = $tab.find('.layui-tab-title'),
                $tab_liById = $tabTile.find('>li[lay-id="' + id + '"]');
            
            if ($tab_liById.length === 1) { 
                return true;
            }

            return false;
        }
    });

    // mainTab 触发事件
    var mainTabHandler = {
        tabAdd: function(){
            //新增一个Tab项
            element.tabAdd('mainTab', {
                title: '新选项'+ (Math.random()*1000|0) //用于演示
                ,content: '内容'+ (Math.random()*1000|0)
                ,id: new Date().getTime() //实际使用一般是规定好的id，这里以时间戳模拟下
            })
        },
        tabDelete: function (othis) {
            //删除指定Tab项
            element.tabDelete('mainTab', '44'); //删除：“商品管理”
            othis.addClass('layui-btn-disabled');
        },
        tabChange: function () {
            //切换到指定Tab项
            element.tabChange('mainTab', '22'); //切换到：用户管理
        }
    };
    
    exports('index', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});