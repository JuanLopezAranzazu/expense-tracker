import { createTheme, type MantineColorsTuple } from '@mantine/core';

const ink: MantineColorsTuple = [
  '#eef3fb',
  '#d9e3f3',
  '#b4c7e6',
  '#8aa8d6',
  '#658cc9',
  '#4a78c0',
  '#3a6cbb',
  '#2b5aa3',
  '#234e91',
  '#164281',
];

export const theme = createTheme({
  primaryColor: 'ink',
  colors: { ink },
  primaryShade: { light: 7, dark: 4 },
  fontFamily: "'Instrument Sans Variable', system-ui, -apple-system, 'Segoe UI', sans-serif",
  headings: {
    fontFamily: "'Instrument Sans Variable', system-ui, -apple-system, 'Segoe UI', sans-serif",
    fontWeight: '600',
  },
  defaultRadius: 'md',
  components: {
    Card: { defaultProps: { withBorder: true, padding: 'lg' } },
    Modal: { defaultProps: { centered: true, radius: 'md' } },
    Button: { defaultProps: { fw: 500 } },
  },
});
