import Svg, { Path } from 'react-native-svg'
import { colors } from '../theme/mobile-theme'

type Props = {
  size?: number
  color?: string
}

export function OrcaLogo({ size = 24, color = colors.textPrimary }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 128 128">
      <Path
        fill={color}
        d="M18 10h92L96 29H78v22l20 13-20 13v22h18l14 19H18l14-19h18V29H32L18 10Zm47 38v32l26-16-26-16Z"
      />
    </Svg>
  )
}
