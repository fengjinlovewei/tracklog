# tracklog（埋点上报插件）

>PS： 使用过程中出现任何问题，或者本插件没有满足你的任何关于埋点上报的功能的需求，联系fengjin01

#### 优势

1. 使用简单，只需在dom元素上绑定数据即可。
2. 体积小，只有4KB。
3. 解除与业务代码的耦合，只与相关埋点dom元素绑定。
4. 性能稳定，完全使用原生API构建，不使用第三方依赖包。
5. 不依附于具体框架，在 vue、react 等任何mvvm框架内使用。

#### 地址

[https://git.zuoyebang.cc/zhiji/tracklog](https://git.zuoyebang.cc/zhiji/tracklog)

#### npm 安装

`npm i @zyb/tracklog`

#### yarn 安装

`yarn add @zyb/tracklog`

#### 使用

首先要在入口文件引入，然后在 mvvm 框架实例化之前初始化。

```
在dom上绑定 data-trackclick，意味着这是一个点击触发点击埋点。
在dom上绑定 data-trackshow，意味着这个dom进入可视区域时触发曝光埋点。
```
具体用法参考下面案例

### vue 使用案例
main.ts
```
import { createApp } from 'vue'
import TrackLog from "@zyb/tracklog";

const fetchTrackLog = (Data: string) => {
  console.log("TrackLog", Data);
  try {
    const json = JSON.parse(Data);
    const { name, data } = json;
    // 处理这些数据，
    console.log(name, data) // HCA_036, {clearfrom: 0}
  } catch (e) {
    // 处理这些数据，
    console.log(Data); // HCA_035
  }
};

new TrackLog({
  click: fetchTrackLog,
  show: fetchTrackLog
});
```

page.ts

```
...
<Button
  @click="go" 
  data-trackclick="HCA_035" 
  :data-trackshow="JSON.stringify({name: 'HCA_036', data: {clearfrom: 0}})">
提交
</Button>
```


### react 使用案例
index.ts

```
import React from 'react'
import ReactDOM from 'react-dom'
import TrackLog from "@zyb/tracklog";

const fetchTrackLog = (Data: string) => {
  console.log("TrackLog", Data);
  try {
    const json = JSON.parse(Data);
    const { name, data } = json;
    // 处理这些数据，
    console.log(name, data) // HCA_036, {clearfrom: 0}
  } catch (e) {
    // 处理这些数据，
    console.log(Data); // HCA_035
  }
};

new TrackLog({
  click: fetchTrackLog,
  show: fetchTrackLog
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
```

page.tsx

```
<Button
  onclick="go" 
  data-trackclick="HCA_035" 
  data-trackshow={ JSON.stringify({name: 'HCA_036', data: {clearfrom: 0}}) }>
提交
</Button>
```
