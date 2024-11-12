// material-ui
import { useTheme } from '@mui/material/styles'; // Import your dark logo
import logo from '../../assets/images/utb.png'; // Import your light logo

// ==============================|| LOGO IMAGE ||============================== //

const Logo = () => {
  const theme = useTheme();

  return (
    // Use the logo image instead of the SVG
    <img
      src={theme.palette.mode === 'dark' ? logoDark : logo} // Switch logo based on theme mode
      alt="UTB"
      width="118"
      height={35}
    />
  );
};

export default Logo;
