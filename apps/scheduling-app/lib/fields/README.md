# Field Registry

Single source of truth for collectible user-facing fields across onboarding, booking, and Salesforce sync.

## Structure

```
lib/fields/
├── types.ts          # FieldId enum, FieldDefinition interface
├── registry.ts       # FIELD_REGISTRY, options, helpers
├── hooks/
│   └── useBookingFormFields.ts  # Determines which fields to show
└── index.ts          # Public exports
```

## Usage

### Field Metadata

```typescript
import { FIELD_REGISTRY, FieldId } from '@/lib/fields';

const phoneField = FIELD_REGISTRY[FieldId.PHONE];
// phoneField.label → "Mobile number"
// phoneField.conversationalQuestion → "What is your phone number?"
// phoneField.salesforce.read → "Phone"
```

### Salesforce Mappings

```typescript
import { getSalesforceReadField, getSalesforceWriteField, FieldId } from '@/lib/fields';

const sfField = getSalesforceWriteField(FieldId.INSURANCE);
// → "Insurance_Company_Name__c"
```

### Storage Keys

```typescript
import { ONBOARDING_STORAGE_KEYS, FieldId } from '@/lib/fields';

const key = ONBOARDING_STORAGE_KEYS[FieldId.STATE];
// → "state"
```

### Booking Form Fields

```typescript
import { useBookingFormFields, FieldId } from '@/lib/fields';

const { shouldShowField } = useBookingFormFields({
  answeredValues: { [FieldId.PHONE]: '+16175551234' }
});

if (shouldShowField(FieldId.INSURANCE)) {
  // render insurance field
}
```

## Fields

| FieldId | Contexts | Salesforce |
|---------|----------|------------|
| `STATE` | onboarding | `Market__c` |
| `SERVICE` | onboarding | `Medication__c,Therapy__c` |
| `PHONE` | onboarding, booking | `Phone` |
| `INSURANCE` | onboarding, booking | `Insurance_Company_Name__c` |
| `CONSENT` | onboarding, booking | `Contact_Consent__c` |
| `FIRST_NAME` | booking | `FirstName` |
| `LAST_NAME` | booking | `LastName` |

## Archived Code

Generic field components and form adapters were removed in commit `3219c69` as they didn't fit the custom business logic in onboarding questions (geolocation detection, Salesforce lead creation, etc.).

To recover if needed:
```bash
git show 3219c69^:apps/scheduling-app/lib/fields/components/
git checkout 3219c69^ -- apps/scheduling-app/lib/fields/components/
```

Deleted files:
- `components/TextField.tsx`
- `components/PhoneField.tsx`
- `components/SelectField.tsx`
- `components/AutocompleteField.tsx`
- `components/CheckboxField.tsx`
- `components/StateSelectField.tsx`
- `components/DynamicField.tsx`
- `components/BookingFormFields.tsx`
- `forms/StandardForm.tsx`
- `forms/ConversationalForm.tsx`

