import { LoaderFunction, useLoaderData } from "remix";
import { db, exclude } from "~/utils/db.server";
import { User } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Paper, TableContainer } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { dateTimeValueFormatter } from "~/utils/valueFormatters";

const useStyles = makeStyles({
    root: {
        '&.MuiDataGrid-root .MuiDataGrid-cell:focus': {
            outline: 'none',
        },
        '&.MuiDataGrid-root .MuiDataGrid-cell:focus0-within': {
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

    ];

    return (
        <>
            <TableContainer component={Paper}>
                <DataGrid className={classNames.root} rows={users} columns={columns} />
            </TableContainer>
        </>

    );
}
