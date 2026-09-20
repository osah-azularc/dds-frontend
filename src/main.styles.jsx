/* eslint-disable */
import React from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
import { colors, textFieldClasses, useTheme } from '@mui/material';

const MainStyles = () => {
  const theme = useTheme();
  return (
    <GlobalStyles
      styles={{
        '.AvatarMedium': {
          width: '32px',
          height: '32px',
        },
        '.AvatarSmall': {
          width: '24px',
          height: '24px',
        },
        '.RadioGroupMultiLine': {
          '& .MuiFormControlLabel-root': {
            verticalAlign: 'top',
            alignItems: 'start',
            marginBottom: '8px',
            marginTop: '8px',
          },
          '& .MuiRadio-root': {
            // padding: '0px',
            marginTop: '-8px',
          },
        },
        '.MuiDialog-paperWidthSm': {
          maxWidth: '600px',
        },
        '.ButtonLoaderContainer': {
          position: 'relative',
          width: '100%',
        },
        '.ButtonLoader': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginTop: '-12px',
          marginLeft: '-12px',
        },
        '.MuiDataGrid-toolbarContainer .BillingPeriodCustomSearch': {
          '& .MuiFormControl-root.MuiTextField-root': {
            width: '100%',
          },
          '& .MuiInputBase-root.MuiInput-root::after': {
            display: 'none',
          },
          '& .MuiInputBase-root.MuiInput-root::before': {
            display: 'none',
          },
          '& .MuiInputBase-root.MuiInput-root': {
            border: '1px solid',
            borderColor: theme.palette.divider,
            borderRadius: '4px',
            minHeight: '40px',
            paddingLeft: '14px',
            paddingRight: '12px',
            '&:hover': {
              border: '1px solid',
              borderColor: theme.palette.text.primary,
            },
          },
          '& .Mui-focused': {
            border: '2px solid!important',
          },
        },
        '.MuiDataGrid-cellContent': {
          textAlign: 'left',
        },
        '.logoBox': {
          '@media screen and (max-width: 1180px)': {
            paddingLeft: '5%',
          },
        },
        '.MainLogo': {
          cursor: 'pointer',
        },
        '.infinite-scroll-component__outerdiv': {
          width: '100%',
        },
        '.SmallDatePicker': {
          '& .MuiOutlinedInput-input': {
            paddingTop: '0px!important',
            paddingBottom: '0px!important',
            height: '40px',
          },
          '& .MuiFormLabel-root.MuiInputLabel-root': {
            top: '-7px',
          },
        },
        '.NoFullHeight .MuiPaper-root.MuiDialog-paper': {
          height: 'auto',
          margin: '6px',
        },
        '.NoFullHeight .MuiPaper-root': {
          height: 'auto!important',
          margin: '6px',
          width: '100%',
        },
        '.hidden': {
          display: 'none',
        },
        '.AppLayoutNavClose .FormFooter': {
          width: '100%',
          /* [theme.breakpoints.down('sm')]: {
            width: 'calc(100% - 64px)',
          }, */
        },
        '.AppLayoutNavOpen .FormFooter': {
          width: 'calc(100% - 64px)',
        },
        '.DatePickerClearedBox': {
          '& .clearButton': {
            marginRight: '40px',
          },
        },
        '.material-symbols-outlined': {
          color: theme.palette.action.active,
        },
        '.TagsCounter': {
          whiteSpace: 'nowrap',
          marginLeft: '8px',
        },
        '.FullDialogRight .MuiPaper-root.MuiDialog-paper': {
          maxHeight: 'calc(100% - 0px)',
          minHeight: 'calc(100% - 0px)',
          borderRadius: '0',
          maxWidth: '600px',
          margin: '0px',
          minWidth: '50%',
        },
        '.FullDialogRight .MuiDialog-container': {
          justifyContent: 'right',
        },
        '.CommonLogArrow': {
          marginLeft: '16px',
          marginRight: '16px',
        },
        '.CommonLogLabel': {
          marginRight: '16px',
          fontWeight: theme.typography.fontWeightMedium,
        },
        '.CommonInnerLoopBox': {
          marginBottom: '24px',
          '&:last-child': {
            marginBottom: '0px',
          },
        },
        '.CommonLogInfo': {
          color: theme.palette.text.primary,
        },
        '.CommonLogInfoSecond': {
          fontWeight: theme.typography.fontWeightMedium,
          color: theme.palette.text.primary,
        },
        '.CommonLogInfoContainer': {
          marginTop: '16px',
        },
        '.CommonLogInfoContainer .FlexCenter': {
          flexWrap: 'wrap',
        },
        '.CommonLogName': {
          paddingRight: '4px',
          fontWeight: theme.typography.fontWeightMedium,
        },
        '.CommonLogTime': {
          marginBottom: '8px',
        },
        '.CommonLogCommentContent': {
          display: 'flex',
          minWidth: '26px',
          '& svg': {
            marginRight: '8px',
          },
        },
        '.CommonLogEntry': {
          padding: '16px 16px',
          border: '1px solid',
          borderColor: theme.palette.divider,
          backgroundColor: theme.palette.background.paper,
          maxWidth: '70%',
        },
        '.CommonLogInfoComment': {
          backgroundColor: theme.palette.background.default,
          border: '1px solid',
          borderColor: theme.palette.divider,
          padding: '8px 16px 8px 8px',
          borderRadius: '4px',
          marginTop: '16px',
        },
        '.NoMoreLog': {
          padding: '24px 32px',
          textAlign: 'center',
        },
        '.CommonLogLoopBox': {
          padding: '24px 16px 24px 32px',
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
        },
        '.PaddingLR': {
          paddingLeft: '16px',
          paddingRight: '16px',
        },
        '.CustomTabPanel': {
          padding: 0,
        },
        '.disable-cell, .disable-cell a, .disable-cell p': {
          color: theme.palette.text.secondary,
          textDecoration: 'none',
        },

        '.ActionIconButton.DisableButton': {
          display: 'none',
        },
        '.WrapperBoxSecond.MuiGrid-root>.MuiGrid-item': {
          maxWidth: '100%!important',
        },
        '.FilterAutocomplete': {
          '& .MuiAutocomplete-tag': {
            whiteSpace: 'nowrap',
          },
          '& .MuiOutlinedInput-root': {
            // overflow: 'hidden',
            flexWrap: 'nowrap',
            paddingRight: '100px !important',
            marginRight: '100px',
          },
          // '& .MuiAutocomplete-endAdornment': {
          //   right: '0px!important',
          //   backgroundColor: '#fff',
          //   height: '40px',
          //   paddingRight: '9px',
          // },
        },
        '.CustomList li': {
          paddingLeft: '0px',
        },
        '.ListDot': {
          fontSize: '6px',
          color: theme.palette.text.primary,
          marginRight: '8px',
        },
        '.NoWrap': {
          whiteSpace: 'normal!important',
        },
        '.CommonCustomCol': {
          textAlign: 'left',
        },
        '.FullWidth': {
          width: '100%',
        },
        // '.MaxFullWidth': {
        //   maxWidth: '100%!important',
        // },
        '.AutocompleteCheckbox': {
          padding: '0px',
          marginRight: '8px',
        },
        '.AutocompleteCategory .MuiAutocomplete-listbox .MuiAutocomplete-option[aria-disabled="true"]':
          {
            opacity: '1!important',
            borderBottom: '1px solid',
            borderColor: theme.palette.divider,
          },
        '.CustomTableGridRole div.CustomTableGridCell:nth-of-type(2)': {
          justifyContent: 'center',
          textAlign: 'center',
        },
        '.CustomSwitchCheck': {
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: '#1C5F73',
          padding: '2px',
          color: theme.palette.common.white,
        },
        '.CustomTableGrid': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          alignSelf: 'stretch',
          borderRadius: '4px',
          border: '1px solid',
          borderColor: theme.palette.divider,
          backgroundColor: theme.palette.common.white,
        },
        '.CustomTableGridHeader': {
          display: 'flex',
          padding: '8px 0px',
          alignItems: 'flex-start',
          alignSelf: 'stretch',
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
          background: 'rgba(207, 216, 220, 1)',
        },
        '.DisabledText': {
          color: theme.palette.text.disabled,
          fontWeight: theme.typography.fontWeightMedium,
          marginLeft: '4px',
        },
        '.EnabledText': {
          color: theme.palette.primary.main,
          fontWeight: theme.typography.fontWeightMedium,
          marginLeft: '4px',
        },
        '.CustomTableGridBody': {
          width: '100%',
        },
        '.CustomTableGridBodyRow': {
          display: 'flex',
          alignItems: 'center',
          alignSelf: 'stretch',
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
        },
        '.CustomTableGridCell': {
          display: 'flex',
          padding: '16px 10px 16px 10px',
          alignItems: 'center',
          flex: '1 0 0',
          '& .MuiFormControlLabel-root': {
            marginRight: '0px',
          },
        },
        '.CustomTableGridHeader .MuiTypography-root': {
          color: theme.palette.text.primary,
          fontWeight: theme.typography.fontWeightMedium,
        },
        '.PermissionsHeading': {
          color: theme.palette.text.primary,
          fontWeight: theme.typography.fontWeightMedium,
          marginRight: '16px',
        },
        '.PermissionsWarning': {
          color: theme.palette.warning.dark,
          fontWeight: theme.typography.fontWeightMedium,
          marginLeft: '4px',
        },
        '.PermissionsInfo': {
          maxWidth: '80%',
          whiteSpace: 'normal',
          marginTop: '8px',
        },
        '.InputTypeTextarea textarea.MuiInputBase-inputMultiline': {
          height: '23px!important',
          overflow: 'auto!important',
          maxHeight: '23px!important',
        },
        '.AutocompleteCustomStartIcon.AutocompleteCheck': {
          '& .OptionCustomIcon': {
            marginRight: '8px',
            '& svg': {
              opacity: '1',
              position: 'relative',
              right: 'auto',
            },
          },
        },
        '.CustomAutopopulateContent': {
          position: 'relative',
          paddingLeft: '32px',
        },
        '.CustomAutopopulateContentBox': {
          position: 'relative',
          // paddingLeft: '12px',
        },
        '.LocationIconBox': {
          position: 'absolute',
          left: '0px',
          top: '50%',
          transform: 'translate(0px, -50%)',
          fontSize: '22px',
        },
        '.AddCustomAutopopulate': {
          '& li li': {
            cursor: 'pointer',
            padding: '6px 16px',
            '&:hover': {
              backgroundColor: theme.palette.primary.selected,
            },
            '& .CustomCheckAutopopulate': {
              opacity: '0',
              position: 'absolute',
              right: '16px',
              colors: theme.palette.primary.main,
            },
            '&:hover .CustomCheckAutopopulate, &[data-focus="true"] .CustomCheckAutopopulate, &[aria-selected="true"] .CustomCheckAutopopulate, &:focus .CustomCheckAutopopulate':
              {
                opacity: '1',
                colors: theme.palette.primary.main,
              },
          },
        },
        '.MuiAutocomplete-popper .MuiAutocomplete-listbox': {
          '& li': {
            '& svg.CustomCheckIcon': {
              opacity: '0',
              position: 'absolute',
              right: '16px',
              colors: theme.palette.primary.main,
            },
            '&:hover svg.CustomCheckIcon, &[data-focus="true"] svg.CustomCheckIcon, &[aria-selected="true"] svg.CustomCheckIcon, &:focus svg.CustomCheckIcon':
              {
                opacity: '1',
                colors: theme.palette.primary.main,
              },
          },
        },
        '.AutocompleteCheck': {
          '& .selected': {
            cursor: 'pointer',
            backgroundColor: theme.palette.primary.selected,

            '& svg': {
              opacity: '0',
              position: 'absolute',
              right: '16px',
            },
            '&:hover svg, &[data-focus="true"] svg, &[aria-selected="true"] svg, &:focus svg': {
              opacity: '1',
            },
          },
          '& li': {
            paddingRight: '40px!important',
            cursor: 'pointer',
            padding: '6px 16px',
            '&:hover': {
              backgroundColor: theme.palette.primary.selected,
            },
            '& svg': {
              opacity: '0',
              position: 'absolute',
              right: '16px',
              colors: theme.palette.primary.main,
            },
            '&:hover svg, &[data-focus="true"] svg, &[aria-selected="true"] svg, &:focus svg': {
              opacity: '1',
              colors: theme.palette.primary.main,
            },
          },
        },
        '.TableFormat': {
          maxHeight: '300px',
          overflowX: 'auto',
        },
        '.RowLoop': {
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          width: '100%',
          justifyContent: 'space-between',
          marginBottom: '16px',
        },
        '.MuiAutocomplete-listbox li:last-child .MuiAutocomplete-groupUl': {
          border: 'none',
          paddingBottom: '0px',
          marginBottom: '0px',
        },
        '.RowLoop > *': {
          flex: '1',
        },
        '.NoSortArrow .MuiDataGrid-sortIcon': {
          display: 'none',
        },
        '.CustomTab .MuiTabPanel-root': {
          backgroundColor: theme.palette.background.dark,
        },
        '.CustomTab .MuiTabs-root': {
          paddingLeft: '16px',
          paddingRight: '16px',
          backgroundColor: theme.palette.background.default,
        },
        '.FixedCustomTab .FixedCustomTabHeader': {
          position: 'sticky',
          top: '64px',
          zIndex: '99',
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
        },
        '.FixedCustomHeader': {
          position: 'fixed',
          top: '0px',
          zIndex: '99',
          transition: 'top 0.2s ease-in-out',
        },
        '.FixedCustomHeader.scrolled': {
          top: '64px',
        },
        '.AppLayoutNavOpen .FixedCustomHeader': {
          width: 'calc(100% - 240px)',
        },
        '.AppLayoutNavClose .FixedCustomHeader': {
          width: 'calc(100% - 65px)',
        },
        '.BreadcrumbsFirstSequence': {
          whiteSpace: 'nowrap',
          color: theme.palette.text.secondary,
          '&:hover': {
            color: theme.palette.text.secondary,
          },
          '& .MuiTypography-root': {
            color: theme.palette.text.secondary,
          },
        },
        '.BreadcrumbsIcon': {
          marginRight: '8px',
          minWidth: '16px',
          maxWidth: '16px',
          height: '16px',
          // marginTop: '4px',
        },

        '.HeadingBox .MuiBreadcrumbs-ol .MuiBreadcrumbs-li .MuiTypography-root, .MuiBreadcrumbs-separator':
          {
            lineHeight: '17px',
          },
        '.HeadingBox .MuiBreadcrumbs-ol': {
          flexWrap: 'nowrap',
          alignItems: 'flex-start',
          '& .MuiBreadcrumbs-li .FlexCenter': {
            alignItems: 'flex-start',
          },
          '& .MuiBreadcrumbs-li': {
            // wordBreak: 'break-word',
          },
        },
        '.OverlineHeading': {
          marginBottom: '8px',
        },
        '.MuiDataGrid-panel .MuiPaper-root': {
          '& .MuiDataGrid-panelHeader': {
            display: 'none',
          },
          '& .MuiDataGrid-panelContent': {
            '& .MuiDataGrid-columnsPanel': {
              padding: '0px',
              '& .MuiDataGrid-columnsPanelRow': {
                minHeight: '38px',
                '&:hover': {
                  backgroundColor: theme.palette.primary.hover,
                },
                '& .MuiFormControlLabel-root': {
                  paddingLeft: '0px',
                  margin: '0px',
                  width: '100%',
                },
              },
            },
          },
        },
        // '.MuiDateRangeCalendar-root': {
        //   '& div:nth-of-type(1)': {
        //     zIndex: '0!important',
        //   },
        //   '& .MuiDateRangeCalendar-monthContainer': {
        //     backgroundColor: '#fff',
        //     zIndex: '10',
        //     borderRadius: '4px',
        //   },
        // },
        '& .MuiPickersLayout-shortcuts + .MuiPickersLayout-contentWrapper': {
          borderLeft: '1px solid',
          borderColor: theme.palette.divider,
        },
        '& .MuiPickersLayout-shortcuts': {
          backgroundColor: '#fff',
          zIndex: '10',
          borderRadius: '4px',
          minWidth: '242px',
          '& .MuiListItem-root': {
            padding: '0px',
          },
          '& .MuiChip-root': {
            border: '0px',
            borderRadius: '0px',
            padding: '20px 16px',
            width: '100%',
            justifyContent: 'left',
            backgroundColor: theme.palette.background.default,
            '&:hover': {
              backgroundColor: theme.palette.primary.hover,
            },
            '& .MuiChip-label': {
              padding: '0px',
            },
          },
        },
        '.ToolbarBox': {
          display: 'flex',
          alignItems: 'center',
          paddingBottom: '10px',
          paddingTop: '6px',
          '& .MuiDataGrid-toolbarContainer:first-of-type': {
            '& .MuiButtonBase-root.MuiButton-root:nth-of-type(2)': {
              // display: 'none',
            },
            '& .MuiButtonBase-root.MuiButton-root + .MuiBox-root': {
              display: 'none',
            },
          },
          '& .CustomGridToolbarContainer': {
            width: '100%',
          },
        },
        '.LinkContainer': {
          cursor: 'pointer',
          '& .MuiTypography-caption': {
            textTransform: 'uppercase',
          },
          '& .LocationAddress': {
            textTransform: 'none!important',
          },
        },
        '.CustomGridToolbarContainer .MuiButtonBase-root.MuiButton-root': {
          marginRight: '4px',
          marginLeft: '4px',
        },
        '.WrapperBox': {
          // height: '100%',
          minHeight: '100vh',
        },
        '.WrapperBoxSecond': {
          minHeight: 'calc(100% - 37px)',
          [theme.breakpoints.down('md')]: {
            minHeight: 'auto',
          },
        },
        '.CommonDatePicker': {
          '& .MuiStack-root': {
            paddingTop: '0px',
            overflow: 'visible',
          },
          '& .MuiStack-root .MuiTextField-root': { width: '100%' },
        },
        '.CustomFieldIcon': {
          position: 'relative',
          '& .MuiInputBase-input.MuiOutlinedInput-input': {
            paddingLeft: '40px!important',
          },
          '& .MuiFormControl-root.MuiTextField-root .MuiFormLabel-root': {
            transform: 'translate(40px, 14px) scale(1)',
          },
          '& .MuiFormControl-root.MuiTextField-root .MuiFormLabel-root.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)',
          },
        },
        '.CustomIconLeft': {
          position: 'absolute',
          zIndex: '99',
          top: '14px',
          left: '10px',
          transform: 'translate(0%, 0%)',
        },
        '.MuiButtonBase-root': {
          '&[aria-describedby="action-export"], &[aria-describedby="action-filter"]': {
            backgroundColor: theme.palette.primary.hover,
          },
        },
        '.ActionIconButton': {
          border: '2px solid',
          borderColor: 'transparent',
          color: theme.palette.action.active,
          fontSize: '10px',
          '&:hover': {
            borderColor: theme.palette.action.active,
            backgroundColor: theme.palette.action.focus,
          },
          '&[aria-describedby="action-popover"]': {
            borderColor: theme.palette.action.active,
            backgroundColor: theme.palette.action.focus,
          },
          '& svg': {
            fontSize: '22px',
          },
        },
        '.RadioGroupWrapper .MuiFormControlLabel-root': {
          width: 'calc(50% - 0px)',
        },
        '.RadioGroupWrapper .MuiFormControlLabel-root:last-child': {
          marginRight: '0px',
        },
        '.DialogActionsCorner': {
          justifyContent: 'space-between!important',
        },
        '.MainDrawer .MuiPaper-root.MuiDrawer-paper::-webkit-scrollbar': {
          width: '1px',
        },
        '.MainDrawer .MuiPaper-root.MuiDrawer-paper::-webkit-scrollbar-thumb': {
          background: theme.palette.common.neutral.main,
        },
        '.MainDrawer .MuiPaper-root.MuiDrawer-paper::-webkit-scrollbar-track': {
          backgroundColor: theme.palette.common.neutral.main,
        },
        '.MainDrawerOpen .MuiListItemIcon-root': {
          marginRight: '16px',
        },
        '.MainDrawerClose .MuiListItemIcon-root': {
          marginRight: '0px',
        },
        '.AppLayoutNavOpen': {
          maxWidth: 'calc(100% - 0px)',
          [theme.breakpoints.down('sm')]: {
            maxWidth: 'calc(100% - 0px)',
          },
        },
        '.AppLayoutNavClose': {
          maxWidth: 'calc(100%)',
        },
        '.ChipNoBorder, .NoBorder': {
          border: 'none!important',
        },
        // '.PopoverCustom .MuiPaper-root.MuiPopover-paper': {
        //   top: '68px!important',
        // },
        '.DatePickerIcon': {
          [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
          },
        },
        '.MuiStack-root.MuiMultiInputDateRangeField-root>:not(style)~:not(style)': {
          [theme.breakpoints.down('sm')]: {
            marginTop: '16px',
          },
        },
        '.DatePickerIcon .MuiTextField-root': {
          backgroundImage: `url(
            ${import(`./assets/images/calendar-today-outlined-icon.png`)}
          )`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center right 12px',
          [theme.breakpoints.down('sm')]: {
            marginLeft: '0px',
          },
        },
        '.BasicDatePickerIcon, .BasicDatePickerIconCustom': {
          width: '100%',
        },
        '.BasicDatePickerIcon .MuiInputAdornment-root .MuiButtonBase-root.MuiIconButton-edgeEnd svg, .BasicDatePickerIconCustom .MuiInputAdornment-root .MuiButtonBase-root.MuiIconButton-edgeEnd svg ':
          {
            visibility: 'hidden',
          },
        '.BasicDatePickerIcon .MuiInputAdornment-root .MuiButtonBase-root.MuiIconButton-edgeEnd': {
          backgroundImage: `url(
            ${import(`./assets/images/calendar-today-outlined-icon.png`)}
          )`,
          backgroundRepeat: 'no-repeat',
          // backgroundPosition: 'center center',
          backgroundPosition: 'center right 12px',
        },
        '.BasicDatePickerIconCustom .MuiInputBase-adornedEnd': {
          backgroundImage: `url(
            ${import(`./assets/images/calendar-today-outlined-icon.png`)}
          )`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center right 12px',
        },
        '.clearButton': {
          padding: '4px',
        },
        '.CustomIconButton:hover svg path': {
          fill: '#fff',
        },
        '.MainHeading': {
          fontWeight: theme.typography.fontWeightMedium,
        },
        '.SubHeading': {
          marginTop: '12px',
        },
        '.DialogHeading': {
          // fontWeight: theme.typography.fontWeightMedium,
          marginBottom: '5px',
        },
        '.DialogSubHeading': {
          fontWeight: theme.typography.fontWeightMedium,
        },
        '.DialogDivider': {
          marginTop: '0px',
          marginBottom: '0px',
        },
        '.HeadingBoxContainer': {
          // position: 'sticky',
          // top: '64px',
          // zIndex: '999',
          backgroundColor: '#fff',
        },

        // '.FixedTable': {
        //   position: 'sticky',
        //   top: '116px',
        // },
        // '.ChildrenBox': { height: 'calc(100% - 64px)' },
        '.ChildrenBox': {
          minHeight: '100%',
        },
        '.FilterBox': {
          padding: '12px 16px',
          width: '100%',
          // position: 'sticky',
          // top: 'calc(64px + 88px)',
          // zIndex: '999',
          // backgroundColor: '#fff',
        },
        '.HeadingBox': {
          padding: '16px 16px',
          // marginBottom: '16px',
          // borderBottom: '1px solid',
          // borderColor: theme.palette.divider,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '0px',
        },
        '.HeadingBox.BreadcrumbsBox': {
          padding: '16px 16px',
        },
        '.AlignStart': {
          alignItems: 'start',
        },
        '.HeadingBorder': {
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
        },
        '.FooterBorderTop': {
          borderTop: '1px solid',
          borderColor: theme.palette.divider,
        },
        '.CommonFullBorder': {
          border: '1px solid',
          borderColor: theme.palette.divider,
        },
        '.BgGreySecondary': {
          backgroundColor: theme.palette.background.paper,
          borderRadius: '4px',
        },
        '.BgGreyPrimary': {
          backgroundColor: theme.palette.background.dark,
        },
        '.FlexCenter': {
          display: 'flex',
          alignItems: 'center',
          // flexWrap: 'wrap',
        },
        '.FlexStart': {
          display: 'flex',
          alignItems: 'start',
        },
        '.FlexCenterCorner': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          // width: '100%',
        },
        '.GrayBorderPaper': {
          border: '2px solid',
          borderColor: theme.palette.divider,
          padding: '24px',
        },
        '.GrayBorderPaperWhiteBg': {
          border: '2px solid',
          borderColor: theme.palette.divider,
          padding: '40px',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          backgroundColor: theme.palette.background.paper,
          borderRadius: '4px',
        },
        '.BackLinkBox': {
          backgroundColor: theme.palette.background.default,
        },
        '.BackLink': {
          cursor: 'pointer',
        },
        '.HidePagination': {
          '& .MuiDataGrid-footerContainer': {
            display: 'none',
          },
        },
        '.MuiDataGrid-toolbarContainer .MuiButtonBase-root.MuiButton-root.MuiButton-sizeMedium': {
          padding: '8px 11px',
          fontSize: '15px',
        },
        '.MuiDataGrid-toolbarContainer .MuiButtonBase-root.MuiButton-root.MuiButton-sizeSmall': {
          padding: '8px 11px',
          fontSize: '15px',
        },
        '.MuiDataGrid-toolbarContainer .MuiButtonBase-root.MuiButton-root': {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          color: theme.palette.primary.main,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: theme.palette.primary.hover,
          },
        },
        '.MuiDataGrid-panelHeader .MuiFormControl-root.MuiTextField-root': {
          display: 'none',
        },
        '.MuiDataGrid-menu .MuiPaper-root': {
          borderRadius: '4px',
          boxShadow:
            '0px 5px 5px -3px rgba(0, 0, 0, 0.20), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12) !important',
        },
        '.DrawerHeaderBox': {
          minHeight: '100px',
          '@media (max-width: 1024px)': {
            minHeight: '90px',
          },
        },
        '.CommonActionListBox.CommonActionList .MuiButtonBase-root.MuiListItemButton-root': {
          maxHeight: '80px!important',
        },
        '.CommonActionList .MuiButtonBase-root.MuiListItemButton-root': {
          // borderBottom: '1px solid',
          // borderColor: theme.palette.divider,
          maxHeight: '36px',
          '&:hover': {
            backgroundColor: theme.palette.primary.hover,
          },
        },
        // '.CommonActionList .MuiButtonBase-root.MuiListItemButton-root:last-child': {
        //   borderBottom: 'none',
        // },
        '.CommonActionList .MuiListItem-root': {
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
          paddingLeft: '0px',
          paddingRight: '0px',
        },
        '.CommonToolbarList .MuiListItem-root': {
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
          paddingLeft: '2px',
          paddingRight: '2px',
        },
        '.CommonSubToolbarList .MuiListItem-root': {
          paddingLeft: '2px',
          paddingRight: '2px',
        },
        '.CommonActionList .MuiListItem-root:last-child, .CommonToolbarList .MuiListItem-root:last-child':
          {
            borderBottom: 'none',
          },
        '.BottomFixed': {
          position: 'fixed',
          background: '#fff',
          bottom: 0,
          right: 0,
          width: '100%',
          zIndex: 1,
        },
        '@media screen and (min-device-width: 1200px)': {
          '.FixedTable .MuiDataGrid-virtualScrollerContent': {
            maxHeight: 'calc(100vh - 100px) !important',
            minHeight: 'calc(100vh - 100px) !important',
          },
          /* '.SmallFixedTable .MuiDataGrid-virtualScrollerContent': {
            maxHeight: '350px !important',
            minHeight: '350px !important',
          }, */
          '.TableContainer .MuiDataGrid-virtualScroller': {
            // maxHeight: 'calc(100% - 400px)',
            // overflow: 'visible',
          },
          '.TableContainer': {
            height: 'calc(100% - 200px)',
            position: 'sticky',
            top: '116px',
            // zIndex: '999',
            // height: '600px',
          },
          '.SmallTableContainer': {
            height: '350px',
            position: 'sticky',
            top: '116px',
            // zIndex: '999',
            // height: '600px',
          },
        },
        '@media screen and (max-width: 1199px)': {
          '.TableContainer': {
            height: '400px',
          },
          '.CommonLogEntry': {
            maxWidth: '100%',
          },
        },
        '@media screen and (min-device-width: 768px) and (max-width: 1019px)': {},
        '@media screen and (min-device-width: 320px) and (max-width: 1019px)': {},
        '@media screen and (min-device-width: 320px) and (max-width: 600px)': {},
        '@media screen and (min-device-width: 320px) and (max-width: 767px)': {
          '.AppLayoutNavClose .FixedCustomHeader': {
            width: 'calc(100% - 0px)',
          },
          '.CommonLogDate': {
            marginBottom: '16px',
          },
        },
      }}
    />
  );
};

export default MainStyles;
