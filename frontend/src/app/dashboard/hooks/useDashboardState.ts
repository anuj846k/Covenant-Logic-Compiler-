import * as api from "@/lib/api";
import { useEffect, useState } from "react";

export type Tab =
  | "upload"
  | "extract"
  | "generate"
  | "calculate"
  | "results"
  | "certificate";

interface DashboardState {
  agreementData: api.AgreementUploadResponse | null;
  extractionData: api.ExtractionResponse | null;
  generatedCode: api.GeneratedCodeResponse | null;
  calculationResult: api.CalculationResponse | null;
  financialData: api.FinancialDataInput;
}

export function useDashboardState() {
  const [activeTab, setActiveTab] = useState<Tab>("upload");
  const [agreementData, setAgreementData] =
    useState<api.AgreementUploadResponse | null>(null);
  const [extractionData, setExtractionData] =
    useState<api.ExtractionResponse | null>(null);
  const [generatedCode, setGeneratedCode] =
    useState<api.GeneratedCodeResponse | null>(null);
  const [calculationResult, setCalculationResult] =
    useState<api.CalculationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCovenant, setEditingCovenant] = useState<number | null>(null);

  const [financialData, setFinancialData] = useState<api.FinancialDataInput>({
    agreement_id: "",
    consolidated_ebit: 65000000,
    depreciation: 15000000,
    amortisation: 3000000,
    impairment_costs: 8000000,
    senior_debt: 400000000,
    total_debt: 450000000,
    interest_expense: 12000000,
    principal_payments: 10000000,
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("axiom_dashboard_state");
    if (saved) {
      try {
        const state: DashboardState = JSON.parse(saved);
        setAgreementData(state.agreementData);
        setExtractionData(state.extractionData);
        setGeneratedCode(state.generatedCode);
        setCalculationResult(state.calculationResult);
        setFinancialData(state.financialData);
      } catch (e) {
        console.error("Failed to load saved state", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    const state: DashboardState = {
      agreementData,
      extractionData,
      generatedCode,
      calculationResult,
      financialData,
    };
    localStorage.setItem("axiom_dashboard_state", JSON.stringify(state));
  }, [
    agreementData,
    extractionData,
    generatedCode,
    calculationResult,
    financialData,
  ]);

  const clearAllData = () => {
    localStorage.removeItem("axiom_dashboard_state");
    setAgreementData(null);
    setExtractionData(null);
    setGeneratedCode(null);
    setCalculationResult(null);
    setActiveTab("upload");
  };

  const tabsCompleted = {
    upload: !!agreementData,
    extract: !!extractionData,
    generate: !!generatedCode,
    calculate: !!calculationResult,
    results: !!calculationResult,
    certificate: !!calculationResult,
  };

  return {
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
  };
}
