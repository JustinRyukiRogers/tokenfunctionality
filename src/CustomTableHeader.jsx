// src/CustomTableHeader.jsx
import React from 'react';


const PROJECT_WIDTH = 200;
const GROUP_WIDTH = 170;

function CustomTableHeader({ columns, table, groupDescriptions, openModal }) {
  const ungroupedColumns = columns.filter(col => !col.group);
  const groupedColumns = columns.filter(col => col.group);

  const topHeaderCells = [];
  const bottomHeaderCells = [];

  // Compute how many columns each group has
  const groupCounts = {};
  groupedColumns.forEach(col => {
    groupCounts[col.group] = (groupCounts[col.group] || 0) + 1;
  });

  // First row — ungrouped columns
  ungroupedColumns.forEach((col, index, arr) => {
    const width = col.id === 'project' ? `${PROJECT_WIDTH}px` : undefined;
    const currentSort = table.getState().sorting.find(s => s.id === col.id);
    topHeaderCells.push(
      <th
        key={col.id}
        rowSpan="2"
        style={{
          padding: '12px 8px',
          border: '2px solid #333',
          backgroundColor: '#f2f2f2',
          textAlign: 'left',
          width: width,
          ...(col.id === 'project' && { borderLeft: '2px solid #333', borderRight: '3px solid #333' }),
          cursor: 'pointer',
        }}
        className={(arr.length > 1 && index >= arr.length - 2) ? "last-two-cell" : ""}
        onClick={() => {
          const currentSort = table.getState().sorting.find(s => s.id === col.id);
          if (!currentSort) {
            table.setSorting([{ id: col.id, desc: false }]);
          } else if (currentSort.desc === false) {
            table.setSorting([{ id: col.id, desc: true }]);
          } else {
            table.setSorting([]);
          }
        }}
      >
          {col.header}

      </th>
    );
  });

  // First row — group headers
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
          padding: '16px 8px',
          border: '2px solid #333',
          backgroundColor: '#e0e0e0',
          textAlign: 'center',
          width: `${GROUP_WIDTH}px`,
          cursor: 'pointer',
        }}
        onClick={() => {
          const description = groupDescriptions[currentGroup] || "No description available.";
          openModal(currentGroup, description);
        }}
      >
        {currentGroup}
      </th>
    );

    i = j;
  }

  // Second row — individual toggleable headers
  groupedColumns.forEach((col, index, arr) => {
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
        className={index >= arr.length - 2 ? "last-two-cell" : ""}
        onClick={() => {
          const current = table.getColumn(col.id).getFilterValue();
          table.getColumn(col.id).setFilterValue(current ? undefined : true);
        }}
      >
        <span>
          {col.header}{filterIndicator}
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

export default CustomTableHeader;
