import { UF_COMPONENTS } from './lib/generated/components';
import { UF_FORMS } from './lib/generated/value-accessors';

export * from './lib/generated/components';
export * from './lib/generated/value-accessors';
export { UfValueAccessor } from './lib/value-accessor';

/**
 * Every component and form directive, for a standalone component's imports:
 * `imports: [UNFRAMED]`. Or import only what you use.
 */
export const UNFRAMED = [...UF_COMPONENTS, ...UF_FORMS] as const;
