# iMusic
## 基于nodejs的音乐播放器
## 客户端：node-webkit + angular + angular-material
## 移动端：react-native
## web管理端：express + mongoDB
 
> 导出数据
```
mongoexport --db imusic  --collection  musics --out musics.json
```

> 导入数据
```
mongoimport --db imusic --collection musics --file musics.json
```
##注：文件中的音乐文件仅仅作为例子使用，切勿传播，屌丝赔不起啊。大侠饶命···

![客户端](http://static.oschina.net/uploads/img/201601/12162647_9OYd.jpg)

![web管理端：express](http://static.oschina.net/uploads/img/201601/12162650_pz56.jpg)