const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/agreements";

export interface AgreementUploadResponse {
  agreement_id: string;
  filename: string;
  page_count: number;
  s3_key: string;
  upload_time: string;
  definitions_found: boolean;
  definitions_page_range: string | null;
}

export interface EBITDAAdjustment {
  name: string;
  section_ref: string;
  page: number;
}

export interface EBITDACap {
  item: string;
  cap_type: string;
  cap_value: number;
  section_ref: string;
}

export interface EBITDADefinition {
  base_metric: string;
  section_ref: string;
  page: number;
  add_backs: EBITDAAdjustment[];
  deductions: EBITDAAdjustment[];
  caps: EBITDACap[];
  full_legal_text?: string;
}

export interface CovenantDefinition {
  name: string;
  limit_value: number;
  limit_type: string;
  formula?: string;
  legal_text?: string;
  section_ref: string;
  page?: number;
  // UI helpers
  limit?: number; // fallback
  section?: string; // fallback
}

export interface ExtractionResponse {
  agreement_id: string;
  extraction_time: string;
  success: boolean;
  ebitda_definition: EBITDADefinition | null;
  covenants: CovenantDefinition[];
  raw_response?: string;
}

export interface GeneratedCodeResponse {
  agreement_id: string;
  code: string;
  functions: string[];
  generation_time: string;
  contract_refs: string[];
}

export interface CovenantResult {
  name: string;
  value: number;
  limit: number;
  limit_type: string;
  compliant: boolean;
  section_ref: string;
}

export interface CalculationResponse {
  agreement_id: string;
  calculation_time: string;
  ebitda: number;
  covenants: CovenantResult[];
  all_compliant: boolean;
  breached_covenants: string[];
  trace: Record<string, any>;
}

export interface FinancialDataInput {
  agreement_id: string;
  consolidated_ebit: number;
  depreciation: number;
  amortisation: number;
  impairment_costs: number;
  senior_debt: number;
  total_debt: number;
  interest_expense: number;
  principal_payments: number;
}

export async function uploadAgreement(
  file: File
): Promise<AgreementUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Upload failed");
  }

  return response.json();
}

export async function extractCovenants(
  agreementId: string
): Promise<ExtractionResponse> {
  const response = await fetch(`${API_BASE_URL}/extract`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agreement_id: agreementId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Extraction failed");
  }

  return response.json();
}

export async function generateCode(
  agreementId: string
): Promise<GeneratedCodeResponse> {
  const response = await fetch(`${API_BASE_URL}/generate-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agreement_id: agreementId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Code generation failed");
  }

  return response.json();
}

export async function calculateCovenants(
  data: FinancialDataInput
): Promise<CalculationResponse> {
  const response = await fetch(`${API_BASE_URL}/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Calculation failed");
  }

  return response.json();
}

/**
 * Update manually edited covenants (human-in-the-loop)
 */
export async function updateCovenants(
  agreementId: string,
  covenants: CovenantDefinition[],
  ebitdaDefinition?: EBITDADefinition | null
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/covenants/${agreementId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      covenants,
      ebitda_definition: ebitdaDefinition,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to update covenants");
  }

  return response.json();
}

export async function downloadCertificate(data: {
  agreement_id: string;
  company_name: string;
  agent_name: string;
  agreement_date: string;
  test_date: string;
  leverage_ratio: number;
  leverage_limit: number;
  compliant: boolean;
  signature_image: string | null;
}): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/certificate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Certificate generation failed");
  }

  return response.blob();
}
