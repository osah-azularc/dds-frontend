import PropTypes from 'prop-types';
import Header from '../Header/Header';

const DrawerNav = ({ open, setOpen }) => {
  return <Header open={open} setOpen={setOpen} />;
};

DrawerNav.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default DrawerNav;
