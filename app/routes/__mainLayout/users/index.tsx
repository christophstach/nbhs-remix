import { Form, LoaderFunction, useLoaderData } from "remix";
import { db, exclude } from "~/utils/db.server";
import { User } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    TableContainer,
    TextField
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { dateTimeValueFormatter } from "~/utils/valueFormatters";
import TopNavPortal from "~/components/TopNavPortal";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";


const useStyles = makeStyles({
    root: {
        "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
            outline: "none",
        },
        "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
            outline: "none",
        },
        "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus": {
            outline: "none",
        },
        "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within": {
            outline: "none",
        }
    }
});

export let loader: LoaderFunction = async ({request}) => {
    const users = await db.user.findMany();

    return users.map(user => exclude(user, "passwordHash"));
};


export default function UsersIndexRoute() {
    const classNames = useStyles();
    const users = useLoaderData<Omit<User, "passwordHash">[]>();

    const [selectedUser, setSelectedUser] = useState<User>(null as unknown as User);


    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const handleCreateDialogOpen = () => setCreateDialogOpen(true);
    const handleCreateDialogClose = () => setCreateDialogOpen(false);

    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const handleUpdateDialogOpen = () => setUpdateDialogOpen(true);
    const handleUpdateDialogClose = () => setUpdateDialogOpen(false);

    function onUpdateUserClick(user: User) {
        setSelectedUser(user);
        handleUpdateDialogOpen();
    }

    const columns: GridColDef[] = [
        {field: "id", headerName: "Id", width: 200},
        {field: "email", headerName: "E-Mail", flex: 1},
        {field: "firstName", headerName: "First Name", flex: 1},
        {field: "lastName", headerName: "Last Name", flex: 1},
        {
            field: "createdAt",
            headerName: "Created At",
            type: "dateTime",
            width: 150,
            valueFormatter: dateTimeValueFormatter
        },
        {
            field: "updatedAt",
            headerName: "Updated At",
            type: "dateTime",
            width: 150,
            valueFormatter: dateTimeValueFormatter
        },
        {
            field: "actions",
            type: "action",
            headerName: "",
            sortable: false,
            resizable: false,
            disableColumnMenu: true,

            renderCell: (value) => {
                return (
                    <>
                        <IconButton onClick={() => onUpdateUserClick(value.row)}>
                            <EditIcon color="warning" />
                        </IconButton>
                        <Form method="post" action={`/users/${value.id}/destroy`}>
                            <IconButton type="submit">
                                <DeleteIcon color="error" />
                            </IconButton>
                        </Form>
                    </>
                );
            }
        }
    ];

    return (
        <>
            <TopNavPortal>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleCreateDialogOpen}
                    startIcon={<AddIcon />}>Create User</Button>
            </TopNavPortal>

            <TableContainer component={Paper}>
                <DataGrid className={classNames.root} rows={users} columns={columns} />
            </TableContainer>


            <Dialog open={createDialogOpen} onClose={handleCreateDialogClose}>
                <Form method="post" action="/users/create" onSubmit={handleCreateDialogClose}>
                    <DialogTitle>
                        New User
                    </DialogTitle>
                    <DialogContent sx={{minWidth: "500px", display: "flex", flexDirection: "column", gap: "1rem"}}>
                        <TextField
                            placeholder="E-Mail"
                            name="email"
                            type="email"
                            autoComplete="off"
                            autoFocus
                        />

                        <TextField
                            placeholder="Password"
                            type="password"
                            autoComplete="new-password"
                            name="password"
                        />

                        <TextField
                            placeholder="First Name"
                            name="firstName"
                        />

                        <TextField
                            placeholder="Last Name"
                            name="lastName"
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleUpdateDialogClose}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </DialogActions>
                </Form>
            </Dialog>
            <Dialog open={updateDialogOpen} onClose={handleUpdateDialogClose}>
                <Form method="post" action={`/users/${selectedUser?.id}/update`} onSubmit={handleUpdateDialogClose}>
                    <DialogTitle>
                        Update User
                    </DialogTitle>
                    <DialogContent sx={{minWidth: "500px", display: "flex", flexDirection: "column", gap: "1rem"}}>
                        <TextField
                            defaultValue={selectedUser?.email}
                            placeholder="E-Mail"
                            name="email"
                            type="email"
                            autoComplete="off"
                            autoFocus
                        />


                        <TextField
                            defaultValue={selectedUser?.firstName}
                            placeholder="First Name"
                            name="firstName"
                        />

                        <TextField
                            defaultValue={selectedUser?.lastName}
                            placeholder="Last Name"
                            name="lastName"
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleCreateDialogClose}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </DialogActions>
                </Form>
            </Dialog>
        </>
    );
}
