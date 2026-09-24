import { SEARCH_RESULTS_TABLE_MIN_HEIGHT } from './components/searchResultsDataGridStyles';

const styles = (theme) => ({
  PageOuter: {
    width: '100%',
    boxSizing: 'border-box',
    padding: theme.spacing(3),
  },

  GridContainer: {
    minHeight: `${SEARCH_RESULTS_TABLE_MIN_HEIGHT}px`,
  },
});

export default styles;
