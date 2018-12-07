function DetailMap(d){
    this._wrapdom=d._wrapdom;
    this.xq_data=d.xq_data;

    this.init=function(){
        this.iframeMap();
    };
    this.iframeMap= function (){
        this.initMapContainer();
        this.registMapEvent();
        this.mapTabToView();
        this.loadTabEvent();
    };
    this.initMapContainer= function(){

        this._map=new BMap.Map('baidu-map', {enableMapClick:false});//地图底层不可点
        this._map.enableScrollWheelZoom();  // 开启鼠标滚轮缩放
        this._map.enableKeyboard();         // 开启键盘控制
        this._map.enableContinuousZoom();   // 开启连续缩放效果
        this._map.enableInertialDragging(); // 开启惯性拖拽效果
        // this._map.centerAndZoom(this._city,14);	// 初始化地图

        this._buscanvas = $(this._wrapdom).find("#bus-map").get(0);
        this._ditiecanvas = $(this._wrapdom).find("#ditie-map").get(0);
        this._symapcanvas = $(this._wrapdom).find("#yry-map").get(0);
        this._pupilmapcanvas = $(this._wrapdom).find("#pupil-map").get(0);
        this._middlemapcanvas = $(this._wrapdom).find("#middle-map").get(0);
        this._highmapcanvas = $(this._wrapdom).find("#high-map").get(0);
        this._ylmapcanvas = $(this._wrapdom).find("#yiliao-map").get(0);
        this._gwmapcanvas = $(this._wrapdom).find("#shop-map").get(0);
        this._lifemapcanvas = $(this._wrapdom).find("#life-map").get(0);
        this._yulemapcanvas = $(this._wrapdom).find("#yule-map").get(0);

        var canvasArr=[
            {key:'bus',dom:this._buscanvas},
            {key:'ditie',dom:this._ditiecanvas},
            {key:'yry',dom:this._symapcanvas},
            {key:'pupil',dom:this._pupilmapcanvas},
            {key:'middle',dom:this._middlemapcanvas},
            {key:'high',dom:this._highmapcanvas},
            {key:'yiliao',dom:this._ylmapcanvas},
            {key:'gouwu',dom:this._gwmapcanvas},
            {key:'life',dom:this._lifemapcanvas},
            {key:'yule',dom:this._yulemapcanvas}
        ];

        Xl.forIn(canvasArr,function(i,v){
            var mapname=v.key+'_map';
            mapname=new BMap.Map(v.dom,{enableMapClick:false});//配套部分地图
            HubObj.mapDomArr.push({key:v.key,value:mapname,circle:'',marker:[]});
            mapname.enableScrollWheelZoom();

        },this);
    };
    this.registMapEvent= function(){
        //注册地图事件
        var __t=this;
        this.createMarkMap();
        this._map.addEventListener("tilesloaded",function(e){
            // 防止黑块
            $('#baidu-map').css('visibility','visible');
            if(!__t.isload){
                __t.isload=true;
                __t.loadPeitaoToDetail();
            }
        });
    };
    this.createMarkMap= function(){
        if(this.xq_data.lat && this.xq_data.lng){
            this._createMarkMap(null, this.xq_data.lng , this.xq_data.lat);
        }else{
            this.searchMarkMap(HubObj.cityname);
        }

    };
    this.searchMarkMap= function(data,type){
        var __t=this;
        var local = new BMap.LocalSearch(this._map);
        local.setSearchCompleteCallback(function (rs) {
            if(!rs.getPoi(0)){
                Xl.alert('未找到相应的位置，请重新搜索');
                return;
            }
            var poi = rs.getPoi(0);
            var point = poi.point;
            __t._createMarkMap(null, point.lng, point.lat,type);
        });
        local.search($_C.cityname+data);
    };
    this._createMarkMap= function(point, posx, posy, type){
        var __t=this;
        if(!point){
            HubObj.lng=posx;
            HubObj.lat=posy;

            point = new BMap.Point(posx, posy);	// 创建点坐标
        }
        this._map.centerAndZoom(point, 16);	// 初始化地图
        this._map.clearOverlays();             //清除覆盖物
        this._marker = new BMap.Marker(point);    // 创建标注
        this._map.addOverlay(this._marker);	     // 将标注添加到地图中
        this._marker.enableDragging(true); // 设置标注可拖拽
        this._marker.setZIndex(1000);
        this._marker.addEventListener("dragend",function(){
            __t.markPointToMap(__t._marker);
        });
        this._marker.addEventListener('click',function(e){
            __t.markPointToMap(__t._marker);
        });

        if(type){
            //地图位置搜索时，不刷新后面的配套地图信息，保存时才刷新
            $(this._wrapdom).find('._fy-loacl').html('<span>GPS坐标：'+ HubObj.lng+','+HubObj.lat +'</span>');
            return;
        }
        this.createPeitaoMarker();
    };

    this.markPointToMap=function(marker){

        this.markerpoint=marker.getPosition();
        HubObj.lat=this.markerpoint.lat;
        HubObj.lng=this.markerpoint.lng;
        $(this._wrapdom).find('._fy-loacl').html('<span>GPS坐标：'+ HubObj.lng+','+HubObj.lat +'</span>');
        // this.createPeitaoMarker();
    };
    this.createPeitaoMarker=function(){
        var __t=this;
        $(this._wrapdom).find('._fy-gps').html('<span>GPS坐标：'+ HubObj.lng+','+HubObj.lat +'</span>');
        var point=new BMap.Point(HubObj.lng, HubObj.lat);
        Xl.forIn(HubObj.mapDomArr,function(i,v){
            v.value.clearOverlays();
            v.value.centerAndZoom(point, 15);
            var marker = new BMap.Marker(point);  // 创建标注
            v.value.addOverlay(marker);
            v.value.addEventListener("zoomend",function(e){
                __t.loadMapDetail(v.key);
            });
            v.value.addEventListener("dragend",function(e){
                __t.loadMapDetail(v.key);
            });
        },this);
    };

    this.mapTabToView=function(){
        var __t=this;
        $(this._wrapdom).find('.mapdetail-list ul li').click(function(e){

            if($(this).hasClass("active")){
                return;
            }
            $(this).addClass("active").siblings().removeClass("active");

            __t._index=$(this).parents('.mapdetail-list').attr('data-index');
            var $_childdom=$(this).parents('.baidumap_toolbar').find('.route');
            $_childdom.html(Map.sosoDom[__t._index]);
            $_childdom.find('a:nth-child(1)').addClass("active").siblings().removeClass("active");

            var maptype=$(this).parents('.baidumap_toolbar').attr('data-key');

            __t.loadMapDetail(maptype);
            __t.loadTabEvent();

        });

    };
    this.loadTabEvent=function(){
        var __t=this;
        $(this._wrapdom).find('.baidumap_toolbar .route a').click(function(){
            if($(this).hasClass("active")){
                return;
            }
            $(this).addClass("active").siblings().removeClass("active");
            var maptype=$(this).parents('.baidumap_toolbar').attr('data-key');
            __t.loadMapDetail(maptype);
        });
    };

    this.moveToLocation=function(key,index,maptype){
        var __t=this;

        var $_resultBox=this.$_sosomap.find('#baidumap_result');
        var soso_range=d._formsetObj.getValueByKey(maptype+'_range');

        Xl.forIn(HubObj.mapDomArr,function(i,v){
            if(maptype==v.key){
                this.sosoMap=v.value;
                Xl.forIn(v.marker,function(i,j){
                    v.value.removeOverlay(j);
                });
            }
        },this);

        var localpoint = new BMap.Point(HubObj.lng, HubObj.lat);
        var options = {
            onSearchComplete: function (results) {
                if (__t._local.getStatus() == BMAP_STATUS_SUCCESS) {
                    // 判断状态是否正确

                    if (results.getCurrentNumPois() < 1) {
                        $_resultBox.html('<p class="noResult">暂无相关信息，请查看其他内容吧</p>');
                    } else {

                        var num = 0;
                        //右边列表项
                        var listdata = ['<ul class="clearfix">'];
                        for (var i = 0; i < results.getCurrentNumPois(); i++) {


                            var endpoint = new BMap.Point(results.getPoi(i).point.lng, results.getPoi(i).point.lat);
                            var distance = parseInt(__t._map.getDistance(localpoint, endpoint));
                            // if (distance <= parseInt(soso_range)) {
                                listdata.push('<li class="maplist_' + i + '">' +
                                    '<a data-index="' + i + '" data-event="showInfoWindow" title="' + results.getPoi(i).title + '">' +
                                    '<p class="mapContent">' +
                                    '<span class="maptitle"><i><img src="' + Map.tabBarPic[index] + '" /></i>' + results.getPoi(i).title + '</span>' +
                                    '<span class="mapdis fr"><i><img src="/static/images/map/distance.png" /></i>' + distance + '米</span>' +
                                    '</p>' +
                                    '<p class="mapAddress">' + results.getPoi(i).address + '</p></a></li>');

                                num++;
                                var marker = __t.addMarker(results.getPoi(i).point, num, maptype);
                                var openInfoWinFun = __t.addInfoWindow(marker, results.getPoi(i), distance);

                            // }
                        }
                    }
                    listdata.push(['</ul>']);
                    $_resultBox.html(listdata.join(''));

                    if ($_resultBox.find('ul').children().length == 0) {
                        $_resultBox.html('<p class="noResult">暂无相关信息</p>');
                    }

                } else {
                    $_resultBox.html('<p class="noResult">暂无相关信息</p>');
                }
            }
        };

        this._local = new BMap.LocalSearch(this.sosoMap, options);

        // if(maptype=='bus'||maptype=='ditie'){
        //     this._local.searchInBounds(key,this.sosoMap.getBounds());
        // }else {
        //     var url = '/dict/lpzd/getlocal?lng=' + HubObj.lng + '&lat=' + HubObj.lat + '&range=' + soso_range;
        //     Xl.request(Xl.GU(url), {}, function (d, isok) {
        //         if (isok) {
        //             var swPoint = new BMap.Point(d.SW.lng, d.SW.lat);
        //             var nePoint = new BMap.Point(d.NE.lng, d.NE.lat);
        //             var bounds = new BMap.Bounds(swPoint, nePoint);
        //             __t._local.searchInBounds(key, bounds);
        //         } else {
        //             __t._local.searchInBounds(key, this.sosoMap.getBounds());
        //         }
        //     }, 0, '', 'get');
        // }
        this._local.searchInBounds(key,this.sosoMap.getBounds());

    };

    // 添加标注
    this.addMarker=function(point, index,maptype){

        var myIcon = new BMap.Icon("/static/images/map/map.png", new BMap.Size(23, 27));
        var marker = new BMap.Marker(point,{icon:myIcon});
        var label = new BMap.Label(index,{offset: new BMap.Size(5, 4)} );
        label.setStyle({
            background:'none',color:'#fff',fontWeight:'bold',border:'none'//只要对label样式进行设置就可达到在标注图标上显示数字的效果
        });
        marker.setLabel(label);//显示坐标点里面的内容

        Xl.forIn(HubObj.mapDomArr,function(i,v){
            if(maptype==v.key){
                this.sosoMap=v.value;
                v.marker.push(marker);
            }
        },this);
        this.sosoMap.addOverlay(marker);
        return marker;
    };

    // 添加信息窗口
    this.addInfoWindow=function(marker,poi,distance){

        var name = null;
        var infoWindowHtml = [];
        if(poi.type == BMAP_POI_TYPE_NORMAL){
            name = "地址：  "
        }else if(poi.type == BMAP_POI_TYPE_BUSSTOP||poi.type == BMAP_POI_TYPE_SUBSTOP){
            name = "线路：  "
        }
        infoWindowHtml.push('<div id="infoWindowbox">' +
            '<p class="infoContent">'+
            '<span class="infotitle">'+poi.title+'</span>'+
            '<span class="infodis fr">'+distance+'米</span>'+
            '</p>'+
            '<p class="infoAddress">'+name+poi.address+'</p>' +
            '</div>');

        var infoWindow = new BMap.InfoWindow(infoWindowHtml.join(""),{width:200});
        //选中标注点显示列表背景色
        var openInfoWinFun = function(){
            marker.openInfoWindow(infoWindow);
        };
        marker.addEventListener("click", openInfoWinFun);//标注点点击事件
        return openInfoWinFun;
    };

    this.loadMapDetail=function(type){

        var sosomapdom=type+'_mapbox';
        this.$_sosomap=$('.'+sosomapdom);

        var key=this.$_sosomap.find('.mapdetail-list .route a.active').text();
        this._index=this.$_sosomap.find('.mapdetail-list').attr('data-index');

        this.moveToLocation(key,this._index,type);
    };

    this.loadPeitaoToDetail=function(){
        var __t=this;

        var types=HubObj.type;
        var timer=setInterval(function(){
            if(Xl.isEmpty(types)){
                clearInterval(timer);
            }
            __t.loadMapDetail(types[0]);
            types.splice(0,1);
        },1000);

    };
    this.init();

}