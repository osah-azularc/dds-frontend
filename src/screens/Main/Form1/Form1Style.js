import screenTabStyles from '../../../styles/shared/screenTabStyles';

const styles = (theme) => {
  const tabStyles = screenTabStyles(theme);

  return {
    HeaderSection: {
      p: 3,
      backgroundColor: '#fff',
      borderBottom: '1px solid #dfe3e8',
    },
    HeaderContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 1,
      [theme.breakpoints.down('md')]: {
        alignItems: 'flex-start',
        flexDirection: 'column',
      },
    },
    TabListContainer: {
      ...tabStyles.TabListContainer,
      justifyContent: 'flex-start',
      pl: 3,
    },
    // Reuses tabStyles.TabListContainer's colors/spacing, but that shared
    // style never sets display:flex itself (its only other user renders a
    // single TabList child, so justifyContent/alignItems had nothing to
    // act on) - set explicitly here so the actions box actually gets
    // pushed to the far right instead of just flowing after the tabs. Also
    // overrides its '& .MuiTabs-root' width:100% back to auto - with two
    // children instead of one, a full-width TabList leaves the actions box
    // no room on the same line, so it wraps to a second line and lands back
    // at the left edge instead of the right.
    DetailTabBar: {
      ...tabStyles.TabListContainer,
      display: 'flex',
      alignItems: 'stretch',
      pr: 3,
      flexWrap: 'wrap',
      rowGap: 1,
      minHeight: 64,
      '& .MuiTabs-root': {
        width: 'auto',
      },
    },
    DetailTabBarActions: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 2,
      flex: '1 1 auto',
      minWidth: 0,
      py: 1,
    },
    DetailTabBarMessage: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    },
    DetailTabBarMessageText: {
      color: '#fff',
    },
    ContentContainer: {
      backgroundColor: '#f1f1f1',
      alignItems: 'stretch',
    },
    LeftPanel: {
      p: 3,
    },
    RightPanel: {
      display: 'flex',
      minWidth: 0,
    },
    RightPanelContent: {
      p: 3,
      backgroundColor: '#fff',
      flexGrow: 1,
      minWidth: 0,
    },
    SectionTitle: {
      mb: 2.5,
    },
    SectionSpacing: {
      mt: 4,
    },
    FieldBackground: {
      '& .MuiOutlinedInput-root': { backgroundColor: '#fff' },
    },
    DocumentDataGrid: {
      width: '100%',
      minWidth: 0,
      overflow: 'hidden',
      border: '1px solid #dfe3e8',
      borderRadius: '4px',
      '--DataGrid-overlayHeight': '120px',
      '& .MuiDataGrid-columnHeaders': {
        backgroundColor: '#ECEFF1',
      },
      '& .MuiDataGrid-columnHeaderTitle': {
        fontWeight: 600,
      },
      '& .MuiDataGrid-cell': {
        display: 'flex',
        alignItems: 'center',
      },
      '& .MuiDataGrid-overlayWrapper, & .MuiDataGrid-overlayWrapperInner': {
        height: '120px !important',
        minHeight: '120px !important',
      },
      '& .MuiDataGrid-overlay': {
        height: '100% !important',
        minHeight: '120px !important',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  };
};

export default styles;
