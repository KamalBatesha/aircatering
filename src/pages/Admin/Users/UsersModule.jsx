import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

export default function UsersModule() {
    const [search, setSearch] = useState('');

    return <Outlet context={{ search, setSearch }} />;
}
