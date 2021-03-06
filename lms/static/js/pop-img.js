var LIMIT_TO_VIEWPORT=false;
var SCALE=1.0;

function popImgInit(evt){
  var scale=SCALE;
  var imgTag=(window.event)?event.srcElement:evt.target;
  var imgPath=imgTag.src.replace(/-small(\.\w+)$/,function(a,b){
    scale=1;
    return b;
  })
  var tagTop=Math.max(document.documentElement.scrollTop,document.body.scrollTop);
  var tag=document.createElement("div");
  tag.style.cssText="z-index:9999999999;width:100%;height:"+
    Math.max(document.body.clientHeight,document.body.offsetHeight)
    +"px;position:absolute;background:white;top:0;filter: Alpha(Opacity=0);Opacity:0;";
  var tagImg=document.createElement("div");
  tagImg.style.cssText="z-index:9999999999;font:12px /18px verdana;overflow:auto;text-align:center;position:absolute;width:200px;border:5px solid gray;background:gray;color:white;left:"+(parseInt(document.body.offsetWidth)/2-100)+"px;top:"+(document.documentElement.clientHeight/3+tagTop)+"px;"
  var closeTag=document.createElement("div");
  closeTag.style.cssText="border:1px solid #000;color:#000;line-height:8px;background:#fff;width:10px;height:10px;position:absolute;right:3px;top:3px;filter:Alpha(Opacity=50);Opacity:0.5;cursor:pointer;";
  closeTag.innerHTML="X"
  closeTag.onclick=closes;
  document.body.appendChild(tag);
  document.body.appendChild(tagImg);
  var img=new Image();
  img.src=imgPath;
  img.style.cssText="border:none;filter: Alpha(Opacity=0);Opacity:0;width:100%;height:100%";
  var barShow,imgTime;
  img.complete?ImgOK():img.onload=ImgOK;
  function ImgOK(){
    var Stop1=false,Stop2=false,temp=0;
    var tx=tagImg.offsetWidth,ty=tagImg.offsetHeight;
    var ix=img.width,iy=img.height;
    var sx=document.documentElement.clientWidth,sy=Math.min(document.documentElement.clientHeight,document.body.clientHeight/*opera*/);
    if(LIMIT_TO_VIEWPORT){ //鏄惁闄愬埗鍒拌鍙�
      var xx=ix>sx?sx-50:ix+4,yy=iy>sy?sy-50:iy+3;
    }else{
      var xx=ix,yy=iy
    }
    if(scale!=1){
      xx=xx*scale
      yy=yy*scale
    }
    var maxTime=setInterval(function(){
      temp+=35;
      if((tx+temp)<xx){
        tagImg.style.width=(tx+temp)+"px";
        tagImg.style.left=(sx-(tx+temp))/2+"px";
      }else{
        Stop1=true;
        tagImg.style.width=xx+"px";
        tagImg.style.left=(sx-xx)/2+"px";
      }
      if((ty+temp)<yy){
        tagImg.style.height=(ty+temp)+"px";
        tagImg.style.top=(tagTop+((sy-(ty+temp))/2))+"px";
      }else{
        Stop2=true;
        tagImg.style.height=yy+"px";
        var top=(tagTop+((sy-yy)/2))
        tagImg.style.top=(top>0?top:0)+"px";
      }
      if(Stop1&&Stop2){
        clearInterval(maxTime);
        tagImg.appendChild(img);
        temp=0;
        imgOPacity();
      }
    },1);
    function imgOPacity(){
      temp+=10;
      img.style.filter="alpha(opacity="+temp+")";
      img.style.opacity=temp/100;
      imgTime=setTimeout(imgOPacity,1)
      if(temp>100) clearTimeout(imgTime);
    }
    tagImg.innerHTML="";
    tagImg.appendChild(closeTag);
    if(ix>xx||iy>yy){
      //img.alt="宸﹂敭鎷栧姩,鍙屽嚮鏀惧ぇ缂╁皬";
      img.ondblclick=function (){
        if(tagImg.offsetWidth<img.offsetWidth||tagImg.offsetHeight<img.offsetHeight){
          img.style.width="auto";
          img.style.height="100%";
          //img.alt="鍙屽嚮鍙互鏀惧ぇ";
          img.onmousedown=null;
          closeTag.style.top="10px";
          closeTag.style.left="10px";
          tagImg.style.overflow="visible";
          tagImg.style.width=img.offsetWidth+"px";
          tagImg.style.left=((sx-img.offsetWidth)/2)+"px";
        }else{
          img.style.width=ix+"px";
          img.style.height=iy+"px";
          img.alt="鍙屽嚮鍙互缂╁皬";
          img.onmousedown=dragDown;
          tagImg.style.overflow="auto";
          tagImg.style.width=xx+"px";
          tagImg.style.left=((sx-xx)/2)+"px";
        }
      }
      img.onmousedown=dragDown;
      tagImg.onmousemove=barHidden;
      tagImg.onmouseout=moveStop;
      document.onmouseup=moveStop;
    }else{
      tagImg.style.overflow="visible";
      tagImg.onmousemove=barHidden;
    }
  }
  function dragDown(a){
    img.style.cursor="pointer";
    var evts=a||window.event;
    var onx=evts.clientX,ony=evts.clientY;
    var sox=tagImg.scrollLeft,soy=tagImg.scrollTop;
    var sow=img.width+2-tagImg.clientWidth,soh=img.height+2-tagImg.clientHeight;
    var xxleft,yytop;
    document.onmousemove=function(e){
      var evt=e||window.event;
      xxleft=sox-(evt.clientX-onx)<0?"0":sox-(evt.clientX-onx)>sow?sow:sox-(evt.clientX-onx);
      yytop=soy-(evt.clientY-ony)<0?"0":soy-(evt.clientY-ony)>soh?soh:soy-(evt.clientY-ony);
      tagImg.scrollTop=yytop;
      tagImg.scrollLeft=xxleft;
      closeTag.style.top=(yytop+10)+"px";
      closeTag.style.left=(xxleft+10)+"px";
      return false;
    }
    return false;
  }
  function barHidden(){
    //clearTimeout(barShow);
    //if(closeTag.style.display=="none")closeTag.style.display="block";
    //barShow=setTimeout(function(){closeTag.style.display="none";},2000);
  }
  function closes(){
    document.body.removeChild(tag);
    document.body.removeChild(tagImg);
    clearTimeout(barShow);
    clearTimeout(imgTime);
    document.onmouseup=null;
    tag=img=tagImg=closeTag=null;
  }
  function moveStop(){
    document.onmousemove=null;
    tagImg.onmousemove=barHidden;
    img.style.cursor="default";
  }
}
