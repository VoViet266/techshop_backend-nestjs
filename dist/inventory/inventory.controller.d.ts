import { InventoryService } from './inventory.service';
import { CreateInventoryDto, CreateStockMovementDto, CreateTransferDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { IUser } from 'src/user/interface/user.interface';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    create(createInventoryDto: CreateInventoryDto, user: IUser): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/inventory.schema").Inventory> & import("./schemas/inventory.schema").Inventory & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/inventory.schema").Inventory> & import("./schemas/inventory.schema").Inventory & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(user: IUser): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("./schemas/inventory.schema").Inventory> & import("./schemas/inventory.schema").Inventory & {
        _id: import("mongoose").Types.ObjectId;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOne(productId: string, branchId: string, variantId: string): Promise<number>;
    update(id: string, updateInventoryDto: UpdateInventoryDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/inventory.schema").Inventory> & import("./schemas/inventory.schema").Inventory & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/inventory.schema").Inventory> & import("./schemas/inventory.schema").Inventory & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(id: string): Promise<{
        message: string;
    }>;
    importStock(dto: CreateStockMovementDto, user: IUser): Promise<{
        message: string;
        inventory: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/inventory.schema").Inventory> & import("./schemas/inventory.schema").Inventory & {
            _id: import("mongoose").Types.ObjectId;
        }> & import("mongoose").Document<unknown, {}, import("./schemas/inventory.schema").Inventory> & import("./schemas/inventory.schema").Inventory & {
            _id: import("mongoose").Types.ObjectId;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    getAllImport(user: IUser): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("./schemas/stock-movement.schema").StockMovement> & import("./schemas/stock-movement.schema").StockMovement & {
        _id: import("mongoose").Types.ObjectId;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getImport(id: string): Promise<import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("./schemas/stock-movement.schema").StockMovement> & import("./schemas/stock-movement.schema").StockMovement & {
        _id: import("mongoose").Types.ObjectId;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getAllExport(user: IUser): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("./schemas/stock-movement.schema").StockMovement> & import("./schemas/stock-movement.schema").StockMovement & {
        _id: import("mongoose").Types.ObjectId;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getExport(id: string): Promise<import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("./schemas/stock-movement.schema").StockMovement> & import("./schemas/stock-movement.schema").StockMovement & {
        _id: import("mongoose").Types.ObjectId;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    exportStock(dto: CreateStockMovementDto, user: IUser): Promise<{
        message: string;
        inventory: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/inventory.schema").Inventory> & import("./schemas/inventory.schema").Inventory & {
            _id: import("mongoose").Types.ObjectId;
        }> & import("mongoose").Document<unknown, {}, import("./schemas/inventory.schema").Inventory> & import("./schemas/inventory.schema").Inventory & {
            _id: import("mongoose").Types.ObjectId;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    getAllTransfer(): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("./schemas/transfer.schema").Transfer> & import("./schemas/transfer.schema").Transfer & {
        _id: import("mongoose").Types.ObjectId;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    transferStock(dto: CreateTransferDto, user: IUser): Promise<{
        message: string;
    }>;
    getTransferDetail(id: string): Promise<import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("./schemas/transfer.schema").Transfer> & import("./schemas/transfer.schema").Transfer & {
        _id: import("mongoose").Types.ObjectId;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    updateTransfer(id: string, dto: CreateTransferDto, user: IUser): Promise<{
        message: string;
    }>;
}
