import React from 'react'

export default function LoadingTable() {

    const row = 4;
    const col = 3;

    const renderTable = () => {
        const table = [];

        for (let i = 0; i < row; i++) {
            const row = [];

            for (let j = 0; j < col; j++) {
                row.push(                
                        <td><span className='placeholder d-inline-block text-truncate' style={{minWidth: "100%"}}></span></td>                
                    );
            }

            table.push(<tr className='placeholder-glow' key={i}>{row}</tr>);
        }

        return table;
    };
    
    return (
        
        <>  
            {renderTable()}            
        </>
    )
}
