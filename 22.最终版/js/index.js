window.addEventListener('DOMContentLoaded',function () {
//  window.onload =  function () {
  //获取元素
  var header = document.getElementById('header');
  var navUps = document.querySelectorAll('#header .headerMain .nav .navList .navItem .up');
  var arrow = document.querySelector('#header .headerMain .arrow');
  var navItem = document.querySelectorAll('#header .headerMain .nav .navList .navItem');
  var content = document.getElementById('content');
  var contentItems = document.querySelectorAll('#content .contentList .contentItem');
  var contentList = document.querySelector('#content .contentList');
  var homeConverNavItems = document.querySelectorAll('#content .contentList .home .contentInner .homeConverNavList .homeConverNavItem')
  var homeConverItems = document.querySelectorAll('#content .contentList .home .contentInner .homeConverList .homeConverItem')
  var team3Items = document.querySelectorAll('#content .contentList .team .team3 .team3List .team3Item')
  var team3List = document.querySelector('#content .contentList .team .team3 .team3List')
  var menuNavItems = document.querySelectorAll('#content .menuNavList .menuNavItem')
  var myMusic = document.querySelector('#header .headerMain .music');
  var myAudio = document.querySelector('#header .headerMain .music>audio');
  var maskLine = document.querySelector('#mask .maskLine');
  var maskUp = document.querySelector('#mask .maskUp')
  var maskDown = document.querySelector('#mask .maskDown')
  var mask = document.getElementById('mask')
  var index = 0;//屏幕切换
  var oldIndex = 0;//轮播图的上一次结果
  var timeId;
  var isAnimation = false //标识轮播图是否处于切换状态
  var myCanvas;
  var time1;
  var time2;

  //初始化第一个up元素高亮
  navUps[0].style.width = '100%'
  //初始化三角的位置
  arrow.style.left = navItem[0].getBoundingClientRect().left + navItem[0].offsetWidth/2 + 'px';

  //响应缩放
  window.onresize = function () {
    contentMove(index)
    contentBind()
  }

  //给每一个导航项加点击事件
  headerBind();
  function headerBind() {
    for (var i=0; i<navItem.length; i++ ){
      var item = navItem[i];
      item.index = i //缓存计数器
      //给每一个导航项加点击事件
      item.onclick = function () {
        animationArr[index].outAnimation();
        animationArr[this.index].inAnimation();
        index = this.index
        contentMove(this.index)
      }
    }
  }

  //内容区移动逻辑
  function contentMove(index) {
    //1.给所有的up元素去除高亮
    for (var j=0; j<navUps.length; j++ ){
      navUps[j].style.width = ''
    }
    //2.给当前点击的navItem所包含的up元素高亮
    navUps[index].style.width = '100%'
    //3.重置所有侧边栏导航
    for (var j=0; j<menuNavItems.length; j++ ){
      menuNavItems[j].className = 'menuNavItem';
    }
    //4.当前加高亮
    menuNavItems[index].className = 'menuNavItem active';
    //5.切换三角位置
    arrow.style.left = navItem[index].getBoundingClientRect().left + navItem[index].offsetWidth/2 + 'px';
    //6.切换屏幕
    contentList.style.top = -(index) * (document.documentElement.clientHeight - header.offsetHeight) + 'px'
  }

  //内容区设置高度逻辑
  contentBind();
  function contentBind() {
    //给内容区设置高度
    content.style.height = document.documentElement.clientHeight - header.offsetHeight + 'px'
    //给每一屏设置高度
    for (var i=0; i<contentItems.length; i++ ){
      contentItems[i].style.height = document.documentElement.clientHeight - header.offsetHeight + 'px'
    }
  }

  //鼠标滚轮
  Scroll();
  function Scroll() {
    //ie/chrome
    document.onmousewheel = function (event) {
      clearTimeout(timeId)
      timeId = setTimeout(function () {
        scrollMove(event)
      },200)
    }
    //firefox
    if(document.addEventListener){
      document.addEventListener('DOMMouseScroll',function (event) {
        clearTimeout(timeId)
        timeId = setTimeout(function () {
          scrollMove(event)
        },200)
      });
    }
    function scrollMove(event) {
      event = event || window.event;
      var flag = '';
      if(event.wheelDelta){
        //ie/chrome
        if(event.wheelDelta > 0){
          //上
          flag = 'up';
        }else {
          //下
          flag = 'down'
        }
      }
      else if(event.detail){
        //firefox
        if(event.detail < 0){
          //上
          flag = 'up';
        }else {
          //下
          flag = 'down'
        }
      }

      switch (flag){
        case 'up':
          //鼠标滚轮向上滚动
          console.log('上')
          if(index>0){
            animationArr[index].outAnimation()
            index--
            animationArr[index].inAnimation()
            contentMove(index)
          }

          break;
        case 'down':
          //鼠标滚轮向下滚动
          console.log('下')
          if(index<contentItems.length-1){
            animationArr[index].outAnimation()
            index++
            animationArr[index].inAnimation()
            contentMove(index)
          }
          break;
      }

      //取消默认行为
      event.preventDefault && event.preventDefault();
      return false;
    }
  }

  //轮播图点击切换
  home3D();
  function home3D() {
    for (var i=0; i<homeConverNavItems.length; i++ ){
      var item = homeConverNavItems[i];
      item.index = i
      //给轮播图导航小圆点绑定点击事件
      item.onclick = function () {
        //判断轮播图是否正在切换
        if(isAnimation){
          //轮播图正在切换中
          return;
        }
        //重置切换状态
        isAnimation = true
        //动画完成之后，恢复状态
        setTimeout(function () {
          isAnimation = false
        },3000)

        //1.重置所有小圆点
        for (var j=0; j<homeConverNavItems.length; j++ ){
          homeConverNavItems[j].className = 'homeConverNavItem';
        }
        //2.当前加高亮
        this.className = 'homeConverNavItem active';
        //3.切换轮播图
        //判断用户点击的是之前的某一屏，还是以后的某一屏幕
        if(oldIndex<this.index){
          //用户点击的是以后的某一屏
          homeConverItems[oldIndex].className = 'homeConverItem leftHide';
          homeConverItems[this.index].className = 'homeConverItem rightShow';
        }
        else if(oldIndex>this.index){
          //用户点击的是之前的某一屏
          homeConverItems[oldIndex].className = 'homeConverItem rightHide';
          homeConverItems[this.index].className = 'homeConverItem leftShow';
        }
        oldIndex = this.index
      }
    }
  }

  //自动轮播
  function autoPlay() {
    setInterval(function () {
      //判断轮播图是否正在切换
      if(isAnimation){
        //轮播图正在切换中
        return;
      }
      //重置切换状态
      isAnimation = true
      //动画完成之后，恢复状态
      setTimeout(function () {
        isAnimation = false
      },3000)
      //1.重置所有小圆点
      for (var j=0; j<homeConverNavItems.length; j++ ){
        homeConverNavItems[j].className = 'homeConverNavItem';
      }
      //2.下一个小圆点高亮
      homeConverNavItems[oldIndex+1>homeConverNavItems.length-1?0:oldIndex+1].className = 'homeConverNavItem active';
      //3.自动切换轮播图
      homeConverItems[oldIndex].className = 'homeConverItem leftHide';
      homeConverItems[oldIndex+1>homeConverNavItems.length-1?0:oldIndex+1].className = 'homeConverItem rightShow';

      if(oldIndex<homeConverNavItems.length-1){
        oldIndex++
      }else{
        oldIndex = 0
      }
    },3000)
  }

  //第五屏逻辑
  teamBind()
  function teamBind() {
    //第五屏鼠标移出事件
    team3List.onmouseleave = function () {
      //重置所有人物li为半透明
      for (var j=0; j<team3Items.length; j++ ){
        team3Items[j].style.opacity = 0.5
      }
      //删除canvasDOM节点
      myCanvas.remove()
      myCanvas = null;
      clearInterval(time1)
      clearInterval(time2)
    }

    //第五屏鼠标移入事件
    for (var i=0; i<team3Items.length; i++ ){
      var item = team3Items[i];
      item.onmouseenter = function () {
        //1.重置所有人物li为半透明
        for (var j=0; j<team3Items.length; j++ ){
          team3Items[j].style.opacity = 0.5
        }
        //2.给当前的高亮
        this.style.opacity = 1
        //3.动态追加一个canvas层
        if(!myCanvas){
          myCanvas = document.createElement('canvas');
          myCanvas.width = this.offsetWidth;
          myCanvas.height = this.offsetHeight;
          addAnimation()
          team3List.appendChild(myCanvas);
        }
        myCanvas.style.left = this.offsetLeft + 'px';

      }
    }
  }

  //给canvas加动画
  function addAnimation() {
    var painting = myCanvas.getContext('2d');
    var arr = [] //承装圆的容器

    //每隔一段时间从容器中取出所有圆，重新摆放在页面上
    time1 = setInterval(function () {
      painting.clearRect(0,0,myCanvas.width,myCanvas.height)
      //加工圆
      for (var j=0; j<arr.length; j++ ){
        var item2 = arr[j];
        item2.deg++;
        item2.x = item2.startX + Math.sin(item2.deg*Math.PI/180) * item2.pathScale * 0.5;
        item2.y = item2.startY - (item2.deg*Math.PI/180) * item2.pathScale * 2.2;
        if(item2.y + item2.r <0){
          arr.splice(j,1)
        }
      }

      for (var i=0; i<arr.length; i++ ){
        var item = arr[i];
        painting.beginPath()
        painting.arc(item.x,item.y,item.r,0,2*Math.PI);
        painting.fillStyle = 'rgba('+item.red+','+item.green+','+item.blue+','+item.a+')'
        painting.fill()
      }
    },16)

    //制造圆的工厂
    time2 = setInterval(function () {
      console.log(arr);
      var obj = {}
      //圆的基础信息
      obj.r = Math.floor(Math.random()*8 + 2);
      obj.x = Math.floor(Math.random()*myCanvas.width);
      obj.y = myCanvas.height + obj.r
      obj.red = Math.floor(Math.random()*255);
      obj.green = Math.floor(Math.random()*255);
      obj.blue = Math.floor(Math.random()*255);
      obj.a = 1
      //圆做曲线运动的属性
      obj.startX = obj.x;
      obj.startY = obj.y;
      obj.deg = 0;
      obj.pathScale = Math.floor(Math.random()*80 + 20)
      arr.push(obj)
    },50)
  }

  //侧边栏导航逻辑
  menuListBind()
  function menuListBind() {
    for (var i=0; i<menuNavItems.length; i++ ){
      var item = menuNavItems[i];
      item.index = i;
      item.onclick = function () {
        animationArr[index].outAnimation()
        animationArr[this.index].inAnimation()
        //1.移动内容区
        contentMove(this.index)
        //2.维护外部的index（为了保证鼠标滚轮逻辑的正常执行）
        index = this.index
      }

    }
  }

  //音乐
  myMusic.onclick = function () {
    if(myAudio.paused){
      //当前音乐没有播放
      //1.播放
      myAudio.play()
      //2.替换背景
      myMusic.style.backgroundImage = 'url("./img/musicon.gif")'
    }else{
      //当前音乐正在播放
      //1.暂停播放
      myAudio.pause()
      //2.替换背景
      myMusic.style.backgroundImage = 'url("./img/musicoff.gif")'
    }
  }

  //存放每一屏出入场的数组
  var animationArr = [
    {
      outAnimation:function () {
        var homeConverList = document.querySelector('#content .contentList .home .contentInner .homeConverList')
        var homeConverNavList  = document.querySelector('#content .contentList .home .contentInner .homeConverNavList')
        homeConverList.style.transform = 'translate(0,-200px)';
        homeConverList.style.opacity = '0.5';
        homeConverNavList.style.transform = 'translate(0,200px)';
      },
      inAnimation:function () {
        var homeConverList = document.querySelector('#content .contentList .home .contentInner .homeConverList')
        var homeConverNavList  = document.querySelector('#content .contentList .home .contentInner .homeConverNavList')
        homeConverList.style.transform = 'translate(0,0)';
        homeConverList.style.opacity = '1';
        homeConverNavList.style.transform = 'translate(0,0)';
      }
    },
    {
      outAnimation:function () {
        var plane1 = document.querySelector('#content .contentList .course .plane1')
        var plane2 = document.querySelector('#content .contentList .course .plane2')
        var plane3 = document.querySelector('#content .contentList .course .plane3')
        plane1.style.transform = 'translate(-200px,-200px)';
        plane2.style.transform = 'translate(-200px,0px)';
        plane3.style.transform = 'translate(200px,-200px)';
      },
      inAnimation:function () {
        var plane1 = document.querySelector('#content .contentList .course .plane1')
        var plane2 = document.querySelector('#content .contentList .course .plane2')
        var plane3 = document.querySelector('#content .contentList .course .plane3')
        plane1.style.transform = 'translate(0,0)';
        plane2.style.transform = 'translate(0,0)';
        plane3.style.transform = 'translate(0,0)';
      }
    },
    {
      outAnimation:function () {
        var pencel1 = document.querySelector('#content .contentList .works .pencel1')
        var pencel2 = document.querySelector('#content .contentList .works .pencel2')
        var pencel3 = document.querySelector('#content .contentList .works .pencel3')
        pencel1.style.transform = 'translate(0px,-20px)';
        pencel2.style.transform = 'translate(0px,50px)';
        pencel3.style.transform = 'translate(200px,200px)';
      },
      inAnimation:function () {
        var pencel1 = document.querySelector('#content .contentList .works .pencel1')
        var pencel2 = document.querySelector('#content .contentList .works .pencel2')
        var pencel3 = document.querySelector('#content .contentList .works .pencel3')
        pencel1.style.transform = 'translate(0,0)';
        pencel2.style.transform = 'translate(0,0)';
        pencel3.style.transform = 'translate(0,0)';
      }
    },
    {
      outAnimation:function () {
        var box1 = document.querySelector('#content .contentList .about .about3Item:nth-child(1)')
        var box2 = document.querySelector('#content .contentList .about .about3Item:nth-child(2)')
        box1.style.transform = 'rotate(-30deg)';
        box2.style.transform = 'rotate(30deg)';
      },
      inAnimation:function () {
        var box1 = document.querySelector('#content .contentList .about .about3Item:nth-child(1)')
        var box2 = document.querySelector('#content .contentList .about .about3Item:nth-child(2)')
        box1.style.transform = 'rotate(0)';
        box2.style.transform = 'rotate(0)';
      }
    },
    {
      outAnimation:function () {
        var team1 = document.querySelector('#content .contentList .team .team1');
        var team2 = document.querySelector('#content .contentList .team .team2');
        team1.style.transform = 'translate(-200px,0)';
        team2.style.transform = 'translate(200px,0)';
      },
      inAnimation:function () {
        var team1 = document.querySelector('#content .contentList .team .team1');
        var team2 = document.querySelector('#content .contentList .team .team2');
        team1.style.transform = 'translate(0,0)';
        team2.style.transform = 'translate(0,0)';
      }
    }
  ]

  //所有屏处于出场效果（等待入场）
  for (var i=0; i<animationArr.length; i++ ){
    animationArr[i].outAnimation()
  }

  //临时控制第一屏入场
//    setTimeout(function () {
//      animationArr[0].inAnimation();
//    },1000)

  //进度条逻辑
  var imgArr = ['bg1.jpg','bg2.jpg','bg3.jpg','bg4.jpg','bg5.jpg','about1.jpg','about2.jpg','about3.jpg','about4.jpg','worksimg1.jpg','worksimg2.jpg','worksimg3.jpg','worksimg4.jpg','team.png','greenLine.png'];
  var loaded = 0;
  for (var i=0; i<imgArr.length; i++ ){
    var myImg = new Image();
    myImg.src = './img/'+imgArr[i]
    myImg.onload = function () {
      loaded++
      maskLine.style.width = (loaded/imgArr.length)*100 + '%'
    }
  }

  maskLine.addEventListener('transitionend',function () {
    maskUp.style.height = '0';
    maskDown.style.height = '0';
    maskLine.remove()
    animationArr[0].inAnimation();
  })

  maskUp.addEventListener('transitionend',function () {
    mask.remove()
    autoPlay()
  })


})