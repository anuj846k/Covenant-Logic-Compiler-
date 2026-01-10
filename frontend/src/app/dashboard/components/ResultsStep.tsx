import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as api from "@/lib/api";
import { AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";

interface ResultsStepProps {
  calculationResult: api.CalculationResponse | null;
  onContinue: () => void;
}

export function ResultsStep({
  calculationResult,
  onContinue,
}: ResultsStepProps) {
  if (!calculationResult) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            Run calculations first to see compliance results
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Analysis Results</CardTitle>
        <CardDescription>
          Detailed breakdown of financial covenant testing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card
          className={
            calculationResult.all_compliant
              ? "border-green-500/50 bg-green-500/5"
              : "border-destructive/50 bg-destructive/5"
          }
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {calculationResult.all_compliant ? (
                <>
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-lg font-semibold text-green-500">
                      Compliance Confirmed
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Calculated EBITDA: $
                      {(calculationResult.ebitda / 1000000).toFixed(2)}M
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-8 h-8 text-destructive" />
                  <div>
                    <p className="text-lg font-semibold text-destructive">
                      Covenant Breach Identified
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Breached:{" "}
                      {calculationResult.breached_covenants.join(", ")}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Covenant Test Summary
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground">
                  Covenant
                </TableHead>
                <TableHead className="text-muted-foreground">Actual</TableHead>
                <TableHead className="text-muted-foreground">Limit</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">
                  Audit Ref
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calculationResult.covenants.map((covenant, index) => (
                <TableRow key={index} className="hover:bg-muted/30">
                  <TableCell className="font-medium text-foreground">
                    {covenant.name}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {covenant.value.toFixed(2)}x
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {covenant.limit.toFixed(2)}x ({covenant.limit_type})
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={covenant.compliant ? "default" : "destructive"}
                      className={
                        covenant.compliant
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : ""
                      }
                    >
                      {covenant.compliant ? "Pass" : "Fail"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {covenant.section_ref}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Button
          onClick={onContinue}
          size="lg"
          className="w-full h-12 text-base"
        >
          Continue to Certification <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
