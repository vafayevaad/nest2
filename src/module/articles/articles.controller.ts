import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UserRole } from 'src/common/enums/user-role';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { QueryDto } from './dto/query.dto';

@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiOkResponse({ type: CreateArticleDto })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        text: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        backgroundImage: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @Post('create_articles')
  @UseInterceptors(
    FilesInterceptor('backgroundImage', 10, {
      storage: diskStorage({
        destination: path.join(process.cwd(), 'uploads'),
        filename: (req, file, cb) => {
          const uniqueSufix = `${file.fieldname}${Date.now()}${Math.round(
            Math.random() * 1e9,
          )}`;
          const ext = path.extname(file.originalname);
          cb(null, `${uniqueSufix}${ext}`);
        },
      }),
    }),
  )
  create(
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.articlesService.create(createArticleDto, files);
  }

  @ApiOkResponse({ type: CreateArticleDto })
  @HttpCode(200)
  @Get('get_all_articles')
  findAll(@Query() queryDto: QueryDto) {
    return this.articlesService.findAll(queryDto);
  }

  @ApiNotFoundResponse({ description: 'Article not found' })
  @HttpCode(200)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @ApiNotFoundResponse({ description: 'Article not found' })
  @ApiOkResponse({ description: 'Updated article' })
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @ApiNotFoundResponse({ description: 'Article not found' })
  @ApiOkResponse({ description: 'Deleted article' })
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }
}