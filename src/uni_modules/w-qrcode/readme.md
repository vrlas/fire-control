# w-qrcode 二维码生成器

高性能二维码生成组件，纯 JavaScript 实现，无外部依赖。

## 特性

- 纯 JavaScript 实现，无需任何外部依赖
- 支持 Vue2 和 Vue3
- 支持全平台：H5、App（Vue/Nvue）、微信/支付宝/百度/字节跳动/QQ 等小程序
- 支持自定义前景色、背景色
- 支持添加 Logo 图片
- 支持多种纠错级别（L/M/Q/H）
- 支持保存到相册
- 支持导出为图片

## 安装

将 `w-qrcode` 目录复制到项目的 `uni_modules` 目录下即可。

## 基本使用

```vue
<template>
  <w-qrcode value="https://example.com" />
</template>
```

## 完整示例

```vue
<template>
  <view class="container">
    <!-- 基础用法 -->
    <w-qrcode
      value="https://example.com"
      :size="200"
    />

    <!-- 自定义颜色 -->
    <w-qrcode
      value="https://example.com"
      :size="200"
      foreground="#1989fa"
      background="#f5f5f5"
    />

    <!-- 带 Logo -->
    <w-qrcode
      ref="qrcodeRef"
      value="https://example.com"
      :size="200"
      logo="/static/logo.png"
      :logo-size="50"
      :logo-radius="8"
      error-correction-level="H"
      @generated="onGenerated"
      @longpress="onLongpress"
    />

    <button @click="saveToAlbum">保存到相册</button>
  </view>
</template>

<script>
export default {
  methods: {
    onGenerated(info) {
      console.log('二维码生成成功:', info);
      // { version: 2, size: 25, errorCorrectionLevel: 'H' }
    },
    onLongpress(e) {
      console.log('长按事件');
    },
    saveToAlbum() {
      this.$refs.qrcodeRef.saveToAlbum()
        .then(res => {
          console.log('保存成功', res);
        })
        .catch(err => {
          console.error('保存失败', err);
        });
    }
  }
};
</script>
```

## Vue3 组合式 API 示例

```vue
<template>
  <w-qrcode
    ref="qrcodeRef"
    :value="qrValue"
    :size="200"
  />
</template>

<script setup>
import { ref } from 'vue';

const qrcodeRef = ref(null);
const qrValue = ref('https://example.com');

const saveToAlbum = () => {
  qrcodeRef.value.saveToAlbum();
};
</script>
```

## Props 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| value | String | '' | 要编码的文本内容 |
| size | Number/String | 200 | 二维码尺寸（单位：px） |
| foreground | String | '#000000' | 前景色（二维码颜色） |
| background | String | '#FFFFFF' | 背景色 |
| errorCorrectionLevel | String | 'M' | 纠错级别，可选值：L/M/Q/H |
| margin | Number/String | 2 | 二维码边距（单位：模块） |
| logo | String | '' | Logo 图片路径 |
| logoSize | Number/String | 50 | Logo 尺寸（单位：px） |
| logoMargin | Number/String | 5 | Logo 外边距（单位：px） |
| logoRadius | Number/String | 8 | Logo 圆角（单位：px） |
| logoBackground | String | '#FFFFFF' | Logo 背景色 |
| canvas2d | Boolean | true | 是否使用 Canvas 2D（仅小程序有效） |

## 纠错级别说明

| 级别 | 纠错能力 | 说明 |
|------|----------|------|
| L | 约 7% | 数据恢复能力最低 |
| M | 约 15% | 默认级别，平衡 |
| Q | 约 25% | 较高的数据恢复能力 |
| H | 约 30% | 最高级别，适合添加 Logo |

> 注意：如果需要在二维码中添加 Logo，建议使用 `H` 级别，以保证扫描成功率。

## Events 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| generated | 二维码生成成功时触发 | { version, size, errorCorrectionLevel } |
| error | 生成失败时触发 | Error 对象 |
| longpress | 长按二维码时触发 | Event 对象 |

## Methods 方法

通过 ref 获取组件实例后调用：

| 方法名 | 说明 | 参数 | 返回值 |
|--------|------|------|--------|
| saveToAlbum | 保存到相册 | - | Promise |
| toTempFilePath | 获取临时文件路径 | options | Promise<{tempFilePath}> |
| toDataURL | 获取 Base64（仅 H5） | type, quality | Promise<string> |
| generate | 重新生成二维码 | - | - |

### toTempFilePath 参数

```javascript
this.$refs.qrcodeRef.toTempFilePath({
  fileType: 'png', // 'jpg' | 'png'
  quality: 1,      // 0-1，jpg 时有效
  destWidth: 300,  // 输出图片宽度
  destHeight: 300  // 输出图片高度
});
```

## 直接使用 JS SDK

如果只需要生成二维码数据，可以直接使用 JS SDK：

```javascript
import QRCode from '@/uni_modules/w-qrcode/js_sdk/qrcode.js';

// 生成二维码数据
const result = QRCode.generate('https://example.com', {
  errorCorrectionLevel: 'M' // L/M/Q/H
});

console.log(result);
// {
//   version: 2,          // 版本号 1-40
//   size: 25,            // 矩阵尺寸
//   modules: [[...], ...], // 二维码矩阵，1表示黑色，0表示白色
//   errorCorrectionLevel: 'M'
// }
```

## 平台差异

| 平台 | 渲染方式 | 说明 |
|------|----------|------|
| H5 | Canvas | 完全支持 |
| App-Vue | Canvas | 完全支持 |
| App-Nvue | View 布局 | 使用 Fallback 渲染 |
| 微信小程序 | Canvas 2D | 推荐使用 Canvas 2D |
| 其他小程序 | Canvas | 使用旧版 Canvas API |

## 常见问题

### 1. 二维码扫描不出来？

- 检查内容是否正确
- 增加纠错级别（使用 'H'）
- 减小 Logo 尺寸（不超过二维码的 30%）
- 增加二维码尺寸

### 2. 保存到相册失败？

- 小程序需要用户授权
- App 需要配置相册权限
- 检查图片路径是否正确

### 3. Logo 不显示？

- 确保图片路径正确
- 本地图片使用绝对路径
- 网络图片需要在小程序后台配置域名白名单

## 更新日志

### 1.0.0

- 初始版本发布
- 支持基础二维码生成
- 支持自定义样式
- 支持 Logo 图片
- 支持多平台
