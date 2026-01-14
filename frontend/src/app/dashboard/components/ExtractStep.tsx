import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as api from "@/lib/api";
import {
  Brain,
  Database,
  Edit3,
  FileText,
  HelpCircle,
  Loader2,
  Pencil,
  Save,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

// Loading steps with icons and messages
const LOADING_STEPS = [
  {
    icon: Database,
    message: "Indexing document into vector store...",
    progress: 15,
  },
  {
    icon: Brain,
    message: "Building semantic embeddings with AI...",
    progress: 30,
  },
  {
    icon: Search,
    message: "Searching for EBITDA definitions...",
    progress: 45,
  },
  {
    icon: Search,
    message: "Locating financial covenant clauses...",
    progress: 60,
  },
  {
    icon: Sparkles,
    message: "Extracting ratio limits & thresholds...",
    progress: 75,
  },
  {
    icon: Brain,
    message: "Analyzing covenant structure with LLM...",
    progress: 85,
  },
  { icon: Sparkles, message: "Finalizing extraction results...", progress: 95 },
];

interface ExtractStepProps {
  agreementData: api.AgreementUploadResponse | null;
  extractionData: api.ExtractionResponse | null;
  loading: boolean;
  editingCovenant: number | null;
  onExtract: () => void;
  onUpdateCovenant: (
    index: number,
    field: keyof api.CovenantDefinition,
    value: any
  ) => void;
  onUpdateEbitdaComponent: (
    type: "add_backs" | "deductions" | "caps",
    index: number,
    field: string,
    value: any
  ) => void;
  onDeleteCovenant: (index: number) => void;
  onSaveCovenants: () => void;
  onSetEditingCovenant: (index: number | null) => void;
  onAddCovenant: () => void;
  onContinue: () => void;
}

export function ExtractStep({
  extractionData,
  loading,
  editingCovenant,
  onExtract,
  onUpdateCovenant,
  onUpdateEbitdaComponent,
  onDeleteCovenant,
  onSaveCovenants,
  onSetEditingCovenant,
  onAddCovenant,
  onContinue,
}: ExtractStepProps) {
  const [editingEbitda, setEditingEbitda] = useState<{
    type: "add_backs" | "deductions" | "caps";
    index: number;
  } | null>(null);

  // Animated loading step
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (!loading) {
      setLoadingStep(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval);
  }, [loading]);

  const currentStep = LOADING_STEPS[loadingStep];
  const StepIcon = currentStep?.icon || Database;

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Covenant Extraction
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              AI-extracted covenant definitions for your review
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
          >
            Phase 2: Human Verification
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-0 space-y-8">
        {!extractionData && (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/10 rounded-xl bg-white/[0.02]">
            <Button
              onClick={onExtract}
              disabled={loading}
              size="lg"
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 h-12 text-base font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Running AI Extraction...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-3" />
                  Analyze Agreement
                </>
              )}
            </Button>

            {loading && (
              <div className="mt-8 w-full max-w-md space-y-6">
                {/* Animated Progress Bar */}
                <div className="space-y-2">
                  <Progress
                    value={currentStep?.progress || 0}
                    className="h-2 bg-white/5 transition-all duration-1000"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Processing...</span>
                    <span>{currentStep?.progress || 0}%</span>
                  </div>
                </div>

                {/* Current Step with Icon */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20 animate-pulse">
                  <div className="p-3 rounded-full bg-cyan-500/10">
                    <StepIcon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {currentStep?.message || "Processing..."}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Step {loadingStep + 1} of {LOADING_STEPS.length}
                    </p>
                  </div>
                  <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                </div>

                {/* What's happening */}
                <div className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground">
                    🧠 AI is reading your agreement and extracting covenant
                    definitions
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    This may take 30-60 seconds for complex documents
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {extractionData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            {/* EBITDA SECTION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  EBITDA Analysis
                </h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-cyan-400 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-slate-900 border-slate-800">
                      <p className="text-xs">
                        Based on the definition found on Page{" "}
                        {extractionData.ebitda_definition?.page}. Components
                        without unique sub-clauses are linked to the main
                        section.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {extractionData.ebitda_definition && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-white/[0.03] border-white/10 overflow-hidden">
                    <div className="h-1 bg-cyan-500/50 w-full" />
                    <CardContent className="p-4 space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Base Metric
                      </span>
                      <p className="text-sm font-semibold text-white truncate">
                        {extractionData.ebitda_definition.base_metric ||
                          "Consolidated EBIT"}
                      </p>
                      <p
                        className="text-[10px] font-mono text-cyan-400 truncate"
                        title={extractionData.ebitda_definition.section_ref}
                      >
                        {extractionData.ebitda_definition.section_ref}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="col-span-1 md:col-span-2 bg-white/[0.03] border-white/10 overflow-hidden">
                    <div className="h-1 bg-amber-500/50 w-full" />
                    <CardContent className="p-4">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block font-mono">
                        Add-Backs & Adjustments
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {extractionData.ebitda_definition.add_backs?.map(
                          (ab, i) => {
                            const isEditing =
                              editingEbitda?.type === "add_backs" &&
                              editingEbitda.index === i;
                            // Fallback to main section if sub-ref is missing
                            const ref =
                              ab.section_ref === "Unspecified" ||
                              !ab.section_ref
                                ? extractionData.ebitda_definition?.section_ref
                                : ab.section_ref;

                            return (
                              <div
                                key={i}
                                className="flex items-center gap-1 group"
                              >
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] px-2 py-0.5 border-white/10 bg-white/5 text-white/90 font-medium transition-all group-hover:border-cyan-500/50 max-w-[200px] sm:max-w-[300px] overflow-hidden ${
                                    ab.section_ref === "Unspecified"
                                      ? "border-amber-500/30"
                                      : ""
                                  }`}
                                >
                                  <span className="truncate mr-1">
                                    {ab.name}
                                  </span>
                                  <span className="mx-1 text-muted-foreground/30 flex-shrink-0">
                                    |
                                  </span>
                                  <span
                                    className="text-cyan-400/80 font-mono italic truncate"
                                    title={ref}
                                  >
                                    {ref}
                                  </span>
                                </Badge>
                                {!isEditing && (
                                  <button
                                    onClick={() =>
                                      setEditingEbitda({
                                        type: "add_backs",
                                        index: i,
                                      })
                                    }
                                    className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-cyan-400"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                )}
                                {isEditing && (
                                  <Input
                                    value={ab.section_ref}
                                    onChange={(e) =>
                                      onUpdateEbitdaComponent(
                                        "add_backs",
                                        i,
                                        "section_ref",
                                        e.target.value
                                      )
                                    }
                                    className="h-6 w-24 text-[10px] font-mono p-1 bg-black/50 border-cyan-500/50"
                                    onBlur={() => setEditingEbitda(null)}
                                    autoFocus
                                  />
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* COVENANTS TABLE */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">
                Financial Covenants
              </h3>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/[0.03]">
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-muted-foreground font-mono text-[11px] uppercase tracking-wider">
                        Covenant
                      </TableHead>
                      <TableHead className="text-muted-foreground font-mono text-[11px] uppercase tracking-wider">
                        Limit
                      </TableHead>
                      <TableHead className="text-muted-foreground font-mono text-[11px] uppercase tracking-wider">
                        Type
                      </TableHead>
                      <TableHead className="text-muted-foreground font-mono text-[11px] uppercase tracking-wider">
                        Reference
                      </TableHead>
                      <TableHead className="text-right text-muted-foreground font-mono text-[11px] uppercase tracking-wider">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {extractionData.covenants?.map((covenant, index) => {
                      const covenantName = covenant.name || "Unknown Covenant";
                      const covenantLimit = Number(covenant.limit_value) || 0;
                      const covenantSection = covenant.section_ref || "";

                      return (
                        <TableRow
                          key={index}
                          className="border-white/10 hover:bg-white/[0.01]"
                        >
                          <TableCell>
                            {editingCovenant === index ? (
                              <Input
                                value={covenantName}
                                onChange={(e) =>
                                  onUpdateCovenant(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="h-8 bg-transparent border-cyan-500/50"
                              />
                            ) : (
                              <span className="font-semibold text-sm text-white">
                                {covenantName}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingCovenant === index ? (
                              <Input
                                type="text"
                                value={covenant.limit_value ?? ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  // Allow empty string or numbers/decimals
                                  if (val === "" || /^\d*\.?\d*$/.test(val)) {
                                    onUpdateCovenant(index, "limit_value", val);
                                  }
                                }}
                                className="h-8 w-24 bg-transparent border-cyan-500/50 font-mono text-cyan-400"
                                placeholder="0.00"
                              />
                            ) : (
                              <span className="text-cyan-400 font-mono font-bold">
                                {Number(covenant.limit_value || 0).toFixed(2)}x
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                covenant.limit_type === "max"
                                  ? "border-amber-500/30 text-amber-500 bg-amber-500/5"
                                  : "border-green-500/30 text-green-500 bg-green-500/5"
                              }
                            >
                              {covenant.limit_type === "max"
                                ? "≤ MAX"
                                : "≥ MIN"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {editingCovenant === index ? (
                              <Input
                                value={covenantSection}
                                onChange={(e) =>
                                  onUpdateCovenant(
                                    index,
                                    "section_ref",
                                    e.target.value
                                  )
                                }
                                className="h-8 font-mono text-sm bg-transparent border-cyan-500/50"
                              />
                            ) : (
                              <span className="font-mono text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded">
                                {covenantSection}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              {editingCovenant === index ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={onSaveCovenants}
                                  className="h-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                                >
                                  <Save className="w-4 h-4 mr-1.5" />
                                  Save
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onSetEditingCovenant(index)}
                                  className="h-8 text-muted-foreground hover:text-white"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteCovenant(index)}
                                className="h-8 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onAddCovenant}
                    className="w-full justify-start text-xs text-muted-foreground hover:text-cyan-400 hover:bg-cyan-500/5 border border-dashed border-white/10 hover:border-cyan-500/30 py-6"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Manual Covenant Row
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                LMA Standard Analysis Complete
              </p>
              <Button
                onClick={onContinue}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-10 h-11 transition-all hover:translate-x-1"
              >
                Continue to Code Generation →
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper icons
function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
