import { Link, LoaderFunction, useLoaderData } from "remix";
import { db, exclude } from "~/utils/db.server";
import { User } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, IconButton, Paper, TableContainer } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { dateTimeValueFormatter } from "~/utils/valueFormatters";
import TopNavPortal from "~/components/TopNavPortal";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const useStyles = makeStyles({
    root: {
        '&.MuiDataGrid-root .MuiDataGrid-cell:focus': {
            outline: 'none',
        },
        '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
            outline: 'none',
        },
        '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus': {
            outline: 'none',
        },
        '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within': {
            outline: 'none',
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
                        <IconButton component={Link} to={`/users/${value.id}`}>
                            <EditIcon color="warning" />
                        </IconButton>
                        <IconButton component={Link} to={`/users/${value.id}/delete`}>
                            <DeleteIcon color="error" />
                        </IconButton>
                    </>
                );
            }
        }
    ];

    return (
        <>
            <TopNavPortal>
                <Button component={Link} to="/users/create" variant="contained" color="secondary" startIcon={<AddIcon />}>Benutzer anlegen</Button>
            </TopNavPortal>

            <TableContainer component={Paper}>
                <DataGrid className={classNames.root} rows={users} columns={columns} />
            </TableContainer>
        </>

    );
}
