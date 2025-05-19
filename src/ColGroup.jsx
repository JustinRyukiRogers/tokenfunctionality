// ColGroup.jsx
function ColGroup({ columns }) {
  return (
    <colgroup>
      {columns.map(col => {
        let width;
        if (col.id === 'project') {
          width = '200px';
        } else if (col.group) {
          width = `${150 / (columns.filter(c => c.group === col.group).length)}px`;
        }
        return <col key={col.id} style={{ width }} />;
      })}
    </colgroup>
  );
}

export default ColGroup;
