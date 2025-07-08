import { PriceRepository } from "./PriceRepository";
import { PriceQueue } from "./queue/PriceQueue";
import { pullPrices } from "./sync/pull";
import { pushPrices } from "./sync/push";
import { composeRepository } from "../../core/repositories/composeRepository";
import type { Price } from "./PriceModel";

export const priceRepo = composeRepository({
    local: new PriceRepository(),
    queue: new PriceQueue(),
    sync: {
        pull: pullPrices,
        push: pushPrices,
    },
});

export type { Price };
