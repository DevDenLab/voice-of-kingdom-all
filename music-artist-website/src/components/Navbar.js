import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  Collapse,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TikTokIcon from '@mui/icons-material/MusicNote';

const Navbar = ({ backgroundImage, overlayText, textColor }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const toggleSubmenu = (submenu) => {
    setOpenSubmenus((prev) => ({ ...prev, [submenu]: !prev[submenu] }));
  };

  const menuItems = [
    { label: 'HOME', link: '/' },
    {
      label: 'VOK-MUSIC',
      subItems: [
        { label: 'Biography', link: '/biography' },
        { label: 'Music', link: '/music' },
        { label: 'Upcoming Events', link: '/events' },
        { label: 'Photo Galleries', link: '/galleries' },
        { label: 'Store', link: '/store' },
        { label: 'Bookings', link: '/music/bookings' },
        { label: 'Testimonials', link: '/testimonials' },
      ],
    },
    {
      label: 'VOK-MESSAGE',
      subItems: [
        { label: 'Biography', link: '/message-biography' },
        { label: 'Messages', link: '/messages' },
        { label: 'Upcoming Messages', link: '/upcoming-messages' },
        { label: 'Testimonials', link: '/message-testimonials' },
      ],
    },
    { label: 'ABOUT VOK', link: '/about' },
    { label: 'CONTACT', link: '/contactus' },
  ];

  const renderMenuItems = (items, mobile = false) =>
    items.map((item, index) => (
      <React.Fragment key={index}>
        {mobile ? (
          <ListItem
            button
            component={Link}
            to={item.link}
            onClick={item.subItems ? () => toggleSubmenu(item.label) : toggleDrawer(false)}
            sx={{ backgroundColor: 'lightgray', '&:hover': { backgroundColor: 'gray' } }} // Background color on hover
          >
            <ListItemText
              primary={item.label}
              sx={{ color: 'black', fontFamily: 'Arial', fontSize: '18px' }} // Main options text color
            />
            {item.subItems && <ExpandMoreIcon />}
          </ListItem>
        ) : (
          <Button
            color="inherit"
            component={Link}
            to={item.link}
            onClick={toggleDrawer(false)}
            sx={{ ml: 2, color: 'black', fontFamily: 'Arial', fontSize: '18px' }} // Main options text color for desktop
          >
            {item.label}
          </Button>
        )}
        {mobile && item.subItems && (
          <Collapse in={openSubmenus[item.label]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.subItems.map((subItem, subIndex) => (
                <ListItem
                  button
                  key={subIndex}
                  component={Link}
                  to={subItem.link}
                  onClick={toggleDrawer(false)}
                  sx={{ pl: 4, backgroundColor: 'lightgray', '&:hover': { backgroundColor: 'gray' } }} // Background color on hover for sub-items
                >
                  <ListItemText
                    primary={subItem.label}
                    sx={{ color: 'blue', fontFamily: 'Arial', fontSize: '16px' }} // Sub-options text color
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    ));
  

  const socialIcons = (
    <Box
      sx={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 2,
        zIndex: 2,
      }}
    >
      <IconButton color="inherit" aria-label="facebook" sx={{ color: 'white' }}>
        <FacebookIcon />
      </IconButton>
      <IconButton color="inherit" aria-label="twitter" sx={{ color: 'white' }}>
        <TwitterIcon />
      </IconButton>
      <IconButton color="inherit" aria-label="instagram" sx={{ color: 'white' }}>
        <InstagramIcon />
      </IconButton>
      <IconButton color="inherit" aria-label="youtube" sx={{ color: 'white' }}>
        <YouTubeIcon />
      </IconButton>
      <IconButton color="inherit" aria-label="tiktok" sx={{ color: 'white' }}>
        <TikTokIcon />
      </IconButton>
    </Box>
  );

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '80vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1,
        }}
      />
      <Typography
        variant="h2"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: textColor || 'white',
          textAlign: 'center',
          zIndex: 2,
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          fontWeight: 'light',
        }}
      >
        {overlayText}
      </Typography>
      {socialIcons}
      <AppBar position="absolute" sx={{ backgroundColor: 'transparent', boxShadow: 'none', width: '100%', zIndex: 3 }}>
        <Toolbar disableGutters sx={{ minHeight: 'auto', px: 2 }}>
          <Box
            sx={{
              position: 'relative',
              height: { xs: 60, sm: 80 },
              width: { xs: 120, sm: 160 },
            }}
          >
            <Box
              component="img"
              src="/favicon.jpg"
              alt="VOK LOGO"
              sx={{
                position: 'absolute',
                top: 0,
                left: -15,
                height: '140%',
                width: '100%',
                objectFit: 'contain',
                objectPosition: 'left top',
              }}
            />
          </Box>

          {isMobile ? (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ fontSize: '45px' }}
              >
                <MenuIcon fontSize="inherit" />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                PaperProps={{
                  sx: {
                    width: '250px',
                    backgroundColor: 'white',
                    color: 'black',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                  <IconButton color="inherit" onClick={toggleDrawer(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <List>
                  {renderMenuItems(menuItems, true)}
                </List>
              </Drawer>
            </>
          ) : (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
              {renderMenuItems(menuItems)}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
