import axios from "axios";

export const downloadFile = async (url: string, defaultFilename?: string) => {
  await axios.get(url, { responseType: 'blob' })
    .then(response => {
      const href = window.URL.createObjectURL(response.data);

      const anchorElement = document.createElement('a');

      anchorElement.href = href;

      // 1) Get the value of content-disposition header
      const contentDisposition =
        response.headers['content-disposition'];

      // 2) set the fileName variable to the default value
      let fileName = defaultFilename;

      // 3) if the header is set, extract the filename
      if (contentDisposition) {
        const fileNameMatch =
          contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch.length === 2) {
          fileName = fileNameMatch[1];
        }
      }

      anchorElement.download = fileName || 'download';

      document.body.appendChild(anchorElement);
      anchorElement.click();

      document.body.removeChild(anchorElement);
      window.URL.revokeObjectURL(href);
    });
}
