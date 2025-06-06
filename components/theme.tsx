import { createTheme, GlobalStyles } from '@mui/material';
// https://mui.com/material-ui/customization/css-theme-variables/usage/#typescript
import type {} from '@mui/material/themeCssVarsAugmentation';
// types for Tabs augmentation
import type {} from '@mui/lab/themeAugmentation';

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
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TypographyVariantsOptions extends NewTypographyVariants {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TypographyVariants extends Required<NewTypographyVariants> {}
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides
    extends Record<UnusedTypographyVariants, false>,
      Record<keyof NewTypographyVariants, true> {}
}

// xs: 0px
// sm: 600px
// md: 900px
// lg: 1200px
// xl: 1536px

/**
 * Define the font family in a custom variable to prevent the long list from being
 * repeated several times in the generated CSS
 */
const fontVarName = '--draft-font';

/** Page padding on XS; other small spaces */
const spacingXS = 2;
/** Page side gutters >= S */
const spacingMainGutter = 3;
/** Spacing within page content (and above/below) >= S */
const spacingMain = 4;

const generalSpacing = { xs: spacingXS, sm: spacingMain };

export const spacing = {
  page: {
    /** Outer padding for XS */
    paddingXS: spacingXS,
    /** Outer padding for > XS */
    padding: [spacingMain, spacingMainGutter] as const,
    /** Spacing between heading and content */
    vertical: generalSpacing,
  },

  /** Spacing between competition description and team cards */
  competitionVertical: generalSpacing,

  /** Spacing between team card grid items */
  teamCardsGrid: generalSpacing,

  teamCard: {
    /** Spacing betwen header and elements */
    vertical: spacingXS,
    /** Spacing between ranking/points and team name */
    headerHorizontal: { xs: 2.5, sm: 3 },
    /** Spacing between ranking, points number, "points" (design props defined inline) */
    rankingVertical: '3px',
  },
};

/** Ranking numeral size in rem */
export const rankingNumberSize = 2.5;

/** Escape orange, #ff6f42 */
const primaryMain = 'rgb(255, 110, 66)';

export const theme = createTheme({
  // This makes the built pages bigger because MUI uses longer variable references everywhere
  // and defines a bunch of variables that are never used...but without it, dark mode detection
  // based on system preference doesn't see to work...
  // (see bottom for a list of the only vars that are used)
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: primaryMain,
          // slightly less dark than the default, but ok contrast on white
          dark: 'rgb(193, 84, 50)',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: primaryMain,
        },
      },
    },
  },
  components: {
    // Team card content
    MuiCardContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          // The default padding is 2spc other sides, 3spc bottom. Reducing it looks better.
          '&:last-child': { paddingBottom: theme.spacing(2.5) },
        }),
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
          padding: theme.spacing(spacing.page.paddingXS),
          [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(...spacing.page.padding),
          },
        }),
      },
    },
    // rider dialog title
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
          // The content has padding all around, so double padding after the title looks excessive
          paddingBottom: '0',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: ({ theme }) => [
          // Make tiny links more readable by moving the underline down
          { textUnderlineOffset: '2px' },
          // Ensure adequate text contrast for links in light mode
          theme.applyStyles('light', {
            color: theme.vars.palette.primary.dark,
          }),
          // The default dark mode underline color is too dark
          theme.applyStyles('dark', {
            textDecorationColor: `rgba(${theme.vars.palette.primary.mainChannel} / 0.6)`,
          }),
        ],
      },
    },
    MuiStack: {
      defaultProps: { useFlexGap: true },
    },
    // women/men tab buttons
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontWeight: typography.fontWeightBold,
          fontSize: '1.2rem',
          [theme.breakpoints.up('sm')]: { fontSize: '1.5rem' },
          padding: theme.spacing(1.5, 4),
        }),
      },
    },
    // competition tab content
    MuiTabPanel: {
      styleOverrides: {
        root: { padding: '0' },
      },
    },
    // team and rider tables
    MuiTable: {
      styleOverrides: {
        root: { width: '100%' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({ padding: theme.spacing(0.5, 1) }),
        head: ({ theme }) => ({ fontWeight: theme.typography.fontWeightBold }),
      },
    },
  },
  typography: {
    fontFamily: `var(${fontVarName})`,
    fontWeightLight: 400,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    // Typography variant styles are set separately below so they can access provided or generated
    // values from the theme
  },
});

const { typography } = theme;
// page title
typography.h1 = {
  fontSize: '2rem', // xs
  lineHeight: '1.1',
  fontWeight: typography.fontWeightBold,
  textAlign: 'center',
  margin: '0',
  [theme.breakpoints.up('sm')]: {
    fontSize: '2.3rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2.7rem',
    marginTop: theme.spacing(spacingMain),
  },
};
// team names on cards
typography.h3 = {
  fontSize: '1.3rem',
  lineHeight: '1.3',
  fontWeight: typography.fontWeightRegular,
  margin: '0',
};
// tab labels, other buttons
typography.button = {
  textTransform: 'none', // don't uppercase
};
// description text with links to article and UCI rankings
typography.description = {
  fontSize: '1.1rem',
  lineHeight: '1.6',
  textAlign: 'center',
};
// Number sign in the card header
typography.rankingPound = {
  display: 'inline-block',
  fontSize: '1.4rem', // was 1.5
  paddingRight: 2, // was 4
  paddingTop: 6,
  verticalAlign: 'top',
};
// Rank number in the card header
typography.rankingNumber = {
  fontSize: `${rankingNumberSize}rem`,
  fontWeight: typography.fontWeightBold,
};
// Number of points in the card header
typography.rankingPointsCount = {
  fontSize: '1.3rem',
};
// "points" text in the card header
typography.rankingPointsText = {
  fontSize: '1rem',
};
// Team owner name in card header
typography.teamOwner = {
  fontWeight: typography.fontWeightMedium,
};
typography.tiny = {
  fontSize: '0.7rem',
};

export const fontFamily = 'Inter, system-ui, Avenir, Helvetica Neue, Helvetica, Arial, sans-serif';

// docs recommend creating this JSX element only once
export const globalStyles = (
  <GlobalStyles
    styles={{
      ':root': {
        // Not sure if MUI provides a proper way of defining a custom variable, so do this
        [fontVarName]: fontFamily,
      },
    }}
  />
);

// The only used --mui-* vars, based on getting all the style elements and finding var() references:
// --mui-palette-action-active
// --mui-palette-action-activeChannel
// --mui-palette-action-disabled
// --mui-palette-action-hover
// --mui-palette-action-hoverOpacity
// --mui-palette-action-selectedOpacity
// --mui-palette-background-default
// --mui-palette-background-paper
// --mui-palette-common-white
// --mui-palette-error-main
// --mui-palette-grey-400
// --mui-palette-grey-500
// --mui-palette-primary-dark
// --mui-palette-primary-main
// --mui-palette-primary-mainChannel
// --mui-palette-success-light
// --mui-palette-TableCell-border
// --mui-palette-text-disabled
// --mui-palette-text-primary
// --mui-palette-text-secondary
// --mui-spacing
// --mui-zIndex-modal
