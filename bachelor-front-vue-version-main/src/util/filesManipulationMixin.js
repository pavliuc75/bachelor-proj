export default {
  methods: {
    downloadFile(name, content, mimeType) {
      let a = document.createElement("a");
      let blob = new Blob([content], { "type": mimeType });
      a.href = window.URL.createObjectURL(blob);
      a.download = name;
      a.click();
    }
  }
};