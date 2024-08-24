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
import { MdDashboard , MdShoppingCart ,MdFormatListBulleted} from "react-icons/md";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  FormatListBulletedSharp as CategoriesIcon,
} from "@mui/icons-material";
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
      icon: <MdDashboard className="text-orange-600 text-3xl" />,
      href: "/",
    },
    {
      text: "Products",
      icon: <MdShoppingCart className="text-orange-600 text-3xl" />,
      href: "/products",
    },
    {
      text: "Categories",
      icon: <MdFormatListBulleted className="text-orange-600 text-3xl" />,
      href: "/categories",
    },
  ];

  const drawer = (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", p: 1.5 }}>
        <Avatar alt={user.name} src="/path/to/profile.jpg" sx={{ mr: 2 }} />
        <Box>
          <Typography variant="subtitle1" className="text-orange-500">
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
          <ListItem disablePadding key={text}>
            <Link href={href} passHref legacyBehavior>
              <ListItemButton
                component="a"
                sx={{
                  width: "100%",
                  backgroundColor: isActive(href) ? "#fbd38d" : "inherit",
                  "&:hover": { backgroundColor: "#fed7aa" },
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
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar className="bg-slate-100">
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" }, color: "#fb923c" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            <p className="text-lg font-bold text-orange-400 font-serif italic">
              SARAMODA
            </p>
            <p className="text-xs text-orange-800">control panel</p>
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              sx={{
                border: "1px solid #fb923c",
                backgroundColor: "orange",
                color: "#fff",
                "&:hover": { backgroundColor: "#ea580c" },
              }}
              onClick={logoutUser}
            >
              Logout
            </Button>
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
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#f1f5f9",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#f1f5f9",
            },
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
