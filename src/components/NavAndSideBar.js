import Link from "next/link";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
} from "@mui/material";
import {
  MdDashboard,
  MdShoppingCart,
  MdFormatListBulleted,
  MdListAlt,
} from "react-icons/md";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";

const drawerWidth = 240;

const NavAndSideBar = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [user, setUser] = useState({ name: "Admin Name", role: "role" });
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== undefined) {
      const userInfo = JSON.parse(localStorage.getItem("account-info"));
      if (userInfo) {
        setUser(userInfo);
      }
    }
  }, []);

  const handleDrawerToggle = () => !isClosing && setMobileOpen(!mobileOpen);
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };
  const handleDrawerTransitionEnd = () => setIsClosing(false);
  const isActive = (path) => router.pathname === path;
  const logoutUser = () => {
    localStorage.removeItem("d-token");
    sessionStorage.removeItem("d-token");
    localStorage.removeItem("account-info");
    router.replace("/login");
  };

  const drawerItems = [
    {
      text: "Dashboard",
      icon: <MdDashboard className="text-primary text-3xl" />,
      href: "/",
    },
    {
      text: "Products",
      icon: <MdShoppingCart className="text-primary text-3xl" />,
      href: "/products",
    },
    {
      text: "Categories",
      icon: <MdFormatListBulleted className="text-primary text-3xl" />,
      href: "/categories",
    },
    {
      text: "Orders",
      icon: <MdListAlt className="text-primary text-3xl" />,
      href: "/orders",
    },
  ];

  const drawer = (
    <div>
      <Box className="flex items-center p-1.5">
        <Avatar alt={user.name} src="/path/to/profile.jpg" className="mr-2" />
        <Box>
          <Typography variant="subtitle1" className="text-primary">
            {user.name}
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            {user.role}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List>
        {drawerItems.map(({ text, icon, href }) => (
          <ListItem onClick={handleDrawerClose} disablePadding key={text}>
            <Link href={href} passHref legacyBehavior>
              <ListItemButton
                component="a"
                sx={{
                  width: "100%",
                  backgroundColor: isActive(href) ? "#d3d5d0" : "inherit",
                  "&:hover": { backgroundColor: "#d3d5d0" },
                }}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box className="flex">
      <CssBaseline />
      <AppBar
        position="fixed"
        className={`w-full sm:w-[calc(100%-${drawerWidth}px)] ml-0 sm:ml-[${drawerWidth}px]`}
      >
        <Toolbar className="bg-white">
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className="mr-2 text-primary"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" className="flex-grow">
            <p className="text-lg font-bold text-primary font-serif italic">
              SARAMODA
            </p>
            <p className="text-xs text-gray-800">control panel</p>
          </Typography>
          <Box className="flex gap-1">
            <Button
              className="border-1 border-primary bg-primary text-white"
              onClick={logoutUser}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        className="w-full flex-shrink-0"
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{ keepMounted: true }}
          className="block"
          PaperProps={{
            className: "box-border w-[240px] bg-[#f1f5f9]",
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="persistent"
          open={mobileOpen}
          PaperProps={{
            className: "box-border w-[240px] bg-[#f1f5f9]",
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default NavAndSideBar;
