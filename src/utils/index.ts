export const exportData = (content: any) => {
  var a = document.createElement('a');
  var file = new Blob([JSON.stringify(content)], { type: 'text/plain' });
  a.href = URL.createObjectURL(file);
  a.download = `${new Date().getTime()}.json`;
  a.click();
};
