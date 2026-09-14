# Observability

## 1. Goals

The system must make it possible to understand:

- failed bookings
- availability conflicts
- payment failures
- notification failures
- dependency outages
- tenant-specific incidents

## 2. Logs

Structured logs should include where appropriate:

- request/correlation ID
- business ID
- organization ID
- person ID when permitted
- operation
- outcome
- latency
- dependency
- error code

Do not log secrets or payment credentials.

## 3. Metrics

Useful metrics:

- appointment creation rate
- appointment confirmation rate
- booking conflict rate
- payment success/failure rate
- notification delivery rate
- availability latency
- external dependency latency
- error rate

## 4. Tracing

Distributed tracing should propagate correlation/trace context across module calls and asynchronous events.

## 5. Events

Important lifecycle events should be observable:

- AppointmentCreated
- AppointmentConfirmed
- AppointmentCancelled
- AppointmentCompleted
- AppointmentNoShow
- PaymentSucceeded
- PaymentFailed

## 6. Alerts

Alert on:

- dependency failure
- abnormal payment failure
- queue backlog
- notification failure
- database failure
- high booking conflict rates
