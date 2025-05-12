import React, { useEffect, useState, useMemo } from 'react';
import Modal from './Modal';
import Papa from 'papaparse';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import CustomTableHeader from './CustomTableHeader';
import { renderTickCross } from './renderUtils';
import groupDescriptions from './groupDescriptions';
import { useTokenTableData } from './useTokenTableData';


// Fixed width constants.
const PROJECT_WIDTH = 300; // Increased width for the combined column
const GROUP_WIDTH = 150;



// Custom filter function: When filterValue is true, only include rows with truthy values.
// Modification: Always include pinned rows.
function truthyFilterFn(row, columnId, filterValue) {
  if (row.original.pinned) return true; // NEW: pinned rows bypass filtering
  const cellValue = row.getValue(columnId);
  if (filterValue) {
    return typeof cellValue === 'string' && cellValue.trim().length > 0;
  }
  return true;
}

// Flat columns definitions.
// Replace separate "Project Name" and "Token" columns with one combined column.
const flatColumns = [
  {
    id: 'project',
    header: 'Project (Token)',
    // Return both the project name and token ticker for sorting and global filtering.
    accessorFn: row => `${row.name} ${row.token}`.toLowerCase(),
    cell: ({ row }) => {
      const { name, token } = row.original;
      return (
        <div style={{ textAlign: 'left' }}>
          <span style={{ fontWeight: 'bold' }}>{name}</span>{' '}
          <span style={{ color: 'grey', fontSize: '0.85rem' }}>{token}</span>
        </div>
      );
    },
    headerTooltip: 'Project name and token ticker',
    // The filter function can remain as is, since it already combines name and token.
    filterFn: (row, columnId, filterValue) => {
      const { name, token } = row.original;
      const combined = `${name} ${token}`.toLowerCase();
      return combined.includes(filterValue.toLowerCase());
    },
  }
  
  ,
  // ... The rest of your grouped columns remain unchanged:
  {
    id: 'contribution.endogenous',
    group: 'Service Provision',
    header: 'Endo',
    accessorKey: 'contribution.endogenous',
    cell: ({ getValue }) => renderTickCross(getValue()),
    headerTooltip: 'Right to perform work or provide resources for the native system.',
    filterFn: truthyFilterFn,
  },
  {
    id: 'contribution.exogenous',
    group: 'Service Provision',
    header: 'Exo',
    accessorKey: 'contribution.exogenous',
    cell: ({ getValue }) => renderTickCross(getValue()),
    headerTooltip: 'Right to perform work or provide resources for an external system.',
    filterFn: truthyFilterFn,
  },
  {
    id: 'governance.endogenous',
    group: 'Governance',
    header: 'Endo',
    accessorKey: 'governance.endogenous',
    cell: ({ getValue }) => renderTickCross(getValue()),
    headerTooltip: 'System governance rights exercised by the native token.',
    filterFn: truthyFilterFn,
  },
  {
    id: 'governance.exogenous',
    group: 'Governance',
    header: 'Exo',
    accessorKey: 'governance.exogenous',
    cell: ({ getValue }) => renderTickCross(getValue()),
    headerTooltip: 'External system governance rights exercised by the native token.',
    filterFn: truthyFilterFn,
  },
  {
    id: 'valueredistribution.endogenous',
    group: 'Value Distribution',
    header: 'Endo',
    accessorKey: 'valueredistribution.endogenous',
    cell: ({ getValue }) => renderTickCross(getValue()),
    headerTooltip: 'Redistribution of native system value to token holders.',
    filterFn: truthyFilterFn,
  },
  {
    id: 'valueredistribution.exogenous',
    group: 'Value Distribution',
    header: 'Exo',
    accessorKey: 'valueredistribution.exogenous',
    cell: ({ getValue }) => renderTickCross(getValue()),
    headerTooltip: 'Redistribution of value from external systems to token holders.',
    filterFn: truthyFilterFn,
  },
  {
    id: 'membership.endogenous',
    group: 'Membership',
    header: 'Endo',
    accessorKey: 'membership.endogenous',
    cell: ({ getValue }) => renderTickCross(getValue()),
    headerTooltip: 'Access to features and benefits provided by system or community.',
    filterFn: truthyFilterFn,
  },
  {
    id: 'membership.exogenous',
    group: 'Membership',
    header: 'Exo',
    accessorKey: 'membership.exogenous',
    cell: ({ getValue }) => renderTickCross(getValue()),
    headerTooltip: 'Access to features and benefits provided by external parties/systems.',
    filterFn: truthyFilterFn,
  },
  {
    id: 'payments.endogenous',
    group: 'Payments',
    header: 'Endo',
    accessorKey: 'payments.endogenous',
    cell: ({ getValue }) => renderTickCross(getValue()),
    headerTooltip: 'Reliance of native system payments on token as unit of account and medium of exchange.',
    filterFn: truthyFilterFn,
  },
  {
    id: 'payments.exogenous',
    group: 'Payments',
    header: 'Exo',
    accessorKey: 'payments.exogenous',
    cell: ({ getValue }) => renderTickCross(getValue()),
    headerTooltip: 'Token is used as a unit of account and medium of exchange in external environments, this includes other dApps, blockchains, extensions of blockchains, such as layer two networks, and the real world.',
    filterFn: truthyFilterFn,
  },
  {
    id: 'collateral.endogenous',
    group: 'Collateral',
    header: 'Endo',
    accessorKey: 'collateral.endogenous',
    cell: ({ getValue }) => renderTickCross(getValue()),
    headerTooltip: 'Token allows the holder to acquire financial leverage within a system or to cryptoeconomically secure the native system.',
    filterFn: truthyFilterFn,
  },
  {
    id: 'collateral.exogenous',
    group: 'Collateral',
    header: 'Exo',
    accessorKey: 'collateral.exogenous',
    cell: ({ getValue }) => renderTickCross(getValue()),
    headerTooltip: 'Token is considered a general store of value and thus allows the holder to acquire financial leverage from an external system or to cryptoeconomically secure an external system.',
    filterFn: truthyFilterFn,
  },
  {
    id: 'assetownership.endogenous',
    group: 'Asset Ownership',
    header: 'Endo',
    accessorKey: 'assetownership.endogenous',
    cell: ({ getValue }) => renderTickCross(getValue()),
    headerTooltip: 'The token is a claim on assets that are controlled or managed by the system.',
    filterFn: truthyFilterFn,
  },
  {
    id: 'assetownership.exogenous',
    group: 'Asset Ownership',
    header: 'Exo',
    accessorKey: 'assetownership.exogenous',
    cell: ({ getValue }) => renderTickCross(getValue()),
    headerTooltip: 'The token is a claim on an asset other than that controlled or managed by the system.',
    filterFn: truthyFilterFn,
  },
];

// Enhance columns: Mark first and last column in each group.
function getEnhancedColumns(columns) {
  return columns.map((col, index, arr) => {
    if (!col.group) return col;
    const prevGroup = index > 0 ? arr[index - 1].group : null;
    const nextGroup = index < arr.length - 1 ? arr[index + 1].group : null;
    return {
      ...col,
      firstInGroup: col.group && col.group !== prevGroup,
      lastInGroup: col.group && col.group !== nextGroup,
    };
  });
}
const enhancedColumns = getEnhancedColumns(flatColumns);

// Compute groupCounts: Number of subcolumns per group.
const groupCounts = {};
enhancedColumns.forEach(col => {
  if (col.group) {
    groupCounts[col.group] = (groupCounts[col.group] || 0) + 1;
  }
});



// Main table component with multi-row pinning.
function CryptoTable() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  // Change to an array for multiple pinned rows
  const [pinnedRowIds, setPinnedRowIds] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: '' });

  const [helpOpen, setHelpOpen] = useState(false);

  const openHelp = () => setHelpOpen(true);
  const closeHelp = () => setHelpOpen(false);

  
  const openModal = (title, body) => {
    setModalContent({ title, body });
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
  };
  

  const { data, loading, error, setData } = useTokenTableData(
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vT8W60RuKy6njMwzDc6zhe7JBl5QuMZ-lTZRDfoj4YvHAG7c2GZlAhAfggRqpN-bziMmfft8I3t27Xa/pub?gid=0&single=true&output=csv'
  );
  

  const columns = useMemo(() => enhancedColumns, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Order rows: sort so that pinned rows (in data) always appear at the top.
  const allRows = table.getRowModel().rows;
  const orderedRows = [...allRows].sort((a, b) => {
    if (a.original.pinned === b.original.pinned) return 0;
    return a.original.pinned ? -1 : 1;
  });

  const baseTdStyle = {
    padding: '12px 8px',
    border: '1px solid #ddd',
    textAlign: 'center',
  };

  const renderCell = (cell, isTooltipLeft) => {
    const cellStyle = { ...baseTdStyle };
    
    // For the combined project column:
    if (cell.column.id === 'project') {
      cellStyle.width = `${PROJECT_WIDTH}px`;
      cellStyle.borderLeft = '2px solid #333';
    }
    
    if (cell.column.columnDef.group) {
      const count = groupCounts[cell.column.columnDef.group] || 1;
      cellStyle.width = `${GROUP_WIDTH / count}px`;
    }
    if (cell.column.columnDef.firstInGroup) {
      cellStyle.borderLeft = '2px solid #333';
    }
    if (cell.column.columnDef.lastInGroup) {
      cellStyle.borderRight = '2px solid #333';
    }
    
    return (
      <td key={cell.id} style={cellStyle} className={isTooltipLeft ? "last-two-cell" : ""}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </td>
    );
  };
  

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: 'inherit', // or directly 'Futura, sans-serif'
    borderBottom: '2px solid #333',
  };

  if (loading) return <div>Loading token table...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;
  
  return (
    <div>
      {/* Search and Help Button Container */}
      <div className="search-help-container">
        <input
          className="search-bar"
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search token..."
        />
        <button className="help-button" onClick={openHelp}>?</button>
      </div>
  
      {/* Table with clickable group headers */}
      <table style={tableStyle}>
        <CustomTableHeader 
          columns={columns} 
          table={table} 
          groupDescriptions={groupDescriptions} 
          openModal={openModal} 
        />
        <tbody>
          {orderedRows.map(row => (
            <tr 
              key={row.id}
              onClick={() => {
                setData(prevData =>
                  prevData.map(r =>
                    r.id === row.original.id ? { ...r, pinned: !r.pinned } : r
                  )
                );
              }}
              style={{
                cursor: 'pointer',
                backgroundColor: row.original.pinned ? '#fffae6' : 'inherit',
              }}
            >
              {row.getVisibleCells().map((cell, index, arr) =>
                renderCell(cell, index >= arr.length - 2)
              )}
            </tr>
          ))}
        </tbody>
      </table>
  
      {/* Modal for group header descriptions */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={modalContent.title}
      >
        {modalContent.body}
      </Modal>
  
      {/* Help modal */}
      <Modal
        isOpen={helpOpen}
        onClose={closeHelp}
        title="How to Use This Dashboard"
      >
        <ul>
          <li>Use the <strong>search bar</strong> to find tokens by name or ticker.</li>
          <li>Click column group headers like <em>Governance</em> to read what they mean.</li>
          <li>Click a row to pin it to the top of the table.</li>
          <li>Hover over tick/cross icons to see tooltips with additional detail.</li>
          <li>Click column headers to sort or toggle filters.</li>
        </ul>
      </Modal>
    </div>
  );
  
  

}

export default CryptoTable;
