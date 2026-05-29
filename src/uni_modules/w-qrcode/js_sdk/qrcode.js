/**
 * QRCode Generator - 纯JavaScript实现
 * 基于 ISO/IEC 18004 标准
 * @version 2.0.0
 */

// 纠错级别 - 使用标准索引
const ECL = { L: 0, M: 1, Q: 2, H: 3 };

// 模式指示符
const MODE = {
  Numeric: 0b0001,
  Alphanumeric: 0b0010,
  Byte: 0b0100,
  Kanji: 0b1000
};

// 字母数字字符映射
const ALPHANUM = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';

// 各版本各纠错级别的数据容量（字节模式）
const CAPACITIES = [
  [17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],
  [134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],
  [321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],
  [586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],
  [929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],
  [1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],
  [1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],
  [2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]
];

// RS块信息表 [总码字, [各纠错级别的纠错码字数], [各纠错级别的块数(组1,组2)]]
const RS_BLOCKS = [
  [[26,[7,10,13,17],[[1,0],[1,0],[1,0],[1,0]]]],
  [[44,[10,16,22,28],[[1,0],[1,0],[1,0],[1,0]]]],
  [[70,[15,26,18,22],[[1,0],[1,0],[2,0],[2,0]]]],
  [[100,[20,18,26,16],[[1,0],[2,0],[2,0],[4,0]]]],
  [[134,[26,24,18,22],[[1,0],[2,0],[4,0],[4,0]]]],
  [[172,[18,16,24,28],[[2,0],[4,0],[4,0],[4,0]]]],
  [[196,[20,18,18,26],[[2,0],[4,0],[6,0],[5,0]]]],
  [[242,[24,22,22,26],[[2,0],[4,0],[6,0],[6,0]]]],
  [[292,[30,22,20,24],[[2,0],[5,0],[8,0],[8,0]]]],
  [[346,[18,26,24,28],[[4,0],[5,0],[8,0],[8,0]]]],
  [[404,[20,30,28,24],[[4,0],[5,0],[8,0],[11,0]]]],
  [[466,[24,22,26,28],[[4,0],[8,0],[10,0],[11,0]]]],
  [[532,[26,22,24,22],[[4,0],[9,0],[12,0],[16,0]]]],
  [[581,[30,24,20,24],[[4,0],[9,0],[16,0],[16,0]]]],
  [[655,[22,24,30,24],[[6,0],[10,0],[12,0],[18,0]]]],
  [[733,[24,28,24,30],[[6,0],[10,0],[17,0],[16,0]]]],
  [[815,[28,28,28,28],[[6,0],[11,0],[16,0],[19,0]]]],
  [[901,[30,26,28,28],[[6,0],[13,0],[18,0],[21,0]]]],
  [[991,[28,26,26,26],[[7,0],[14,0],[21,0],[25,0]]]],
  [[1085,[28,26,30,28],[[8,0],[16,0],[20,0],[25,0]]]],
  [[1156,[28,26,28,30],[[8,0],[17,0],[23,0],[25,0]]]],
  [[1258,[28,28,30,24],[[9,0],[17,0],[23,0],[34,0]]]],
  [[1364,[30,28,30,30],[[9,0],[18,0],[25,0],[30,0]]]],
  [[1474,[30,28,30,30],[[10,0],[20,0],[27,0],[32,0]]]],
  [[1588,[26,28,30,30],[[12,0],[21,0],[29,0],[35,0]]]],
  [[1706,[28,28,28,30],[[12,0],[23,0],[34,0],[37,0]]]],
  [[1828,[30,28,30,30],[[12,0],[25,0],[34,0],[40,0]]]],
  [[1921,[30,28,30,30],[[13,0],[26,0],[35,0],[42,0]]]],
  [[2051,[30,28,30,30],[[14,0],[28,0],[38,0],[45,0]]]],
  [[2185,[30,28,30,30],[[15,0],[29,0],[40,0],[48,0]]]],
  [[2323,[30,28,30,30],[[16,0],[31,0],[43,0],[51,0]]]],
  [[2465,[30,28,30,30],[[17,0],[33,0],[45,0],[54,0]]]],
  [[2611,[30,28,30,30],[[18,0],[35,0],[48,0],[57,0]]]],
  [[2761,[30,28,30,30],[[19,0],[37,0],[51,0],[60,0]]]],
  [[2876,[30,28,30,30],[[19,0],[38,0],[53,0],[63,0]]]],
  [[3034,[30,28,30,30],[[20,0],[40,0],[56,0],[66,0]]]],
  [[3196,[30,28,30,30],[[21,0],[43,0],[59,0],[70,0]]]],
  [[3362,[30,28,30,30],[[22,0],[45,0],[62,0],[74,0]]]],
  [[3532,[30,28,30,30],[[24,0],[47,0],[65,0],[77,0]]]],
  [[3706,[30,28,30,30],[[25,0],[49,0],[68,0],[81,0]]]]
];

// 更完整的RS块信息
const EC_PARAMS = [
  // [纠错码字每块, 数据码字每块组1, 块数组1, 数据码字每块组2, 块数组2]
  // L, M, Q, H for each version
  [[7,19,1,0,0],[10,16,1,0,0],[13,13,1,0,0],[17,9,1,0,0]], // v1
  [[10,34,1,0,0],[16,28,1,0,0],[22,22,1,0,0],[28,16,1,0,0]], // v2
  [[15,55,1,0,0],[26,44,1,0,0],[18,17,2,0,0],[22,13,2,0,0]], // v3
  [[20,80,1,0,0],[18,32,2,0,0],[26,24,2,0,0],[16,9,4,0,0]], // v4
  [[26,108,1,0,0],[24,43,2,0,0],[18,15,2,16,2],[22,11,2,12,2]], // v5
  [[18,68,2,0,0],[16,27,4,0,0],[24,19,4,0,0],[28,15,4,0,0]], // v6
  [[20,78,2,0,0],[18,31,4,0,0],[18,14,2,15,4],[26,13,4,14,1]], // v7
  [[24,97,2,0,0],[22,38,2,39,2],[22,18,4,19,2],[26,14,4,15,2]], // v8
  [[30,116,2,0,0],[22,36,3,37,2],[20,16,4,17,4],[24,12,4,13,4]], // v9
  [[18,68,2,69,2],[26,43,4,44,1],[24,19,6,20,2],[28,15,6,16,2]], // v10
  [[20,81,4,0,0],[30,50,1,51,4],[28,22,4,23,4],[24,12,3,13,8]], // v11
  [[24,92,2,93,2],[22,36,6,37,2],[26,20,4,21,6],[28,14,7,15,4]], // v12
  [[26,107,4,0,0],[22,37,8,38,1],[24,20,8,21,4],[22,11,12,12,4]], // v13
  [[30,115,3,116,1],[24,40,4,41,5],[20,16,11,17,5],[24,12,11,13,5]], // v14
  [[22,87,5,88,1],[24,41,5,42,5],[30,24,5,25,7],[24,12,11,13,7]], // v15
  [[24,98,5,99,1],[28,45,7,46,3],[24,19,15,20,2],[30,15,3,16,13]], // v16
  [[28,107,1,108,5],[28,46,10,47,1],[28,22,1,23,15],[28,14,2,15,17]], // v17
  [[30,120,5,121,1],[26,43,9,44,4],[28,22,17,23,1],[28,14,2,15,19]], // v18
  [[28,113,3,114,4],[26,44,3,45,11],[26,21,17,22,4],[26,13,9,14,16]], // v19
  [[28,107,3,108,5],[26,41,3,42,13],[30,24,15,25,5],[28,15,15,16,10]], // v20
  [[28,116,4,117,4],[26,42,17,0,0],[28,22,17,23,6],[30,16,19,17,6]], // v21
  [[28,111,2,112,7],[28,46,17,0,0],[30,24,7,25,16],[24,13,34,0,0]], // v22
  [[30,121,4,122,5],[28,47,4,48,14],[30,24,11,25,14],[30,15,16,16,14]], // v23
  [[30,117,6,118,4],[28,45,6,46,14],[30,24,11,25,16],[30,16,30,17,2]], // v24
  [[26,106,8,107,4],[28,47,8,48,13],[30,24,7,25,22],[30,15,22,16,13]], // v25
  [[28,114,10,115,2],[28,46,19,47,4],[28,22,28,23,6],[30,16,33,17,4]], // v26
  [[30,122,8,123,4],[28,45,22,46,3],[30,23,8,24,26],[30,15,12,16,28]], // v27
  [[30,117,3,118,10],[28,45,3,46,23],[30,24,4,25,31],[30,15,11,16,31]], // v28
  [[30,116,7,117,7],[28,45,21,46,7],[30,23,1,24,37],[30,15,19,16,26]], // v29
  [[30,115,5,116,10],[28,47,19,48,10],[30,24,15,25,25],[30,15,23,16,25]], // v30
  [[30,115,13,116,3],[28,46,2,47,29],[30,24,42,25,1],[30,15,23,16,28]], // v31
  [[30,115,17,0,0],[28,46,10,47,23],[30,24,10,25,35],[30,15,19,16,35]], // v32
  [[30,115,17,116,1],[28,46,14,47,21],[30,24,29,25,19],[30,15,11,16,46]], // v33
  [[30,115,13,116,6],[28,46,14,47,23],[30,24,44,25,7],[30,16,59,17,1]], // v34
  [[30,121,12,122,7],[28,47,12,48,26],[30,24,39,25,14],[30,15,22,16,41]], // v35
  [[30,121,6,122,14],[28,47,6,48,34],[30,24,46,25,10],[30,15,2,16,64]], // v36
  [[30,122,17,123,4],[28,46,29,47,14],[30,24,49,25,10],[30,15,24,16,46]], // v37
  [[30,122,4,123,18],[28,46,13,47,32],[30,24,48,25,14],[30,15,42,16,32]], // v38
  [[30,117,20,118,4],[28,47,40,48,7],[30,24,43,25,22],[30,15,10,16,67]], // v39
  [[30,118,19,119,6],[28,47,18,48,31],[30,24,34,25,34],[30,15,20,16,61]]  // v40
];

// 对齐图案位置
const ALIGN_POS = [
  [], [6,18], [6,22], [6,26], [6,30], [6,34],
  [6,22,38], [6,24,42], [6,26,46], [6,28,50], [6,30,54], [6,32,58], [6,34,62],
  [6,26,46,66], [6,26,48,70], [6,26,50,74], [6,30,54,78], [6,30,56,82], [6,30,58,86], [6,34,62,90],
  [6,28,50,72,94], [6,26,50,74,98], [6,30,54,78,102], [6,28,54,80,106], [6,32,58,84,110],
  [6,30,58,86,114], [6,34,62,90,118], [6,26,50,74,98,122], [6,30,54,78,102,126],
  [6,26,52,78,104,130], [6,30,56,82,108,134], [6,34,60,86,112,138], [6,30,58,86,114,142],
  [6,34,62,90,118,146], [6,30,54,78,102,126,150], [6,24,50,76,102,128,154],
  [6,28,54,80,106,132,158], [6,32,58,84,110,136,162], [6,26,54,82,110,138,166], [6,30,58,86,114,142,170]
];

// 格式信息预计算 (ecl*8+mask) -> formatBits
const FORMAT_BITS = [
  0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976,
  0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0,
  0x355f, 0x3068, 0x3f31, 0x3a06, 0x24b4, 0x2183, 0x2eda, 0x2bed,
  0x1689, 0x13be, 0x1ce7, 0x19d0, 0x0762, 0x0255, 0x0d0c, 0x083b
];

// 版本信息 (版本7+)
const VERSION_BITS = [
  0x07c94, 0x085bc, 0x09a99, 0x0a4d3, 0x0bbf6, 0x0c762, 0x0d847, 0x0e60d,
  0x0f928, 0x10b78, 0x1145d, 0x12a17, 0x13532, 0x149a6, 0x15683, 0x168c9,
  0x177ec, 0x18ec4, 0x191e1, 0x1afab, 0x1b08e, 0x1cc1a, 0x1d33f, 0x1ed75,
  0x1f250, 0x209d5, 0x216f0, 0x228ba, 0x2379f, 0x24b0b, 0x2542e, 0x26a64,
  0x27541, 0x28c69
];

// GF(2^8) 运算表
const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();

// RS编码
function rsEncode(data, ecLen) {
  const gen = new Uint8Array(ecLen + 1);
  gen[0] = 1;
  for (let i = 0; i < ecLen; i++) {
    for (let j = i + 1; j >= 1; j--) {
      gen[j] = gen[j] ? EXP[LOG[gen[j]] + i] ^ gen[j-1] : gen[j-1];
    }
    gen[0] = EXP[LOG[gen[0]] + i];
  }

  const result = new Uint8Array(ecLen);
  for (let i = 0; i < data.length; i++) {
    const coef = data[i] ^ result[0];
    result.copyWithin(0, 1);
    result[ecLen - 1] = 0;
    if (coef) {
      for (let j = 0; j < ecLen; j++) {
        result[j] ^= EXP[LOG[gen[ecLen - 1 - j]] + LOG[coef]];
      }
    }
  }
  return result;
}

// 获取数据模式
function getMode(text) {
  if (/^\d+$/.test(text)) return MODE.Numeric;
  if (/^[0-9A-Z $%*+\-./:]+$/.test(text)) return MODE.Alphanumeric;
  return MODE.Byte;
}

// 获取字符计数位数
function getCharCountBits(ver, mode) {
  const idx = ver < 10 ? 0 : ver < 27 ? 1 : 2;
  return [[10,9,8,8],[12,11,16,10],[14,13,16,12]][idx][[MODE.Numeric,MODE.Alphanumeric,MODE.Byte,MODE.Kanji].indexOf(mode)];
}

// UTF-8编码
function toUtf8(str) {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c < 0x80) {
      bytes.push(c);
    } else if (c < 0x800) {
      bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
    } else if (c >= 0xd800 && c < 0xdc00 && i + 1 < str.length) {
      const c2 = str.charCodeAt(++i);
      c = 0x10000 + ((c & 0x3ff) << 10) + (c2 & 0x3ff);
      bytes.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 0x3f), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    } else {
      bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    }
  }
  return bytes;
}

// 获取最小版本
function getMinVersion(text, ecl) {
  const mode = getMode(text);
  const len = mode === MODE.Byte ? toUtf8(text).length : text.length;
  for (let v = 1; v <= 40; v++) {
    if (len <= CAPACITIES[v-1][ecl]) return v;
  }
  return -1;
}

// 编码数据
function encodeData(text, ver, ecl) {
  const mode = getMode(text);
  const bits = [];

  // 写入位
  const write = (val, len) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
  };

  // 模式指示符
  write(mode, 4);

  // 字符计数
  const utf8 = mode === MODE.Byte ? toUtf8(text) : null;
  const charCount = utf8 ? utf8.length : text.length;
  write(charCount, getCharCountBits(ver, mode));

  // 数据编码
  if (mode === MODE.Numeric) {
    for (let i = 0; i < text.length; i += 3) {
      const chunk = text.substr(i, 3);
      write(parseInt(chunk, 10), chunk.length * 3 + 1);
    }
  } else if (mode === MODE.Alphanumeric) {
    for (let i = 0; i < text.length; i += 2) {
      if (i + 1 < text.length) {
        write(ALPHANUM.indexOf(text[i]) * 45 + ALPHANUM.indexOf(text[i+1]), 11);
      } else {
        write(ALPHANUM.indexOf(text[i]), 6);
      }
    }
  } else {
    for (const b of utf8) write(b, 8);
  }

  // 获取数据容量
  const params = EC_PARAMS[ver - 1][ecl];
  const [ecPerBlock, dc1, bc1, dc2, bc2] = params;
  const totalDC = dc1 * bc1 + dc2 * bc2;
  const capacity = totalDC * 8;

  // 终止符
  const termLen = Math.min(4, capacity - bits.length);
  for (let i = 0; i < termLen; i++) bits.push(0);

  // 对齐到字节
  while (bits.length % 8) bits.push(0);

  // 填充
  const pads = [0xec, 0x11];
  let padIdx = 0;
  while (bits.length < capacity) {
    write(pads[padIdx++ % 2], 8);
  }

  // 转换为字节
  const bytes = [];
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
    bytes.push(b);
  }

  // 分块并添加纠错码
  const blocks = [];
  const ecBlocks = [];
  let offset = 0;

  for (let i = 0; i < bc1; i++) {
    const block = bytes.slice(offset, offset + dc1);
    blocks.push(block);
    ecBlocks.push(rsEncode(new Uint8Array(block), ecPerBlock));
    offset += dc1;
  }
  for (let i = 0; i < bc2; i++) {
    const block = bytes.slice(offset, offset + dc2);
    blocks.push(block);
    ecBlocks.push(rsEncode(new Uint8Array(block), ecPerBlock));
    offset += dc2;
  }

  // 交织
  const result = [];
  const maxDC = Math.max(dc1, dc2);
  for (let i = 0; i < maxDC; i++) {
    for (const block of blocks) {
      if (i < block.length) result.push(block[i]);
    }
  }
  for (let i = 0; i < ecPerBlock; i++) {
    for (const ec of ecBlocks) {
      result.push(ec[i]);
    }
  }

  return result;
}

// 创建二维码矩阵
function createMatrix(ver) {
  const size = ver * 4 + 17;
  const matrix = [];
  const reserved = [];
  for (let i = 0; i < size; i++) {
    matrix.push(new Array(size).fill(0));
    reserved.push(new Array(size).fill(false));
  }

  // 标记保留区域
  const mark = (r, c) => {
    if (r >= 0 && r < size && c >= 0 && c < size) reserved[r][c] = true;
  };

  // 查找图案
  const placeFinder = (r, c) => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
        mark(nr, nc);
        if (dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6) {
          const isBlack = dr === 0 || dr === 6 || dc === 0 || dc === 6 ||
                         (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4);
          matrix[nr][nc] = isBlack ? 1 : 0;
        } else {
          matrix[nr][nc] = 0;
        }
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // 对齐图案
  if (ver >= 2) {
    const positions = ALIGN_POS[ver - 1];
    for (const r of positions) {
      for (const c of positions) {
        if (reserved[r][c]) continue;
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            mark(r + dr, c + dc);
            const isBlack = Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0);
            matrix[r + dr][c + dc] = isBlack ? 1 : 0;
          }
        }
      }
    }
  }

  // 时序图案
  for (let i = 8; i < size - 8; i++) {
    const v = i % 2 === 0 ? 1 : 0;
    if (!reserved[6][i]) { matrix[6][i] = v; mark(6, i); }
    if (!reserved[i][6]) { matrix[i][6] = v; mark(i, 6); }
  }

  // 暗模块
  matrix[size - 8][8] = 1;
  mark(size - 8, 8);

  // 格式信息区域
  for (let i = 0; i < 9; i++) { mark(8, i); mark(i, 8); }
  for (let i = 0; i < 8; i++) { mark(8, size - 1 - i); mark(size - 1 - i, 8); }

  // 版本信息区域
  if (ver >= 7) {
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 3; j++) {
        mark(i, size - 11 + j);
        mark(size - 11 + j, i);
      }
    }
  }

  return { matrix, reserved, size };
}

// 放置数据
function placeData(matrix, reserved, data) {
  const size = matrix.length;
  let bitIdx = 0;
  let upward = true;

  for (let col = size - 1; col >= 1; col -= 2) {
    if (col === 6) col = 5;

    for (let i = 0; i < size; i++) {
      const row = upward ? size - 1 - i : i;

      for (let dc = 0; dc < 2; dc++) {
        const c = col - dc;
        if (!reserved[row][c]) {
          const bit = bitIdx < data.length * 8
            ? (data[Math.floor(bitIdx / 8)] >> (7 - bitIdx % 8)) & 1
            : 0;
          matrix[row][c] = bit;
          bitIdx++;
        }
      }
    }
    upward = !upward;
  }
}

// 应用掩码
function applyMask(matrix, reserved, mask) {
  const size = matrix.length;
  const result = matrix.map(row => [...row]);

  const masks = [
    (r, c) => (r + c) % 2 === 0,
    (r, c) => r % 2 === 0,
    (r, c) => c % 3 === 0,
    (r, c) => (r + c) % 3 === 0,
    (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
    (r, c) => (r * c) % 2 + (r * c) % 3 === 0,
    (r, c) => ((r * c) % 2 + (r * c) % 3) % 2 === 0,
    (r, c) => ((r + c) % 2 + (r * c) % 3) % 2 === 0
  ];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!reserved[r][c] && masks[mask](r, c)) {
        result[r][c] ^= 1;
      }
    }
  }

  return result;
}

// 放置格式信息
function placeFormatInfo(matrix, ecl, mask) {
  const size = matrix.length;
  const bits = FORMAT_BITS[ecl * 8 + mask];

  // 左上水平
  for (let i = 0; i <= 5; i++) matrix[8][i] = (bits >> (14 - i)) & 1;
  matrix[8][7] = (bits >> 8) & 1;
  matrix[8][8] = (bits >> 7) & 1;
  matrix[7][8] = (bits >> 6) & 1;
  for (let i = 0; i <= 5; i++) matrix[i][8] = (bits >> i) & 1;

  // 右上和左下
  for (let i = 0; i <= 7; i++) matrix[8][size - 1 - i] = (bits >> i) & 1;
  for (let i = 0; i <= 6; i++) matrix[size - 1 - i][8] = (bits >> (14 - i)) & 1;
}

// 放置版本信息
function placeVersionInfo(matrix, ver) {
  if (ver < 7) return;
  const size = matrix.length;
  const bits = VERSION_BITS[ver - 7];

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 3; j++) {
      const bit = (bits >> (i * 3 + j)) & 1;
      matrix[i][size - 11 + j] = bit;
      matrix[size - 11 + j][i] = bit;
    }
  }
}

// 计算惩罚分数
function calcPenalty(matrix) {
  const size = matrix.length;
  let penalty = 0;

  // 规则1: 连续同色
  for (let r = 0; r < size; r++) {
    let cnt = 1;
    for (let c = 1; c < size; c++) {
      if (matrix[r][c] === matrix[r][c-1]) cnt++;
      else { if (cnt >= 5) penalty += cnt - 2; cnt = 1; }
    }
    if (cnt >= 5) penalty += cnt - 2;
  }
  for (let c = 0; c < size; c++) {
    let cnt = 1;
    for (let r = 1; r < size; r++) {
      if (matrix[r][c] === matrix[r-1][c]) cnt++;
      else { if (cnt >= 5) penalty += cnt - 2; cnt = 1; }
    }
    if (cnt >= 5) penalty += cnt - 2;
  }

  // 规则2: 2x2块
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const v = matrix[r][c];
      if (v === matrix[r][c+1] && v === matrix[r+1][c] && v === matrix[r+1][c+1]) {
        penalty += 3;
      }
    }
  }

  // 规则3: 特定图案
  const p1 = [1,0,1,1,1,0,1,0,0,0,0];
  const p2 = [0,0,0,0,1,0,1,1,1,0,1];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - 11; c++) {
      let m1 = true, m2 = true;
      for (let i = 0; i < 11; i++) {
        if (matrix[r][c+i] !== p1[i]) m1 = false;
        if (matrix[r][c+i] !== p2[i]) m2 = false;
      }
      if (m1 || m2) penalty += 40;
    }
  }
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - 11; r++) {
      let m1 = true, m2 = true;
      for (let i = 0; i < 11; i++) {
        if (matrix[r+i][c] !== p1[i]) m1 = false;
        if (matrix[r+i][c] !== p2[i]) m2 = false;
      }
      if (m1 || m2) penalty += 40;
    }
  }

  // 规则4: 黑白比例
  let dark = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c]) dark++;
    }
  }
  const ratio = dark / (size * size);
  penalty += Math.floor(Math.abs(ratio - 0.5) / 0.05) * 10;

  return penalty;
}

// 选择最佳掩码
function selectMask(matrix, reserved, ecl, ver) {
  let bestMask = 0;
  let bestPenalty = Infinity;

  for (let mask = 0; mask < 8; mask++) {
    const masked = applyMask(matrix, reserved, mask);
    placeFormatInfo(masked, ecl, mask);
    placeVersionInfo(masked, ver);
    const p = calcPenalty(masked);
    if (p < bestPenalty) {
      bestPenalty = p;
      bestMask = mask;
    }
  }

  return bestMask;
}

/**
 * 生成二维码
 */
function generate(text, options = {}) {
  const eclName = (options.errorCorrectionLevel || 'M').toUpperCase();
  const ecl = ECL[eclName] !== undefined ? ECL[eclName] : ECL.M;

  let ver = options.version || getMinVersion(text, ecl);
  if (ver < 1) throw new Error('数据过长');
  if (ver > 40) ver = 40;

  const data = encodeData(text, ver, ecl);
  const { matrix, reserved, size } = createMatrix(ver);

  placeData(matrix, reserved, data);

  const mask = selectMask(matrix, reserved, ecl, ver);
  const final = applyMask(matrix, reserved, mask);
  placeFormatInfo(final, ecl, mask);
  placeVersionInfo(final, ver);

  return {
    version: ver,
    size,
    modules: final,
    errorCorrectionLevel: eclName
  };
}

export default { generate, ECL, MODE };
export { generate, ECL, MODE };
