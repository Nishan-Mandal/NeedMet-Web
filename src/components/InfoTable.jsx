import '../style/InfoTable.css'

function InfoTable({ title, columns, rows , style, fixHeight}) {
  if(rows.length == 0) {
    return (
      <div className={`info-section`} style={style}>
        <h2>{title}</h2>

        <div className="table-container">
          No Info
        </div>
      </div>
    )
  }

  return (
    <div className={`info-section`} style={style}>
      <h2>{title}</h2>

      <div 
        className="table-container"
        style={fixHeight ? { maxHeight: fixHeight, overflowY: "auto" } : {}}
      >
        <table className="info-table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, i) => (
                  <td key={i}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InfoTable;