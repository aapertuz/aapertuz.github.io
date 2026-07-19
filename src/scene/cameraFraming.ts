const DESKTOP_HOME_Z = 9.5
const NEAR_DOOR_Z = 3
const DOOR_ROW_X = 3.8
const HORIZONTAL_PADDING = 0.82

export function getHomeCameraZ(width: number, height: number, verticalFov: number) {
  if (width <= 0 || height <= 0) return DESKTOP_HOME_Z

  const aspect = width / height
  const halfVerticalFov = (verticalFov * Math.PI) / 360
  const halfHorizontalFov = Math.atan(Math.tan(halfVerticalFov) * aspect)
  const framedDistance = DOOR_ROW_X / (Math.tan(halfHorizontalFov) * HORIZONTAL_PADDING)

  return Math.max(DESKTOP_HOME_Z, NEAR_DOOR_Z + framedDistance)
}
