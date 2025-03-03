import { createTheme, GlobalStyles } from '@mui/material';
// types for tab augmentation
import '@mui/lab/themeAugmentation';

interface NewTypographyVariants {
  /** Description text with links to article and UCI rankings */
  description?: React.CSSProperties;
  /** Number sign in the card header */
  rankingPound?: React.CSSProperties;
  /** Rank number in the card header */
  rankingNumber?: React.CSSProperties;
  /** Number of points in the card header */
  rankingPointsCount?: React.CSSProperties;
  /** "points" text in the card header */
  rankingPointsText?: React.CSSProperties;
  /** Team owner name in card header */
  teamOwner?: React.CSSProperties;
  /** Tiny text like links in table */
  tiny?: React.CSSProperties;
}

type UnusedTypographyVariants =
  | 'h2'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'overline'
  | 'caption'
  | 'subtitle1'
  | 'subtitle2';

declare module '@mui/material/styles' {
  interface TypographyVariantsOptions extends NewTypographyVariants {}
  interface TypographyVariants extends Required<NewTypographyVariants> {}
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides
    extends Record<UnusedTypographyVariants, false>,
      Record<keyof NewTypographyVariants, true> {}
}

/** Escape orange */
const primaryMain = '#ff6f42';
/** Darker orange (ok contrast on white) */
const primaryDark = '#c15432';

const fontWeights = {
  regular: 400,
  semibold: 600,
  bold: 700,
};

// xs: 0px
// sm: 600px
// md: 900px
// lg: 1200px
// xl: 1536px

/** Page padding on XS; other small spaces */
const spacingXS = 2;
/** Page side gutters >= S */
const spacingMainGutter = 3;
/** Spacing within page content (and above/below) >= S */
const spacingMain = 4;

export const spacing = {
  /** Page outer padding */
  pagePadding: { xs: spacingXS, main: [spacingMain, spacingMainGutter] as const },
  /** General spacing within page content */
  general: { xs: spacingXS, sm: spacingMain },
  teamCard: {
    vertical: spacingXS,
    headerHorizontal: { xs: 2.5, sm: 3 },
    // there's also a stack for the ranking, with design props defined inline
    rankingVertical: '3px',
  },
};

/** Ranking numeral size in rem */
export const rankingNumberSize = 2.5;

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: primaryMain, dark: primaryDark },
  },
  components: {
    // rider dialog title
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
          paddingBottom: 0,
        },
      },
    },
    // Layout container
    MuiContainer: {
      defaultProps: {
        maxWidth: 'lg',
        disableGutters: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(spacing.pagePadding.xs),
          [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(...spacing.pagePadding.main),
          },
        }),
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: primaryDark,
          textDecorationColor: `rgba(193, 84, 50, 0.4)`,
        },
      },
    },
    MuiStack: {
      defaultProps: { useFlexGap: true },
    },
    // women/men tabs
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontWeight: fontWeights.bold,
          fontSize: '1.2rem',
          [theme.breakpoints.up('sm')]: { fontSize: '1.5rem' },
          padding: theme.spacing(1.5, 4),
        }),
      },
    },
    // competition tab content
    MuiTabPanel: {
      styleOverrides: {
        root: { padding: 0 },
      },
    },
    // team and rider tables
    MuiTable: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: { width: '100%' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({ padding: theme.spacing(0.5, 1) }),
        head: { fontWeight: fontWeights.bold },
      },
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica Neue, Helvetica, Arial, sans-serif',
    fontWeightRegular: fontWeights.regular,
    fontWeightMedium: fontWeights.regular,
    fontWeightBold: fontWeights.bold,
    // page title
    h1: {
      fontSize: '2rem', // xs; breakpoint overrides below
      lineHeight: '1.1',
      fontWeight: fontWeights.bold,
      textAlign: 'center',
      margin: 0, // xs-s; override below for md+
    },
    // team names on cards
    h3: {
      fontSize: '1.3rem',
      // fontSize: '1.2rem',
      lineHeight: '1.3',
      fontWeight: fontWeights.regular,
      margin: 0,
    },
    // tab labels, other buttons
    button: {
      textTransform: 'none',
    },
    // description text with links to article and UCI rankings
    description: {
      fontSize: '1.1rem',
      lineHeight: '1.6',
      textAlign: 'center',
    },
    // Number sign in the card header
    rankingPound: {
      display: 'inline-block',
      fontSize: '1.4rem', // was 1.5
      paddingRight: 2, // was 4
      paddingTop: 6,
      verticalAlign: 'top',
      // color: primaryMain,
    },
    // Rank number in the card header
    rankingNumber: {
      fontSize: `${rankingNumberSize}rem`,
      fontWeight: fontWeights.bold,
      // color: primaryMain,
    },
    // Number of points in the card header
    rankingPointsCount: {
      fontSize: '1.3rem',
    },
    // "points" text in the card header
    rankingPointsText: {
      fontSize: '1rem',
    },
    teamOwner: {
      fontWeight: fontWeights.semibold,
    },
    tiny: {
      fontSize: '0.7rem',
    },
  },
});

theme.typography.h1[theme.breakpoints.up('sm')] = {
  fontSize: '2.3rem',
};
theme.typography.h1[theme.breakpoints.up('md')] = {
  fontSize: '2.7rem',
  marginTop: theme.spacing(spacingMain),
};

// docs recommend creating this JSX element only once
// (leaving for reference after style was removed)
export const globalStyles = <GlobalStyles styles={{}} />;
