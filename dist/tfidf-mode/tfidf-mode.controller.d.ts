import { TfidfModeService } from './tfidf-mode.service';
import { CreateTfidfModeDto } from './dto/create-tfidf-mode.dto';
import { UpdateTfidfModeDto } from './dto/update-tfidf-mode.dto';
export declare class TfidfModeController {
    private readonly tfidfModeService;
    constructor(tfidfModeService: TfidfModeService);
    create(createTfidfModeDto: CreateTfidfModeDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateTfidfModeDto: UpdateTfidfModeDto): string;
    remove(id: string): string;
}
