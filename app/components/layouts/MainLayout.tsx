import * as React from "react";
import { FunctionComponent } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import Copyright from "../elements/Copyright";
import { Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import SideNav from "../elements/SideNav";


const drawerWidth: number = 300;
const mdTheme = createTheme();


const MainLayout: FunctionComponent = ({children}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{display: "flex"}}>
                <CssBaseline />
                <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                    <Toolbar sx={{gap: "1rem"}}>
                        <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
                            IS: NBHS
                        </Typography>

                        <div id="top-nav-portal" />

                        <Divider orientation="vertical" variant="middle" flexItem />

                        <div>
                            <IconButton
                                size="large"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                keepMounted

                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem component="a" href="/profile">Profil</MenuItem>
                                <MenuItem component="a" href="/auth/sign-out">Ausloggen</MenuItem>
                            </Menu>
                        </div>

                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {width: drawerWidth, boxSizing: "border-box"},
                    }}
                >
                    <Toolbar />
                    <Box sx={{overflow: "auto"}}>
                        <SideNav />
                    </Box>
                </Drawer>
                <Box component="main" sx={{flexGrow: 1, p: 3}}>
                    <Toolbar />
                    {children}
                    <Copyright />
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default MainLayout;
