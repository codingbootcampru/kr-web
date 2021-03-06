import Layout from '../../components/layout';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { EditForm } from '../../components/EditForm';
import { useSession } from 'next-auth/client';

export default function Userlist({ list }: any) {
    const [visible, setVisible] = useState(false);
    const [id, setId] = useState('');
    const [email, setEmail] = useState('');

    const [session, loading] = useSession();

    if (typeof window !== 'undefined' && loading) return null;
    if (!session) {
        return (
            <Layout title="List of registered users">
                <div>
                    <h2>You must sign in</h2>
                </div>
            </Layout>
        );
    }
    if (session.role !== 'admin') {
        return (
            <Layout title="List of registered users">
                <div>You must be an admin to see this page</div>;
            </Layout>
        );
    }

    const handleEdit = (id: string, email: string) => {
        setVisible(true);
        setId(id);
        setEmail(email);
    };

    return (
        <>
            <Layout title="List of registered users">
                {visible && <EditForm id={id} email={email} />}
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>E-mail</TableCell>
                                <TableCell align="right">Name</TableCell>
                                <TableCell align="right">Role</TableCell>
                                <TableCell align="right">
                                    Edit user data
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list.Users.map((row: any) => (
                                <TableRow key={row._id}>
                                    <TableCell component="th" scope="row">
                                        {row.email}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.role}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            color="primary"
                                            aria-label="upload picture"
                                            component="span"
                                            onClick={() =>
                                                handleEdit(row._id, row.email)
                                            }
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Layout>
        </>
    );
}

Userlist.getInitialProps = async () => {
    const resp = await fetch(`${process.env.RESTURL}/api/test_mongoGET`);
    const json = await resp.json();
    return { list: json };
};
