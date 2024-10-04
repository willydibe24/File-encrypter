const triggerDownload = (blob: Blob, format: string, fileName?: string): void => {
    const link = document.createElement("a");
    
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName ? fileName : crypto.randomUUID().substring(0, 16)}${format}`;
    document.body.append(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(link.href), 5000);
}

export default triggerDownload;