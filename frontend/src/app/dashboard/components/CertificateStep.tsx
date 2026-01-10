import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as api from "@/lib/api";
import { FileCheck, Loader2, PenLine, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

interface CertificateStepProps {
  calculationResult: api.CalculationResponse | null;
  loading: boolean;
  onDownloadCertificate: (payload: any) => void;
}

export function CertificateStep({
  calculationResult,
  loading,
  onDownloadCertificate,
}: CertificateStepProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [formData, setFormData] = useState({
    companyName: "Sample Corporation",
    agentName: "Barclays Bank PLC",
    agreementDate: "24 December 2021",
    testDate: new Date().toISOString().split("T")[0],
  });

  // Map calculation result to specific covenant if available
  const leverageCovenant = calculationResult?.covenants.find((c) =>
    c.name.toLowerCase().includes("leverage")
  );

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const handleDownload = () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      // We could show a toast here, but for now we'll allow it or just alert
    }

    const payload = {
      agreement_id: calculationResult?.agreement_id || "",
      company_name: formData.companyName,
      agent_name: formData.agentName,
      agreement_date: formData.agreementDate,
      test_date: formData.testDate,
      leverage_ratio: leverageCovenant?.value || 0,
      leverage_limit: leverageCovenant?.limit || 0,
      compliant: leverageCovenant?.compliant ?? true,
      signature_image: sigCanvas.current?.toDataURL("image/png") || null,
    };

    onDownloadCertificate(payload);
  };

  if (!calculationResult) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            Complete compliance results first
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          Finalize Compliance Certificate
        </CardTitle>
        <CardDescription>
          Provide signatory details and digital verification to generate the
          LMA-compliant PDF.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-sm font-semibold">
              Borrower (Company Name)
            </Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              className="bg-background/50 border-primary/10 focus:border-primary/30 h-10"
              placeholder="e.g. Acme Corp Holdings"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="agentName" className="text-sm font-semibold">
              Facility Agent
            </Label>
            <Input
              id="agentName"
              value={formData.agentName}
              onChange={(e) =>
                setFormData({ ...formData, agentName: e.target.value })
              }
              className="bg-background/50 border-primary/10 focus:border-primary/30 h-10"
              placeholder="e.g. Barclays Bank PLC"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="agreementDate" className="text-sm font-semibold">
              Agreement Date
            </Label>
            <Input
              id="agreementDate"
              value={formData.agreementDate}
              onChange={(e) =>
                setFormData({ ...formData, agreementDate: e.target.value })
              }
              className="bg-background/50 border-primary/10 focus:border-primary/30 h-10"
              placeholder="e.g. 24 December 2021"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="testDate" className="text-sm font-semibold">
              Testing Period End Date
            </Label>
            <Input
              id="testDate"
              type="date"
              value={formData.testDate}
              onChange={(e) =>
                setFormData({ ...formData, testDate: e.target.value })
              }
              className="bg-background/50 border-primary/10 focus:border-primary/30 h-10"
            />
          </div>
        </div>

        {/* Signature Area */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <PenLine className="w-4 h-4 text-primary" />
              Digital Signature (CFO / Director)
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSignature}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Clear Signature
            </Button>
          </div>
          <div className="border border-primary/10 rounded-xl bg-muted/30 overflow-hidden">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="#3b82f6"
              canvasProps={{
                className: "w-full h-40",
              }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground text-center">
            By signing above, you confirm that the financial information
            provided is true and accurate according to the Facilities Agreement.
          </p>
        </div>

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          disabled={loading}
          size="lg"
          className="w-full h-14 text-lg shadow-lg hover:shadow-primary/20 transition-all font-bold"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              Compiling Legal Document...
            </>
          ) : (
            <>
              <FileCheck className="w-5 h-5 mr-3" />
              Generate & Download Signed Certificate
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
