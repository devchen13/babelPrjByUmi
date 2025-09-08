/**
 * 十进制数值转为指定长度的二进制字符串，不足位数前面补0
 * @param {number} num 十进制数值
 * @param {number} length 二进制字符串长度（可选，默认6位）
 * @returns {string} 补零后的二进制字符串
 */
function decimalToBinaryString(num, length = 6) {
  let bin = num.toString(2)
  return bin.padStart(length, '0')
}

export default decimalToBinaryString
