import { faGavel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import './Loader.css';

// The app-wide gavel loader. Defaults to a full-viewport pass (App.jsx route/Suspense
// fallbacks); pass `minHeight` to drop it into a page section or a routed sub-screen without
// forcing 100vh, and `text` to override the "Loading..." caption.
const Loader = ({ minHeight = '100vh', text = 'Loading...' }) => {
  return (
    <div className="loader-container" style={{ height: 'auto', minHeight }}>
      <span className="loader-content loader">
        <FontAwesomeIcon icon={faGavel} className="gavel-icon" />
      </span>
      <div>
        <span className="loading-text">{text}</span>
      </div>
    </div>
  );
};

Loader.propTypes = {
  minHeight: PropTypes.string,
  text: PropTypes.string,
};

export default Loader;
