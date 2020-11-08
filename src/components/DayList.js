import React from 'react'
import {List, 
    Datagrid, 
    TextField,
    DateField,
    EditButton,
    DeleteButton,
} from 'react-admin'


const DayList = (props) => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source='id'/>
                <TextField source='title'/>
                <DateField source='publishedAt'/>
                <EditButton basePath='/api/frequent/1'/>
                <DeleteButton basePath='/api/frequent/1'/>
            </Datagrid>
        </List>
    )
}

export default DayList
