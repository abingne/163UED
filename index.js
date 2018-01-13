/* 关闭顶部通知条 */
function Notice(){
  var scroll = document.getElementsByClassName("scroll")[0];
  var clickscroll = document.getElementsByClassName("shut")[0];
  if (getCookie('scroll')) {
    scroll.style.display = "none";
  }else{
    clickscroll.onclick = function(){
      setCookie('scroll','true',10);
      scroll.style.display = "none";
    }
  }
}
Notice();

/* 导航关注功能 */
function attention(){
  var logo=document.getElementById("logo");
  var notfollowed=logo.getElementsByTagName("p")[0];
  var followed = document.getElementsByClassName("followed")[0];
  var mask=document.getElementById("mask");
  var logoBtn = document.getElementById("logoBtn");
  var username = document.getElementById("username");
  var password = document.getElementById("password");
  var close=mask.getElementsByTagName("p")[0];
  
  /* 判断cookie中是否存在followSuc，如果存在则显示已关注；
  其实这种方式不科学，因为cookie是会过期的，但是接口中并没有返回用户关注成功后的数据 */
  if (getCookie('followSuc')) {
    notfollowed.style.display = "none";
    followed.style.display = "block";
  }else{
    notfollowed.onclick = function(){
      if (getCookie('loginSuc')) {
        ajax('get','http://study.163.com/webDev/attention.htm','',function(data){
          if (data==1) {
            setCookie('followSuc',true,10);
            notfollowed.style.display = "none";
            followed.style.display = "block";
          };
        });
      }else{
        mask.style.display = "block";
        logoBtn.onclick=function(){
          // 这里使用MD5对用户数据进行加密
          ajax('get','http://study.163.com/webDev/login.htm','userName='+hex_md5(username.value)+'&password='+hex_md5(password.value),function(data){
            if(data==1){
              setCookie('loginSuc',true,10);
              ajax('get','http://study.163.com/webDev/attention.htm','',function(data){
                if (data==1) {
                  setCookie('followSuc',true,10);
                  notfollowed.style.display = "none";
                  followed.style.display = "block";
                  location.reload();
                };
              });
            };
          });
        };
      };
    };
  }
  /* 关闭登录层 */
  close.onclick=function (){
    mask.style.display="none";
  }
};
attention();

/* 这个函数用来设置cookie */
function setCookie(key,value,t) {
  var oDate = new Date();
  oDate.setDate( oDate.getDate() + t );
  document.cookie = key + '=' + value + ';expires=' + oDate.toGMTString();
}
/* 这个函数用来获取cookie */
function getCookie(key) {
  var arr1 = document.cookie.split('; ');
  for (var i=0; i<arr1.length; i++) {
    var arr2 = arr1[i].split('=');
    if ( arr2[0] == key ) {
      return arr2[1];
    }
  }
}

/* 计算轮播区域的高度 */
function calHeight(){
	var carList=document.getElementById("carList");
	var carListImg=carList.getElementsByTagName("img");
	var carousel=carList.parentNode;
	var cHeight=(document.body.clientWidth)/1652*460;

	carousel.style.height=(cHeight).toFixed(3) + "px";

	for (var i = 0; i < carListImg.length; i++) {
		carListImg[i].style.height=(cHeight).toFixed(3) + "px";
	}
}
calHeight();

/* 图片轮播 */
function carousel(){
	var oImgs = document.getElementById("carList").getElementsByTagName("img");
	var oIs = document.getElementById("cut").getElementsByTagName("i");
	var index = 0;
	var timer = null;

	//鼠标滑过容器
  for (var i = 0; i < oImgs.length; i++) {
  		oImgs[i].id=i;
  		oImgs[i].onmouseover=function (){
  			clearInterval(timer);
  			changeOption(this.id);
  		}
  		//鼠标离开容器
  		oImgs[i].onmouseout=function (){
  			 timer=setInterval(autoPlay,5000);
  		}
  	}

  	//为顺序标签添加点击事件
  	for (var k = 0; k < oIs.length; k++) {
  		oIs[k].idd=k;
  		oIs[k].onclick=function (){
  			clearInterval(timer);
  			changeOption(this.idd);
  		}
  	}

  	if (timer) {
  		clearInterval(timer);
  		timer=null;
  	}

  	//图片每两秒自动切换一次
  	timer=setInterval(autoPlay,5000);

  	//将图片切换封装成函数
 	 function autoPlay(){
  		index++;
  		if (index>=oIs.length) {
  			index=0;
  		}
  		changeOption(index);
 	 }

	//封装小圆点添加和删除样式的函数
	function changeOption(cur){
  		for (var j = 0; j < oIs.length; j++) {
  			oIs[j].className="";
  			oImgs[j].style.display="none";
  			oImgs[j].style.opacity="0";
  		}
  		oIs[cur].className="present";
  		oImgs[cur].style.display="block";
  		oImgs[cur].style.opacity="1";
  		index=cur;
 	}
}
carousel();

/* 获取课程列表 */
function getcourseList(iPage,type){
  var courseList = document.getElementById("courseList");
  var oList = courseList.getElementsByTagName("li");

  ajax('get','http://study.163.com/webDev/couresByCategory.htm','pageNo='+iPage+'&psize=20&type='+type,function(data){
    var d = JSON.parse(data);
    if (d.list) {
      for (var i = 0; i < d.list.length; i++) {
        var oLi = document.createElement("li");
        // 这是正常显示的
        var oItem = document.createElement("div");
        oItem.className = "item";
        var oImg = document.createElement("img");
        oImg.src = d.list[i].middlePhotoUrl;

        var oDiv = document.createElement("div");

        var oH3 = document.createElement("h3");
        oH3.className = "title";
        oH3.innerHTML = d.list[i].name;
        var oP1 = document.createElement("p");
        oP1.className = "frequency";
        oP1.innerHTML = d.list[i].provider;
        var oP2 = document.createElement("p");
        oP2.className = "group";
        oP2.innerHTML = d.list[i].learnerCount;
        var oP3 = document.createElement("p");
        oP3.className = "price";
        oP3.innerHTML = '￥'+ d.list[i].price;

        if (d.list[i].price == 0) {
          oP3.innerHTML = "免费";
        }
        oDiv.appendChild(oH3);
        oDiv.appendChild(oP1);
        oDiv.appendChild(oP2);
        oDiv.appendChild(oP3);

        oItem.appendChild(oImg);
        oItem.appendChild(oDiv);
        oLi.appendChild(oItem);
        // 这是mouseover时显示的
        var oDetailItem = document.createElement("div");
        oDetailItem.className = "detailItem";
        var oItemImg = document.createElement("img");
        oItemImg.src = d.list[i].middlePhotoUrl;
        var oSpan = document.createElement("span");
        var oItemTitle = document.createElement("h3");
        oItemTitle.innerHTML = d.list[i].name;
        var oTotal = document.createElement("p");
        oTotal.className = "total";
        var oTotalIcan = document.createElement("i");
        oTotalIcan.className = "totalIcan";
        var oTotalNumber = document.createElement("i");
        oTotalNumber.className = "totalNumber";
        oTotalNumber.innerHTML = d.list[i].learnerCount + "人在学";
        var oIssue = document.createElement("p");
        oIssue.className = "issue";
        oIssue.innerHTML = "发布者：" + d.list[i].provider;
        var oSort = document.createElement("p");
        oSort.className = "sort";
        oSort.innerHTML = "分类：" + d.list[i].categoryName;
        var oPresent = document.createElement("div");
        oPresent.className = "present";
        var oPtxt = document.createElement("p");
        oPtxt.innerHTML = d.list[i].description;

        oTotal.appendChild(oTotalIcan);
        oTotal.appendChild(oTotalNumber);

        oSpan.appendChild(oItemTitle);
        oSpan.appendChild(oTotal);
        oSpan.appendChild(oIssue);
        oSpan.appendChild(oSort);
        oPresent.appendChild(oPtxt);
        
        oDetailItem.appendChild(oItemImg);
        oDetailItem.appendChild(oSpan);
        oDetailItem.appendChild(oPresent);

        oLi.appendChild(oDetailItem);
        courseList.appendChild(oLi);
      }
    }
  })
  getPag(1,10);
  setTimeout(seeDetails,500);
}
getcourseList(1,10);

/* 查看课程详情 */
function seeDetails(){
  var courseList = document.getElementById("courseList");
  var oList = courseList.getElementsByTagName("li");
  for (var i = 0; i < oList.length; i++) {
    oList[i].onmouseover = function(){
      var detailItem = this.getElementsByClassName("detailItem")[0]
      detailItem.style.display = "block";
    };
    oList[i].onmouseout = function(){
      var detailItem = this.getElementsByClassName("detailItem")[0]
      detailItem.style.display = "none";
    }
  }
}

/* tab切换 */
function tabSwitch(){
  var oTab = document.getElementById("tab");
  var oDesign = document.getElementById("design");
  var oEdit = document.getElementById("edit");
  var iPage = 1;

  oEdit.onclick = function (){
    oDesign.className = "";
    oEdit.className = "pitch";
    removeAllChild();
    getcourseList(iPage,20);
    getPag(iPage,20)
  }
  oDesign.onclick = function (){
    oDesign.className = "pitch";
    oEdit.className = "";
    removeAllChild();
    getcourseList(iPage,10);
    getPag(iPage,20);
  }
}
tabSwitch();

/* 清空列表所有子节点 */
function removeAllChild(){
  var courseList = document.getElementById("courseList");
  var paging = document.getElementById("paging");
  while(paging.hasChildNodes()) //当div下还存在子节点时 循环继续  
  {  
    paging.removeChild(paging.firstChild);  
  };
  while(courseList.hasChildNodes()) //当div下还存在子节点时 循环继续  
  {  
    courseList.removeChild(courseList.firstChild);  
  };
};

/* 设置翻页器样式 */
function getPag(iPage,type){
  ajax('get','http://study.163.com/webDev/couresByCategory.htm','pageNo='+iPage+'&psize=20&type='+type,function(data){
    var d = JSON.parse(data);
    var sumPage = d.pagination.totlePageCount;  //总页数
    var currPage = d.pagination.pageIndex;  //当前页码
    
    var oLeft = document.getElementById("left");
    var oPaging = document.getElementById("paging");
    var oUp = document.createElement("a");  //后退一页
    oUp.className = "up";
    oPaging.appendChild(oUp);

    for (var i = 1; i <= sumPage; i++) {
      var oIs = document.createElement("i");
      oIs.innerHTML = i;
      if (parseInt(oIs.innerHTML) == currPage) {
        oIs.className = "cpage";  //为当前页码添加样式
      }
      oPaging.appendChild(oIs);
    }

    var oDown = document.createElement("a");  //前翻一页
    oDown.className = "down";
    oPaging.appendChild(oDown);

    oLeft.appendChild(oPaging); 
  })
}

/* 视频弹出 */
function video(){
  var videoIcan = document.getElementsByClassName("videoIcan")[0];
  var videoMask = document.getElementsByClassName("videoMask")[0];
  var downVideo = document.querySelector("#downVideo");
  videoIcan.onclick = function(){
    videoMask.style.display = "block";
  };
  downVideo.onclick = function(){
    videoMask.style.display = "none";
  }
}
video();

/* 获取最热排行 */
function getHotlist(){
  var hotList = document.getElementById("hotList");

  ajax('get','http://study.163.com/webDev/hotcouresByCategory.htm','',function(data){
    var d = JSON.parse(data);
    for (var i = 0; i < d.length; i++) {

        var oLi = document.createElement("li");

        var oImg = document.createElement("img");
        oImg.src = d[i].smallPhotoUrl;

        var oH3 = document.createElement("h3");
        oH3.className = "title";
        oH3.innerHTML = d[i].name;
        var oP1 = document.createElement("p");
        oP1.className = "group";
        oP1.innerHTML = d[i].learnerCount;

        oLi.appendChild(oImg);
        oLi.appendChild(oH3);
        oLi.appendChild(oP1);

        hotList.appendChild(oLi);
    }
  })
};
getHotlist();
setInterval(getHotlist,5000);

