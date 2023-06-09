import PropTypes from 'prop-types';
// material
import { useTheme } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import svgImage from '../img/logo_single.svg';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  const theme = useTheme();

  return (
    <Box sx={{ width: 40, height: 40, ...sx }}>
      <img src={svgImage} alt="" />
    </Box>
  );
}
