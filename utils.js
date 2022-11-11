const Area = {
  leftTop: [113.946335, 22.548122],
  rigthBottom: [113.957258, 22.540979],
}

function isArea (poi) {
  const { x, y } = poi
  const { leftTop, rigthBottom } = Area
  if (
    x > leftTop[0] &&
    y > leftTop[1] &&
    x < rigthBottom[0] &&
    y < rigthBottom[1]
  ) {
    return true
  }
}

module.exports = {
  isArea,
}
