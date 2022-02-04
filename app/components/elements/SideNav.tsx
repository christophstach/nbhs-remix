import { Link } from "remix";

import { FunctionComponent, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Collapse, Divider, ListItemButton } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ListItemText from "@mui/material/ListItemText";
import PieChartIcon from "@mui/icons-material/PieChart";
import IconExpandLess from "@mui/icons-material/ExpandLess";
import IconExpandMore from "@mui/icons-material/ExpandMore";
import HouseIcon from "@mui/icons-material/House";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import { Project, User, UserRole } from "@prisma/client";


interface SideNavProps {
    user: Omit<User & { projects: Project[] }, 'passwordHash'>
}

const SideNav: FunctionComponent<SideNavProps> = (props) => {
    const user = props.user;

    const [userProjects, setUserProjects] = useState([] as any[]);
    const [formManagementOpen, setFormManagementOpen] = useState(false);
    const [formSubmissionsOpen, setFormSubmissionsOpen] = useState(false);
    const [formApprovalsOpen, setFormApprovalsOpen] = useState(false);
    const [statisticsOpen, setStatisticsOpen] = useState(false);


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
                user.roles.includes(UserRole.ADMIN) ? (
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/users">
                            <ListItemIcon>
                                <PeopleAltIcon />
                            </ListItemIcon>
                            <ListItemText primary="Benutzer" />
                        </ListItemButton>
                    </ListItem>
                ) : <></>
            }

            {
                user.roles.includes(UserRole.ADMIN) ? (
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
                                    <ListItemButton component={Link} to="/areas">
                                        <ListItemText inset primary="Bereiche verwalten" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton component={Link} to="/projects">
                                        <ListItemText inset primary="Projekte verwalten" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton component={Link} to="/categories">
                                        <ListItemText inset primary="Kategorien verwalten" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton component={Link} to="/subcategories">
                                        <ListItemText inset primary="Unterkategorien verwalten" />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                            <Divider />
                        </Collapse>
                    </>
                ) : <></>
            }

            {
                user.roles.includes(UserRole.PROJECT_MANAGER) ? (
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

                            <List component="div" disablePadding>
                                {
                                    user.projects.map(project => {
                                        return (
                                            <ListItem key={project.id} disablePadding>
                                                <ListItemButton
                                                    component={Link}
                                                    to={`/forms/submissions/${project.id}`}>
                                                    <ListItemText inset primary={project.name} />
                                                </ListItemButton>
                                            </ListItem>
                                        )
                                    })
                                }
                            </List>

                            <Divider />
                        </Collapse>
                    </>
                ) : <></>
            }

            {
                user.roles.includes(UserRole.EXECUTIVE) || user.roles.includes(UserRole.AREA_MANAGER) ? (
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
                            <List component="div" disablePadding>
                                {
                                    userProjects.map(userProject => {
                                        return (
                                            <ListItem key={userProject.project} disablePadding>
                                                <ListItemButton
                                                    component={Link}
                                                    to={`/forms/approvals/${userProject.project}`}>
                                                    <ListItemText inset primary={userProject.name} />
                                                </ListItemButton>
                                            </ListItem>
                                        )
                                    })
                                }
                            </List>

                            <Divider />
                        </Collapse>
                    </>
                ) : <></>
            }

            {
                user.roles.includes(UserRole.EXECUTIVE) || user.roles.includes(UserRole.PR_MANAGER) || user.roles.includes(UserRole.AREA_MANAGER) ? (
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
                                    <ListItemButton component={Link} to="/statistics/first-statistic">
                                        <ListItemText inset primary="Statistik 1" />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding>
                                    <ListItemButton component={Link} to="/statistics/2">
                                        <ListItemText inset primary="Statistik 2" />
                                    </ListItemButton>
                                </ListItem>


                                <ListItem disablePadding>
                                    <ListItemButton component={Link} to="/statistics/3">
                                        <ListItemText inset primary="Statistik 3" />
                                    </ListItemButton>
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
