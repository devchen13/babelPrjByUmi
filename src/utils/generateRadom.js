/**
 * 生成指定范围内的真随机整数（包含 min 和 max）
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number} 随机整数
 */
function generateRadom(min, max) {
  if (typeof min !== "number" || typeof max !== "number") {
    throw new Error("参数必须为数字");
  }
  if (min > max) {
    [min, max] = [max, min];
  }
  // Math.random() 生成 [0,1) 的伪随机数，乘以区间长度后向下取整再加 min
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default generateRadom;
