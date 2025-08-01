import { CreateTfidfModeDto } from './dto/create-tfidf-mode.dto';
import { UpdateTfidfModeDto } from './dto/update-tfidf-mode.dto';
export declare class TfidfModeService {
    create(createTfidfModeDto: CreateTfidfModeDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateTfidfModeDto: UpdateTfidfModeDto): string;
    remove(id: number): string;
}
