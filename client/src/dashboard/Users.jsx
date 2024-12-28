import React, { useContext, useEffect } from 'react'
import UsersTable from '../components/UsersTable';
import { ContextGlobal } from '../utils/globalContext';

const Users = () => {

    const { getAllUsers } = useContext(ContextGlobal);

    // useEffect(() => {
    //     getAllUsers();
    // }, [getAllUsers])

    return (
        <div>
            <UsersTable />
        </div>
    )
}

export default Users;
