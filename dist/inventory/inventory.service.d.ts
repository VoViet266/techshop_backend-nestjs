import { CreateInventoryDto, CreateStockMovementDto, CreateTransferDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto, UpdateTransferDto } from './dto/update-inventory.dto';
import { Inventory, InventoryDocument } from './schemas/inventory.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ProductDocument } from 'src/product/schemas/product.schema';
import { StockMovement, StockMovementDocument } from './schemas/stock-movement.schema';
import { Transfer, TransferDocument } from './schemas/transfer.schema';
import mongoose, { Types } from 'mongoose';
import { IUser } from 'src/user/interface/user.interface';
export declare class InventoryService {
    private readonly inventoryModel;
    private readonly productModel;
    private movementModel;
    private transferModel;
    constructor(inventoryModel: SoftDeleteModel<InventoryDocument>, productModel: SoftDeleteModel<ProductDocument>, movementModel: SoftDeleteModel<StockMovementDocument>, transferModel: SoftDeleteModel<TransferDocument>);
    create(createInventoryDto: CreateInventoryDto, user: IUser): Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Inventory> & Inventory & {
        _id: Types.ObjectId;
    }> & mongoose.Document<unknown, {}, Inventory> & Inventory & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    getStockProduct(productId: string, branchId: string, variantId: string): Promise<number>;
    findAll(user: any): Promise<(mongoose.FlattenMaps<mongoose.Document<unknown, {}, Inventory> & Inventory & {
        _id: Types.ObjectId;
    }> & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    findImport(user: any): mongoose.Query<(mongoose.FlattenMaps<mongoose.Document<unknown, {}, StockMovement> & StockMovement & {
        _id: Types.ObjectId;
    }> & Required<{
        _id: Types.ObjectId;
    }>)[], mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, StockMovement> & StockMovement & {
        _id: Types.ObjectId;
    }> & mongoose.Document<unknown, {}, StockMovement> & StockMovement & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>, {}, mongoose.Document<unknown, {}, StockMovement> & StockMovement & {
        _id: Types.ObjectId;
    }, "find">;
    findExport(user: any): mongoose.Query<(mongoose.FlattenMaps<mongoose.Document<unknown, {}, StockMovement> & StockMovement & {
        _id: Types.ObjectId;
    }> & Required<{
        _id: Types.ObjectId;
    }>)[], mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, StockMovement> & StockMovement & {
        _id: Types.ObjectId;
    }> & mongoose.Document<unknown, {}, StockMovement> & StockMovement & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>, {}, mongoose.Document<unknown, {}, StockMovement> & StockMovement & {
        _id: Types.ObjectId;
    }, "find">;
    findOne(id: string): mongoose.Query<mongoose.FlattenMaps<mongoose.Document<unknown, {}, Inventory> & Inventory & {
        _id: Types.ObjectId;
    }> & Required<{
        _id: Types.ObjectId;
    }>, mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Inventory> & Inventory & {
        _id: Types.ObjectId;
    }> & mongoose.Document<unknown, {}, Inventory> & Inventory & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>, {}, mongoose.Document<unknown, {}, Inventory> & Inventory & {
        _id: Types.ObjectId;
    }, "findOne">;
    update(id: string, updateInventoryDto: UpdateInventoryDto): Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Inventory> & Inventory & {
        _id: Types.ObjectId;
    }> & mongoose.Document<unknown, {}, Inventory> & Inventory & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    remove(id: string): Promise<{
        message: string;
    }>;
    importStock(dto: CreateStockMovementDto, user: IUser): Promise<{
        message: string;
        inventory: mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Inventory> & Inventory & {
            _id: Types.ObjectId;
        }> & mongoose.Document<unknown, {}, Inventory> & Inventory & {
            _id: Types.ObjectId;
        } & Required<{
            _id: Types.ObjectId;
        }>;
    }>;
    getImportDetail(id: string): Promise<mongoose.FlattenMaps<mongoose.Document<unknown, {}, StockMovement> & StockMovement & {
        _id: Types.ObjectId;
    }> & Required<{
        _id: Types.ObjectId;
    }>>;
    getExportDetail(id: string): Promise<mongoose.FlattenMaps<mongoose.Document<unknown, {}, StockMovement> & StockMovement & {
        _id: Types.ObjectId;
    }> & Required<{
        _id: Types.ObjectId;
    }>>;
    getTransferDetail(id: string): Promise<mongoose.FlattenMaps<mongoose.Document<unknown, {}, Transfer> & Transfer & {
        _id: Types.ObjectId;
    }> & Required<{
        _id: Types.ObjectId;
    }>>;
    findTransfer(): Promise<(mongoose.FlattenMaps<mongoose.Document<unknown, {}, Transfer> & Transfer & {
        _id: Types.ObjectId;
    }> & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    exportStock(dto: CreateStockMovementDto, user: any): Promise<{
        message: string;
        inventory: mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Inventory> & Inventory & {
            _id: Types.ObjectId;
        }> & mongoose.Document<unknown, {}, Inventory> & Inventory & {
            _id: Types.ObjectId;
        } & Required<{
            _id: Types.ObjectId;
        }>;
    }>;
    transferStock(createTransferDto: CreateTransferDto, user: IUser): Promise<{
        message: string;
    }>;
    updateTransfer(id: string, updateTransferDto: UpdateTransferDto, user: IUser): Promise<{
        message: string;
    }>;
}
