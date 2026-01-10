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
import { Calculator as CalculatorIcon, Loader2 } from "lucide-react";

interface CalculateStepProps {
  financialData: api.FinancialDataInput;
  loading: boolean;
  onUpdateFinancialData: (field: string, value: number) => void;
  onCalculate: () => void;
}

const FINANCIAL_FIELDS = [
  { id: "ebit", label: "Consolidated EBIT ($)", field: "consolidated_ebit" },
  { id: "depreciation", label: "Depreciation ($)", field: "depreciation" },
  { id: "amortisation", label: "Amortisation ($)", field: "amortisation" },
  {
    id: "impairment",
    label: "Impairment Costs ($)",
    field: "impairment_costs",
  },
  { id: "senior-debt", label: "Senior Debt ($)", field: "senior_debt" },
  { id: "total-debt", label: "Total Debt ($)", field: "total_debt" },
  { id: "interest", label: "Interest Expense ($)", field: "interest_expense" },
  {
    id: "principal",
    label: "Principal Payments ($)",
    field: "principal_payments",
  },
];

export function CalculateStep({
  financialData,
  loading,
  onUpdateFinancialData,
  onCalculate,
}: CalculateStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculate Covenant Compliance</CardTitle>
        <CardDescription>
          Enter financial data to calculate covenant compliance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FINANCIAL_FIELDS.map((item) => (
            <div key={item.id} className="space-y-2">
              <Label htmlFor={item.id}>{item.label}</Label>
              <Input
                id={item.id}
                type="number"
                value={
                  financialData[item.field as keyof api.FinancialDataInput]
                }
                onChange={(e) =>
                  onUpdateFinancialData(item.field, Number(e.target.value))
                }
              />
            </div>
          ))}
        </div>

        <Button
          onClick={onCalculate}
          disabled={loading}
          size="lg"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <CalculatorIcon className="w-4 h-4 mr-2" />
              Calculate Compliance
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
