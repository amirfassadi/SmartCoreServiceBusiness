# Shared SmartCore interface

The existing business context, forms, API adapters and query boundaries remain in
this repository. The Platform repository owns the common colors and font source
at `packages/design`; this frontend commits a generated standalone CSS/font copy
and SHA-256 manifest. No runtime dependency on another local repository is required.

This continuation aligns Next.js 16.4.5, React 19.3 and next-intl 4 with Identity,
including asynchronous route parameters and a real root language/direction.
Zod and its React Hook Form resolver are upgraded together; error typing matches
the actual API error objects. Existing tests verify behavior, not live API access.

The root redirects to `/fa`. Category navigation opens the implemented
`/service-categories` route. Switching language preserves the current page.
Browser-local selected-business state uses an external-store subscription and
responds to changes from another tab. Selection is context, never authorization.

`NEXT_PUBLIC_SMARTCORE_CONSOLE_ORIGIN` optionally adds a validated link back to the
platform; set it before building. It contains only an app origin, never credentials.
The API base URL retains its existing independent configuration. A running UI
without a chosen business or connected API must not fabricate business data.
