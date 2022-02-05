import { AccountCircle } from "@mui/icons-material";
import * as React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Alert, Button, Divider, Menu, MenuItem, Snackbar } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import SideNav from "~/components/SideNav";
import Copyright from "~/components/Copyright";
import { Link, LoaderFunction, Outlet, useLoaderData } from "remix";
import { requireUserId, signOut } from "~/utils/session.server";
import { Project, User } from "@prisma/client";
import { db, exclude } from "~/utils/db.server";

const drawerWidth: number = 300;


export let loader: LoaderFunction = async ({request}) => {
    const userId = await requireUserId(request);
    const user = await db.user.findUnique({
        where: {id: userId},
        include: {
            projects: true
        }
    });

    if (!user) {
        return await signOut(request)
    }

    return exclude(user, "passwordHash");
};

export default function MainLayoutHiddenRoute() {
    const user = useLoaderData<Omit<User & { projects: Project[] }, "passwordHash">>();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{display: "flex", height: "100%"}}>
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
                    <SideNav user={user} />
                </Box>
            </Drawer>
            <Box component="main" sx={{flexGrow: 1, p: 3, display: "flex", flexDirection: "column"}}>
                <Toolbar />
                <Box component="div" sx={{display: "flex", flexGrow: 1}}>
                    <Outlet />
                </Box>
                <Copyright />
            </Box>


            <div id="snackbar-portal" />
        </Box>
    );
}
