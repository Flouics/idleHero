//马蜂窝计算坐标。
var Hex = function (q, r) {
    return {q: q, r: r};
};

var HexagonUtil = function () {
    this.hex_directions = [
        Hex(+1, 0), Hex(+1, -1), Hex(0, -1),
        Hex(-1, 0), Hex(-1, +1), Hex(0, +1)
    ]
};

//轴坐标转像素坐标
HexagonUtil.prototype.hex_to_pixel = function (hex, size) {
    var x = size * 3 / 2 * hex.q
    var y = size * Math.pow(3, 0.5) * (hex.r + hex.q / 2)

    return {x: x, y: y};
};

//像素坐标转轴坐标
HexagonUtil.prototype.pixel_to_hex = function (pixel, size) {
    var q = pixel.x * 2 / 3 / size;
    var r = (pixel.y * Math.pow(3, 0.5) - pixel.x) / 3 / size;
    q = Math.round(q);
    r = Math.round(r);
    return Hex(q, r);
};

HexagonUtil.prototype.pos_offset_to_hex = function (offsetPos) {
    var row = offsetPos.row;
    var col = offsetPos.col;
    var q = col;
    var r = row - (col - (col & 1)) / 2; //转成轴坐标
    return Hex(q, r);
};

HexagonUtil.prototype.pos_hex_to_offset = function (hexPos) {
    var q = hexPos.q;
    var r = hexPos.r;
    var col = q;
    var row = r + (q - (q & 1)) / 2;
    return {col: col, row: row};
};

//指定列，返回轴坐标的最大和最小值
HexagonUtil.prototype.get_offset_to_hex_r_range = function (col, max_row_offset) {
    var row = max_row_offset;
    var col = col;
    //var r = row - (col - (col & 1)) / 2; //转成轴坐标
    var min_r = -row - (col - (col & 1)) / 2;
    var max_r = row - (col - (col & 1)) / 2;
    return {min: min_r, max: max_r};
};

//检查两个轴坐标是否相邻。
HexagonUtil.prototype.check_hex_is_neighbor = function (hex_a, hex_b) {
    if (this.check_hex_is_equal(hex_a, hex_b)) return false;
    var hex_neighbor;
    for (var i in this.hex_directions) {
        hex_neighbor = this.get_hex_neighbor_by_direct(hex_a, this.hex_directions[i]);
        if (this.check_hex_is_equal(hex_neighbor, hex_b)) {
            return true;
        }
    }
    return false;
};

//获取相邻的六边形格子，
//distance 进行扩展，支持方向上的更远的距离。
HexagonUtil.prototype.get_hex_neighbor_by_direct = function (hex, dir, distance) {
    if (distance == undefined) distance = 1;
    return Hex(hex.q + dir.q * distance, hex.r + dir.r * distance);
};

//检查两个轴坐标是否相等
HexagonUtil.prototype.check_hex_is_equal = function (hex_a, hex_b) {
    return hex_a.q == hex_b.q && hex_a.r == hex_b.r;
};

module.exports = function () {
    return new HexagonUtil();
};
