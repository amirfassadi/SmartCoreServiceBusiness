"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessPolicyVersionCreated = exports.ServiceArchived = exports.ServiceCreated = exports.ServiceCategoryCreated = exports.BusinessLocationDeactivated = exports.BusinessLocationCreated = exports.BusinessProfileUpdated = exports.BusinessCreated = void 0;
class BusinessCreated {
    name = 'BusinessCreated';
    aggregateId;
    occurredAt;
    payload;
    constructor(aggregateId, payload) {
        this.aggregateId = aggregateId;
        this.occurredAt = new Date();
        this.payload = payload;
    }
}
exports.BusinessCreated = BusinessCreated;
class BusinessProfileUpdated {
    name = 'BusinessProfileUpdated';
    aggregateId;
    occurredAt;
    payload;
    constructor(aggregateId, payload) {
        this.aggregateId = aggregateId;
        this.occurredAt = new Date();
        this.payload = payload;
    }
}
exports.BusinessProfileUpdated = BusinessProfileUpdated;
class BusinessLocationCreated {
    name = 'BusinessLocationCreated';
    aggregateId;
    occurredAt;
    payload;
    constructor(aggregateId, payload) {
        this.aggregateId = aggregateId;
        this.occurredAt = new Date();
        this.payload = payload;
    }
}
exports.BusinessLocationCreated = BusinessLocationCreated;
class BusinessLocationDeactivated {
    name = 'BusinessLocationDeactivated';
    aggregateId;
    occurredAt;
    payload;
    constructor(aggregateId, payload) {
        this.aggregateId = aggregateId;
        this.occurredAt = new Date();
        this.payload = payload;
    }
}
exports.BusinessLocationDeactivated = BusinessLocationDeactivated;
class ServiceCategoryCreated {
    name = 'ServiceCategoryCreated';
    aggregateId;
    occurredAt;
    payload;
    constructor(aggregateId, payload) {
        this.aggregateId = aggregateId;
        this.occurredAt = new Date();
        this.payload = payload;
    }
}
exports.ServiceCategoryCreated = ServiceCategoryCreated;
class ServiceCreated {
    name = 'ServiceCreated';
    aggregateId;
    occurredAt;
    payload;
    constructor(aggregateId, payload) {
        this.aggregateId = aggregateId;
        this.occurredAt = new Date();
        this.payload = payload;
    }
}
exports.ServiceCreated = ServiceCreated;
class ServiceArchived {
    name = 'ServiceArchived';
    aggregateId;
    occurredAt;
    payload;
    constructor(aggregateId, payload) {
        this.aggregateId = aggregateId;
        this.occurredAt = new Date();
        this.payload = payload;
    }
}
exports.ServiceArchived = ServiceArchived;
class BusinessPolicyVersionCreated {
    name = 'BusinessPolicyVersionCreated';
    aggregateId;
    occurredAt;
    payload;
    constructor(aggregateId, payload) {
        this.aggregateId = aggregateId;
        this.occurredAt = new Date();
        this.payload = payload;
    }
}
exports.BusinessPolicyVersionCreated = BusinessPolicyVersionCreated;
