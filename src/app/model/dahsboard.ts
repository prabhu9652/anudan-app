export class Grant {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  createdBy: string;
}

export class Tenant {
  name: string;
  grants: Grant[];
}

export class Tenants {
  tenants: Tenant[];
}
