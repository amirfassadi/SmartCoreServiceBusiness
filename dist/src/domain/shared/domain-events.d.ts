export type DomainEvent = {
    name: string;
    aggregateId: string;
    occurredAt: Date;
    payload?: Record<string, unknown>;
};
export declare class BusinessCreated implements DomainEvent {
    name: string;
    aggregateId: string;
    occurredAt: Date;
    payload?: Record<string, unknown>;
    constructor(aggregateId: string, payload?: Record<string, unknown>);
}
export declare class BusinessProfileUpdated implements DomainEvent {
    name: string;
    aggregateId: string;
    occurredAt: Date;
    payload?: Record<string, unknown>;
    constructor(aggregateId: string, payload?: Record<string, unknown>);
}
export declare class BusinessLocationCreated implements DomainEvent {
    name: string;
    aggregateId: string;
    occurredAt: Date;
    payload?: Record<string, unknown>;
    constructor(aggregateId: string, payload?: Record<string, unknown>);
}
export declare class BusinessLocationDeactivated implements DomainEvent {
    name: string;
    aggregateId: string;
    occurredAt: Date;
    payload?: Record<string, unknown>;
    constructor(aggregateId: string, payload?: Record<string, unknown>);
}
export declare class ServiceCategoryCreated implements DomainEvent {
    name: string;
    aggregateId: string;
    occurredAt: Date;
    payload?: Record<string, unknown>;
    constructor(aggregateId: string, payload?: Record<string, unknown>);
}
export declare class ServiceCreated implements DomainEvent {
    name: string;
    aggregateId: string;
    occurredAt: Date;
    payload?: Record<string, unknown>;
    constructor(aggregateId: string, payload?: Record<string, unknown>);
}
export declare class ServiceArchived implements DomainEvent {
    name: string;
    aggregateId: string;
    occurredAt: Date;
    payload?: Record<string, unknown>;
    constructor(aggregateId: string, payload?: Record<string, unknown>);
}
export declare class BusinessPolicyVersionCreated implements DomainEvent {
    name: string;
    aggregateId: string;
    occurredAt: Date;
    payload?: Record<string, unknown>;
    constructor(aggregateId: string, payload?: Record<string, unknown>);
}
