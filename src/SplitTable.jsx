// SplitTable.jsx
import React from 'react';
import './SplitTable.css';

function SplitTable({ columns, rows, renderCell, CustomTableHeader, table, groupDescriptions, openModal }) {
  return (
    <div className="table-wrapper">
    <div className="scroll-container">
        <table className="header-table">
        <colgroup>
            {columns.map(col => (
            <col key={col.id} style={{ width: col.width || 'auto' }} />
            ))}
        </colgroup>
        <CustomTableHeader
            columns={columns}
            table={table}
            groupDescriptions={groupDescriptions}
            openModal={openModal}
        />
        </table>

        <div className="scroll-body">
        <table className="body-table">
            <colgroup>
            {columns.map(col => (
                <col key={col.id} style={{ width: col.width || 'auto' }} />
            ))}
            </colgroup>
            <tbody>
            {rows.map((row) => (
                <tr
                key={row.id}
                onClick={row.onClick}
                className={row.original.pinned ? 'pinned-row' : ''}
                >

                {row.getVisibleCells().map((cell, i, arr) =>
                    renderCell(cell, i >= arr.length - 2)
                )}
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </div>
    </div>

  );
}

export default SplitTable;