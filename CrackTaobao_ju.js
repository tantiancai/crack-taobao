﻿var _Taobao_is_ie = true;
var _Taobao_layer;
var _ErrorNum;
var _intervalProcess;
var _isStated = false;
var _isError = false;
var _xmlhttp;
var _itemInfo;
var _skus = new Array();

function _TaobaoInit()
{
    var agt = navigator.userAgent.toLowerCase();
    _Taobao_is_ie = (agt.indexOf("msie")!=-1 && document.all);
    var h = '';
    h += '<div id="_CrackJLPT2010_12">V4.9.7';
    h += '<div>';
    h += ' <form id="_book" onsubmit="return false;">';
    h += '    时间间隔（ms）：<input id="_txtInt" type="text" size="4" value="200">';
    h += '    <br />';
    h += '    <input id="_btnAutoBook" onclick="_AutoBook();" type="submit" value="开始查询">';
    h += '    <input id="_btnStop" onclick="_StopAutoBook();" type="button" value="停止">';
    h += '    <input id="_btnBuy" onclick="_Buy();" style="display:none;" type="button" value="购买">';
    h += ' </form>';
    h += '</div>';
    h += '<div id="_autoBook">';
    h += '</div>';
    h += '<div id="_errorMsg">';
    h += ' 查询到开始秒杀后会自动显示购买信息';
    h += '</div>';
    h += '</div>';
    try
    {
        var el = document.createElement('div');
        el.id='_Taobao_layer';
        el.style.position='absolute';
        el.style.left = document.documentElement.scrollLeft + 3 + 'px';
        el.style.top = document.documentElement.scrollTop + 30 + 'px';
        el.style.zIndex=9000;
        el.style.border = '1px solid #808080';
        el.style.backgroundColor='#F8F0E5';

        document.body.appendChild(el);
        _TaobaoSet(el, h);
        window.onscroll = function()
        {
            document.getElementById("_Taobao_layer").style.left = document.documentElement.scrollLeft + 3 + 'px';
            document.getElementById("_Taobao_layer").style.top = document.documentElement.scrollTop + 30 + 'px';
        };
    }
    catch(x)
    {
        alert("Crack Tabobao can not support this page.\n" + x);
        _Taobao_layer = true;
        return;
    }

	_Taobao_layer = document.getElementById('_Taobao_layer');
}

function _ShowError(str)
{
    document.getElementById("_errorMsg").innerHTML = str;
}

function _createXmlHttp()
{
    var _xmlhttp = false;

    try
    {
        _xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch (e)
    {
        try
        {
            _xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch (E)
        {
            _xmlhttp = false;
        }
    }
    if (!_xmlhttp && typeof XMLHttpRequest != 'undefined')
    {
        _xmlhttp = new XMLHttpRequest();
    }

    return _xmlhttp;
}

function _checkXmlHttp()
{
    if ( typeof(_xmlhttp) == "undefined")
    {
        _xmlhttp = _createXmlHttp();
    }
    if (
        ! _xmlhttp
        || _xmlhttp.readyState == 1
        || _xmlhttp.readyState == 2
        || _xmlhttp.readyState == 3
        )
    {
        return false;
    }
    return true;
}

function _getXmlHttp(url, para, callback)
{
	var time = new Date();
    if (!_checkXmlHttp())
    {
        return;
    }

	if(url.indexOf("#") > 0)
	{
		url = url.substring(0, url.indexOf("#"));
	}
    _xmlhttp.open("GET", url + "&timeStamp=" + time.getTime(), true);

    _xmlhttp.onreadystatechange = function ()
    {
        if (_xmlhttp.readyState == 4 && _xmlhttp.status == 200)
        {
        	callback(_xmlhttp.responseText);
        }
    }

    _xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    _xmlhttp.send(para);
    
    document.getElementById("_autoBook").innerHTML = "正在查询：<br />" + time.toLocaleString();
}

function _BookCheck()
{
	//秒杀未开始
	if(_isStated != true)
	{
		_getXmlHttp(location.href, "", _CheckResult);
	}
}

function _CheckResult(str)
{
	if( str.indexOf("您查看的宝贝不存在") > 0)
	{
		clearInterval(_intervalProcess);
		_isError = true;
		_ShowError("无法显示商品，可能刷新太频繁");
	}
	
    if( str.indexOf("开始秒杀") < 0 && _isError == false)
    {
        _isStated = true;
        clearInterval(_intervalProcess);
        _Book(str);
    }
}

function _Book(str)
{
	var start;
	var end;
	var html;
	var form;
	var dls;
	_ShowError("请设置购买信息");
//	start = str.indexOf('<div class="key');
//	end = str.indexOf('<ul class="other');
//	html = str.substring(start, end);
//	if(html != "")
//	{
		//要回答问题的秒杀
//		document.getElementById("_autoBook").innerHTML = html;
//		document.getElementById("_btnBuy").style.display = "inline";
//		dls = document.getElementById("_autoBook").getElementsByTagName("dl");
		//start = str.indexOf('<form id="J_FrmBid');
		//end = str.indexOf('detail-other end');
		//form = str.substring(start, end);
		//start = form.indexOf('<input');
		//end = form.indexOf('</form>');
		//form = form.substring(start, end);
		//问题：“问君能有几多愁”诗句的下句是：恰似一江春水向东流
//		var question = '<input type="hidden" name="82cbc720f1cd8e8b3bd5982bf368de58" value="cf7cdf247800a0ba51337b340aa2632d" />';
//		document.getElementById("J_FrmBid").innerHTML += question;
		//如果只有数量则直接提交
//		if(dls.length > 1)
//		{
//			_InitPage(str, document.getElementById("_autoBook"));
//		}
//		else
//		{
//			_Buy();
//		}
//	}
	//不要回答问题的秒杀
//	else
//	{
		//天猫
		if(location.href.indexOf('tmall') > 0)
		{
			start = str.indexOf('<div class="tb-key');
			end = str.indexOf('<ul class="tb-meta', start);
		}
		//淘宝
		else
		{
			start = str.indexOf('<div id="J_isku"');
			end = str.indexOf('<div class="tb-trash"', start);
		}
		html = str.substring(start, end);
		if (html != "")
		{
			document.getElementById("_autoBook").innerHTML = html;
			document.getElementById("_btnBuy").style.display = "inline";
			dls = document.getElementById("_autoBook").getElementsByTagName("dl");
			//如果只有数量则直接提交
			if(dls.length > 1)
			{
				_InitPage(str, document.getElementById("_autoBook"));
			}
			else
			{
				_Buy();
			}
		}
		else
		{
			document.getElementById("_autoBook").innerText = str;
		}
//	}
	//window.location.reload();
}

function _InitPage(str, div)
{
	var start = str.indexOf('"skuMap"');
	var start2 = str.indexOf('\n', start);
	var strSkuMap = str.substring(start, str.indexOf('\n', start2 + 2));
	if(location.href.indexOf('tmall') > 0)
	{
		_itemInfo = eval("\({" + strSkuMap + "}}\)");
	}
	else
	{
		_itemInfo = eval("\({" + strSkuMap + "}\)");
	}
	var lis = div.getElementsByTagName("li");
	for(var li in lis)
	{
		lis[li].onclick = function()
		{
			_skus.push(this.getAttribute("data-value"));
			this.style.fontWeight = "bold";
		}
	}
}

function _Buy()
{
	var sku = "";
	var skuId;
	if(_skus.length > 0)
	{
		sku = ";" + _skus.join(";") + ";";
		try
		{
			skuId = _itemInfo.skuMap[sku].skuId;
			document.getElementById("J_FrmBid").skuId.value = skuId;
		}
		catch(e)
		{
			_ShowError("请从上到下顺序点击");
			_skus = [];
			return;
		}
	}
	//天猫
	if(location.href.indexOf('tmall') > 0)
	{
		document.getElementById("J_FrmBid").action = 'http://buy.tmall.com/order/confirm_order.htm';
	}
	document.getElementById("J_FrmBid").submit();
}

function _StopAutoBook()
{
    clearInterval(_intervalProcess);
    _isStated = false;
    _ShowError("已停止");
}

function _AutoBook()
{
	var intTime = document.getElementById("_txtInt").value;
	_isStated = false;
    clearInterval(_intervalProcess);
	_intervalProcess = setInterval(_BookCheck, intTime);
}

function _TaobaoSet(el, htmlCode)
{
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('msie') >= 0 && ua.indexOf('opera') < 0)
    {
        el.innerHTML = '<div style="display:none">for IE</div>' + htmlCode;
        el.removeChild(el.firstChild);
    }
    else
    {
        var el_next = el.nextSibling;
        var el_parent = el.parentNode;
        el_parent.removeChild(el);
        el.innerHTML = htmlCode;
        if (el_next)
        {
            el_parent.insertBefore(el, el_next)
        }
        else
        {
            el_parent.appendChild(el);
        }
    }
}

if(!document.getElementById('_Taobao_layer'))
{
    _TaobaoInit();
}
else
{
    document.body.removeChild(document.getElementById('_Taobao_layer'));
    _TaobaoInit();
}

//javascript:void((function(){var%20element=document.createElement('script');element.setAttribute('src','http://crack-taobao.googlecode.com/svn/trunk/CrackTaobao_ju.js');document.body.appendChild(element);})())

