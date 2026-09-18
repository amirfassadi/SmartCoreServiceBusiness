export type DomainEvent = {
  name: string;
  aggregateId: string;
  occurredAt: Date;
  payload?: Record<string, unknown>;
};

export class BusinessCreated implements DomainEvent {
  name = 'BusinessCreated';
  aggregateId: string;
  occurredAt: Date;
  payload?: Record<string, unknown>;

  constructor(aggregateId: string, payload?: Record<string, unknown>) {
    this.aggregateId = aggregateId;
    this.occurredAt = new Date();
    this.payload = payload;
  }
}

export class BusinessProfileUpdated implements DomainEvent {
  name = 'BusinessProfileUpdated';
  aggregateId: string;
  occurredAt: Date;
  payload?: Record<string, unknown>;

  constructor(aggregateId: string, payload?: Record<string, unknown>) {
    this.aggregateId = aggregateId;
    this.occurredAt = new Date();
    this.payload = payload;
  }
}

export class BusinessLocationCreated implements DomainEvent {
  name = 'BusinessLocationCreated';
  aggregateId: string;
  occurredAt: Date;
  payload?: Record<string, unknown>;

  constructor(aggregateId: string, payload?: Record<string, unknown>) {
    this.aggregateId = aggregateId;
    this.occurredAt = new Date();
    this.payload = payload;
  }
}

export class BusinessLocationDeactivated implements DomainEvent {
  name = 'BusinessLocationDeactivated';
  aggregateId: string;
  occurredAt: Date;
  payload?: Record<string, unknown>;

  constructor(aggregateId: string, payload?: Record<string, unknown>) {
    this.aggregateId = aggregateId;
    this.occurredAt = new Date();
    this.payload = payload;
  }
}

export class ServiceCategoryCreated implements DomainEvent {
  name = 'ServiceCategoryCreated';
  aggregateId: string;
  occurredAt: Date;
  payload?: Record<string, unknown>;

  constructor(aggregateId: string, payload?: Record<string, unknown>) {
    this.aggregateId = aggregateId;
    this.occurredAt = new Date();
    this.payload = payload;
  }
}

export class ServiceCreated implements DomainEvent {
  name = 'ServiceCreated';
  aggregateId: string;
  occurredAt: Date;
  payload?: Record<string, unknown>;

  constructor(aggregateId: string, payload?: Record<string, unknown>) {
    this.aggregateId = aggregateId;
    this.occurredAt = new Date();
    this.payload = payload;
  }
}

export class ServiceArchived implements DomainEvent {
  name = 'ServiceArchived';
  aggregateId: string;
  occurredAt: Date;
  payload?: Record<string, unknown>;

  constructor(aggregateId: string, payload?: Record<string, unknown>) {
    this.aggregateId = aggregateId;
    this.occurredAt = new Date();
    this.payload = payload;
  }
}

export class BusinessPolicyVersionCreated implements DomainEvent {
  name = 'BusinessPolicyVersionCreated';
  aggregateId: string;
  occurredAt: Date;
  payload?: Record<string, unknown>;

  constructor(aggregateId: string, payload?: Record<string, unknown>) {
    this.aggregateId = aggregateId;
    this.occurredAt = new Date();
    this.payload = payload;
  }
}
