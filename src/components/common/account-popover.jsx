/* eslint-disable */
import { AccountCircle, LogoutOutlined } from '@mui/icons-material';
import { Avatar, Box, IconButton, List, ListItem, ListItemButton, Popover } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { account } from '../../_mock/account';
import useAuth from '../../hooks/useAuth';
import { setLoggingOut } from '../../utilities/axiosConfig';
import styles from './AccountPopoverStyle';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const theme = useTheme();
  const classes = styles(theme);
  const [open, setOpen] = useState(null);
  const { logout } = useAuth();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const userName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '';
  const userInitials = userName
    ? userName
        .split(' ')
        .map((name) => name.charAt(0).toUpperCase())
        .join('')
    : 'AM';
  const userEmail = user?.email || '';

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    // Set flag to suppress "Session expired" modal from AuthProvider
    setLoggingOut(true);
    logout(userEmail);
  };

  return (
    <>
      <IconButton
        role="button"
        aria-label={userName ? userInitials : 'Account menu'}
        onClick={handleOpen}
      >
        <Avatar src={account.photoURL} alt={account.displayName} sx={classes.UserAccountAvatar}>
          {userInitials}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <List component="nav" aria-label="" className="CommonToolbarList">
          <ListItem>
            <ListItemButton
              aria-label="My-Account"
              role="button"
              onClick={() => {
                navigate('/my-account');
                handleClose();
              }}
            >
              <Box className="FlexCenter">
                <Box className="FlexCenter" mr={1}>
                  <AccountCircle color="action" />
                </Box>
                My Account
              </Box>
            </ListItemButton>
          </ListItem>
          <ListItem className="NoBorder">
            <ListItemButton aria-label="Logout" role="button" onClick={handleLogout}>
              <Box className="FlexCenter">
                <Box className="FlexCenter" mr={1}>
                  <LogoutOutlined color="action" />
                </Box>
                Logout
              </Box>
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>
    </>
  );
}
