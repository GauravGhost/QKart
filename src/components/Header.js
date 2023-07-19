import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import "./Header.css";
import { Typography } from "@mui/material";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const navigate = useHistory();
  const name = localStorage.getItem('username');
  const [username, setUsername] = useState(!!name)

  const logoutHandler = () => {
    localStorage.clear();
    setUsername(false);
  }
  const loginRegisterButton = <Box>
    <Button
      className="explore-button"
      variant="text"
      onClick={() => navigate.push('/login')}
    >
      Login
    </Button>
    <Button
      variant="contained"
      onClick={() => navigate.push('/register')}
    >
      Register
    </Button>
  </Box>

  const backToExplorer = <Button
    className="explore-button"
    startIcon={<ArrowBackIcon />}
    variant="text"
    onClick={() => navigate.push('/')}
  >
    Back to explore
  </Button>

  const avatarLogoutButton = <Stack direction="row" alignItems="center" spacing={2}>

    <img src="avatar.png" alt={name} width='34' />
    <Typography variant="subtitle1" className='username-text'>{name}</Typography>
    <Button
      className="explore-button"
      variant="text"
      onClick={logoutHandler}
    >
      Logout
    </Button>
  </Stack>


  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {hasHiddenAuthButtons ? backToExplorer : username ? avatarLogoutButton : loginRegisterButton}
    </Box>
  );
};

export default Header;
