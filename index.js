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

  ajax('get','http://study.163.com/webDev/couresByCategory.htm','pageNo='+iPage+'&psize=20&type='+type,function(data){
    var d = JSON.parse(data);
    if (d.list) {
    for (var i = 0; i < d.list.length; i++) {

        var oLi = document.createElement("li");

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

        oLi.appendChild(oImg);
        oLi.appendChild(oDiv);

        courseList.appendChild(oLi);
    }
  }
  })
  getPag(1,10);
}
getcourseList(1,10);

/* tab切换 */
function tabSwitch(){
  var oTab = document.getElementById("tab");
  var oDesign = document.getElementById("design");
  var oEdit = document.getElementById("edit");
  var iPage = 1;

  oEdit.onclick = function (){
    var iPage = 1;
    oDesign.className = "";
    oEdit.className = "pitch";
    removeAllChild();
    getcourseList(iPage,20);
    getPag(iPage,20)
  }
  oDesign.onclick = function (){
    var iPage = 1;
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
}

/* 设置翻页器样式 */
function getPag(iPage,type){
  ajax('get','http://study.163.com/webDev/couresByCategory.htm','pageNo='+iPage+'&psize=20&type='+type,function(data){
    var d = JSON.parse(data);
    var sumPage = d.pagination.totlePageCount;  //总页数
    var currPage = d.pagination.pageIndex;  //当前页码
    
    var oLeft = document.getElementById("left");
    var oPaging = document.getElementById("paging");
    //oPaging.className = "paging";
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


 /* 为翻页器添加点击事件 
function addEvent(){
  var paging = document.querySelector(".paging"); //找到翻页器模块
  var previous = document.querySelector(".up"); //找到上一页按钮
  var next = document.querySelector(".down"); //找到下一页按钮
  
}
addEvent();
*/

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
}
//getHotlist();
setInterval(getHotlist(),5000);

//点击关注弹出登录框
	var logo=document.getElementById("logo");
	var notfollowed=logo.getElementsByTagName("p")[0];
	var mask=document.getElementById("mask");

	notfollowed.onclick=function (){
		mask.style.display="block";
	}

//登录框中的关闭按钮，点击后登录框的display变为none
	var close=mask.getElementsByTagName("p")[0];
	close.onclick=function (){
		mask.style.display="none";
	}

/* 登录 
function login(){
  var username = document.getElementById("username");
  var password = document.getElementById("password");
  var oBtn = document.getElementById("btn");

  oBtn.onclick = function (){
    ajax('get','http://study.163.com/webDev/login.htm','userName='+username.value+'&password='+password.value,function(data){
      alert(data);
    })
  }
}
login();
*/
