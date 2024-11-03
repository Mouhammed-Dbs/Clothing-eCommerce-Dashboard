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
  Button,
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
      icon: <MdDashboard className="text-primary-600 text-3xl" />,
      href: "/",
    },
    {
      text: "Products",
      icon: <MdShoppingCart className="text-primary-600 text-3xl" />,
      href: "/products",
    },
    {
      text: "Categories",
      icon: <MdFormatListBulleted className="text-primary-600 text-3xl" />,
      href: "/categories",
    },
    {
      text: "Orders",
      icon: <MdListAlt className="text-primary-600 text-3xl" />,
      href: "/orders",
    },
    {
      text: "Returned Orders",
      icon: <MdListAlt className="text-primary-600 text-3xl" />,
      href: "/return-orders",
    },
  ];

  const drawer = (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", p: 1.5 }}>
        <Avatar alt={user.name} src="/path/to/profile.jpg" sx={{ mr: 2 }} />
        <Box>
          <Typography variant="subtitle1" className="text-primary-500">
            {user.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
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
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: "100%", // إزالة تأثير العرض بناءً على حالة القائمة الجانبية
        }}
      >
        <Toolbar className="bg-slate-100">
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: "#3d3f36" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            <p className="text-lg font-bold text-primary-400 font-serif italic">
              SARAMODA
            </p>
            <p className="text-xs text-primary-800">control panel</p>
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              sx={{
                border: "1px solid #3d3f36",
                backgroundColor: "primary",
                color: "#4d4e49",
                "&:hover": { backgroundColor: "#3d3f36", color: "#d3d5d0" },
              }}
              onClick={logoutUser}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "#f1f5f9",
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default NavAndSideBar;
