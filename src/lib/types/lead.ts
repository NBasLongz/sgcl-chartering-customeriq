export type LeadRole =
  | 'Shipper / Charterer'
  | 'Shipper'
  | 'Charterer'
  | 'Trader'
  | 'Forwarder'
  | string;

export type LeadGroup = 'A' | 'B' | 'C';

export type LeadStatus =
  | 'Đã duyệt tiếp cận'
  | 'Giao Senior Broker'
  | 'Đưa vào lịch chăm sóc'
  | 'Cần Broker kiểm tra lại'
  | 'Đã loại trừ';

export type ServiceType =
  | 'Dry Bulk Chartering'
  | 'Project / Breakbulk'
  | 'Không thuộc phạm vi';

export interface RawLead {
  id: string;
  company: string;
  role: LeadRole;
  source: string;
  cargo: string;
  volume: string;
  route: string;
  status: LeadStatus;
  manualGroup: 'AUTO' | LeadGroup;
  note?: string;
}

export interface EvaluatedLead extends RawLead {
  score: number;
  scoreCargo: number;
  scoreRoute: number;
  scoreVolume: number;
  penalty: number;
  autoGroup: LeadGroup;
  group: LeadGroup;
  service: ServiceType;
  vesselFit: string;
  reason: string;
  xaiSteps: string[];
}

export type PresetViewType =
  | 'ALL'
  | 'SUITABLE'
  | 'DRY_BULK'
  | 'PROJECT'
  | 'EXCLUDED'
  | 'NEEDS_REVIEW';
