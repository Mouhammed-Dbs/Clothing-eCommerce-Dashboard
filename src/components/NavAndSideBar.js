import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { orange } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar'
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Button from '@mui/material/Button';
import Link from 'next/link';

const primary = orange[300];


const drawerWidth = 240;


const NavAndSideBar = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5 }}>
        <Avatar alt="Admin" src="/path/to/profile.jpg" sx={{ mr: 2}} /> {/* Add Profile pic */}
        <Typography variant="h6" className='text-orange-500'>Admin Name</Typography> {/* Add Admin Name */}
      </Box>
      <Divider />
      <List>
        
          <ListItem  disablePadding className=' flex flex-col' >
            <ListItemButton component="a" href="/" className='w-full hover:bg-orange-200'>
              <ListItemIcon>
                 <DashboardIcon className='text-orange-300' />
              </ListItemIcon>
              <ListItemText primary={"Dashboard"} />
            </ListItemButton>
            <ListItemButton component="a" href="addProducts" className='w-full hover:bg-orange-200'>
              <ListItemIcon>
                 <AddCircleIcon className='text-orange-300'/>
              </ListItemIcon>
              <ListItemText primary={"Add Products"} />
            </ListItemButton>
          </ListItem>
      </List>
      <Divider />
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar className='bg-slate-100'>
          <IconButton
            className='text-orange-400'
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }}}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div"  sx={{ flexGrow: 1 }}>
          <p className="text-lg font-bold text-orange-400  font-serif italic ">
            SARAMODA
          </p>
          <p className='text-xs text-orange-800'>control panel</p>
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>            <Button variant="contained" className='hover:bg-[#A29415] text-slate-950 bg-[#E3D026]'>Signup</Button>
            <Button variant="outlined" className='hover:bg-[#A29415] text-slate-950 border-orange-400'>Login</Button>
          </Box>
        </Toolbar>
        </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth,backgroundColor: "#f1f5f9" },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth ,backgroundColor: "#f1f5f9" },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

    </Box>
  );
};

export default NavAndSideBar;        
