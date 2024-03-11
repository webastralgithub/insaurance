import React from 'react';
import * as XLSX from 'xlsx';

const ExampleFileDownload = () => {
  const downloadExampleExcel = () => {
    const data = [
      ['firstname', 'Email', 'address1', 'phone'],
      ['John Doe', 'johndoe@example.com', '123 Main St', '123-456-7890'],
      ['Jane Smith', 'janesmith@example.com', '456 Oak Ave', '987-654-3210']
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ExampleSheet');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'example.xlsx');
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <button onClick={downloadExampleExcel}>Download Example Excel</button>
    </div>
  );
};

export default ExampleFileDownload;
