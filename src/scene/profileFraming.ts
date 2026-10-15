import { Matrix4, PerspectiveCamera, Quaternion, Vector3 } from 'three'
import { getHomeCameraZ } from './cameraFraming'

export function getProfileFraming(width: number, height: number, narrow: boolean) {
  const fov = narrow ? 52 : 40
  const halfFov = Math.tan(fov * Math.PI / 360)
  const distance = Math.max(9, 9 * height / width)
  const name = new Vector3(0, 2.9, -13)
  let headingScreenY = 0.23

  if (narrow) {
    // Anchor the mobile heading above the doors at its original screen position.
    // The camera and heading share this point throughout the approach and return.
    const home = new PerspectiveCamera(fov, width / height, 0.1, 100)
    home.position.set(0, 3.15, getHomeCameraZ(width, height, fov))
    home.lookAt(0, 2.5, -6)
    home.updateMatrixWorld()
    const compact = width <= 640 && height <= 700
    headingScreenY = (compact ? 0.15 : 0.19) + (compact ? 16.5 : 20.9) / height
    const ray = new Vector3(0, 1 - 2 * headingScreenY, 0.5).unproject(home).sub(home.position).normalize()
    name.copy(home.position).addScaledVector(ray, (-22 - home.position.z) / ray.z)
  }

  const look = new Vector3(0, name.y - distance * halfFov * (1 - 2 * headingScreenY), name.z)
  const end = new Vector3(0, narrow ? look.y : Math.max(0.9, look.y), name.z + distance)
  return { name, look, end, headingScreenY }
}

const aim = new Matrix4()
const up = new Vector3(0, 1, 0)
const pitchAxis = new Vector3(1, 0, 0)
const pitch = new Quaternion()

export function aimMobileProfile(position: Vector3, framing: ReturnType<typeof getProfileFraming>, rotation: Quaternion) {
  // Solve orientation from the current position instead of damping it separately.
  // This keeps the name at the same screen height in both directions.
  aim.lookAt(position, framing.name, up)
  const offset = Math.atan((1 - 2 * framing.headingScreenY) * Math.tan(52 * Math.PI / 360))
  return rotation.setFromRotationMatrix(aim).multiply(pitch.setFromAxisAngle(pitchAxis, -offset))
}
