import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TfidfModeService } from './tfidf-mode.service';
import { CreateTfidfModeDto } from './dto/create-tfidf-mode.dto';
import { UpdateTfidfModeDto } from './dto/update-tfidf-mode.dto';

@Controller('tfidf-mode')
export class TfidfModeController {
  constructor(private readonly tfidfModeService: TfidfModeService) {}

  @Post()
  create(@Body() createTfidfModeDto: CreateTfidfModeDto) {
    return this.tfidfModeService.create(createTfidfModeDto);
  }

  @Get()
  findAll() {
    return this.tfidfModeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tfidfModeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTfidfModeDto: UpdateTfidfModeDto) {
    return this.tfidfModeService.update(+id, updateTfidfModeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tfidfModeService.remove(+id);
  }
}
