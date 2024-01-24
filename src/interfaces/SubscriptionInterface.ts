export enum TypeCharacteristics {
  QUANTITY = 'quantity',
  BOOLEAN = 'boolean',
}

export interface PlanInterface extends Document {
  _id?: string;
  name: string;
  description: string;
  price_month: number;
  price_year?: number;
  characteristics: CharacteristicsInterface[];
}

export interface CharacteristicsInterface {
  quantity: number;
  description: string;
  methods: string;
  path: string;
  type_characteristics: TypeCharacteristics;
}

export interface DoSubscriptionParamsInterface {
  plan_id: string | undefined;
  auto_renew: boolean;
  billing_period: string;
  subscription_id?: string;
}

export interface SubscriptionsInterface {
  id?: string;
  _id?: string;
  user_id?: string;
  plan_id?: string;
  date_start?: Date | string;
  date_end?: Date | string;
  expired_at?: Date | null;
  auto_renew?: boolean;
  billing_period?: string;
}
