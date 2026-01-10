import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as api from "@/lib/api";
import { cn } from "@/lib/utils";
import { Check, Code as CodeIcon, Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface GenerateStepProps {
  generatedCode: api.GeneratedCodeResponse | null;
  loading: boolean;
  onGenerate: () => void;
  onContinue: () => void;
}

export function GenerateStep({
  generatedCode,
  loading,
  onGenerate,
  onContinue,
}: GenerateStepProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unlock Syndicate Logic</CardTitle>
        <CardDescription>
          Transforming legal prose into executable logic
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-md">
              <CodeIcon className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-cyan-400">
                The "Gold Standard" of Loan Logic
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                This code represents the "Digital Twin" of the legal contract.
                Instead of ambiguous text, we provide a{" "}
                <strong>verifiable source of truth</strong> that can be shared
                across all Lenders in the syndicate to ensure everyone
                calculates compliance identically, every single quarter.
              </p>
            </div>
          </div>
        </div>

        {!generatedCode && (
          <Button
            onClick={onGenerate}
            disabled={loading}
            size="lg"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Code...
              </>
            ) : (
              <>
                <CodeIcon className="w-4 h-4 mr-2" />
                Generate Verifiable Logic
              </>
            )}
          </Button>
        )}

        {generatedCode && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Functions: {generatedCode.functions.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Contract References: {generatedCode.contract_refs.length}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "flex items-center gap-2 transition-all",
                  copied &&
                    "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                )}
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>

            <div className="rounded-lg overflow-hidden border">
              <SyntaxHighlighter
                language="python"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  maxHeight: "500px",
                  fontSize: "0.875rem",
                }}
              >
                {generatedCode.code}
              </SyntaxHighlighter>
            </div>

            <Button onClick={onContinue} className="w-full">
              Continue to Calculations →
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
