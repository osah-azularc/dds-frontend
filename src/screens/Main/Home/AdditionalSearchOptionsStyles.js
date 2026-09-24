const styles = (theme) => ({
  PanelOuter: {
    width: '100%',
    // This app doesn't apply box-sizing:border-box anywhere (no CssBaseline,
    // no reset), so the browser default content-box would add the left/right
    // padding on top of width:100%, making this element wider than its
    // container and causing a page-level horizontal scrollbar.
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    borderTop: '1px solid #e0e0e0',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4, 3),
    overflow: 'hidden',
  },

  PanelInner: {
    width: '100%',
    maxWidth: '1200px',
  },
});

export default styles;
