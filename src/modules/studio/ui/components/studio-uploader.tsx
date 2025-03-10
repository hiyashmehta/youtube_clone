import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import MuxUploader from "@mux/mux-uploader-react";
import MuxUploaderDrop from "@mux/mux-uploader-react";
import MuxUploaderFileSelect from "@mux/mux-uploader-react";
import MuxUploaderStatus from "@mux/mux-uploader-react";
import MuxUploaderProgress from "@mux/mux-uploader-react";

interface StudioUploaderProps {
  endpoint?: string | null;
  onSuccess: () => void;
}

const UPLOADER_ID = "video-uploader";

export const StudioUploader = ({
  endpoint,
  onSuccess
}: StudioUploaderProps) => {
  return (
    <div>
      <MuxUploader
        onSuccess={onSuccess}
        endpoint={endpoint}
        id={UPLOADER_ID}
        className="hidden group/uploader"
      />
      <MuxUploaderDrop id={UPLOADER_ID} className="group/drop">
        <div slot="heading" className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center gap-2 rounded-full bg-muted h-32 w-32">
            <UploadIcon className="size-10 text-muted-foreground group/drop-[&[active]]:animate-bounce transition-all duration-300" />
          </div>
          <div className="flex flex-col gap-2 text-center">
            <p className="text-sm">Drag and drop video files to upload</p>
            <p className="text-xs text-muted-foreground">
              Your videos will be private until you publish them.
            </p>
          </div>
          <MuxUploaderFileSelect id={UPLOADER_ID}>
            <Button type="button" className="rounded-full">
              Select Files
            </Button>
          </MuxUploaderFileSelect>
        </div>
        <span slot="separator" className="hidden" />
        <MuxUploaderStatus id={UPLOADER_ID} className="text-sm" />
        <MuxUploaderProgress id={UPLOADER_ID} className="text-sm" type="percentage" />
        <MuxUploaderProgress id={UPLOADER_ID} type="bar" />
      </MuxUploaderDrop>
    </div>
  );
};

export default StudioUploader;