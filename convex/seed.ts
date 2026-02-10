// convex/seed.ts
import { mutation } from "./_generated/server";

export const run = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // --------------------------------------------------
    // 1. Manufacturer (approved)
    // --------------------------------------------------
    const manufacturerId = await ctx.db.insert("manufacturers", {
      name: "Innova Fibre Cement",
      website: "https://www.innovafibrecement.com.au",
      manufacturerType: "mixed",
      status: "approved",
      notesInternal: "Seed manufacturer",
      createdAt: now,
      updatedAt: now,
    });

    // --------------------------------------------------
    // 2. Manufacturer User (you = admin)
    // --------------------------------------------------
    await ctx.db.insert("manufacturerUsers", {
      manufacturerId,
      email: "buildquoteau@gmail.com",
      role: "admin",
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    // --------------------------------------------------
    // 3. Global System (approved)
    // --------------------------------------------------
    const systemId = await ctx.db.insert("systems", {
      nameGeneric: "External Fibre Cement Cladding System",
      systemType: "non_proprietary",
      primaryStages: ["External Cladding"],
      description:
        "Generic fibre cement cladding system. Advisory reference only.",
      driverComponentType: "cladding_board",
      advisoryOnly: true,
      status: "approved",
      createdAt: now,
      updatedAt: now,
    });

    // --------------------------------------------------
    // 4. Components (canonical library)
    // --------------------------------------------------
    const createComponent = async (
      name: string,
      category: "driver" | "dependent" | "accessory",
      isDriver: boolean
    ) => {
      return ctx.db.insert("components", {
        nameGeneric: name,
        category,
        isDriver,
        createdAt: now,
        updatedAt: now,
      });
    };

    const claddingBoardsId = await createComponent(
      "Cladding boards",
      "driver",
      true
    );
    const sarkingId = await createComponent(
      "Sarking / Weather barrier",
      "dependent",
      false
    );
    const battensId = await createComponent(
      "Battens / cavity system",
      "dependent",
      false
    );
    const flashingsId = await createComponent(
      "Flashings & trims",
      "dependent",
      false
    );
    const fixingsId = await createComponent(
      "Fixings & fasteners",
      "dependent",
      false
    );
    const sealantsId = await createComponent(
      "Sealants & tapes",
      "dependent",
      false
    );
    const accessoriesId = await createComponent(
      "Handy accessories",
      "accessory",
      false
    );

    // --------------------------------------------------
    // 5. System ↔ Component links (order + defaults)
    // --------------------------------------------------
    const link = async (
      componentId: any,
      uiOrder: number,
      defaultIncluded: boolean,
      dependencyNotes?: string
    ) => {
      await ctx.db.insert("systemComponents", {
        systemId,
        componentId,
        defaultIncluded,
        dependencyNotes,
        uiOrder,
        createdAt: now,
        updatedAt: now,
      });
    };

    await link(
      claddingBoardsId,
      10,
      true,
      "Driver component: board profile and thickness influence fixings."
    );
    await link(sarkingId, 20, true);
    await link(battensId, 30, true);
    await link(flashingsId, 40, true);
    await link(
      fixingsId,
      50,
      true,
      "Fixings vary based on board thickness and substrate."
    );
    await link(sealantsId, 60, true);
    await link(accessoriesId, 70, false);

    // --------------------------------------------------
    // 6. Manufacturer ↔ System mapping (approved)
    // --------------------------------------------------
    const manufacturerSystemId = await ctx.db.insert("manufacturerSystems", {
      manufacturerId,
      systemId,
      marketedName: "Innova Fibre Cement Cladding",
      isPrimarySupplier: true,
      status: "approved",
      rejectionReason: undefined,
      createdAt: now,
      updatedAt: now,
    });

    // --------------------------------------------------
    // 7. Reference Document (approved placeholder)
    // --------------------------------------------------
    await ctx.db.insert("referenceDocuments", {
      manufacturerId,
      systemId,
      componentId: undefined,
      docType: "installation",
      source: "manufacturer_pdf",
      title: "Installation Guide (Seed)",
      version: "2026",
      r2Key: `manufacturers/${manufacturerId}/systems/${systemId}/docs/installation/installation-guide.pdf`,
      publicUrl: undefined,
      advisoryOnly: true,
      status: "approved",
      rejectionReason: undefined,
      createdAt: now,
      updatedAt: now,
    });

    return {
      ok: true,
      manufacturerId,
      systemId,
      manufacturerSystemId,
      note:
        "Seed complete. Ensure ADMIN_EMAILS includes buildquoteau@gmail.com for admin access.",
    };
  },
});
