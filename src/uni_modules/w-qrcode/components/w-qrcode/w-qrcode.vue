<template>
  <view class="w-qrcode" :style="rootStyle">
    <!-- #ifdef MP-WEIXIN -->
    <canvas
      v-if="canvas2d"
      :id="canvasId"
      :canvas-id="canvasId"
      type="2d"
      :style="canvasStyle"
      @longpress="onLongpress"
    ></canvas>
    <canvas
      v-else
      :id="canvasId"
      :canvas-id="canvasId"
      :style="canvasStyle"
      @longpress="onLongpress"
    ></canvas>
    <!-- #endif -->

    <!-- #ifdef H5 -->
    <canvas
      :id="canvasId"
      :canvas-id="canvasId"
      :style="canvasStyle"
      :width="canvasWidth"
      :height="canvasHeight"
      @longpress="onLongpress"
    ></canvas>
    <!-- #endif -->

    <!-- #ifdef APP-PLUS -->
    <canvas
      :id="canvasId"
      :canvas-id="canvasId"
      :style="canvasStyle"
      @longpress="onLongpress"
    ></canvas>
    <!-- #endif -->

    <!-- #ifdef MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ || MP-KUAISHOU || MP-LARK || MP-JD -->
    <canvas
      :id="canvasId"
      :canvas-id="canvasId"
      :style="canvasStyle"
      @longpress="onLongpress"
    ></canvas>
    <!-- #endif -->

    <!-- 用于非Canvas渲染场景的备用方案 -->
    <view v-if="showFallback" class="w-qrcode__fallback" :style="fallbackStyle">
      <view
        v-for="(row, rowIndex) in modules"
        :key="rowIndex"
        class="w-qrcode__row"
        :style="rowStyle"
      >
        <view
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          class="w-qrcode__cell"
          :style="cell ? darkCellStyle : lightCellStyle"
        ></view>
      </view>
    </view>
  </view>
</template>

<script>
import QRCode from '../../js_sdk/qrcode.js';

// 生成唯一ID
let uid = 0;
const generateId = () => `w-qrcode-${++uid}-${Date.now()}`;

// 获取系统信息用于 rpx 转换
let systemInfo = null;
const getSystemInfo = () => {
  if (!systemInfo) {
    systemInfo = uni.getSystemInfoSync();
  }
  return systemInfo;
};

// 单位转换：支持 px、rpx、数字
const parseSize = (size) => {
  if (typeof size === 'number') {
    return size;
  }
  const str = String(size).trim();
  if (str.endsWith('rpx')) {
    const rpxValue = parseFloat(str);
    const { windowWidth } = getSystemInfo();
    return Math.round(rpxValue * windowWidth / 750);
  }
  if (str.endsWith('px')) {
    return parseFloat(str);
  }
  return parseFloat(str) || 0;
};

export default {
  name: 'w-qrcode',

  emits: ['generated', 'error', 'longpress'],

  props: {
    // 要编码的文本
    value: {
      type: String,
      default: ''
    },
    // 二维码尺寸（支持 px、rpx）
    size: {
      type: [Number, String],
      default: 200
    },
    // 前景色
    foreground: {
      type: String,
      default: '#000000'
    },
    // 背景色
    background: {
      type: String,
      default: '#FFFFFF'
    },
    // 纠错级别 L/M/Q/H
    errorCorrectionLevel: {
      type: String,
      default: 'M',
      validator: (val) => ['L', 'M', 'Q', 'H'].includes(val)
    },
    // Logo 图片路径
    logo: {
      type: String,
      default: ''
    },
    // Logo 尺寸（支持 px、rpx）
    logoSize: {
      type: [Number, String],
      default: 50
    },
    // Logo 边距
    logoMargin: {
      type: [Number, String],
      default: 5
    },
    // Logo 圆角
    logoRadius: {
      type: [Number, String],
      default: 4
    },
    // Logo 背景色
    logoBackground: {
      type: String,
      default: '#FFFFFF'
    },
    // 是否使用 Canvas 2D（仅微信小程序）
    canvas2d: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      canvasId: generateId(),
      modules: [],
      showFallback: false,
      isReady: false,
      ctx: null,
      canvasNode: null,
      pixelRatio: 1
    };
  },

  computed: {
    // 转换后的像素尺寸
    sizePx() {
      return Math.floor(parseSize(this.size));
    },
    logoSizePx() {
      return Math.floor(parseSize(this.logoSize));
    },
    logoMarginPx() {
      return Math.floor(parseSize(this.logoMargin));
    },
    logoRadiusPx() {
      return Math.floor(parseSize(this.logoRadius));
    },
    // H5 canvas 属性
    canvasWidth() {
      return this.sizePx;
    },
    canvasHeight() {
      return this.sizePx;
    },
    rootStyle() {
      const size = this.sizePx;
      return `width: ${size}px; height: ${size}px; display: inline-block;`;
    },
    canvasStyle() {
      const size = this.sizePx;
      return `width: ${size}px; height: ${size}px; display: block;`;
    },
    fallbackStyle() {
      const size = this.sizePx;
      return {
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: this.background
      };
    },
    // 计算每个模块的像素大小
    cellSizePx() {
      if (!this.modules.length) return 0;
      const moduleCount = this.modules.length;
      return Math.floor(this.sizePx / moduleCount);
    },
    // 偏移量（居中）
    offset() {
      if (!this.modules.length) return 0;
      const actualSize = this.cellSizePx * this.modules.length;
      return Math.floor((this.sizePx - actualSize) / 2);
    },
    rowStyle() {
      return {
        height: `${this.cellSizePx}px`
      };
    },
    darkCellStyle() {
      return {
        width: `${this.cellSizePx}px`,
        height: `${this.cellSizePx}px`,
        backgroundColor: this.foreground
      };
    },
    lightCellStyle() {
      return {
        width: `${this.cellSizePx}px`,
        height: `${this.cellSizePx}px`,
        backgroundColor: this.background
      };
    }
  },

  watch: {
    value: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.generate();
          });
        }
      },
      immediate: true
    },
    foreground() {
      this.$nextTick(() => this.draw());
    },
    background() {
      this.$nextTick(() => this.draw());
    },
    size() {
      this.$nextTick(() => this.draw());
    },
    logo() {
      this.$nextTick(() => this.draw());
    },
    logoSize() {
      this.$nextTick(() => this.draw());
    },
    logoRadius() {
      this.$nextTick(() => this.draw());
    },
    logoMargin() {
      this.$nextTick(() => this.draw());
    },
    logoBackground() {
      this.$nextTick(() => this.draw());
    },
    errorCorrectionLevel() {
      this.$nextTick(() => this.generate());
    }
  },

  mounted() {
    this.pixelRatio = getSystemInfo().pixelRatio || 1;
    this.isReady = true;
    if (this.value) {
      // 延迟执行确保 canvas 已渲染
      setTimeout(() => {
        this.generate();
      }, 50);
    }
  },

  methods: {
    // 生成二维码数据
    generate() {
      if (!this.value) {
        this.modules = [];
        return;
      }

      try {
        const result = QRCode.generate(this.value, {
          errorCorrectionLevel: this.errorCorrectionLevel
        });

        this.modules = result.modules;
        this.$emit('generated', {
          version: result.version,
          size: result.size,
          errorCorrectionLevel: result.errorCorrectionLevel
        });

        this.$nextTick(() => {
          setTimeout(() => {
            this.draw();
          }, 20);
        });
      } catch (error) {
        console.error('[w-qrcode] Generate error:', error);
        this.$emit('error', error);
      }
    },

    // 绘制二维码
    draw() {
      if (!this.modules.length || !this.isReady) return;

      // #ifdef MP-WEIXIN
      if (this.canvas2d) {
        this.drawCanvas2D();
        return;
      }
      this.drawCanvasLegacy();
      return;
      // #endif

      // #ifdef APP-NVUE
      this.showFallback = true;
      return;
      // #endif

      // #ifdef H5
      this.drawCanvasH5();
      return;
      // #endif

      // #ifdef APP-PLUS
      this.drawCanvasLegacy();
      return;
      // #endif

      // #ifndef MP-WEIXIN || APP-NVUE || H5 || APP-PLUS
      this.drawCanvasLegacy();
      // #endif
    },

    // H5 Canvas 绘制
    drawCanvasH5() {
      const query = uni.createSelectorQuery().in(this);
      query.select(`#${this.canvasId}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          if (res && res[0] && res[0].node) {
            const canvas = res[0].node;
            const ctx = canvas.getContext('2d');

            // 设置 canvas 实际像素大小
            const dpr = this.pixelRatio;
            canvas.width = this.sizePx * dpr;
            canvas.height = this.sizePx * dpr;
            ctx.scale(dpr, dpr);

            this.canvasNode = canvas;
            this.ctx = ctx;
            this.renderQRCode(ctx, canvas, true);
          } else {
            // 降级处理
            this.drawCanvasLegacy();
          }
        });
    },

    // Canvas 2D 绘制（微信小程序）
    drawCanvas2D() {
      const query = uni.createSelectorQuery().in(this);
      query.select(`#${this.canvasId}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res || !res[0] || !res[0].node) {
            this.drawCanvasLegacy();
            return;
          }

          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          const dpr = this.pixelRatio;

          canvas.width = this.sizePx * dpr;
          canvas.height = this.sizePx * dpr;
          ctx.scale(dpr, dpr);

          this.canvasNode = canvas;
          this.ctx = ctx;

          this.renderQRCode(ctx, canvas, true);
        });
    },

    // 旧版 Canvas 绘制
    drawCanvasLegacy() {
      const ctx = uni.createCanvasContext(this.canvasId, this);
      this.ctx = ctx;
      this.renderQRCodeLegacy(ctx);
    },

    // 统一的二维码渲染方法（Canvas 2D / H5）
    renderQRCode(ctx, canvas, isCanvas2D) {
      const size = this.sizePx;
      const modules = this.modules;
      const moduleCount = modules.length;
      const cellSize = this.cellSizePx;
      const offset = this.offset;

      // 清空并绘制背景
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = this.background;
      ctx.fillRect(0, 0, size, size);

      // 绘制二维码模块
      ctx.fillStyle = this.foreground;
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (modules[row][col]) {
            const x = offset + col * cellSize;
            const y = offset + row * cellSize;
            ctx.fillRect(x, y, cellSize, cellSize);
          }
        }
      }

      // 绘制 Logo
      if (this.logo && canvas) {
        this.renderLogo(ctx, canvas);
      }
    },

    // 旧版 Canvas 渲染
    renderQRCodeLegacy(ctx) {
      const size = this.sizePx;
      const modules = this.modules;
      const moduleCount = modules.length;
      const cellSize = this.cellSizePx;
      const offset = this.offset;

      // 绘制背景
      ctx.setFillStyle(this.background);
      ctx.fillRect(0, 0, size, size);

      // 绘制二维码模块
      ctx.setFillStyle(this.foreground);
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (modules[row][col]) {
            const x = offset + col * cellSize;
            const y = offset + row * cellSize;
            ctx.fillRect(x, y, cellSize, cellSize);
          }
        }
      }

      // 绘制 Logo
      if (this.logo) {
        this.renderLogoLegacy(ctx);
      } else {
        ctx.draw();
      }
    },

    // 绘制 Logo（Canvas 2D / H5）
    renderLogo(ctx, canvas) {
      const size = this.sizePx;
      const logoSize = this.logoSizePx;
      const logoMargin = this.logoMarginPx;
      const logoRadius = this.logoRadiusPx;
      const x = Math.floor((size - logoSize) / 2);
      const y = Math.floor((size - logoSize) / 2);
      const bgSize = logoSize + logoMargin * 2;
      const bgX = Math.floor((size - bgSize) / 2);
      const bgY = Math.floor((size - bgSize) / 2);

      // 绘制 Logo 背景
      ctx.fillStyle = this.logoBackground;
      this.drawRoundRect(ctx, bgX, bgY, bgSize, bgSize, logoRadius + logoMargin / 2);
      ctx.fill();

      // 绘制 Logo 图片
      const img = canvas.createImage ? canvas.createImage() : new Image();
      img.onload = () => {
        ctx.save();
        this.drawRoundRect(ctx, x, y, logoSize, logoSize, logoRadius);
        ctx.clip();
        ctx.drawImage(img, x, y, logoSize, logoSize);
        ctx.restore();
      };
      img.onerror = (err) => {
        console.error('[w-qrcode] Logo load error:', err);
      };
      img.src = this.logo;
    },

    // 绘制 Logo（旧版 Canvas）
    renderLogoLegacy(ctx) {
      const size = this.sizePx;
      const logoSize = this.logoSizePx;
      const logoMargin = this.logoMarginPx;
      const logoRadius = this.logoRadiusPx;
      const x = Math.floor((size - logoSize) / 2);
      const y = Math.floor((size - logoSize) / 2);
      const bgSize = logoSize + logoMargin * 2;
      const bgX = Math.floor((size - bgSize) / 2);
      const bgY = Math.floor((size - bgSize) / 2);

      // 绘制 Logo 背景
      ctx.setFillStyle(this.logoBackground);
      this.drawRoundRect(ctx, bgX, bgY, bgSize, bgSize, logoRadius + logoMargin / 2);
      ctx.fill();

      // 绘制 Logo 图片
      ctx.save();
      this.drawRoundRect(ctx, x, y, logoSize, logoSize, logoRadius);
      ctx.clip();
      ctx.drawImage(this.logo, x, y, logoSize, logoSize);
      ctx.restore();
      ctx.draw();
    },

    // 绘制圆角矩形
    drawRoundRect(ctx, x, y, width, height, radius) {
      if (radius <= 0) {
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.closePath();
        return;
      }
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.arcTo(x + width, y, x + width, y + radius, radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
      ctx.lineTo(x + radius, y + height);
      ctx.arcTo(x, y + height, x, y + height - radius, radius);
      ctx.lineTo(x, y + radius);
      ctx.arcTo(x, y, x + radius, y, radius);
      ctx.closePath();
    },

    // 长按事件
    onLongpress(e) {
      this.$emit('longpress', e);
    },

    // 保存到相册
    saveToAlbum() {
      return new Promise((resolve, reject) => {
        // #ifdef MP-WEIXIN
        if (this.canvas2d && this.canvasNode) {
          uni.canvasToTempFilePath({
            canvas: this.canvasNode,
            success: (res) => {
              this.saveImage(res.tempFilePath).then(resolve).catch(reject);
            },
            fail: reject
          });
          return;
        }
        // #endif

        // #ifdef H5
        if (this.canvasNode) {
          try {
            const dataURL = this.canvasNode.toDataURL('image/png');
            // H5 下载图片
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = dataURL;
            link.click();
            resolve({ tempFilePath: dataURL });
            return;
          } catch (e) {
            reject(e);
            return;
          }
        }
        // #endif

        uni.canvasToTempFilePath({
          canvasId: this.canvasId,
          success: (res) => {
            this.saveImage(res.tempFilePath).then(resolve).catch(reject);
          },
          fail: reject
        }, this);
      });
    },

    // 保存图片
    saveImage(tempFilePath) {
      return new Promise((resolve, reject) => {
        // #ifdef H5
        resolve({ tempFilePath });
        return;
        // #endif

        // #ifndef H5
        uni.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success: () => {
            uni.showToast({
              title: '保存成功',
              icon: 'success'
            });
            resolve({ tempFilePath });
          },
          fail: (err) => {
            if (err.errMsg && err.errMsg.includes('auth deny')) {
              uni.showModal({
                title: '提示',
                content: '需要您授权保存相册权限',
                showCancel: false
              });
            }
            reject(err);
          }
        });
        // #endif
      });
    },

    // 获取临时文件路径
    toTempFilePath(options = {}) {
      return new Promise((resolve, reject) => {
        const defaultOptions = {
          fileType: 'png',
          quality: 1,
          ...options
        };

        // #ifdef MP-WEIXIN
        if (this.canvas2d && this.canvasNode) {
          uni.canvasToTempFilePath({
            ...defaultOptions,
            canvas: this.canvasNode,
            success: resolve,
            fail: reject
          });
          return;
        }
        // #endif

        // #ifdef H5
        if (this.canvasNode) {
          try {
            const dataURL = this.canvasNode.toDataURL('image/png');
            resolve({ tempFilePath: dataURL });
            return;
          } catch (e) {
            reject(e);
            return;
          }
        }
        // #endif

        uni.canvasToTempFilePath({
          ...defaultOptions,
          canvasId: this.canvasId,
          success: resolve,
          fail: reject
        }, this);
      });
    },

    // 获取 Base64
    toDataURL(type = 'image/png', quality = 1) {
      return new Promise((resolve, reject) => {
        // #ifdef H5
        if (this.canvasNode) {
          try {
            resolve(this.canvasNode.toDataURL(type, quality));
            return;
          } catch (e) {
            reject(e);
            return;
          }
        }
        // #endif

        reject(new Error('toDataURL is only supported on H5'));
      });
    }
  }
};
</script>

<style scoped>
.w-qrcode {
  position: relative;
  overflow: hidden;
}

.w-qrcode__fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.w-qrcode__row {
  display: flex;
  flex-direction: row;
}

.w-qrcode__cell {
  flex-shrink: 0;
}
</style>
