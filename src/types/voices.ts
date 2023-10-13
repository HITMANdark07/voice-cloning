export interface Voice {
  voice_id: string;
  name: string;
  samples: Sample[];
  category: string;
  fine_tuning: FineTuning;
  labels: Labels;
  description: string;
  preview_url: string;
  available_for_tiers: any[];
  settings: any;
  sharing: any;
  high_quality_base_model_ids: any[];
}

export interface Sample {
  sample_id: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  hash: string;
}

export interface FineTuning {
  language: any;
  is_allowed_to_fine_tune: boolean;
  fine_tuning_requested: boolean;
  finetuning_state: string;
  verification_attempts: any;
  verification_failures: any[];
  verification_attempts_count: number;
  slice_ids: any;
  manual_verification: any;
  manual_verification_requested: boolean;
}

export interface Labels {
  language: string;
  accent: string;
}
