# AutoCatelog
## 功能
- 根据你的 <h*> 标签向你的文章添加一个具有完整UI的目录
- UI包括滚动监听，标题锚点，目录的层级展开与缩回
- 可以使用预设的CSS(使用```position:absolue```，定位自设)
## 样例
![img](https://github.com/xxx407410849/AutoCatelog/blob/master/dist/md/20180806012514977.gif)
## Blog
关于这个插件和UI实现的想法，已在 [作者CSDN博客](https://blog.csdn.net/u012312705/article/details/81437727) 中详细描述
## 使用方式
- 本项目依赖Jquery，若项目包中已有jq，可直接导入autocatelog.js(若需css则一并添加catelog.css)
- 若无jq，则使用dist目录下的main.js
- 使用方法可参照demo.html
 ```
    // 你的目录容器,为空时请自行在html中创建类名为(catelog-ctn)的容器以调用css，(类名绑定的CSS)
    let catelogCtn = document.getElementsByClassName('catelog-ctn');
    // 你所添加文章的最近父元素
    let articleCtn = document.getElementsByClassName('article-ctn');
    // 实例化
    let autocatelog = new AutoCatelog(articleCtn,catelogCtn);
    // 初始化
    autocatelog.init();
```
