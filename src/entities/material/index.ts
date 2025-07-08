import { MaterialRepository } from "./MaterialRepository";
import { MaterialQueue } from "./queue/MaterialQueue";
import { pullMaterials } from "./sync/pull";
import { pushMaterials } from "./sync/push";
import { composeRepository } from "../../core/repositories/composeRepository";
import type { Material } from "./MaterialModel";

// Instancias por separado
export const materialRepo = composeRepository({
    local: new MaterialRepository(),
    queue: new MaterialQueue(),
    sync: {
        pull: pullMaterials,
        push: pushMaterials,
    },
});

export type { Material };
