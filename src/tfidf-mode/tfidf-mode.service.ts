import { Injectable } from '@nestjs/common';
import { CreateTfidfModeDto } from './dto/create-tfidf-mode.dto';
import { UpdateTfidfModeDto } from './dto/update-tfidf-mode.dto';

@Injectable()
export class TfidfModeService {
  create(createTfidfModeDto: CreateTfidfModeDto) {
    return 'This action adds a new tfidfMode';
  }

  findAll() {
    return `This action returns all tfidfMode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tfidfMode`;
  }

  update(id: number, updateTfidfModeDto: UpdateTfidfModeDto) {
    return `This action updates a #${id} tfidfMode`;
  }

  remove(id: number) {
    return `This action removes a #${id} tfidfMode`;
  }
}
