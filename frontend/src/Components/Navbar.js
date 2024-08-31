import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

/**
 * Navbar component for navigation.
 * @param {string} buttonLabel - Label for the navigation button.
 * @param {Function} toggleView - Function to toggle between views.
 */
function Navbar({ buttonLabel, toggleView }) {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          News App
        </Typography>
        <Button color="inherit" onClick={toggleView}>
          {buttonLabel}
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
