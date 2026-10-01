# Observability

## What it holds

The runtime record: metrics, monitors and alert thresholds, dashboards, traces and spans, logs, incident records, and notebooks. Answers what production was doing when the code was written. A monitor's threshold is often the number the code enforces, and an incident timeline is often the reason the code exists.

## Searching

Unconstrained log and span searches drown or time out.

1. Identify the owning service and its dependencies.
2. Dashboards and monitors first: they show what the team watched, and a monitor's query and threshold are quotable.
3. Metrics named for the feature or symbol: metadata, then the timeseries across the window.
4. Logs by symbol, error string, or feature name, aggregated rather than dumped.
5. Spans and traces for timeouts, retries, slow paths, and cross-service calls.
6. Incidents in the window when the target is defensive; an incident timeline that names the change is **direct evidence**, and a monitor or dashboard created just after an incident is usually its action item.

## Good evidence

A monitor whose threshold matches the constant in the code. A dashboard by the target's author with widgets for what the code guards. A metric spiking just before the merge and settling after. An incident record citing the target's symbols or error strings. A log pattern in the window before the change that the code would prevent.

## Pitfalls

- A spike before and calm after is suggestive; other changes landed in the same window. Record neighbouring PRs.
- A chart reflects its author's framing; "retry success rate" shows the team cared about retries, not why a line exists.

## Extra fields

Per item: type (dashboard, monitor, metric, log pattern, trace, incident, notebook); the condition or query verbatim; owner and created or modified date.
