export class Grant {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  createdBy: string;
  status?: string;
  subStatus?: string;
  startDate?: Date;
  endDate?: Date;
}

export class Tenant {
  name: string;
  grants: Grant[];
}

export class Tenants {
  tenants: Tenant[];
}
