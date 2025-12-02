interface FileData {
  file: File;
  key: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createFormData<T extends { [index: string]: any }>(
  data: T,
  appendFile?: FileData
) {
  const formData = new FormData();
  if (appendFile) {
    formData.append(appendFile.key, appendFile.file);
  }

  Object.keys(data)
    .filter(Boolean)
    .forEach((key: string) => {
      formData.append(key, data[key]);
    });

  return formData;
}
