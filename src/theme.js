import { createTheme } from '@mui/material/styles';
import { deepPurple, deepOrange, teal, red, blue } from '@mui/material/colors';

const calendarRootStyles = {
  zIndex: 100,
  background: '#fff',
  boxShadow: 'none',
};

const toggleInputRootStyles = (theme) => ({
  padding: '8px',
  border: '2px solid transparent',
  '&.Mui-focusVisible': {
    border: `2px solid ${theme.palette.primary.main}`,
  },
});

const appTheme = createTheme({
  palette: {
    primary: {
      main: '#d7a312',
      dark: '#a3750d',
      light: '#4F91A5',
      contrastText: '#fff',
      hover: 'rgba(215, 163, 18, 0.08)',
      selected: 'rgba(35, 117, 143, 0.12)',
      focus: 'rgba(35, 117, 143, 0.18)',
      focusVisible: 'rgba(35, 117, 143, 0.3)',
      outlineBorder: 'rgba(35, 117, 143, 0.5)',
    },
    secondary: {
      main: '#737c8c',
      dark: '#091B23',
      light: '#5C6E75',
      contrastText: '#fff',
    },
    error: {
      main: '#D32F2F',
      dark: '#C62828',
      light: '#EF5350',
      contrastText: '#fff',
      hover: 'rgba(211, 47, 47, 0.08)',
    },
    success: {
      main: '#2E7D32',
      dark: '#1B5E20',
      light: '#4CAF50',
      contrastText: '#fff',
      backgroundColor: '#EDF7ED',
    },
    warning: {
      main: '#EF6C00',
      dark: '#C25700',
      light: '#FFF4E5',
      contrastText: '#663C00',
    },
    info: {
      main: '#0288D1',
      dark: '#01579B',
      light: '#03A9F4',
      contrastText: '#fff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hover: 'rgba(0, 0, 0, 0.08)',
    },
    background: {
      default: '#fff',
      paper: '#fafafa',
      dark: '#ECEFF1',
      light: '#EEE',
      main: '#F5F5F5',
    },
    action: {
      active: 'rgba(0, 0, 0, 0.56)',
      hover: 'rgba(0, 0, 0, 0.08)',
      selected: 'rgba(0, 0, 0, 0.12)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
      focus: 'rgba(0, 0, 0, 0.18)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    common: {
      black: 'rgba(0, 0, 0, 0.87)',
      white: '#fff',
      neutral: {
        light: '#768085',
        main: '#334249',
        dark: 'rgba(255, 255, 255, 0.7)',
      },
    },
    customDeepPurple: {
      main: deepPurple[300],
      light: deepPurple[50],
      contrastText: '#fff',
    },
    customRed: {
      main: red[900],
      dark: red[600],
      light: red[50],
      contrastText: '#fff',
    },
    customBlue: {
      main: blue[900],
      dark: blue[600],
      light: blue[50],
      contrastText: '#fff',
    },
    customDeepOrange: {
      main: deepOrange[200],
      light: deepOrange[50],
      contrastText: '#fff',
    },
    customTeal: {
      main: teal[200],
      light: teal[50],
      contrastText: '#fff',
    },
  },
  typography: (palette) => ({
    fontFamily: 'Open Sans, sans-serif',
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    color: palette.text.primary,
    wordBreak: 'break-word',
    h1: {
      fontSize: 24,
      fontWeight: 600,
      wordBreak: 'break-word',
      '@media screen and (min-device-width: 768px) and (max-width: 1024px)': {
        fontSize: 24,
      },
      '@media screen and (min-device-width: 320px) and (max-width: 767px)': {
        fontSize: 20,
      },
    },
    h2: {
      fontSize: 18,
      fontWeight: 600,
      wordBreak: 'break-word',
      '@media screen and (min-device-width: 768px) and (max-width: 1024px)': {
        fontSize: 17,
      },
      '@media screen and (min-device-width: 320px) and (max-width: 767px)': {
        fontSize: 17,
      },
    },
    h3: {
      fontSize: 16,
      fontWeight: 400,
      wordBreak: 'break-word',
      '@media screen and (min-device-width: 768px) and (max-width: 1024px)': {
        fontSize: 15,
      },
      '@media screen and (min-device-width: 320px) and (max-width: 767px)': {
        fontSize: 15,
      },
    },
    h4: {
      fontSize: 16,
      fontWeight: 600,
      wordBreak: 'break-word',
      '@media screen and (min-device-width: 768px) and (max-width: 1024px)': {
        fontSize: 15,
      },
      '@media screen and (min-device-width: 320px) and (max-width: 767px)': {
        fontSize: 15,
      },
    },
    h5: {
      fontSize: 14,
      fontWeight: 600,
      wordBreak: 'break-word',
      '@media screen and (min-device-width: 768px) and (max-width: 1024px)': {
        fontSize: 14,
      },
      '@media screen and (min-device-width: 320px) and (max-width: 767px)': {
        fontSize: 14,
      },
    },
    h6: {
      fontSize: 12,
      fontWeight: 600,
      wordBreak: 'break-word',
      '@media screen and (min-device-width: 768px) and (max-width: 1024px)': {
        fontSize: 12,
      },
      '@media screen and (min-device-width: 320px) and (max-width: 767px)': {
        fontSize: 12,
      },
    },
    body1: {
      fontSize: 16,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 600,
      fontWeightBold: 700,
      color: palette.text.primary,
      wordBreak: 'break-word',
      '@media screen and (min-device-width: 768px) and (max-width: 1024px)': {
        fontSize: 16,
      },
      '@media screen and (min-device-width: 320px) and (max-width: 767px)': {
        fontSize: 14,
      },
    },
    body2: {
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 600,
      fontWeightBold: 700,
      wordBreak: 'break-word',
      color: 'rgba(0, 0, 0, 0.60)',
      '@media screen and (min-device-width: 768px) and (max-width: 1024px)': {
        fontSize: 14,
      },
      '@media screen and (min-device-width: 320px) and (max-width: 767px)': {
        fontSize: 14,
      },
    },
    caption: {
      fontSize: 12,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 600,
      fontWeightBold: 700,
      color: 'rgba(0, 0, 0, 0.60)',
      wordBreak: 'break-word',
    },
    subtitle1: {
      fontSize: 16,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 600,
      fontWeightBold: 700,
      wordBreak: 'break-word',
    },
    subtitle2: {
      fontSize: 13,
      fontWeight: 400,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 600,
      fontWeightBold: 700,
      wordBreak: 'break-word',
    },
    button: {
      fontSize: 16,
    },
    overline: {
      fontSize: 12,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 600,
      fontWeightBold: 700,
      wordBreak: 'break-word',
      color: 'rgba(0, 0, 0, 0.60)',
      letterSpacing: '1px',
    },
  }),
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          wordBreak: 'break-word',
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: '13px',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: '58px',
          height: '40px',
          overflow: 'visible',
        },
        thumb: ({ theme }) => ({
          width: '22px',
          height: '22px',
          border: `1px solid ${theme.palette.divider}`,
        }),
        track: {
          borderRadius: '32px',
          marginTop: '1px',
        },
        switchBase: {
          '&:hover': {
            backgroundColor: 'rgba(12, 38, 49, 0.30)',
          },
          '&.Mui-checked:hover': {
            backgroundColor: 'rgba(12, 38, 49, 0.30)',
          },
          '&.Mui-checked': {
            transform: 'translateX(16px)',
          },
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-standardSuccess': {
            background: 'rgba(50, 50, 50, 1)',
            '& .MuiAlert-icon': {
              display: 'none',
            },
            '& .MuiAlert-message': {
              color: '#fff',
            },
          },
          '& .MuiAlert-standardError': {
            background: 'rgba(211, 47, 47, 1)',
            '& .MuiAlert-icon': {
              color: '#fff',
            },
            '& .MuiAlert-message': {
              color: '#fff',
            },
          },
        },
      },
    },
    MuiTabPanel: {
      styleOverrides: {
        root: {
          padding: '8px',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          top: '93px',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          '@media screen and (min-device-width: 768px)': {
            minWidth: '600px',
          },
          '@media screen and (max-device-width: 767px)': {
            maxHeight: 'calc(100% - 0px)',
            borderRadius: '0px',
            margin: '0px',
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          background: '#f1f1f1',
          borderBottom: '1px solid #a6aab2',
          '@media screen and (max-device-width: 767px)': {
            padding: '16px 16px',
          },
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          '@media screen and (max-device-width: 767px)': {
            padding: '16px 16px',
          },
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px !important',
          '& > :not(style) ~ :not(style)': {
            marginLeft: '16px',
          },
          '@media screen and (max-device-width: 767px)': {
            padding: '12px 16px!important',
          },
        },
      },
    },
    MuiDataGrid: {
      defaultProps: {
        autoHeight: true,
        getRowHeight: () => 'auto',
        disableColumnResize: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: '#fff',
          color: theme.palette.text.primary,
          '--DataGrid-overlayHeight': '100%',
          '& .MuiDataGrid-overlayWrapperInner': {
            minHeight: '100px !important',
          },
          '& .MuiDataGrid-overlay': {
            height: '100% !important',
            minHeight: '100px !important',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          '& .MuiDataGrid-columnHeaders': {
            '& .MuiDataGrid-columnHeaderTitleContainerContent': {
              overflow: 'visible',
            },
          },
          '& .MuiDataGrid-withBorderColor': {
            borderColor: theme.palette.divider,
          },
          '& .MuiDataGrid-row': {
            backgroundColor: '#fff',
          },
          '& .MuiDataGrid-row:hover, & .MuiDataGrid-root .MuiDataGrid-row.Mui-hovered': {
            backgroundColor: theme.palette.primary.hover,
          },
          '& .MuiDataGrid-row.Mui-selected': {
            backgroundColor: 'rgba(35, 117, 143, 0.08)',
          },
          '& .MuiTablePagination-selectLabel': {
            fontWeight: 600,
          },
          '& .MuiTablePagination-displayedRows': {
            color: theme.palette.text.primary,
            fontWeight: 600,
          },
          '& .MuiTablePagination-actions .MuiButtonBase-root.MuiIconButton-root': {
            color: theme.palette.primary.main,
          },
          '& .MuiTablePagination-actions .MuiButtonBase-root.MuiIconButton-root.Mui-disabled': {
            color: theme.palette.action.disabled,
          },
          '& .MuiSelect-select.MuiInputBase-input': {
            minWidth: '35px !important',
            padding: '0px 10px 0px 0px !important',
            color: theme.palette.text.primary,
            textAlignLast: 'left !important',
            fontSize: '14px',
          },
          '& .MuiInputBase-root.MuiTablePagination-input': {
            marginRight: '22px !important',
          },
          '& .MuiTablePagination-actions': {
            marginLeft: '15px !important',
          },
          '& .MuiDataGrid-container--top [role="row"], & .MuiDataGrid-container--bottom [role="row"]':
            {
              background: 'transparent',
            },
          '& .MuiDataGrid-columnSeparator': {
            opacity: '1 !important',
          },
          '& .MuiDataGrid-columnHeader--last .MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          '& .MuiDataGrid-main': {
            minHeight: '100%',
          },
        }),
        footerContainer: {
          background: '#fff',
          borderRadius: '0 0 4px 4px',
          boxShadow:
            '0px 3px 5px -1px rgba(0, 0, 0, 0.20), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12)',
        },
        iconButtonContainer: {
          width: 'auto',
        },
        columnHeaders: {
          backgroundColor: '#ECEFF1',
        },
        columnHeader: {
          padding: '16px 12px',
          '&:not(.MuiDataGrid-columnHeader--sorted) .MuiDataGrid-sortIcon': {
            opacity: 1,
          },
          '&:focus': {
            outline: 'none',
          },
          '&:focus-within': {
            outline: 'none',
          },
        },
        cell: ({ theme }) => ({
          padding: '16px 12px',
          borderBottomColor: `${theme.palette.divider}!important`,
          wordBreak: 'break-word',
          '&:focus': {
            outline: 'none',
          },
          '&:focus-within': {
            outline: 'none',
          },
        }),
        panelWrapper: {
          borderRadius: '4px',
          boxShadow:
            '0px 5px 5px -3px rgba(0, 0, 0, 0.20), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiPickersPopper: {
      styleOverrides: {
        paper: {
          boxShadow:
            '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          ...calendarRootStyles,
        },
      },
    },
    MuiDateRangeCalendar: {
      styleOverrides: {
        root: {
          ...calendarRootStyles,
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: '14px',
          '&:hover ': {
            borderColor: 'transparent!important',
            background: theme.palette.primary.hover,
          },
          '&:not(.Mui-selected)': {
            borderColor: theme.palette.primary.main,
            borderWidth: '2px',
          },
          '&.MuiDateRangePickerDay-day:not(.Mui-selected)': {
            borderColor: theme.palette.primary.main,
            borderWidth: '2px',
          },
        }),
      },
    },
    MuiDateRangePickerDay: {
      styleOverrides: {
        root: {
          '&:first-of-type .MuiDateRangePickerDay-rangeIntervalDayPreview': {
            borderLeftColor: 'transparent',
          },
          '&:last-of-type .MuiDateRangePickerDay-rangeIntervalDayPreview': {
            borderRightColor: 'transparent',
          },
          '&.MuiDateRangePickerDay-outsideCurrentMonth.MuiDateRangePickerDay-hiddenDayFiller .MuiDateRangePickerDay-rangeIntervalDayPreview':
            {
              backgroundColor: 'transparent',
            },
          '&.MuiDateRangePickerDay-rangeIntervalDayHighlight button': {
            color: '#fff',
          },
          '&.MuiDateRangePickerDay-rangeIntervalDayHighlight.MuiDateRangePickerDay-outsideCurrentMonth.MuiDateRangePickerDay-hiddenDayFiller':
            {
              backgroundColor: 'transparent',
            },
        },
        rangeIntervalDayHighlight: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
        }),
        rangeIntervalDayPreview: ({ theme }) => ({
          borderColor: 'transparent',
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          background: theme.palette.primary.hover,
        }),
      },
    },
    MuiDayCalendar: {
      styleOverrides: {
        weekDayLabel: ({ theme }) => ({
          color: theme.palette.text.disabled,
          fontWeight: 600,
        }),
      },
    },
    MuiPickersArrowSwitcher: {
      styleOverrides: {
        root: {
          '& .MuiTypography-root': {
            fontWeight: 600,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#BDBDBD',
        },
      },
    },
    MuiMultiInputDateRangeField: {
      styleOverrides: {
        separator: {
          display: 'none',
        },
        root: {
          '& .MuiInputBase-root': {
            paddingRight: '0',
          },
        },
      },
    },
    MuiPickersOutlinedInput: {
      styleOverrides: {
        root: {
          // Only pad the real label span - the no-label notch renders a
          // <span class="notranslate"> holding a zero-width space, and padding that
          // widens the <legend>, cutting a small gap into the top border of every
          // field that uses an above-field label instead of a floating one.
          '& .MuiPickersOutlinedInput-notchedOutline legend > span:not(.notranslate)': {
            paddingLeft: '2px',
            paddingRight: '2px',
          },
          '@media screen and (min-device-width: 320px) and (max-device-width: 767px)': {
            '& .MuiPickersOutlinedInput-notchedOutline legend > span:not(.notranslate)': {
              paddingLeft: '4px',
              paddingRight: '4px',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          height: '26px',
          color: theme.palette.text.primary,
          fontWeight: '400',
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
          border: '1px solid #BDBDBD',
          ...(ownerState.variant === 'contained' &&
            ownerState.color === 'customDeepPurple' && {
              backgroundColor: theme.palette.customDeepPurple.light,
              border: '1px solid',
              borderColor: theme.palette.customDeepPurple.main,
            }),
          ...(ownerState.variant === 'contained' &&
            ownerState.color === 'customDeepOrange' && {
              backgroundColor: theme.palette.customDeepOrange.light,
              border: '1px solid',
              borderColor: theme.palette.customDeepOrange.main,
            }),
          ...(ownerState.variant === 'contained' &&
            ownerState.color === 'customTeal' && {
              backgroundColor: theme.palette.customTeal.light,
              border: '1px solid',
              borderColor: theme.palette.customTeal.main,
            }),
          ...(ownerState.variant === 'contained' &&
            ownerState.color === 'success' && {
              backgroundColor: '#EDF7ED',
              border: '1px solid rgba(46, 125, 50, 0.5)',
            }),
          ...(ownerState.variant === 'contained' &&
            ownerState.color === 'warning' && {
              backgroundColor: '#FFF4E5',
              border: '1px solid rgba(239, 108, 0, 0.5)',
            }),
          ...(ownerState.variant === 'contained' &&
            ownerState.color === 'error' && {
              backgroundColor: '#FDEDED',
              border: '1px solid rgba(211, 47, 47, 0.50)',
            }),
          ...(ownerState.variant === 'contained' &&
            ownerState.color === 'info' && {
              backgroundColor: '#fff',
              border: '1px solid #BDBDBD',
            }),
          ...(ownerState.variant === 'contained' &&
            ownerState.color === 'primary' && {
              backgroundColor: '#fff',
              border: `1px solid ${theme.palette.primary.main}`,
              color: theme.palette.primary.main,
            }),
        }),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '10px',
          backgroundColor: 'rgba(97, 97, 97, 97)',
          marginBottom: '8px!important',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        root: {},
        badge: {
          fontSize: '12px',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        scroller: {
          '& .Mui-selected': {
            background: 'transparent',
            borderRadius: '0px 0px 0 0',
          },
          '& .MuiTab-root': {
            marginTop: '2px',
            marginLeft: '2px',
            marginRight: '2px',
            marginBottom: '2px',
            minHeight: 'auto',
            '@media screen and (min-device-width: 768px) and (max-device-width: 1024px)': {
              fontSize: 14,
            },
            '@media screen and (min-device-width: 320px) and (max-device-width: 767px)': {
              fontSize: 13,
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          maxWidth: '100%',
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        root: {},
        labelContainer: ({ theme }) => ({
          '& .MuiTypography-caption': {
            color: theme.palette.text.primary,
            fontWeight: 600,
          },
        }),
        label: {
          '&.Mui-active': {
            fontWeight: 600,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {},
        input: ({ theme }) => ({
          fontSize: 14,
          color: theme.palette.text.primary,
          fontWeight: 400,
          '@media screen and (min-device-width: 320px) and (max-device-width: 767px)': {
            fontSize: 16,
          },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: 16,
          color: 'rgba(0, 0, 0, 0.60)',
          fontWeight: 400,
          backgroundColor: 'transparent',
          borderRadius: 4,
          paddingRight: '0',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: `${theme.palette.primary.main} !important`,
            borderWidth: '2px !important',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#000',
          },
          '&.Mui-focused': {
            borderColor: theme.palette.primary.main,
            boxShadow: 'none',
          },
          '&:hover': {
            borderColor: '#000!important',
            boxShadow: 'none',
          },
          '&.Mui-error': {
            borderColor: theme.palette.error.main,
          },
          // Only pad the real label span - the no-label notch renders a
          // <span class="notranslate"> holding a zero-width space, and padding that
          // widens the <legend>, cutting a small gap into the top border of every
          // field that uses an above-field label instead of a floating one.
          '& .MuiOutlinedInput-notchedOutline legend > span:not(.notranslate)': {
            paddingLeft: '2px',
            paddingRight: '2px',
          },
          '@media screen and (min-device-width: 320px) and (max-device-width: 767px)': {
            '& .MuiOutlinedInput-notchedOutline legend > span:not(.notranslate)': {
              paddingLeft: '4px',
              paddingRight: '4px',
            },
          },
        }),
        input: {
          '&::placeholder': {
            color: 'rgba(0, 0, 0, 0.60)',
            opacity: '1',
          },
        },
        inputMultiline: {
          borderRadius: 4,
          padding: 10,
        },
        multiline: {
          padding: 0,
        },
        notchedOutline: {
          borderColor: 'rgba(0, 0, 0, 0.23)',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: `${theme.palette.text.primary} !important`,
          fontSize: '14px!important',
          fontWeight: '600!important',
          marginBottom: '0px!important',
        }),
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiFormLabel-root': {
            paddingLeft: '0px',
            paddingRight: '0px',
            backgroundColor: 'transparent',
            fontSize: '14px!important',
            color: 'rgba(0, 0, 0, 0.60)!important',
            fontWeight: '400!important',
          },
          '& .MuiInputLabel-shrink': {
            background: 'transparent!important',
          },
          '& .Mui-focused': {
            color: `${theme.palette.primary.main}!important`,
          },
          '& .Mui-error': {
            color: `${theme.palette.error.main} !important`,
          },
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&:hover': {
            backgroundColor: theme.palette.primary.hover,
          },
        }),
      },
    },
    MuiPopover: {
      styleOverrides: {
        root: {},
        paper: {
          background: '#fff',
          border: '1px solid #0000001F',
          boxShadow:
            '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        fontSizeSmall: {
          fontSize: '20px',
        },
        fontSizeMedium: {
          fontSize: '24px',
        },
        fontSizeLarge: {
          fontSize: '32px',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiAutocomplete-tag': {
            backgroundColor: theme.palette.action.selected,
            border: 'none',
            '& .MuiChip-deleteIcon': {
              color: 'rgba(0, 0, 0, 0.56)',
              opacity: '0.9',
              '&:hover': {
                color: 'rgba(0, 0, 0, 0.56)',
                opacity: '0.9',
              },
            },
          },
        }),
        groupLabel: {
          backgroundColor: '#fff',
          textTransform: 'capitalize',
          fontSize: '12px',
          lineHeight: '32px',
        },
        groupUl: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.divider}`,
          paddingBottom: '10px',
          marginBottom: '10px',
          '& .MuiAutocomplete-option': {
            paddingLeft: '16px!important',
          },
        }),
        listbox: ({ theme }) => ({
          fontSize: '14px',
          background: '#fff',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '4px',
          padding: 0,
        }),
        noOptions: {
          paddingTop: '0px',
          paddingBottom: '0px',
        },
        option: ({ theme }) => ({
          '&:hover': {
            backgroundColor: `${theme.palette.primary.hover} !important`,
          },
          '&$checked': {
            backgroundColor: `${theme.palette.primary.hover} !important`,
          },
          '&[data-focus="true"]': {
            backgroundColor: `${theme.palette.primary.hover} !important`,
          },
          '&[aria-selected="true"]': {
            backgroundColor: `${theme.palette.primary.hover} !important`,
          },
        }),
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          fontSize: 16,
          color: 'rgba(0, 0, 0, 0.60)',
          marginBottom: '8px',
          fontWeight: '400',
          '&.MuiInputLabel-shrink': {
            maxWidth: '100%',
            transform: 'translate(14px, -9px) scale(0.75)',
            background: '#fff',
          },
          '@media screen and (min-device-width: 320px) and (max-device-width: 767px)': {
            fontSize: 14,
            '&.MuiInputLabel-shrink': {
              background: '#fff !important',
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({
          marginTop: '10px',
          marginBottom: '10px',
          borderBottom: `1px solid ${theme.palette.divider}`,
          height: 'auto',
          background: 'none',
        }),
      },
    },
    MuiStack: {
      styleOverrides: {
        root: {
          '& .MuiButtonBase-root': {
            margin: '0',
          },
          '& .MuiTextField-root': {
            minWidth: 'auto !important',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontFamily: 'Open Sans, sans-serif',
          cursor: 'pointer',
          '&:hover': {
            color: '#0C2631',
          },
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: 'true',
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: ({ theme }) => toggleInputRootStyles(theme),
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: ({ theme }) => toggleInputRootStyles(theme),
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          fontSize: 16,
          fontWeight: 400,
          fontFamily: 'Open Sans, sans-serif',
          '&.Mui-focusVisible': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        color: 'primary',
      },
      text: {
        textTransform: 'uppercase',
        fontWeight: 600,
        fontSize: '0.875rem',
        color: '#000',
      },
      styleOverrides: {
        sizeLarge: {
          fontSize: '15px',
          padding: '8px 11px',
        },
        sizeMedium: {
          fontSize: '14px',
          padding: '5px 11px',
        },
        sizeSmall: {
          fontSize: '13px',
          padding: '4px 10px',
        },
        root: ({ ownerState, theme }) => ({
          textTransform: 'uppercase',
          fontWeight: '600',
          borderRadius: '4',
          color: '#fff',
          letterSpacing: '0.4px',
          '@media screen and (min-device-width: 768px) and (max-device-width: 1024px)': {
            fontSize: 13,
          },
          '@media screen and (min-device-width: 320px) and (max-device-width: 767px)': {
            fontSize: 13,
          },
          ...(ownerState.variant === 'contained' &&
            ownerState.color === 'primary' && {
              backgroundColor: theme.palette.primary.main,
              boxShadow:
                '0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)',
              color: '#fff',
              border: `1px solid ${theme.palette.primary.main}`,
              textTransform: 'uppercase',
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
                boxShadow:
                  '0px 2px 4px -1px rgba(0, 0, 0, 0.20), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
                border: `1px solid ${theme.palette.primary.main}`,
                color: '#fff',
              },
            }),
          ...(ownerState.variant === 'contained' &&
            ownerState.color === 'secondary' && {
              backgroundColor: theme.palette.secondary.main,
              boxShadow:
                '0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)',
              color: '#fff',
              border: `1px solid ${theme.palette.secondary.main}`,
              textTransform: 'uppercase',
              '&:hover': {
                backgroundColor: theme.palette.secondary.main,
                boxShadow:
                  '0px 2px 4px -1px rgba(0, 0, 0, 0.20), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
                border: `1px solid ${theme.palette.secondary.main}`,
                color: '#fff',
              },
            }),
          ...(ownerState.variant === 'outlined' &&
            ownerState.color === 'primary' && {
              backgroundColor: 'transparent',
              boxShadow: 'none',
              color: theme.palette.primary.main,
              border: `1px solid ${theme.palette.primary.main}`,
              textTransform: 'uppercase',
              '&:hover': {
                backgroundColor: theme.palette.primary.hover,
                boxShadow: 'none',
                border: `1px solid ${theme.palette.primary.main}`,
                color: theme.palette.primary.main,
              },
              '&.Mui-disabled': {
                backgroundColor: '#fff',
                color: theme.palette.action.disabled,
                border: `1px solid ${theme.palette.divider}`,
              },
            }),
          ...(ownerState.variant === 'outlined' &&
            ownerState.color === 'secondary' && {
              backgroundColor: '#fff',
              boxShadow: 'none',
              color: '#0C2631',
              border: '1px solid rgba(12, 38, 49, 0.50)',
              textTransform: 'uppercase',
              '&:hover': {
                backgroundColor: theme.palette.primary.hover,
                boxShadow: 'none',
                border: '1px solid rgba(12, 38, 49, 0.50)',
                color: '#0C2631',
              },
              '&.Mui-disabled': {
                backgroundColor: '#fff',
                color: theme.palette.action.disabled,
                border: `1px solid ${theme.palette.divider}`,
              },
            }),
          ...(ownerState.variant === 'outlined' &&
            ownerState.color === 'error' && {
              backgroundColor: '#fff',
              boxShadow: 'none',
              color: theme.palette.error.main,
              border: '1px solid rgba(211, 47, 47, 0.50)',
              textTransform: 'uppercase',
            }),
          ...(ownerState.variant === 'outlined' &&
            ownerState.color === 'info' && {
              backgroundColor: '#fff',
              boxShadow: 'none',
              color: 'rgba(0, 0, 0, 0.60)',
              border: '1px solid #E0E0E0',
              textTransform: 'capitalize',
            }),
          ...(ownerState.variant === 'text' &&
            ownerState.color === 'primary' && {
              backgroundColor: 'transparent',
              boxShadow: 'none',
              color: theme.palette.text.primary,
              border: 'none',
              textTransform: 'uppercase',
              fontWeight: '600',
            }),
          ...(ownerState.variant === 'text' &&
            ownerState.color === 'secondary' && {
              backgroundColor: 'transparent',
              boxShadow: 'none',
              color: theme.palette.primary.main,
              border: 'none',
              textTransform: 'uppercase',
              fontWeight: '600',
            }),
          ...(ownerState.variant === 'text' &&
            ownerState.color === 'error' && {
              backgroundColor: 'transparent',
              boxShadow: 'none',
              color: theme.palette.error.main,
              border: 'none',
              textTransform: 'capitalize',
              fontWeight: '600',
            }),
          '&.MuiButton-containedPrimary, &.MuiButton-containedSecondary': {
            '&.Mui-disabled': {
              backgroundColor: theme.palette.action.disabledBackground,
              color: theme.palette.action.disabled,
              borderColor: 'transparent',
            },
          },
          '&.MuiButton-outlinedSecondary': {
            '&:hover': {
              backgroundColor: theme.palette.primary.hover,
              boxShadow: 'none',
              borderColor: 'rgba(12, 38, 49, 0.50)',
              color: '#0C2631',
            },
          },
          '&.MuiButton-outlinedError': {
            '&:hover': {
              borderColor: 'rgba(211, 47, 47, 0.50)',
            },
          },
          '&.MuiButton-textPrimary, &.MuiButton-textSecondary': {
            '&:hover': {
              backgroundColor: `${theme.palette.primary.hover} !important`,
              boxShadow: 'none !important',
              border: 'none !important',
              color: `${theme.palette.primary.main} !important`,
            },
          },
          '&.MuiButton-textError': {
            '&:hover': {
              backgroundColor: 'rgba(211, 47, 47, 0.04) !important',
              boxShadow: 'none !important',
              border: 'none !important',
              color: `${theme.palette.error.main} !important`,
            },
          },
          '&.MuiButton-outlinedInfo': {
            '&:hover': {
              color: `${theme.palette.primary.main} !important`,
            },
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          boxShadow: 'none',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 1025,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default appTheme;
