// types.d.ts
declare type UploadToFirebaseOptions = {
    uri: string;
    name: string;
    onProgress?: (progress: number) => void;
  };
  
  declare const uploadToFirebase: (options: UploadToFirebaseOptions) => Promise<any>;
  