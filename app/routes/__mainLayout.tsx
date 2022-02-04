import { AccountCircle } from "@mui/icons-material";
import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import SideNav from "~/components/elements/SideNav";
import Copyright from "~/components/elements/Copyright";
import { Link, LoaderFunction, Outlet, useLoaderData } from "remix";
import { requireUser } from "~/utils/session.server";
import { User } from "@prisma/client";

const drawerWidth: number = 300;
const theme = createTheme();

export let loader: LoaderFunction = async ({request}) => {
    return await requireUser(request);
};

export default function MainLayoutHiddenRoute() {
    const user = useLoaderData<Omit<User, 'passwordHash'>>();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <Box sx={{display: "flex"}}>
                <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                    <Toolbar sx={{gap: "1rem"}}>
                        <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
                            NBHS
                        </Typography>

                        <div id="top-nav-portal" />

                        <Divider orientation="vertical" variant="middle" flexItem />

                        <div>
                            <Button
                                size="large"
                                onClick={handleMenu}
                                color="inherit"
                                endIcon={<AccountCircle />}
                            >
                                {user.firstName}

                            </Button>
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
                                <MenuItem component={Link} to="/profile">Profil</MenuItem>
                                <MenuItem component={Link} to="/auth/sign-out">Ausloggen</MenuItem>
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
                    <Outlet />
                    <Copyright />
                </Box>
            </Box>
        </ThemeProvider>
    );
}
