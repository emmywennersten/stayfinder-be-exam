"use client";

import { useRouter } from "next/navigation";

import AuthGate from "@/components/AuthGate";
import PropertyForm from "@/components/PropertyForm";
import type { PropertyFormResult } from "@/components/PropertyForm";
import T from "@/components/typography";
import { createProperty } from "@/utils/propertyService";
import type { NewPropertyInput } from "@/utils/propertyService";

export default function NewPropertyPage() {
  const router = useRouter();

  async function onCreate(input: NewPropertyInput): Promise<PropertyFormResult> {
    const result = await createProperty(input);

    if (!result.ok) {
      return { error: result.message, fieldErrors: result.fieldErrors };
    }

    router.push(`/properties/${result.data.property_id}`);
    return {};
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <T.Header size="lg">List a stay</T.Header>
      <AuthGate message="You have to be logged in to list a stay.">
        <PropertyForm onSubmit={onCreate} />
      </AuthGate>
    </main>
  );
}
