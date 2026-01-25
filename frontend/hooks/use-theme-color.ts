import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Theme = keyof typeof Colors; // 'light' | 'dark'
type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

type Props = {
  light?: string;
  dark?: string;
};

export function useThemeColor(props: Props, colorName: ColorName) {
  // Get the theme from the hook, default to 'light'
  const themeRaw = useColorScheme() ?? 'light';

  // Narrow theme to only valid keys
  const theme: Theme = themeRaw === 'dark' ? 'dark' : 'light';

  // Access the color safely from props
  const colorFromProps = theme === 'dark' ? props.dark : props.light;

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Safe indexing into Colors object
    const themeColors = Colors[theme];
    return Object.prototype.hasOwnProperty.call(themeColors, colorName)
      ? themeColors[colorName]
      : themeColors.text; // Fallback to a guaranteed color
  }
}
