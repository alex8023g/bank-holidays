export function requestForLeaveWord(text: string) {
  const data = new Blob([text], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  const textFile = window.URL.createObjectURL(data);
  const a = document.createElement('a');
  a.setAttribute('id', 'download');
  a.setAttribute('href', textFile);
  a.setAttribute('download', '');
  a.textContent = 'Click here to download the test for the students';
  a.download = 'Заявление_на_отпуск.docx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(textFile);
}
