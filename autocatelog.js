let $ = require('jquery');
require('./catelog.css');
window.$ = $;
class AutoCatelog {
    constructor(articleElem, catelogCtn) {
        this.articleElem = articleElem;
        catelogCtn === null ? this.catelogCtn = '.catelog-ctn' : this.catelogCtn = catelogCtn;
    }
    init() {
        let $articleElem = $(this.articleElem);
        let $articleChildElem = $articleElem.children();
        let hReg = /^h/i;
        let $hCtn = [];
        let $liCtn = [];
        let $wayList = [];
        let $setList = [];
        //鉴定存在的最高级H,最低级H
        //实际上推荐只使用H3 H4 H5
        let $minH = "H6";
        let $maxH = "H1";
        for (let i = 0; i < $articleChildElem.length; i++) {
            if (hReg.test($articleChildElem[i].nodeName)) {
                $hCtn.push($articleChildElem[i]);
                if ($minH > $articleChildElem[i].nodeName) {
                    $minH = $articleChildElem[i].nodeName;
                }
                if ($maxH < $articleChildElem[i].nodeName) {
                    $maxH = $articleChildElem[i].nodeName;
                }
            }
        }
        //目录排序,提取
        //实际上用padding模拟排序,而不是真的有顺序
        let minHNum = parseInt($minH.slice(1, 2));
        let maxHNum = parseInt($maxH.slice(1, 2));
        let $ulElem = $("<ul class='catalog'></ul>");
        //点击事件绑定以及抽取标题文字
        $hCtn.forEach(function (item) {
            let $liElem = $("<li class='catalogitem'></li>")
            $liElem.addClass(item.nodeName + "item");
            $liElem.text(item.innerHTML);
            $liElem.on('click', function (e) {
                let $elem = e.target;
                let $idx = $('.catalogitem').index(e.target);
                console.log($idx);
                let $elemTop = $hCtn[$idx].offsetTop;
                $('html,body').animate({
                    scrollTop: $elemTop + "px"
                }, 500);
            });
            if (item.nodeName != $minH) $liElem.addClass('unset');
            //存储liElem
            $liCtn.push($liElem);
            $ulElem.append($liElem);
        });
        //插入至容器
        $(this.catelogCtn).append($ulElem);
        for (let i = maxHNum + 1; --i; i > minHNum) {
            let ClassStr = ".H" + i + "item";
            $(ClassStr).css("margin-left", (i - minHNum) * 6 + "px");
        }

        //catelog UI
        $(window).scroll(function (e) {
            let $scrollTop = $(window).scrollTop();
            let $elemTop = $(this.catelogCtn).offset().top;
            //当标题接触浏览器顶端时标红对应条目
            //用索引值寻找对应元素
            //找到最接近顶端的同级元素
            //标红元素路径
            let $flagElem = void 0;
            let $ansElem = void 0;
            $wayList.length = 0;
            //记录最接近的元素
            $hCtn.forEach(function (item, idx) {
                let $headElemTop = $(item).offset().top;
                if (($scrollTop + 10) >= $headElemTop) {
                    $flagElem = item;
                    $ansElem = idx;
                }
                if (item.nodeName != $minH) $liCtn[idx].addClass('unset');
            });
            //寻找路径
            //确定更高级元素的最接近位置
            if ($flagElem != null && $ansElem != null) {
                findListWay($hCtn, $flagElem, $ansElem);
            }
            //console.log($wayList);
            $('.catalogitem').removeClass('active');
            //标红路径
            for (let i = 0; i < $wayList.length; i++) {
                $wayList[i].addClass('active');
                //寻找展开队列,即路径下的所有元素的下一级
                let $idx = $('.catalogitem').index($wayList[i]);
                findSetWay($idx, $hCtn, $liCtn);
            }
        });
        //寻找的序列，最接近的元素，该元素索引值
        function findListWay($hCtn, $flagElem, $ansElem) {
            //加入自身
            $wayList.push($liCtn[$ansElem]);
            for (let i = $ansElem; i > -1; i--) {
                if ($hCtn[i].nodeName < $flagElem.nodeName) {
                    findListWay($hCtn, $hCtn[i], i);
                    return;
                }
            }
            return;
        }
        //寻找展开队列,即路径下的所有元素的下一级
        function findSetWay(num, $hCtn, $liCtn) {
            let $checkNum = $hCtn[num].nodeName.slice(1, 2);
            //展开
            $liCtn[num].removeClass('unset');
            //按照规则，只有在未遇到H2判断时能遇到H1 H3且并非H1 H2 H3的情况，则迭代最接近层级
            let $lessHnum = 0;
            if ($hCtn[num + 1] != null) $lessHnum = $hCtn[num + 1].nodeName.slice(1, 2);
            for (let i = num + 1; i < $hCtn.length; i++) {
                if ($hCtn[i] == null) break;
                let $Hnum = $hCtn[i].nodeName.slice(1, 2);
                if ($lessHnum > $Hnum) $lessHnum = $Hnum;
                console.log($lessHnum);
                //只有在等于最接近层级的时候 默认为下属第一层
                if ($Hnum > $checkNum && $lessHnum == $Hnum) {
                    $liCtn[i].removeClass('unset');
                }
            }
        }

    }
}
window.AutoCatelog = AutoCatelog;