import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConcentricLoader } from "@/components/ui/loader";
import * as api from "@/lib/api";
import {
  CheckCircle2,
  Cpu,
  FileSearch,
  Loader2,
  ShieldCheck,
  Upload as UploadIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

interface UploadStepProps {
  agreementData: api.AgreementUploadResponse | null;
  loading: boolean;
  onUploadSuccess: (data: api.AgreementUploadResponse) => void;
  onSetLoading: (loading: boolean) => void;
  onError: (error: string) => void;
  onContinue: () => void;
}

export function UploadStep({
  agreementData,
  loading,
  onUploadSuccess,
  onSetLoading,
  onError,
  onContinue,
}: UploadStepProps) {
  const [loadingStatus, setLoadingStatus] = useState(0);
  const statuses = [
    { text: "Securing connection...", icon: ShieldCheck },
    { text: "Uploading to vault...", icon: UploadIcon },
    { text: "Scanning document architecture...", icon: FileSearch },
    { text: "Extracting semantic definitions...", icon: Cpu },
    { text: "Finalizing agreement index...", icon: Loader2 },
  ];

  useEffect(() => {
    if (!loading) {
      setLoadingStatus(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingStatus((prev) => (prev + 1) % statuses.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [loading]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    onError("");
    onSetLoading(true);

    try {
      const response = await api.uploadAgreement(file);
      onUploadSuccess(response);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Upload failed");
      onSetLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload LMA Agreement</CardTitle>
        <CardDescription>
          Upload your LMA loan agreement PDF to begin covenant extraction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <UploadIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          {isDragActive ? (
            <p className="text-lg">Drop the PDF here...</p>
          ) : (
            <>
              <p className="text-lg mb-2">
                Drag & drop your LMA agreement PDF here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse files
              </p>
            </>
          )}
        </div>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
            >
              <div className="relative flex flex-col items-center">
                {/* Visual Accent - Pulsing Glow */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-cyan-500 rounded-full blur-3xl -z-10"
                />

                {/* Main Spinner Ring */}
                <div className="relative mb-8">
                  <ConcentricLoader />
                </div>

                {/* Text Content */}
                <motion.div
                  className="text-center space-y-2"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <h3 className="text-xl font-semibold bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Axiom Intelligence
                  </h3>
                  <div className="flex flex-col items-center gap-1">
                    <motion.p
                      key={loadingStatus}
                      initial={{ y: 5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-sm font-mono text-cyan-500/80 tracking-widest uppercase"
                    >
                      {statuses[loadingStatus].text}
                    </motion.p>
                    <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mt-4">
                      <motion.div
                        className="h-full bg-cyan-500"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {agreementData && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Upload Successful
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">
                    Filename:
                  </span>
                  <p className="font-medium">{agreementData.filename}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Pages:</span>
                  <p className="font-medium">{agreementData.page_count}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Definitions Found:
                  </span>
                  <p className="font-medium">
                    {agreementData.definitions_found ? (
                      <Badge variant="default">
                        Yes ({agreementData.definitions_page_range})
                      </Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Agreement ID:
                  </span>
                  <p className="font-mono text-sm">
                    {agreementData.agreement_id}
                  </p>
                </div>
              </div>
              <Button onClick={onContinue} className="w-full mt-4">
                Continue to Extraction →
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
