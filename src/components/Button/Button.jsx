
import PropTypes from 'prop-types';

export function Button({ onClick }) {
  return (
    <div>
      <button type="button"  onClick={onClick}>
        Load more
      </button>
    </div>
  );
}

Button.prototype = { onClick: PropTypes.func.isRequired };