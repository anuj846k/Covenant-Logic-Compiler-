"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import * as api from "@/lib/api";
import { AlertCircle, CheckCircle2, Trash2 } from "lucide-react";
import { CalculateStep } from "./components/CalculateStep";
import { CertificateStep } from "./components/CertificateStep";
import { ExtractStep } from "./components/ExtractStep";
import { GenerateStep } from "./components/GenerateStep";
import { ResultsStep } from "./components/ResultsStep";
import { UploadStep } from "./components/UploadStep";
import { Tab, useDashboardState } from "./hooks/useDashboardState";

const steps = [
  { id: "upload", label: "Upload", number: 1 },
  { id: "extract", label: "Extract", number: 2 },
  { id: "generate", label: "Code", number: 3 },
  { id: "calculate", label: "Calculate", number: 4 },
  { id: "results", label: "Results", number: 5 },
  { id: "certificate", label: "Certificate", number: 6 },
] as const;

export default function DashboardPage() {
  const {
    activeTab,
    setActiveTab,
    agreementData,
    setAgreementData,
    extractionData,
    setExtractionData,
    generatedCode,
    setGeneratedCode,
    calculationResult,
    setCalculationResult,
    loading,
    setLoading,
    error,
    setError,
    editingCovenant,
    setEditingCovenant,
    financialData,
    setFinancialData,
    clearAllData,
    tabsCompleted,
  } = useDashboardState();

  const handleUploadSuccess = (data: api.AgreementUploadResponse) => {
    setAgreementData(data);
    setFinancialData({ ...financialData, agreement_id: data.agreement_id });
    setLoading(false);
  };

  const handleExtract = async () => {
    if (!agreementData) return;
    setLoading(true);
    setError("");

    try {
      const response = await api.extractCovenants(agreementData.agreement_id);
      setExtractionData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Extraction failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    if (!agreementData) return;
    setLoading(true);
    setError("");

    try {
      const response = await api.generateCode(agreementData.agreement_id);
      setGeneratedCode(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Code generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.calculateCovenants(financialData);
      setCalculationResult(response);
      setActiveTab("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Calculation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (payload: any) => {
    setLoading(true);
    setError("");

    try {
      const blob = await api.downloadCertificate(payload);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Compliance_Certificate_${payload.company_name.replace(
        /\s+/g,
        "_"
      )}_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Certificate generation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateCovenant = (
    index: number,
    field: keyof api.CovenantDefinition,
    value: any
  ) => {
    if (!extractionData) return;
    const updated = [...extractionData.covenants];
    updated[index] = { ...updated[index], [field]: value };
    setExtractionData({ ...extractionData, covenants: updated });
  };

  const deleteCovenant = (index: number) => {
    if (!extractionData) return;
    const updated = extractionData.covenants.filter((_, i) => i !== index);
    setExtractionData({ ...extractionData, covenants: updated });
  };

  const updateEbitdaComponent = (
    type: "add_backs" | "deductions" | "caps",
    index: number,
    field: string,
    value: any
  ) => {
    if (!extractionData || !extractionData.ebitda_definition) return;
    const definition = { ...extractionData.ebitda_definition };
    const list = [...(definition[type] as any[])];
    list[index] = { ...list[index], [field]: value };
    setExtractionData({
      ...extractionData,
      ebitda_definition: { ...definition, [type]: list },
    });
  };

  const saveCovenantsToBackend = async () => {
    if (!extractionData || !agreementData) return;

    try {
      await api.updateCovenants(
        agreementData.agreement_id,
        extractionData.covenants,
        extractionData.ebitda_definition
      );
      // Now it's truly persisted!
      setEditingCovenant(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save covenants");
    }
  };

  const handleAddCovenant = () => {
    if (!extractionData) return;

    const newCovenant: api.CovenantDefinition = {
      name: "New Covenant",
      limit_value: 0,
      limit_type: "max",
      section_ref: "Clause 24.2",
    };

    setExtractionData({
      ...extractionData,
      covenants: [...(extractionData.covenants || []), newCovenant],
    });

    // Auto-enter edit mode for the new row
    setEditingCovenant((extractionData.covenants || []).length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                Covenant Logic Compiler
              </h1>
              <p className="text-muted-foreground">
                Transform LMA loan agreements into executable Python code
              </p>
            </div>
            {agreementData && (
              <Button variant="outline" onClick={clearAllData} size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Data
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Sidebar Layout */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Steps */}
          <div className="col-span-3">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  {steps.map((step, index) => {
                    const isActive = activeTab === step.id;
                    const isCompleted = tabsCompleted[step.id as Tab];
                    const isDisabled =
                      index > 0 && !tabsCompleted[steps[index - 1].id as Tab];

                    return (
                      <button
                        key={step.id}
                        onClick={() =>
                          !isDisabled && setActiveTab(step.id as Tab)
                        }
                        disabled={isDisabled}
                        className={`w-full text-left p-4 rounded-lg transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : isCompleted
                            ? "bg-muted hover:bg-muted/80"
                            : "hover:bg-muted/50"
                        } ${
                          isDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                              isActive
                                ? "bg-primary-foreground text-primary"
                                : isCompleted
                                ? "bg-green-500 text-white"
                                : "bg-muted-foreground/20 text-muted-foreground"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              step.number
                            )}
                          </div>
                          <span className="font-medium">{step.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content Area */}
          <div className="col-span-9">
            {/* Error Display */}
            {error && (
              <Card className="mb-6 border-destructive">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium">{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step Content */}
            {activeTab === "upload" && (
              <UploadStep
                agreementData={agreementData}
                loading={loading}
                onSetLoading={setLoading}
                onUploadSuccess={handleUploadSuccess}
                onError={setError}
                onContinue={() => setActiveTab("extract")}
              />
            )}

            {activeTab === "extract" && (
              <ExtractStep
                agreementData={agreementData}
                extractionData={extractionData}
                loading={loading}
                editingCovenant={editingCovenant}
                onExtract={handleExtract}
                onUpdateCovenant={updateCovenant}
                onUpdateEbitdaComponent={updateEbitdaComponent}
                onDeleteCovenant={deleteCovenant}
                onSaveCovenants={saveCovenantsToBackend}
                onSetEditingCovenant={setEditingCovenant}
                onAddCovenant={handleAddCovenant}
                onContinue={() => setActiveTab("generate")}
              />
            )}

            {activeTab === "generate" && (
              <GenerateStep
                generatedCode={generatedCode}
                loading={loading}
                onGenerate={handleGenerateCode}
                onContinue={() => setActiveTab("calculate")}
              />
            )}

            {activeTab === "calculate" && (
              <CalculateStep
                financialData={financialData}
                loading={loading}
                onUpdateFinancialData={(field, value) =>
                  setFinancialData({ ...financialData, [field]: value })
                }
                onCalculate={handleCalculate}
              />
            )}

            {activeTab === "results" && (
              <ResultsStep
                calculationResult={calculationResult}
                onContinue={() => setActiveTab("certificate")}
              />
            )}

            {activeTab === "certificate" && (
              <CertificateStep
                calculationResult={calculationResult}
                loading={loading}
                onDownloadCertificate={handleDownloadCertificate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
