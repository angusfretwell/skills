# Analytics

## What it holds

The product and data view: usage events, experiment and feature-flag exposures, billing and usage volumes, warehouse query history, pipeline lineage. Answers what users did, which experiments ran, how usage evolved, and where a threshold constant came from.

## Searching

Schemas are company-specific. Confirm every table with the tool's listing or describe command before querying it.

1. Usage trajectory: daily counts of the relevant event across the window. A step from zero at the merge date suggests a launch; a decay to zero suggests a deprecation.
2. Threshold origin: the median, p99, and max of the relevant property in the two weeks before the PR. A p99 that matches the constant suggests the number came from data.
3. Experiments: the exposure table, then counts by variant for the flag key near the PR date.
4. Query history filtered on the table or symbol in a tight window, sorted by duration or bytes read, for migrations, backfills, and performance rewrites.
5. Lineage: when the target reads or writes a pipeline model, record that model under Leads for source control; its own git history carries the rationale.

## Good evidence

An error-classifying event whose count falls to near zero after a defensive PR. An exposure row naming the target's flag with a shipped or concluded decision near the ship date. A distribution whose tail matches the constant.

## Pitfalls

- A step in volume may be new instrumentation, not new behaviour. Check for instrumentation PRs in the window.
- Properties drift; older rows may carry a field only in raw JSON.
- Notebooks are outside the SQL tools.

## Extra fields

Per finding: the fully qualified table and the exact query; the time window; a compact numeric summary (counts, percentiles, first and last seen) rather than rows; the correlation with the ship date.
