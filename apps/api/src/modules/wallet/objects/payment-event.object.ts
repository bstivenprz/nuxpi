export interface PaymentEventObject {
  data: Data;
  event: string;
  sent_at: string;
  signature: Signature;
  timestamp: number;
  environment: string;
}

export interface Data {
  transaction: Transaction;
}

export interface Transaction {
  id: string;
  origin: any;
  status: string;
  currency: string;
  reference: string;
  created_at: string;
  billing_data: any;
  finalized_at: string;
  redirect_url: any;
  customer_data: CustomerData;
  customer_email: string;
  payment_method: PaymentMethod;
  status_message: any;
  amount_in_cents: number;
  payment_link_id: any;
  shipping_address: any;
  payment_source_id: any;
  payment_method_type: string;
}

export interface CustomerData {
  device_id: string;
  full_name: string;
  browser_info: BrowserInfo;
  phone_number: string;
  device_data_token: string;
}

export interface BrowserInfo {
  browser_tz: string;
  browser_language: string;
  browser_user_agent: string;
  browser_color_depth: string;
  browser_screen_width: string;
  browser_screen_height: string;
}

export interface PaymentMethod {
  type: string;
  extra: Extra;
  phone_number: string;
}

export interface Extra {
  is_three_ds: boolean;
  transaction_id: string;
  three_ds_auth_type: any;
  external_identifier: string;
}

export interface Signature {
  checksum: string;
  properties: string[];
}
