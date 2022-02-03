import { Link } from "remix";

import { FunctionComponent, useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { CircularProgress, Collapse, Divider, ListItemButton } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ListItemText from "@mui/material/ListItemText";
import PieChartIcon from "@mui/icons-material/PieChart";
import IconExpandLess from "@mui/icons-material/ExpandLess";
import IconExpandMore from "@mui/icons-material/ExpandMore";
import HouseIcon from "@mui/icons-material/House";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";

import Box from "@mui/material/Box";
import * as permission from "../../helpers/permission";


const SideNav: FunctionComponent = () => {
    const [userProjects, setUserProjects] = useState([] as any[])
    const [formManagementOpen, setFormManagementOpen] = useState(false);
    const [formSubmissionsOpen, setFormSubmissionsOpen] = useState(false);
    const [formApprovalsOpen, setFormApprovalsOpen] = useState(false);
    const [statisticsOpen, setStatisticsOpen] = useState(false);
    const [loading, setLoading] = useState(true);


    const [isAdmin, setIsAdmin] = useState(false);
    const [isProjectResponsible, setIsProjectResponsible] = useState(false);
    const [isDepartmentResponsible, setIsDepartmentResponsible] = useState(false);
    const [isPublicRelationResponsible, setIsPublicRelationResponsible] = useState(false);
    const [isExecutiveBoard, setIsExecutiveBoard] = useState(false);


    useEffect(() => {
        setLoading(true);

        setIsAdmin(permission.isAdmin());
        setIsProjectResponsible(permission.isProjectResponsible());
        setIsDepartmentResponsible(permission.isDepartmentResponsible());
        setIsPublicRelationResponsible(permission.isPublicRelationResponsible());
        setIsExecutiveBoard(permission.isExecutiveBoard());

        /*getUserProjects()
            .then((response) => {
                setUserProjects(response.data.projects);

                setLoading(false);
            })
         */
    }, []);

    function handleOpenCloseFormManagement() {
        setFormManagementOpen(!formManagementOpen);
    }

    function handleOpenCloseFormSubmissions() {
        setFormSubmissionsOpen(!formSubmissionsOpen);
    }

    function handleOpenCloseFormApprovals() {
        setFormApprovalsOpen(!formApprovalsOpen);
    }

    function handleOpenCloseStatistics() {
        setStatisticsOpen(!statisticsOpen);
    }

    return (
        <List>
            {
                isAdmin ? (
                    <ListItem disablePadding>
                        <Link to="/users">
                            <ListItemButton component="a">
                                <ListItemIcon>
                                    <PeopleAltIcon />
                                </ListItemIcon>
                                <ListItemText primary="Benutzer" />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ) : <></>
            }

            {
                isAdmin ? (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleOpenCloseFormManagement}>
                                <ListItemIcon>
                                    <HouseIcon />
                                </ListItemIcon>
                                <ListItemText primary="Formularverwaltung" />
                                {formManagementOpen ? <IconExpandLess /> : <IconExpandMore />}
                            </ListItemButton>
                        </ListItem>

                        <Collapse in={formManagementOpen} timeout="auto" unmountOnExit>
                            <Divider />
                            <List component="div" disablePadding>
                                <ListItem disablePadding>
                                    <Link to="/areas">
                                        <ListItemButton component="a">
                                            <ListItemText inset primary="Bereiche verwalten" />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                                <ListItem disablePadding>
                                    <Link to="/projects">
                                        <ListItemButton component="a">
                                            <ListItemText inset primary="Projekte verwalten" />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                                <ListItem disablePadding>
                                    <Link to="/categories">
                                        <ListItemButton component="a">
                                            <ListItemText inset primary="Kategorien verwalten" />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                                <ListItem disablePadding>
                                    <Link to="/subcategories">
                                        <ListItemButton component="a">
                                            <ListItemText inset primary="Unterkategorien verwalten" />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                            </List>
                            <Divider />
                        </Collapse>
                    </>
                ) : <></>
            }

            {
                isProjectResponsible ? (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleOpenCloseFormSubmissions}>
                                <ListItemIcon>
                                    <PlaylistAddIcon />
                                </ListItemIcon>
                                <ListItemText primary="Formularerfassung" />
                                {formSubmissionsOpen ? <IconExpandLess /> : <IconExpandMore />}
                            </ListItemButton>
                        </ListItem>

                        <Collapse in={formSubmissionsOpen} timeout="auto" unmountOnExit>
                            <Divider />
                            {loading ? (
                                <Box component="div"
                                     sx={{padding: "8px 8px 8px 72px", display: "flex", alignItems: "center"}}>
                                    <CircularProgress size={20} />
                                </Box>
                            ) : (
                                <List component="div" disablePadding>
                                    {
                                        userProjects.map(userProject => {
                                            return (
                                                <ListItem key={userProject.project} disablePadding>
                                                    <Link to={`/forms/submissions/${userProject.project}`}>
                                                        <ListItemButton component="a">
                                                            <ListItemText inset primary={userProject.name} />
                                                        </ListItemButton>
                                                    </Link>
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            )}
                            <Divider />
                        </Collapse>
                    </>
                ) : <></>
            }

            {
                isExecutiveBoard || isDepartmentResponsible ? (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleOpenCloseFormApprovals}>
                                <ListItemIcon>
                                    <PlaylistAddCheckIcon />
                                </ListItemIcon>
                                <ListItemText primary="Formularfreigabe" />
                                {formApprovalsOpen ? <IconExpandLess /> : <IconExpandMore />}
                            </ListItemButton>
                        </ListItem>

                        <Collapse in={formApprovalsOpen} timeout="auto" unmountOnExit>
                            <Divider />
                            {loading ? (
                                <Box component="div"
                                     sx={{padding: "8px 8px 8px 72px", display: "flex", alignItems: "center"}}>
                                    <CircularProgress size={20} />
                                </Box>
                            ) : (
                                <List component="div" disablePadding>
                                    {
                                        userProjects.map(userProject => {
                                            return (
                                                <ListItem key={userProject.project} disablePadding>
                                                    <Link to={`/forms/approvals/${userProject.project}`}>
                                                        <ListItemButton component="a">
                                                            <ListItemText inset primary={userProject.name} />
                                                        </ListItemButton>
                                                    </Link>
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            )}
                            <Divider />
                        </Collapse>
                    </>
                ) : <></>
            }

            {
                isExecutiveBoard || isPublicRelationResponsible || isDepartmentResponsible ? (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleOpenCloseStatistics}>
                                <ListItemIcon>
                                    <PieChartIcon />
                                </ListItemIcon>
                                <ListItemText primary="Statistiken" />
                                {statisticsOpen ? <IconExpandLess /> : <IconExpandMore />}
                            </ListItemButton>
                        </ListItem>

                        <Collapse in={statisticsOpen} timeout="auto" unmountOnExit>
                            <Divider />
                            <List component="div" disablePadding>

                                <ListItem disablePadding>
                                    <Link to="/statistics/first-statistic">
                                        <ListItemButton component="a">
                                            <ListItemText inset primary="Statistik 1" />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>

                                <ListItem disablePadding>
                                    <Link to="/statistics/2">
                                        <ListItemButton component="a">
                                            <ListItemText inset primary="Statistik 2" />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>


                                <ListItem disablePadding>
                                    <Link to="/statistics/3">
                                        <ListItemButton component="a">
                                            <ListItemText inset primary="Statistik 3" />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                            </List>
                        </Collapse>
                    </>
                ) : <></>
            }
        </List>
    );
}

export default SideNav
