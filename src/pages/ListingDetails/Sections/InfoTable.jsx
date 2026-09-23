function InfoTable({ title, columns, rows, style, fixHeight }) {
  if (rows.length === 0) {
    return (
      <div
        className="w-full flex flex-col justify-center items-center bg-surface border border-border shadow-[0_4px_10px_rgba(15,92,63,0.226),0_1px_2px_rgba(0,0,0,0.11)] rounded-[1rem] p-[1.4rem] max-[768px]:p-[1.1rem] max-[768px]:rounded-[0.9rem] max-[480px]:p-[1rem] max-[480px]:rounded-[0.85rem] font-primary"
        style={style}
      >
        <h2 className="font-heading font-bold text-[1.2rem] max-[768px]:text-[1.08rem] max-[480px]:text-[1rem] text-text-accent text-center mb-[1.5rem] max-[768px]:mb-[1.2rem] max-[480px]:mb-[1rem]">
          {title}
        </h2>

        <div className="text-center text-text-secondary text-[0.92rem]">
          No Data Available
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full flex flex-col justify-center items-center bg-surface border border-border shadow-[0_4px_10px_rgba(15,92,63,0.226),0_1px_2px_rgba(0,0,0,0.11)] rounded-[1rem] p-[1.4rem] max-[768px]:p-[1.1rem] max-[768px]:rounded-[0.9rem] max-[480px]:p-[1rem] max-[480px]:rounded-[0.85rem] font-primary"
      style={style}
    >
      <h2 className="font-heading font-bold text-[1.2rem] max-[768px]:text-[1.08rem] max-[480px]:text-[1rem] text-text-accent text-center mb-[1.5rem] max-[768px]:mb-[1.2rem] max-[480px]:mb-[1rem]">
        {title}
      </h2>

      <div
        className="w-full overflow-x-auto rounded-[0.9rem] max-[768px]:rounded-[0.8rem] max-[480px]:rounded-[0.75rem] text-center max-[480px]:max-h-none! max-[480px]:overflow-y-visible!"
        style={fixHeight ? { maxHeight: fixHeight, overflowY: "auto" } : {}}
      >
        <table className="w-full border-collapse table-fixed overflow-hidden rounded-[0.9rem] max-[768px]:rounded-[0.8rem] max-[480px]:rounded-[0.75rem] bg-surface">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="bg-primary-surface text-primary text-[0.92rem] max-[768px]:text-[0.84rem] max-[480px]:text-[0.74rem] font-bold font-heading border border-border p-[0.9rem_1rem] max-[768px]:p-[0.75rem_0.8rem] max-[480px]:p-[0.65rem_0.55rem] text-center tracking-[0.02em]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="hover:bg-primary/[0.025] transition-colors">
                {row.map((cell, i) => (
                  <td
                    key={i}
                    className="text-[0.9rem] max-[768px]:text-[0.84rem] max-[480px]:text-[0.76rem] max-[480px]:leading-[1.45] text-text bg-surface border border-border p-[0.9rem_1rem] max-[768px]:p-[0.75rem_0.8rem] max-[480px]:p-[0.65rem_0.55rem] text-center break-words"
                  >
                    {cell}
                  </td>
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
