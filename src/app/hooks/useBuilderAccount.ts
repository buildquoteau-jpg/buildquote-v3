import { useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export function useBuilderAccount() {
  const { isLoaded: isUserLoaded, user } = useUser();
  const upsertBuilderByEmail = useMutation(api.builders.upsertBuilderByEmail);
  const autoEnsureStartedRef = useRef(false);
  const companyNameFromMetadata =
    typeof user?.unsafeMetadata?.companyName === "string"
      ? user.unsafeMetadata.companyName
      : undefined;

  const clerkUserId = user?.id ?? "";
  const email = user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase() ?? "";
  const builder = useQuery(
    api.builders.getBuilderByEmail,
    email ? { email } : "skip"
  );

  const ensureBuilder = async (): Promise<Id<"builders">> => {
    if (!email) {
      throw new Error("User email is required to create a builder profile.");
    }

    if (builder?._id) {
      return builder._id;
    }

    return await upsertBuilderByEmail({
      email,
      clerkUserId: clerkUserId || undefined,
      firstName: user?.firstName ?? undefined,
      lastName: user?.lastName ?? undefined,
      companyName: companyNameFromMetadata,
    });
  };

  useEffect(() => {
    if (!isUserLoaded || !email) return;
    if (builder === undefined || builder !== null) return;
    if (autoEnsureStartedRef.current) return;

    autoEnsureStartedRef.current = true;
    void upsertBuilderByEmail({
      email,
      clerkUserId: clerkUserId || undefined,
      firstName: user?.firstName ?? undefined,
      lastName: user?.lastName ?? undefined,
      companyName: companyNameFromMetadata,
    });
  }, [
    builder,
    clerkUserId,
    companyNameFromMetadata,
    email,
    isUserLoaded,
    upsertBuilderByEmail,
    user?.firstName,
    user?.lastName,
  ]);

  return {
    builder,
    builderId: builder?._id,
    clerkFirstName: user?.firstName?.trim() ?? "",
    email,
    isUserLoaded,
    ensureBuilder,
  };
}
