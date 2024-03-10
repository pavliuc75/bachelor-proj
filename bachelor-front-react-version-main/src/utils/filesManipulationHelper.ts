function downloadFile(name: string, content: BlobPart, mimeType: any) {
  let a = document.createElement("a");
  let blob = new Blob([content], { type: mimeType });
  a.href = window.URL.createObjectURL(blob);
  a.download = name;
  a.click();
}

export const filesManipulationHelper = { downloadFile };
