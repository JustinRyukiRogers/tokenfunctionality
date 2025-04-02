import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

// Fixed width constants.
const NAME_WIDTH = 150;  
const TOKEN_WIDTH = 100; 
const GROUP_WIDTH = 150; 

// ---------------------------------------------------------------------
// Helper: Render an asset value with tooltip if it contains a pipe.
const renderAsset = (value) => {
  if (typeof value === 'string' && value.includes('|')) {
    const [display, tooltip] = value.split('|').map(s => s.trim());
    return (
      <span className="tooltip-container">
        {display}
        <span className="tooltip-text">{tooltip}</span>
      </span>
    );
  }
  return value;
};

// ---------------------------------------------------------------------
// Helper: Render a tick if there is text; otherwise render nothing.
const renderTickCross = (value) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return <span>{''}</span>; // Blank if empty or not a string.
  }
  
  if (value.includes('|')) {
    const [symbol, tooltip] = value.split('|').map(s => s.trim());
    // If the symbol is "-", display "-" with tooltip; otherwise, display tick.
    if (symbol === '-') {
      return (
        <span className="tooltip-container">
          {'→'}
          <span className="tooltip-text">{tooltip}</span>
        </span>
      );
    } else {
      return (
        <span className="tooltip-container">
          {'\u2713'}
          <span className="tooltip-text">{tooltip}</span>
        </span>
      );
    }
  } else {
    // No pipe: simply display a tick with the entire value as tooltip.
    return (
      <span className="tooltip-container">
        {'\u2713'}
        <span className="tooltip-text">{value}</span>
      </span>
    );
  }
};


// ---------------------------------------------------------------------
// Custom filter function: When filterValue is true, only include rows with truthy values.
function truthyFilterFn(row, columnId, filterValue) {
  const cellValue = row.getValue(columnId);
  if (filterValue) {
    return typeof cellValue === 'string' && cellValue.trim().length > 0;
  }
  return true;
}

// ---------------------------------------------------------------------
// Flat columns definitions.
const flatColumns = [
  {
    id: 'name',
    header: 'Project Name',
    accessorKey: 'name',
    cell: ({ getValue }) => getValue(),
    headerTooltip: 'Full name of the project',
  },
  {
    id: 'token',
    header: 'Token',
    accessorKey: 'token',
    cell: ({ getValue }) => renderAsset(getValue()),
    headerTooltip: 'Token ticker (e.g., BTC)',
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
    id: 'contribution.endogenous',
    group: 'Contribution',
    header: 'Endo',
    accessorKey: 'contribution.endogenous',
    cell: ({ getValue }) => renderTickCross(getValue()),
    headerTooltip: 'Right to perform work or provide resources for the native system.',
    filterFn: truthyFilterFn,
  },
  {
    id: 'contribution.exogenous',
    group: 'Contribution',
    header: 'Exo',
    accessorKey: 'contribution.exogenous',
    cell: ({ getValue }) => renderTickCross(getValue()),
    headerTooltip: 'Right to perform work or provide resources for an external system.',
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
    group: 'Passive Value Redistribution',
    header: 'Endo',
    accessorKey: 'valueredistribution.endogenous',
    cell: ({ getValue }) => renderTickCross(getValue()),
    headerTooltip: 'Redistribution of native system value to token holders.',
    filterFn: truthyFilterFn,
  },
  {
    id: 'valueredistribution.exogenous',
    group: 'Passive Value Redistribution',
    header: 'Exo',
    accessorKey: 'valueredistribution.exogenous',
    cell: ({ getValue }) => renderTickCross(getValue()),
    headerTooltip: 'Redistribution of value from external systems to token holders.',
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

// ---------------------------------------------------------------------
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

// ---------------------------------------------------------------------
// Compute groupCounts: Number of subcolumns per group.
const groupCounts = {};
enhancedColumns.forEach(col => {
  if (col.group) {
    groupCounts[col.group] = (groupCounts[col.group] || 0) + 1;
  }
});

// ---------------------------------------------------------------------
// Custom header renderer: Two header rows with filtering toggles.
// Ungrouped columns ("Name" and "Token") are rendered with rowSpan=2.
// Grouped columns: The bottom header cells are clickable to toggle filtering on that column.
// When a filter is active, " (Filtered)" is appended.
function CustomTableHeader({ columns, table }) {
  // Separate ungrouped columns (those without a group) and grouped columns.
  const ungroupedColumns = columns.filter(col => !col.group);
  const groupedColumns = columns.filter(col => col.group);

  const topHeaderCells = [];
  const bottomHeaderCells = [];

  // Render ungrouped columns with rowSpan=2.
  ungroupedColumns.forEach(col => {
    let width;
    if (col.id === 'name') {
      width = `${NAME_WIDTH}px`;
    } else if (col.id === 'token') {
      width = `${TOKEN_WIDTH}px`;
    }
    // Determine current sorting state for this column.
    const currentSort = table.getState().sorting.find(s => s.id === col.id);
    let sortIndicator = '';
    if (currentSort) {
      sortIndicator = currentSort.desc ? '' : '';
    }
    topHeaderCells.push(
      <th
        key={col.id}
        rowSpan="2"
        style={{
          padding: '12px 8px',
          border: '2px solid #333',
          backgroundColor: '#f2f2f2',
          textAlign: 'center',
          width: width,
          ...(col.id === 'name' && { borderRight: '3px solid #333' }),
          cursor: 'pointer',
        }}
        onClick={() => {
          // Toggle sorting for ungrouped columns.
          const currentSort = table.getState().sorting.find(s => s.id === col.id);
          if (currentSort) {
            table.setSorting([{ id: col.id, desc: !currentSort.desc }]);
          } else {
            table.setSorting([{ id: col.id, desc: false }]);
          }
        }}
      >
        <span className="tooltip-container">
          {col.header}{sortIndicator}
          <span className="tooltip-text">
            {col.headerTooltip ? col.headerTooltip : col.accessorKey}
          </span>
        </span>
      </th>
    );
  });

  // Build top header row for grouped columns.
  let i = 0;
  while (i < groupedColumns.length) {
    const currentGroup = groupedColumns[i].group;
    let colSpan = 0;
    let j = i;
    while (j < groupedColumns.length && groupedColumns[j].group === currentGroup) {
      colSpan++;
      j++;
    }
    topHeaderCells.push(
      <th
        key={currentGroup + '-group'}
        colSpan={colSpan}
        style={{
          padding: '12px 8px',
          border: '2px solid #333',
          backgroundColor: '#e0e0e0',
          textAlign: 'center',
          width: `${GROUP_WIDTH}px`,
        }}
      >
        {currentGroup}
      </th>
    );
    i = j;
  }

  // Build bottom header row: for each grouped column, render its subheader with a tooltip and filtering toggle.
  groupedColumns.forEach(col => {
    const count = groupCounts[col.group] || 1;
    const currentFilter = table.getColumn(col.id).getFilterValue();
    const filterIndicator = currentFilter ? (
      <span className="filter-indicator">&#9679;</span>
    ) : null;
    bottomHeaderCells.push(
      <th
        key={col.id}
        style={{
          padding: '12px 8px',
          border: '2px solid #333',
          backgroundColor: '#f2f2f2',
          textAlign: 'center',
          width: `${GROUP_WIDTH / count}px`,
          cursor: 'pointer',
        }}
        onClick={() => {
          // Toggle filter for this column.
          const current = table.getColumn(col.id).getFilterValue();
          table.getColumn(col.id).setFilterValue(current ? undefined : true);
        }}
      >
        <span className="tooltip-container">
          {col.header}{filterIndicator}
          <span className="tooltip-text">
            {col.headerTooltip ? col.headerTooltip : col.accessorKey}
          </span>
        </span>
      </th>
    );
  });

  return (
    <thead>
      <tr>{topHeaderCells}</tr>
      <tr>{bottomHeaderCells}</tr>
    </thead>
  );
}


// ---------------------------------------------------------------------
// Main table component.
function CryptoTable() {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  useEffect(() => {
    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vT8W60RuKy6njMwzDc6zhe7JBl5QuMZ-lTZRDfoj4YvHAG7c2GZlAhAfggRqpN-bziMmfft8I3t27Xa/pub?gid=0&single=true&output=csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const nestedData = results.data.map(row => ({
              name: row.name,
              token: row.token,
              payments: {
                endogenous: row["payments.endogenous"],
                exogenous: row["payments.exogenous"],
              },
              collateral: {
                endogenous: row["collateral.endogenous"],
                exogenous: row["collateral.exogenous"],
              },
              contribution: {
                endogenous: row["contribution.endogenous"],
                exogenous: row["contribution.exogenous"],
              },
              membership: {
                endogenous: row["membership.endogenous"],
                exogenous: row["membership.exogenous"],
              },
              governance: {
                endogenous: row["governance.endogenous"],
                exogenous: row["governance.exogenous"],
              },
              valueredistribution: {
                endogenous: row["valueredistribution.endogenous"],
                exogenous: row["valueredistribution.exogenous"],
              },
              assetownership: {
                endogenous: row["assetownership.endogenous"],
                exogenous: row["assetownership.exogenous"],
              },
            }));
            console.log(nestedData);
            setData(nestedData);
          },
        });
      })
      .catch(error => console.error('Error fetching CSV:', error));
  }, []);

  const table = useReactTable({
    data,
    columns: enhancedColumns,
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

  const baseTdStyle = {
    padding: '12px 8px',
    border: '1px solid #ddd',
    textAlign: 'center',
  };

  const renderCell = (cell) => {
    const cellStyle = { ...baseTdStyle };
    if (cell.column.id === 'name') {
      cellStyle.borderLeft = '2px solid #333';
      cellStyle.width = `${NAME_WIDTH}px`;
      cellStyle.borderRight = '3px solid #333';
    }
    if (cell.column.id === 'token') {
      cellStyle.width = `${TOKEN_WIDTH}px`;
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
      <td key={cell.id} style={cellStyle}>
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

  return (
    <div>
      <input
        value={globalFilter}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Search token..."
        style={{
          marginBottom: '10px',
          padding: '8px',
          fontSize: '16px',
          width: '300px', // Fixed width instead of 100%
        }}
      />
      <table style={tableStyle}>
        <CustomTableHeader columns={enhancedColumns} table={table} />
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(renderCell)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CryptoTable;
